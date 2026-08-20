import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { getBookingById, updateStatus } from "@/lib/bookings/db";
import { parseMoney } from "@/lib/bookings/pricing";
import { recordCheckout } from "@/lib/payments/db";
import { getStripe } from "@/lib/payments/stripe";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Please sign in to pay." }, { status: 401 });
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking || booking.user_id !== userId) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }
  if (!["approved", "payment_pending"].includes(booking.status) || booking.payment_status === "received") {
    return NextResponse.json({ ok: false, error: "This booking is not awaiting online payment." }, { status: 409 });
  }

  const amount = booking.pricing_snapshot?.depositAmount || parseMoney(booking.price_amount);
  const amountMinor = Math.round(amount * 100);
  if (amountMinor < 100) {
    return NextResponse.json({ ok: false, error: "A valid payment amount has not been set." }, { status: 409 });
  }

  try {
    const origin = new URL(request.url).origin;
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: booking.contact_email,
      client_reference_id: booking.id,
      metadata: { bookingId: booking.id, bookingCode: booking.booking_code },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "inr",
            unit_amount: amountMinor,
            product_data: {
              name: `Booking advance · ${booking.booking_code}`,
              description: booking.package_title || booking.destination || "Bandhan Tours booking",
            },
          },
        },
      ],
      success_url: `${origin}/account/bookings/${booking.id}?payment=success`,
      cancel_url: `${origin}/account/bookings/${booking.id}?payment=cancelled`,
    });
    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    await recordCheckout({ bookingId: booking.id, sessionId: session.id, amountMinor, currency: "inr" });
    if (booking.status !== "payment_pending") {
      await updateStatus(booking.id, "payment_pending", "customer", "Online checkout started");
    }
    return NextResponse.json({ ok: true, url: session.url });
  } catch (error) {
    console.error("create checkout error:", error);
    const message = error instanceof Error && error.message.includes("STRIPE_SECRET_KEY")
      ? "Online payments are not configured yet."
      : "Could not start secure checkout.";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
