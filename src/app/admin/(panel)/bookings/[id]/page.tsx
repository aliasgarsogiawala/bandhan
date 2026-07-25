"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_PIPELINE } from "@/lib/bookings/types";
import type { BookingDetail } from "@/lib/bookings/types";

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setBooking(data.ok ? data.booking : null))
      .finally(() => setLoading(false));
  }, [params.id]);

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
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Contact</span>
            <span className="font-semibold">{booking.contact_name}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Phone / Email</span>
            <span className="font-semibold">{booking.contact_phone} · {booking.contact_email}</span>
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
