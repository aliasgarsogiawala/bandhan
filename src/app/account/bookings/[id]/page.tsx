"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_PIPELINE,
} from "@/lib/bookings/types";
import type { BookingDetail } from "@/lib/bookings/types";

const DOC_LABELS: Record<string, string> = {
  quotation: "Quotation",
  invoice: "Invoice",
  itinerary: "Itinerary",
  voucher: "Voucher",
  other: "Document",
};

export default function AccountBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const enquire = () => window.location.assign(contactEnquiryHref());
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/bookings/${params.id}`, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.error || "Could not load this booking.");
          return;
        }
        setBooking(data.booking);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  const isTerminal = booking?.status === "rejected" || booking?.status === "cancelled";
  const currentIndex = booking
    ? BOOKING_STATUS_PIPELINE.indexOf(booking.status)
    : -1;

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={enquire} />

      <main className="flex-1 py-28 sm:py-32">
        <Container className="max-w-3xl space-y-8">
          <Link href="/account" className="text-sm font-semibold text-accent hover:text-accent-dark">
            &larr; Back to My Bookings
          </Link>

          {loading ? (
            <p className="text-center text-sm text-foreground-muted py-10">Loading…</p>
          ) : error || !booking ? (
            <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-8 text-center">
              <p className="text-foreground-muted font-sans text-sm">{error || "Booking not found."}</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-6 sm:p-8">
                <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  {booking.type === "customized" ? "Custom Trip" : "Standard Booking"} ·{" "}
                  {booking.booking_code}
                </span>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-primary mt-1">
                    {booking.package_title || booking.destination || "Trip Request"}
                  </h1>
                  <Link
                    href={`/account/bookings/${booking.id}/quotation`}
                    target="_blank"
                    className="text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-dark whitespace-nowrap"
                  >
                    Download Summary →
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                      Travel Date
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {booking.travel_date || "TBC"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                      Travellers
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {booking.travellers_count ?? "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                      Price
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {booking.price_amount || "Pending quote"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">
                      Payment
                    </span>
                    <span className="text-sm font-semibold text-primary capitalize">
                      {booking.payment_status}
                    </span>
                  </div>
                </div>

                {/* Status timeline */}
                <div className="mt-8">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block mb-3">
                    Progress
                  </span>
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
                            idx <= currentIndex
                              ? "bg-primary text-white border-primary"
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          }`}
                        >
                          {BOOKING_STATUS_LABELS[status]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-6 sm:p-8">
                <h2 className="text-lg font-heading font-bold text-primary mb-4">Documents</h2>
                {booking.documents.length === 0 ? (
                  <p className="text-sm text-foreground-muted font-sans">
                    No documents have been shared yet.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {booking.documents.map((doc) => (
                      <li key={doc.id}>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-sm font-semibold text-primary hover:text-accent px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 transition-colors"
                        >
                          <span>{DOC_LABELS[doc.doc_type] || "Document"}</span>
                          <span className="text-xs text-accent">View →</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-6 sm:p-8">
                <h2 className="text-lg font-heading font-bold text-primary mb-4">Notifications</h2>
                {booking.notifications.length === 0 ? (
                  <p className="text-sm text-foreground-muted font-sans">No notifications yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {booking.notifications.map((note) => (
                      <li key={note.id} className="text-sm font-sans">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-accent mr-2">
                          {note.channel}
                        </span>
                        <span className="text-foreground-muted">{note.message}</span>
                        <span className="block text-xs text-slate-400 mt-0.5">
                          {new Date(note.created_at).toLocaleString()}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
}
