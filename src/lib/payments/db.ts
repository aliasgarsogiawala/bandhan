import "server-only";

import { getSql } from "@/lib/db";
import { addNotification, getBookingById, setPaymentStatus } from "@/lib/bookings/db";

export async function recordPaymentOrder(input: {
  bookingId: string;
  orderId: string;
  amountMinor: number;
  currency: string;
}) {
  const sql = getSql();
  await sql`
    INSERT INTO booking_payments (booking_id, provider, provider_session_id, amount_minor, currency, status)
    VALUES (${input.bookingId}, 'razorpay', ${input.orderId}, ${input.amountMinor}, ${input.currency}, 'pending')
    ON CONFLICT (provider_session_id) DO NOTHING
  `;
}

/** Claims the Razorpay event, confirms the booking, then records payment success.
 * A stale processing claim is recoverable so webhook retries can finish after a crash. */
export async function paymentOrderBelongsToBooking(bookingId: string, orderId: string) {
  const sql = getSql();
  const rows = (await sql`
    SELECT id FROM booking_payments
    WHERE booking_id = ${bookingId} AND provider = 'razorpay' AND provider_session_id = ${orderId}
    LIMIT 1
  `) as Array<{ id: string }>;
  return rows.length > 0;
}

export async function markPaymentOrderPaid(input: {
  orderId: string;
  paymentId: string;
}): Promise<boolean> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE booking_payments
    SET status = 'processing', provider_payment_id = ${input.paymentId}, updated_at = now()
    WHERE provider = 'razorpay' AND provider_session_id = ${input.orderId}
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
      await setPaymentStatus(booking.id, "received", "razorpay");
      await addNotification(booking.id, "in-app", "Razorpay payment received. Your booking is confirmed.");
    }
    await sql`
      UPDATE booking_payments SET status = 'paid', updated_at = now()
      WHERE provider = 'razorpay' AND provider_session_id = ${input.orderId} AND status = 'processing'
    `;
  } catch (error) {
    await sql`
      UPDATE booking_payments SET status = 'pending', updated_at = now()
      WHERE provider = 'razorpay' AND provider_session_id = ${input.orderId} AND status = 'processing'
    `;
    throw error;
  }
  return true;
}

export async function markPaymentOrderFailed(orderId: string) {
  const sql = getSql();
  await sql`
    UPDATE booking_payments SET status = 'failed', updated_at = now()
    WHERE provider = 'razorpay' AND provider_session_id = ${orderId} AND status = 'pending'
  `;
}
