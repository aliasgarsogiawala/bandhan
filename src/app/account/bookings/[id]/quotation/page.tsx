"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";
import type { BookingDetail } from "@/lib/bookings/types";

export default function BookingQuotationPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setBooking(data.ok ? data.booking : null))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) return <p className="p-10 text-center text-sm text-slate-500">Loading…</p>;
  if (!booking) return <p className="p-10 text-center text-sm text-slate-500">Booking not found.</p>;

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans">
      <div className="max-w-2xl mx-auto p-10">
        <div className="flex items-center justify-between mb-8 print:hidden">
          <h1 className="text-xl font-bold">Booking Summary</h1>
          <PrimaryButton variant="navy" size="sm" onClick={() => window.print()}>
            Print / Save as PDF
          </PrimaryButton>
        </div>

        <div className="border border-slate-200 rounded-2xl p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <span className="text-lg font-bold text-primary">Bandhan Tours</span>
            <span className="text-sm font-semibold text-slate-500">{booking.booking_code}</span>
          </div>

          <h2 className="text-2xl font-bold mb-1">
            {booking.package_title || booking.destination || "Trip Request"}
          </h2>
          <p className="text-sm text-slate-500 mb-6">{BOOKING_STATUS_LABELS[booking.status]}</p>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Traveller</dt>
              <dd className="font-semibold">{booking.contact_name}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Contact</dt>
              <dd className="font-semibold">{booking.contact_email} · {booking.contact_phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Travel Date</dt>
              <dd className="font-semibold">{booking.travel_date || "TBC"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Travellers</dt>
              <dd className="font-semibold">{booking.travellers_count ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Price</dt>
              <dd className="font-semibold">{booking.price_amount || "Pending quote"}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Payment Status</dt>
              <dd className="font-semibold capitalize">{booking.payment_status}</dd>
            </div>
          </dl>

          {booking.special_requirements && (
            <div className="mt-6">
              <dt className="text-slate-500 text-sm">Special Requirements</dt>
              <dd className="text-sm font-medium mt-1">{booking.special_requirements}</dd>
            </div>
          )}

          <p className="text-xs text-slate-400 mt-8 border-t border-slate-100 pt-4">
            Generated on {new Date().toLocaleString()} — Bandhan Tours
          </p>
        </div>
      </div>
    </div>
  );
}
