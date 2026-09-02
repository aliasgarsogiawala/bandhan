"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import PageShell from "@/components/ui/PageShell";
import PageHero from "@/components/ui/PageHero";
import { useAuth } from "@/lib/auth/useAuth";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";
import type { Booking } from "@/lib/bookings/types";
import { AccountProfilePanel } from "@/components/account/AccountProfilePanel";

/**
 * Muted, editorial status chips — the same restraint the group-departure
 * badges use. The previous set reached for a different saturated hue per
 * status, which made a list of bookings read as an alert panel.
 */
const STATUS_BADGE: Record<string, string> = {
  new: "border-primary/15 bg-sand text-foreground-muted",
  reviewing: "border-gold/45 bg-gold/15 text-gold-dark",
  quoted: "border-primary/20 bg-primary/[0.06] text-primary",
  approved: "border-emerald-600/25 bg-emerald-500/10 text-emerald-700",
  rejected: "border-accent/30 bg-accent/10 text-accent-dark",
  payment_pending: "border-gold/45 bg-gold/15 text-gold-dark",
  confirmed: "border-emerald-600/30 bg-emerald-600/12 text-emerald-800",
  cancelled: "border-primary/12 bg-sand-dark/50 text-foreground-muted",
  completed: "border-primary bg-primary text-white",
};

const cta =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-300";

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-primary/12 bg-white p-10 text-center shadow-premium">
      {children}
    </div>
  );
}

export default function AccountPage() {
  const { user, loading, refresh } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  const enquire = () => window.location.assign(contactEnquiryHref());

  useEffect(() => {
    if (!user) return;
    fetch("/api/bookings/mine", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setBookings(data.bookings || []));
  }, [user]);

  const bookingsLoading = Boolean(user) && bookings === null;

  return (
    <PageShell tone="sand" onEnquiryClick={enquire}>
      <PageHero
        size="sm"
        eyebrow="My account"
        title="My bookings"
        description="Track your standard bookings and customized trip requests here."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My account" }]}
      />

      <section className="py-14 sm:py-20">
        <Container className="max-w-3xl space-y-6">
          {loading ? (
            <p className="py-12 text-center text-sm text-foreground-muted">Loading…</p>
          ) : !user ? (
            <EmptyState>
              <p className="text-sm text-foreground-muted">Please sign in to view your bookings.</p>
              <Link
                href="/signin?from=/account"
                className={`${cta} mt-6 bg-accent text-white hover:bg-accent-dark`}
              >
                Sign in
              </Link>
            </EmptyState>
          ) : bookingsLoading ? (
            <p className="py-12 text-center text-sm text-foreground-muted">
              Loading your bookings…
            </p>
          ) : bookings?.length === 0 ? (
            <EmptyState>
              <p className="text-sm text-foreground-muted">You don&apos;t have any bookings yet.</p>
              <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
                <Link
                  href="/packages"
                  className={`${cta} bg-primary text-white hover:bg-gold hover:text-primary`}
                >
                  Browse packages
                </Link>
                <Link
                  href="/plan-trip"
                  className={`${cta} border border-primary/20 text-primary hover:border-primary hover:bg-primary hover:text-white`}
                >
                  Plan a custom trip
                </Link>
              </div>
            </EmptyState>
          ) : (
            <ul className="border border-primary/12 bg-white shadow-premium">
              {(bookings ?? []).map((booking, index) => (
                <li key={booking.id} className={index ? "border-t border-primary/10" : ""}>
                  <Link
                    href={`/account/bookings/${booking.id}`}
                    className="group flex items-start justify-between gap-4 p-5 transition-colors duration-200 hover:bg-sand-light sm:p-6"
                  >
                    <div className="min-w-0">
                      <span className="tabular block text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-light">
                        {booking.type === "customized" ? "Custom trip" : "Standard booking"} ·{" "}
                        {booking.booking_code}
                      </span>
                      <h2 className="mt-1.5 font-heading text-lg font-bold leading-tight tracking-[-0.015em] text-primary">
                        {booking.package_title || booking.destination || "Trip Request"}
                      </h2>
                      <span className="tabular mt-1.5 block text-xs text-foreground-muted">
                        {booking.travel_date || "Dates to be confirmed"}
                      </span>
                      {booking.booked_for !== "self" ? (
                        <span className="mt-1 block text-xs font-semibold text-accent">
                          For {booking.contact_name}
                          {booking.booker_relation ? ` · ${booking.booker_relation}` : ""}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-3">
                      <span
                        className={`border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                          STATUS_BADGE[booking.status] || STATUS_BADGE.new
                        }`}
                      >
                        {BOOKING_STATUS_LABELS[booking.status]}
                      </span>
                      <ArrowRight
                        size={16}
                        aria-hidden="true"
                        className="text-foreground-light transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent"
                      />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {user ? <AccountProfilePanel user={user} onProfileSaved={refresh} /> : null}
        </Container>
      </section>
    </PageShell>
  );
}
