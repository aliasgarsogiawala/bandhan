"use client";

import { useState } from "react";
import type { BookingDetail } from "@/lib/bookings/types";
import { formatMoney, parseMoney } from "@/lib/bookings/pricing";

export function PaymentCheckoutButton({ booking }: { booking: BookingDetail }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (booking.payment_status === "received" || !["approved", "payment_pending"].includes(booking.status)) return null;
  const amount = booking.pricing_snapshot?.depositAmount || parseMoney(booking.price_amount);

  async function checkout() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/bookings/${booking.id}/checkout`, { method: "POST" });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Could not start checkout.");
      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : "Could not start checkout.");
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Secure online payment</p>
      <p className="mt-1 font-heading text-xl font-bold text-primary">Advance due: {formatMoney(amount)}</p>
      <p className="mt-1 text-xs text-foreground-muted">You’ll complete payment on Stripe’s secure checkout page.</p>
      <button type="button" onClick={() => void checkout()} disabled={busy || amount <= 0} className="mt-4 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
        {busy ? "Opening checkout…" : "Pay securely"}
      </button>
      {error ? <p role="alert" className="mt-2 text-sm font-semibold text-red-700">{error}</p> : null}
    </div>
  );
}
