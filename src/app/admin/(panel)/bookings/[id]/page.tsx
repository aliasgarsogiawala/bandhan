"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BookingPartyPanel from "@/components/booking/BookingPartyPanel";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_PIPELINE } from "@/lib/bookings/types";
import type { BookingDetail } from "@/lib/bookings/types";

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const refresh = useCallback(async () => {
    await fetch(`/api/bookings/${params.id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        const next = data.ok ? data.booking : null;
        setBooking(next);
        if (next) {
          setPrice(next.price_amount || "");
          setRemarks(next.internal_remarks || "");
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => { void refresh(); }, [refresh]);

  const action = async (name: string, extra: Record<string, unknown> = {}) => {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/agent/bookings/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: name, ...extra }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update booking.");
      await refresh();
      setMessage("Booking updated.");
    } catch (actionError) {
      setMessage(actionError instanceof Error ? actionError.message : "Could not update booking.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground-muted">Loading…</p>;
  if (!booking) return <p className="text-sm text-foreground-muted">Booking not found.</p>;

  const isTerminal = booking.status === "rejected" || booking.status === "cancelled";
  const currentIndex = BOOKING_STATUS_PIPELINE.indexOf(booking.status);

  return (
    <div className="space-y-6">
      <Link href="/admin/bookings" className="text-sm font-semibold text-accent hover:text-accent-dark">
        &larr; Back to Bookings
      </Link>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
          {booking.type === "customized" ? "Custom Trip" : "Standard Booking"} · {booking.booking_code}
        </span>
        <h1 className="text-xl font-heading font-bold text-primary mt-1">
          {booking.package_title || booking.destination || "Trip Request"}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 text-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Travel Date</span>
            <span className="font-semibold">{booking.travel_date || "TBC"}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Travellers</span>
            <span className="font-semibold">{booking.travellers_count ?? "—"}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Price</span>
            <span className="font-semibold">{booking.price_amount || "Pending quote"}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Payment</span>
            <span className="font-semibold capitalize">{booking.payment_status}</span>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block mb-2">Progress</span>
          {isTerminal ? (
            <span className="inline-block text-sm font-bold px-4 py-2 rounded-full bg-red-50 text-red-700 border border-red-200">
              {BOOKING_STATUS_LABELS[booking.status]}
            </span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {BOOKING_STATUS_PIPELINE.map((status, idx) => (
                <span
                  key={status}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border ${
                    idx <= currentIndex ? "bg-primary text-white border-primary" : "bg-slate-50 text-slate-400 border-slate-200"
                  }`}
                >
                  {BOOKING_STATUS_LABELS[status]}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
          <span className="mr-auto text-xs font-bold uppercase tracking-wider text-foreground-muted">
            {booking.quotation_number}
          </span>
          <a
            href={`/api/bookings/${booking.id}/brochure`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white"
          >
            Preview brochure
          </a>
          <a
            href={`/api/bookings/${booking.id}/brochure?download=1`}
            className="rounded-full border border-primary/20 px-4 py-2 text-xs font-bold text-primary"
          >
            Download PDF
          </a>
        </div>
      </div>

      <BookingPartyPanel booking={booking} />

      <div className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Admin controls</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Quoted price, e.g. ₹85,000" className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" />
          <button disabled={busy || !price.trim()} onClick={() => void action("setPricing", { priceAmount: price })} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">Set pricing</button>
          <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Internal remarks" rows={3} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm sm:col-span-2" />
          <button disabled={busy} onClick={() => void action("setRemarks", { remarks })} className="rounded-xl border border-primary/20 px-4 py-2.5 text-sm font-bold text-primary sm:col-span-2">Save internal remarks</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {booking.status === "quoted" ? <button disabled={busy} onClick={() => void action("approve")} className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-bold text-white">Approve</button> : null}
          {booking.payment_status !== "received" && ["approved", "payment_pending"].includes(booking.status) ? <button disabled={busy} onClick={() => void action("markPaymentReceived")} className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-white">Mark payment received</button> : null}
          {booking.status === "confirmed" ? <button disabled={busy} onClick={() => void action("complete")} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white">Complete trip</button> : null}
          {!isTerminal && booking.status !== "completed" ? <><button disabled={busy} onClick={() => void action("reject")} className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700">Reject</button><button disabled={busy} onClick={() => void action("cancel")} className="rounded-full border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600">Cancel</button></> : null}
        </div>
        {message ? <p role="status" className="mt-3 text-sm font-semibold text-primary">{message}</p> : null}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-3">Status History</h2>
        <ul className="space-y-2 text-sm">
          {booking.history.map((entry) => (
            <li key={entry.id}>
              <span className="font-semibold text-primary">{BOOKING_STATUS_LABELS[entry.to_status]}</span>
              <span className="text-foreground-muted"> — {entry.changed_by}</span>
              {entry.note && <span className="text-foreground-muted"> ({entry.note})</span>}
              <span className="block text-xs text-slate-400">{new Date(entry.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
