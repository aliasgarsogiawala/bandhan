import "server-only";

import { getSql } from "@/lib/db";
import { addNotification, getBookingById, setPaymentStatus } from "@/lib/bookings/db";

export async function recordCheckout(input: {
  bookingId: string;
  sessionId: string;
  amountMinor: number;
  currency: string;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO booking_payments (booking_id, provider_session_id, amount_minor, currency, status)
    VALUES (${input.bookingId}, ${input.sessionId}, ${input.amountMinor}, ${input.currency}, 'pending')
    ON CONFLICT (provider_session_id) DO NOTHING
  `;
}

/** Claims the Stripe event, confirms the booking, then records payment success.
 * A stale processing claim is recoverable so Stripe retries can finish after a crash. */
export async function markCheckoutPaid(input: {
  sessionId: string;
  paymentIntentId: string | null;
}): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE booking_payments
    SET status = 'processing', provider_payment_id = ${input.paymentIntentId}, updated_at = now()
    WHERE provider_session_id = ${input.sessionId}
      AND (
        status IN ('pending', 'failed')
        OR (status = 'processing' AND updated_at < now() - interval '5 minutes')
      )
    RETURNING booking_id
  `) as Array<{ booking_id: string }>;
  if (!rows[0]) return false;

  try {
    const booking = await getBookingById(rows[0].booking_id);
    if (booking && booking.payment_status !== "received") {
      await setPaymentStatus(booking.id, "received", "stripe");
      await addNotification(booking.id, "in-app", "Online payment received. Your booking is confirmed.");
    }
    await sql`
      UPDATE booking_payments SET status = 'paid', updated_at = now()
      WHERE provider_session_id = ${input.sessionId} AND status = 'processing'
    `;
  } catch (error) {
    await sql`
      UPDATE booking_payments SET status = 'pending', updated_at = now()
      WHERE provider_session_id = ${input.sessionId} AND status = 'processing'
    `;
    throw error;
  }
  return true;
}

export async function markCheckoutFailed(sessionId: string) {
  const sql = getSql();
  await sql`
    UPDATE booking_payments SET status = 'failed', updated_at = now()
    WHERE provider_session_id = ${sessionId} AND status = 'pending'
  `;
}
