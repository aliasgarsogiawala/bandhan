"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";
import type { Booking } from "@/lib/bookings/types";

const STATUS_BADGE: Record<string, string> = {
  new: "bg-slate-100 text-slate-600 border-slate-200",
  reviewing: "bg-amber-50 text-amber-700 border-amber-200",
  quoted: "bg-blue-50 text-blue-700 border-blue-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  payment_pending: "bg-orange-50 text-orange-700 border-orange-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-primary/10 text-primary border-primary/20",
};

export default function AgentDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agent/bookings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-extrabold text-primary">Bookings</h1>
        <p className="text-sm text-foreground-muted font-sans mt-1">
          Assigned to you, plus unassigned requests you can pick up.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-foreground-muted">Loading…</p>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-sm text-foreground-muted">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Link
              key={booking.id}
              href={`/agent/bookings/${booking.id}`}
              className="block bg-white rounded-2xl shadow-soft border border-slate-100/80 p-5 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                    {booking.type === "customized" ? "Custom Trip" : "Standard Booking"} ·{" "}
                    {booking.booking_code}
                    {!booking.agent_id && (
                      <span className="ml-2 text-amber-600">· Unassigned</span>
                    )}
                  </span>
                  <h2 className="text-base font-heading font-bold text-primary mt-1">
                    {booking.package_title || booking.destination || "Trip Request"}
                  </h2>
                  <span className="text-xs text-foreground-muted font-sans block mt-1">
                    {booking.contact_name} · {booking.contact_phone}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                    STATUS_BADGE[booking.status] || STATUS_BADGE.new
                  }`}
                >
                  {BOOKING_STATUS_LABELS[booking.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
