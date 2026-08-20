import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { markCheckoutFailed, markCheckoutPaid } from "@/lib/payments/db";
import { getStripe } from "@/lib/payments/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "Webhook is not configured." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = getStripe().webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error("stripe signature error:", error);
    return NextResponse.json({ ok: false, error: "Invalid signature." }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const session = event.data.object;
      if (session.payment_status === "paid") {
        const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null;
        await markCheckoutPaid({ sessionId: session.id, paymentIntentId });
      }
    } else if (event.type === "checkout.session.async_payment_failed") {
      await markCheckoutFailed(event.data.object.id);
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("stripe webhook processing error:", error);
    return NextResponse.json({ ok: false, error: "Webhook processing failed." }, { status: 500 });
  }
}
