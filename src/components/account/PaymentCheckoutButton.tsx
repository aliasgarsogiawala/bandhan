"use client";

import Script from "next/script";
import { useState } from "react";
import { CreditCard, LockKeyhole, ShieldCheck } from "lucide-react";
import type { BookingDetail } from "@/lib/bookings/types";
import { formatMoney, parseMoney } from "@/lib/bookings/pricing";

interface RazorpaySuccess {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CheckoutDetails {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  bookingCode: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", callback: (response: { error?: { description?: string } }) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

export function PaymentCheckoutButton({ booking }: { booking: BookingDetail }) {
  const [scriptReady, setScriptReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [testOverride, setTestOverride] = useState(false);
  const testModeAvailable = process.env.NODE_ENV !== "production";
  if (booking.payment_status === "received" || !["approved", "payment_pending"].includes(booking.status)) return null;
  const amount = booking.pricing_snapshot?.depositAmount || parseMoney(booking.price_amount);

  async function verifyPayment(response: RazorpaySuccess) {
    const verification = await fetch(`/api/bookings/${booking.id}/payment/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(response),
    });
    const data = (await verification.json()) as { ok?: boolean; error?: string };
    if (!verification.ok || !data.ok) throw new Error(data.error || "Could not verify payment.");
    setSuccess(true);
    window.setTimeout(() => window.location.reload(), 1200);
  }

  async function checkout() {
    if (testModeAvailable && testOverride) {
      window.location.assign(`/account/bookings/${booking.id}/confirmation?test=1`);
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (!window.Razorpay) throw new Error("Secure checkout is still loading. Please try again.");
      const response = await fetch(`/api/bookings/${booking.id}/checkout`, { method: "POST" });
      const data = (await response.json()) as { checkout?: CheckoutDetails; error?: string };
      if (!response.ok || !data.checkout) throw new Error(data.error || "Could not start checkout.");
      const checkoutDetails = data.checkout;
      const razorpay = new window.Razorpay({
        key: checkoutDetails.keyId,
        amount: checkoutDetails.amount,
        currency: checkoutDetails.currency,
        name: "Bandhan Tours",
        description: checkoutDetails.description,
        order_id: checkoutDetails.orderId,
        prefill: checkoutDetails.prefill,
        notes: { bookingCode: checkoutDetails.bookingCode },
        theme: { color: "#08243e" },
        retry: { enabled: true },
        modal: { ondismiss: () => setBusy(false) },
        handler: (paymentResponse: RazorpaySuccess) => {
          void verifyPayment(paymentResponse).catch((verifyError) => {
            setError(verifyError instanceof Error ? verifyError.message : "Could not verify payment.");
            setBusy(false);
          });
        },
      });
      razorpay.on("payment.failed", (failure) => {
        setError(failure.error?.description || "Payment failed. No amount was confirmed.");
        setBusy(false);
      });
      razorpay.open();
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Could not start checkout.");
      setBusy(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
        onError={() => setError("Secure checkout could not be loaded.")}
      />
      <section className="mt-6 overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-sand shadow-soft">
        <div className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck size={17} />
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]">Razorpay secure checkout</p>
            </div>
            <p className="mt-2 font-heading text-2xl font-extrabold text-primary">Pay {formatMoney(amount)} advance</p>
            <p className="mt-1 max-w-lg text-xs leading-relaxed text-foreground-muted">
              Complete payment using UPI, cards, netbanking or wallets. Confirmation is applied only after server-side verification.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void checkout()}
            disabled={busy || success || (!testOverride && (!scriptReady || amount <= 0))}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-[6px] px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 ${testOverride ? "bg-amber-700 shadow-amber-700/15 hover:bg-amber-800" : "bg-primary shadow-primary/15 hover:bg-primary/90"}`}
          >
            {success ? <><ShieldCheck size={18} /> Verified</> : busy ? <><LockKeyhole size={17} /> Processing…</> : testOverride ? <><ShieldCheck size={18} /> Preview final confirmation</> : <><CreditCard size={18} /> Pay with Razorpay</>}
          </button>
        </div>
        {testModeAvailable ? (
          <div className="border-t border-amber-200 bg-amber-50 px-5 py-4 sm:px-6">
            <label className="flex cursor-pointer items-start gap-3 text-left">
              <input
                type="checkbox"
                checked={testOverride}
                onChange={(event) => setTestOverride(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-amber-700"
              />
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-amber-800">Test payment override</span>
                <span className="mt-1 block text-xs leading-relaxed text-amber-800/80">Skip Razorpay and preview the final confirmation. No payment is collected and the booking record is not changed.</span>
              </span>
            </label>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-emerald-100 bg-white/70 px-5 py-3 text-[11px] text-foreground-muted sm:px-6">
          <span>Booking {booking.booking_code}</span>
          <span className="inline-flex items-center gap-1.5"><LockKeyhole size={12} /> Payment details are handled by Razorpay</span>
        </div>
        {error ? <p role="alert" className="border-t border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 sm:px-6">{error}</p> : null}
      </section>
    </>
  );
}
