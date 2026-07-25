"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/lib/auth/useAuth";
import { contactEnquiryHref } from "@/lib/enquiryLink";
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

export default function AccountPage() {
  const { user, loading } = useAuth();
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
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={enquire} />

      <main className="flex-1 py-28 sm:py-32">
        <Container className="max-w-3xl">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-accent">
              My Account
            </span>
            <h1 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary">
              My Bookings
            </h1>
            <p className="mt-3 text-foreground-muted font-sans text-sm">
              Track your standard bookings and customized trip requests here.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-sm text-foreground-muted py-10">Loading…</p>
          ) : !user ? (
            <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-8 text-center space-y-4">
              <p className="text-foreground-muted font-sans text-sm">
                Please sign in to view your bookings.
              </p>
              <Link href="/signin?from=/account">
                <PrimaryButton variant="coral" size="md">
                  Sign In
                </PrimaryButton>
              </Link>
            </div>
          ) : bookingsLoading ? (
            <p className="text-center text-sm text-foreground-muted py-10">Loading your bookings…</p>
          ) : bookings?.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-8 text-center space-y-4">
              <p className="text-foreground-muted font-sans text-sm">
                You don&apos;t have any bookings yet.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/packages">
                  <PrimaryButton variant="navy" size="md">
                    Browse Packages
                  </PrimaryButton>
                </Link>
                <Link href="/plan-trip">
                  <PrimaryButton variant="coral" size="md">
                    Plan a Custom Trip
                  </PrimaryButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {(bookings ?? []).map((booking) => (
                <Link
                  key={booking.id}
                  href={`/account/bookings/${booking.id}`}
                  className="block bg-white rounded-2xl shadow-soft border border-slate-100/80 p-5 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                        {booking.type === "customized" ? "Custom Trip" : "Standard Booking"} ·{" "}
                        {booking.booking_code}
                      </span>
                      <h2 className="text-lg font-heading font-bold text-primary mt-1">
                        {booking.package_title || booking.destination || "Trip Request"}
                      </h2>
                      <span className="text-xs text-foreground-muted font-sans block mt-1">
                        {booking.travel_date || "Dates to be confirmed"}
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
        </Container>
      </main>

      <Footer />
    </div>
  );
}
