import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { getBookingById } from "@/lib/bookings/db";
import { markPaymentOrderPaid, paymentOrderBelongsToBooking } from "@/lib/payments/db";
import { assertCapturedPayment, verifyPaymentSignature } from "@/lib/payments/razorpay";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Please sign in to verify payment." }, { status: 401 });
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking || booking.user_id !== userId) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  const orderId = body.razorpay_order_id || "";
  const paymentId = body.razorpay_payment_id || "";
  const signature = body.razorpay_signature || "";
  if (!orderId || !paymentId || !signature) {
    return NextResponse.json({ ok: false, error: "Incomplete payment response." }, { status: 400 });
  }
  if (!(await paymentOrderBelongsToBooking(booking.id, orderId))) {
    return NextResponse.json({ ok: false, error: "Payment order does not match this booking." }, { status: 403 });
  }
  if (!verifyPaymentSignature({ orderId, paymentId, signature })) {
    return NextResponse.json({ ok: false, error: "Payment signature verification failed." }, { status: 400 });
  }

  try {
    await assertCapturedPayment({ orderId, paymentId });
    await markPaymentOrderPaid({ orderId, paymentId });
    return NextResponse.json({ ok: true, confirmed: true });
  } catch (error) {
    console.error("verify Razorpay payment error:", error);
    return NextResponse.json({ ok: false, error: "Payment is not captured yet. We will confirm it automatically." }, { status: 409 });
  }
}
