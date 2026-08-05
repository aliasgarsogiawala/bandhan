"use client";

import type { Booking } from "@/lib/bookings/types";

const BADGE: Record<string, { label: string; className: string }> = {
  self: { label: "Booked for themselves", className: "bg-slate-100 text-slate-600 border-slate-200" },
  guest: { label: "Booked for someone else", className: "bg-amber-50 text-amber-700 border-amber-200" },
  client: { label: "Agent booking", className: "bg-accent/10 text-accent border-accent/20" },
};

/** Compact badge for booking lists. */
export function BookingPartyBadge({ bookedFor }: { bookedFor: Booking["booked_for"] }) {
  const badge = BADGE[bookedFor] || BADGE.self;
  if (bookedFor === "self") return null;
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
    >
      {badge.label}
    </span>
  );
}

/**
 * Who a booking belongs to. On a self booking there is only one person, so
 * this collapses to a single card rather than repeating the same details.
 */
export default function BookingPartyPanel({ booking }: { booking: Booking }) {
  const badge = BADGE[booking.booked_for] || BADGE.self;
  const hasBooker = Boolean(booking.booker_name);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-base font-bold text-primary">Booking party</h2>
        <span
          className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${badge.className}`}
        >
          {badge.label}
        </span>
      </div>

      <div className={`mt-5 grid gap-4 ${hasBooker ? "sm:grid-cols-2" : ""}`}>
        <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
            Lead traveller
          </span>
          <strong className="mt-1 block text-sm text-primary">{booking.contact_name}</strong>
          <span className="mt-0.5 block text-xs text-foreground-muted">
            {booking.contact_email}
          </span>
          <span className="block text-xs text-foreground-muted">{booking.contact_phone}</span>
        </div>

        {hasBooker ? (
          <div className="rounded-xl border border-accent/20 bg-accent/[0.04] p-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-accent">
              {booking.booked_for === "client" ? "Booked by (agent)" : "Booked by"}
              {booking.booker_relation ? ` · ${booking.booker_relation}` : ""}
            </span>
            <strong className="mt-1 block text-sm text-primary">{booking.booker_name}</strong>
            <span className="mt-0.5 block text-xs text-foreground-muted">
              {booking.booker_email}
            </span>
            <span className="block text-xs text-foreground-muted">{booking.booker_phone}</span>
            <span className="mt-2 block text-xs font-semibold text-foreground-muted">
              {booking.notify_booker
                ? "Copied on all traveller updates"
                : "Not copied on traveller updates"}
            </span>
          </div>
        ) : null}
      </div>

      {booking.agent_reference ? (
        <p className="mt-4 text-xs text-foreground-muted">
          Agent reference:{" "}
          <strong className="font-semibold text-primary">{booking.agent_reference}</strong>
        </p>
      ) : null}

      {booking.contact_email === booking.booker_email && hasBooker ? (
        <p className="mt-4 rounded-xl bg-sand px-4 py-2.5 text-xs text-foreground-muted">
          The traveller had no contact details of their own, so everything goes to the booker.
        </p>
      ) : null}
    </div>
  );
}
