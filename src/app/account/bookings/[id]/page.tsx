"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import { Container } from "@/components/ui/Container";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_PIPELINE,
} from "@/lib/bookings/types";
import type { BookingDetail } from "@/lib/bookings/types";
import { BookingTravellerEditor } from "@/components/account/BookingTravellerEditor";
import PdfPreviewModal from "@/components/ui/PdfPreviewModal";

const DOC_LABELS: Record<string, string> = {
  quotation: "Quotation",
  invoice: "Invoice",
  receipt: "Payment Receipt",
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
  const [brochurePreviewOpen, setBrochurePreviewOpen] = useState(false);

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
    <PageShell tone="sand" offsetTop mainClassName="py-14 sm:py-16" onEnquiryClick={enquire}>
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
                  <div className="flex flex-wrap items-center gap-4">
                    {(booking.status === "confirmed" || booking.status === "completed") && (
                      <Link
                        href={`/api/bookings/${booking.id}/confirmation`}
                        target="_blank"
                        className="text-xs font-bold uppercase tracking-wider text-primary hover:text-accent whitespace-nowrap"
                      >
                        Booking Confirmation PDF →
                      </Link>
                    )}
                    <Link
                      href={`/api/bookings/${booking.id}/quotation`}
                      target="_blank"
                      className="text-xs font-bold uppercase tracking-wider text-primary hover:text-accent whitespace-nowrap"
                    >
                      Quotation PDF →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setBrochurePreviewOpen(true)}
                      className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-dark"
                    >
                      Preview Brochure →
                    </button>
                  </div>
                </div>

                {booking.booked_for !== "self" ? (
                  <p className="mt-3 inline-flex flex-wrap items-center gap-2 rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent">
                    Booked for {booking.contact_name}
                    {booking.booker_relation ? ` · ${booking.booker_relation}` : ""}
                  </p>
                ) : null}

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

                {booking.payment_status !== "received" &&
                ["approved", "payment_pending"].includes(booking.status) ? (
                  <div
                    role="status"
                    className="mt-6 rounded-2xl border border-accent/20 bg-accent/5 px-5 py-4"
                  >
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                      Payment coordination
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
                      Bandhan Tours handles payment arrangements directly. Your travel consultant
                      will contact you with the verified amount and payment instructions.
                    </p>
                  </div>
                ) : null}

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

              <BookingTravellerEditor booking={booking} onSaved={setBooking} />

              {/* Documents */}
              <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-6 sm:p-8">
                <h2 className="text-lg font-heading font-bold text-primary mb-4">Documents</h2>
                <div className="mb-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-primary p-5 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                      Generated for your party
                    </span>
                    <h3 className="mt-1 font-heading text-lg font-bold">Personalised quotation</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      Traveller rates, rooms, advance, balance and validity.
                    </p>
                    <div className="mt-4 flex gap-3 text-xs font-bold">
                      <a href={`/api/bookings/${booking.id}/quotation`} target="_blank" rel="noreferrer" className="text-gold">Preview</a>
                      <a href={`/api/bookings/${booking.id}/quotation?download=1`} className="text-white">Download</a>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gold/30 bg-sand p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                      Your complete journey
                    </span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-primary">Personalised trip brochure</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
                      Party details, itinerary, inclusions and trip estimate.
                    </p>
                    <div className="mt-4 flex gap-3 text-xs font-bold">
                      <button type="button" onClick={() => setBrochurePreviewOpen(true)} className="text-accent">Preview</button>
                      <a href={`/api/bookings/${booking.id}/brochure?download=1`} className="text-primary">Download</a>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-primary/10 bg-white p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Travel document</span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-primary">Standalone itinerary</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground-muted">Your day-by-day route in a travel-ready PDF.</p>
                    <div className="mt-4 flex gap-3 text-xs font-bold"><a href={`/api/bookings/${booking.id}/documents/itinerary`} target="_blank" rel="noreferrer" className="text-accent">Preview</a><a href={`/api/bookings/${booking.id}/documents/itinerary?download=1`} className="text-primary">Download</a></div>
                  </div>
                  {booking.price_amount ? <div className="rounded-2xl border border-primary/10 bg-white p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Accounts</span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-primary">Invoice</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground-muted">Verified booking value and payment reference.</p>
                    <div className="mt-4 flex gap-3 text-xs font-bold"><a href={`/api/bookings/${booking.id}/documents/invoice`} target="_blank" rel="noreferrer" className="text-accent">Preview</a><a href={`/api/bookings/${booking.id}/documents/invoice?download=1`} className="text-primary">Download</a></div>
                  </div> : null}
                  {["confirmed", "completed"].includes(booking.status) ? <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-700">Confirmed</span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-primary">Travel voucher</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground-muted">Your confirmation for hotels and service partners.</p>
                    <div className="mt-4 flex gap-3 text-xs font-bold"><a href={`/api/bookings/${booking.id}/documents/voucher`} target="_blank" rel="noreferrer" className="text-emerald-700">Preview</a><a href={`/api/bookings/${booking.id}/documents/voucher?download=1`} className="text-primary">Download</a></div>
                  </div> : null}
                  {booking.payment_status === "received" ? <div className="rounded-2xl border border-gold/30 bg-gold/10 p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">Payment recorded</span>
                    <h3 className="mt-1 font-heading text-lg font-bold text-primary">Payment receipt</h3>
                    <p className="mt-2 text-xs leading-relaxed text-foreground-muted">A downloadable receipt for your records.</p>
                    <div className="mt-4 flex gap-3 text-xs font-bold"><a href={`/api/bookings/${booking.id}/documents/receipt`} target="_blank" rel="noreferrer" className="text-gold-dark">Preview</a><a href={`/api/bookings/${booking.id}/documents/receipt?download=1`} className="text-primary">Download</a></div>
                  </div> : null}
                </div>
                {booking.documents.length === 0 ? (
                  <p className="text-sm text-foreground-muted font-sans">
                    No additional documents have been shared yet.
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

      {booking ? (
        <PdfPreviewModal
          isOpen={brochurePreviewOpen}
          title={`${booking.package_title || booking.destination || "Trip"} brochure`}
          url={`/api/bookings/${booking.id}/brochure`}
          downloadUrl={`/api/bookings/${booking.id}/brochure?download=1`}
          onClose={() => setBrochurePreviewOpen(false)}
        />
      ) : null}
    </PageShell>
  );
}
