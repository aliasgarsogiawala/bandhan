import { NextResponse } from "next/server";
import { markPaymentOrderFailed, markPaymentOrderPaid } from "@/lib/payments/db";
import { assertCapturedPayment, verifyWebhookSignature } from "@/lib/payments/razorpay";

export const runtime = "nodejs";

interface RazorpayWebhook {
  event?: string;
  payload?: {
    order?: { entity?: { id?: string; status?: string } };
    payment?: { entity?: { id?: string; order_id?: string; status?: string } };
  };
}

export async function POST(request: Request) {
  const signature = request.headers.get("x-razorpay-signature") || "";
  const payload = await request.text();
  try {
    if (!signature || !verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ ok: false, error: "Invalid webhook signature." }, { status: 400 });
    }
  } catch (error) {
    console.error("Razorpay webhook configuration error:", error);
    return NextResponse.json({ ok: false, error: "Webhook is not configured." }, { status: 503 });
  }

  let event: RazorpayWebhook;
  try {
    event = JSON.parse(payload) as RazorpayWebhook;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid webhook payload." }, { status: 400 });
  }
  const payment = event.payload?.payment?.entity;
  const orderId = payment?.order_id || event.payload?.order?.entity?.id || "";
  const paymentId = payment?.id || "";

  try {
    if ((event.event === "order.paid" || event.event === "payment.captured") && orderId && paymentId) {
      await assertCapturedPayment({ orderId, paymentId });
      await markPaymentOrderPaid({ orderId, paymentId });
    } else if (event.event === "payment.failed" && orderId) {
      await markPaymentOrderFailed(orderId);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json({ ok: false, error: "Webhook processing failed." }, { status: 500 });
  }
}
