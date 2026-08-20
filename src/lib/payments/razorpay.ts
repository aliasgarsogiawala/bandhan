import "server-only";

import crypto from "node:crypto";
import Razorpay from "razorpay";

let client: Razorpay | null = null;

function credentials() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay API keys are not configured.");
  return { keyId, keySecret };
}

export function getRazorpay() {
  const { keyId, keySecret } = credentials();
  if (!client) client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  return client;
}

export function getRazorpayKeyId() {
  return credentials().keyId;
}

function signaturesMatch(expected: string, received: string) {
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function verifyPaymentSignature(input: { orderId: string; paymentId: string; signature: string }) {
  const { keySecret } = credentials();
  const expected = crypto.createHmac("sha256", keySecret).update(`${input.orderId}|${input.paymentId}`).digest("hex");
  return signaturesMatch(expected, input.signature);
}

export function verifyWebhookSignature(payload: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not configured.");
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return signaturesMatch(expected, signature);
}

export async function assertCapturedPayment(input: { orderId: string; paymentId: string }) {
  const razorpay = getRazorpay();
  const [order, payment] = await Promise.all([
    razorpay.orders.fetch(input.orderId),
    razorpay.payments.fetch(input.paymentId),
  ]);
  if (order.status !== "paid" || payment.status !== "captured" || payment.order_id !== input.orderId) {
    throw new Error("Razorpay has not captured this payment yet.");
  }
  return { order, payment };
}
