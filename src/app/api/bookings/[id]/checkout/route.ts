import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { getBookingById, updateStatus } from "@/lib/bookings/db";
import { parseMoney } from "@/lib/bookings/pricing";
import { recordPaymentOrder } from "@/lib/payments/db";
import { getRazorpay, getRazorpayKeyId } from "@/lib/payments/razorpay";

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
    const order = await getRazorpay().orders.create({
      amount: amountMinor,
      currency: "INR",
      receipt: `${booking.booking_code}-${Date.now().toString(36)}`.slice(0, 40),
      notes: { bookingId: booking.id, bookingCode: booking.booking_code },
    });
    await recordPaymentOrder({ bookingId: booking.id, orderId: order.id, amountMinor, currency: "inr" });
    if (booking.status !== "payment_pending") {
      await updateStatus(booking.id, "payment_pending", "customer", "Online checkout started");
    }
    return NextResponse.json({
      ok: true,
      checkout: {
        keyId: getRazorpayKeyId(),
        orderId: order.id,
        amount: amountMinor,
        currency: "INR",
        bookingId: booking.id,
        bookingCode: booking.booking_code,
        description: booking.package_title || booking.destination || "Bandhan Tours booking advance",
        prefill: {
          name: booking.contact_name,
          email: booking.contact_email,
          contact: booking.contact_phone,
        },
      },
    });
  } catch (error) {
    console.error("create checkout error:", error);
    const message = error instanceof Error && error.message.includes("Razorpay API keys")
      ? "Online payments are not configured yet."
      : "Could not start secure checkout.";
    return NextResponse.json({ ok: false, error: message }, { status: 503 });
  }
}
