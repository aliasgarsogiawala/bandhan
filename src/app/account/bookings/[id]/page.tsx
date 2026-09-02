"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Check, Download, FileText } from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import { Container } from "@/components/ui/Container";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_PIPELINE } from "@/lib/bookings/types";
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

/** Card surface per document kind — the same three tones the booking flow uses. */
const DOC_TONES = {
  navy: {
    card: "border border-primary/12 bg-primary text-white",
    eyebrow: "text-gold",
    title: "text-white",
    body: "text-white/60",
    preview: "bg-white text-primary hover:bg-gold",
    download: "border border-white/25 text-white hover:border-gold hover:text-gold",
  },
  gold: {
    card: "border border-gold/40 bg-sand-light",
    eyebrow: "text-accent",
    title: "text-primary",
    body: "text-foreground-muted",
    preview: "bg-primary text-white hover:bg-accent",
    download: "border border-primary/20 bg-white text-primary hover:border-accent hover:text-accent",
  },
  plain: {
    card: "border border-primary/12 bg-white",
    eyebrow: "text-accent",
    title: "text-primary",
    body: "text-foreground-muted",
    preview: "bg-primary text-white hover:bg-accent",
    download: "border border-primary/20 text-primary hover:border-accent hover:text-accent",
  },
  emerald: {
    card: "border border-emerald-600/25 bg-emerald-500/[0.07]",
    eyebrow: "text-emerald-700",
    title: "text-primary",
    body: "text-foreground-muted",
    preview: "bg-emerald-600 text-white hover:bg-emerald-700",
    download: "border border-emerald-600/30 text-emerald-800 hover:border-emerald-600",
  },
} as const;

type DocTone = keyof typeof DOC_TONES;

interface DocumentCardProps {
  tone: DocTone;
  eyebrow: string;
  title: string;
  description: string;
  /** Omitted when the document opens in the in-page preview modal instead. */
  previewHref?: string;
  onPreview?: () => void;
  downloadHref: string;
}

function DocumentCard({
  tone,
  eyebrow,
  title,
  description,
  previewHref,
  onPreview,
  downloadHref,
}: DocumentCardProps) {
  const style = DOC_TONES[tone];
  const action =
    "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-[4px] px-3 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-300";

  return (
    <article className={`flex flex-col p-5 ${style.card}`}>
      <span className={`block text-[10px] font-bold uppercase tracking-[0.18em] ${style.eyebrow}`}>
        {eyebrow}
      </span>
      <h3 className={`mt-1.5 font-heading text-lg font-bold tracking-[-0.01em] ${style.title}`}>
        {title}
      </h3>
      <p className={`mt-2 flex-1 text-xs leading-5 ${style.body}`}>{description}</p>
      <div className="mt-5 flex gap-2">
        {previewHref ? (
          <a
            href={previewHref}
            target="_blank"
            rel="noreferrer"
            className={`${action} ${style.preview}`}
          >
            <FileText size={14} /> Preview
          </a>
        ) : (
          <button type="button" onClick={onPreview} className={`${action} ${style.preview}`}>
            <FileText size={14} /> Preview
          </button>
        )}
        <a href={downloadHref} className={`${action} ${style.download}`}>
          <Download size={14} /> Save
        </a>
      </div>
    </article>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-primary/12 bg-white shadow-premium">
      <header className="border-b border-primary/10 px-6 py-5 sm:px-8">
        <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-primary">{title}</h2>
      </header>
      <div className="px-6 py-6 sm:px-8">{children}</div>
    </section>
  );
}

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
  const currentIndex = booking ? BOOKING_STATUS_PIPELINE.indexOf(booking.status) : -1;

  /** `[label, value, capitalise]` — only the raw enum needs case-fixing. */
  const facts: [string, string, boolean?][] = booking
    ? [
        ["Travel date", booking.travel_date || "TBC"],
        ["Travellers", String(booking.travellers_count ?? "—")],
        ["Price", booking.price_amount || "Pending quote"],
        ["Payment", booking.payment_status, true],
      ]
    : [];

  return (
    <PageShell tone="sand" offsetTop mainClassName="py-14 sm:py-16" onEnquiryClick={enquire}>
      <Container className="max-w-3xl space-y-6">
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-dark"
        >
          <ArrowLeft size={14} /> Back to my bookings
        </Link>

        {loading ? (
          <p className="py-12 text-center text-sm text-foreground-muted">Loading…</p>
        ) : error || !booking ? (
          <div className="border border-primary/12 bg-white p-10 text-center shadow-premium">
            <p className="text-sm text-foreground-muted">{error || "Booking not found."}</p>
          </div>
        ) : (
          <>
            <section className="border border-primary/12 bg-white shadow-premium">
              <header className="border-b border-primary/10 px-6 py-6 sm:px-8">
                <span className="tabular block text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-muted">
                  {booking.type === "customized" ? "Custom trip" : "Standard booking"} ·{" "}
                  {booking.booking_code}
                </span>
                <h1 className="mt-2 font-heading text-2xl font-extrabold leading-tight tracking-[-0.025em] text-primary sm:text-3xl">
                  {booking.package_title || booking.destination || "Trip Request"}
                </h1>

                {booking.booked_for !== "self" ? (
                  <p className="mt-3 inline-block border border-accent/25 bg-accent/[0.06] px-3 py-1.5 text-xs font-semibold text-accent">
                    Booked for {booking.contact_name}
                    {booking.booker_relation ? ` · ${booking.booker_relation}` : ""}
                  </p>
                ) : null}
              </header>

              <dl className="grid grid-cols-2 gap-px bg-primary/10 sm:grid-cols-4">
                {facts.map(([label, value, capitalise]) => (
                  <div key={label} className="bg-white px-5 py-4">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-light">
                      {label}
                    </dt>
                    <dd
                      className={`tabular mt-1.5 text-sm font-bold text-primary ${
                        capitalise ? "capitalize" : ""
                      }`}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="border-t border-primary/10 px-6 py-6 sm:px-8">
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-muted">
                  Progress
                </span>

                {isTerminal ? (
                  <p className="mt-3 inline-block border border-red-300 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
                    {BOOKING_STATUS_LABELS[booking.status]}
                  </p>
                ) : (
                  <ol className="mt-4 space-y-px">
                    {BOOKING_STATUS_PIPELINE.map((status, index) => {
                      const done = index < currentIndex;
                      const current = index === currentIndex;
                      return (
                        <li
                          key={status}
                          className={`flex items-center gap-3 px-3 py-2.5 ${
                            current ? "bg-primary text-white" : ""
                          }`}
                        >
                          <span
                            className={`tabular flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] text-[10px] font-bold ${
                              current
                                ? "bg-white/15 text-white"
                                : done
                                  ? "bg-emerald-600/10 text-emerald-700"
                                  : "border border-primary/12 text-foreground-light"
                            }`}
                          >
                            {done ? (
                              <Check size={12} strokeWidth={3} />
                            ) : (
                              String(index + 1).padStart(2, "0")
                            )}
                          </span>
                          <span
                            className={`text-xs font-bold uppercase tracking-[0.12em] ${
                              current
                                ? "text-white"
                                : done
                                  ? "text-emerald-700"
                                  : "text-foreground-light"
                            }`}
                          >
                            {BOOKING_STATUS_LABELS[status]}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>

              {booking.payment_status !== "received" &&
              ["approved", "payment_pending"].includes(booking.status) ? (
                <div
                  role="status"
                  className="border-t border-primary/10 border-l-2 border-l-accent bg-accent/[0.05] px-6 py-4 sm:px-8"
                >
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                    Payment coordination
                  </span>
                  <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
                    Bandhan Tours handles payment arrangements directly. Your travel consultant will
                    contact you with the verified amount and payment instructions.
                  </p>
                </div>
              ) : null}
            </section>

            <BookingTravellerEditor booking={booking} onSaved={setBooking} />

            <Panel title="Documents">
              <div className="grid gap-4 sm:grid-cols-2">
                <DocumentCard
                  tone="navy"
                  eyebrow="Generated for your party"
                  title="Personalised quotation"
                  description="Traveller rates, rooms, advance, balance and validity."
                  previewHref={`/api/bookings/${booking.id}/quotation`}
                  downloadHref={`/api/bookings/${booking.id}/quotation?download=1`}
                />
                <DocumentCard
                  tone="gold"
                  eyebrow="Your complete journey"
                  title="Personalised trip brochure"
                  description="Party details, itinerary, inclusions and trip estimate."
                  onPreview={() => setBrochurePreviewOpen(true)}
                  downloadHref={`/api/bookings/${booking.id}/brochure?download=1`}
                />
                <DocumentCard
                  tone="plain"
                  eyebrow="Travel document"
                  title="Standalone itinerary"
                  description="Your day-by-day route in a travel-ready PDF."
                  previewHref={`/api/bookings/${booking.id}/documents/itinerary`}
                  downloadHref={`/api/bookings/${booking.id}/documents/itinerary?download=1`}
                />
                {booking.price_amount ? (
                  <DocumentCard
                    tone="plain"
                    eyebrow="Accounts"
                    title="Invoice"
                    description="Verified booking value and payment reference."
                    previewHref={`/api/bookings/${booking.id}/documents/invoice`}
                    downloadHref={`/api/bookings/${booking.id}/documents/invoice?download=1`}
                  />
                ) : null}
                {["confirmed", "completed"].includes(booking.status) ? (
                  <>
                    <DocumentCard
                      tone="emerald"
                      eyebrow="Confirmed"
                      title="Booking confirmation"
                      description="The signed-off summary of your confirmed trip."
                      previewHref={`/api/bookings/${booking.id}/confirmation`}
                      downloadHref={`/api/bookings/${booking.id}/confirmation?download=1`}
                    />
                    <DocumentCard
                      tone="emerald"
                      eyebrow="Confirmed"
                      title="Travel voucher"
                      description="Your confirmation for hotels and service partners."
                      previewHref={`/api/bookings/${booking.id}/documents/voucher`}
                      downloadHref={`/api/bookings/${booking.id}/documents/voucher?download=1`}
                    />
                  </>
                ) : null}
                {booking.payment_status === "received" ? (
                  <DocumentCard
                    tone="gold"
                    eyebrow="Payment recorded"
                    title="Payment receipt"
                    description="A downloadable receipt for your records."
                    previewHref={`/api/bookings/${booking.id}/documents/receipt`}
                    downloadHref={`/api/bookings/${booking.id}/documents/receipt?download=1`}
                  />
                ) : null}
              </div>

              {booking.documents.length === 0 ? (
                <p className="mt-6 border-t border-primary/10 pt-5 text-sm text-foreground-muted">
                  No additional documents have been shared yet.
                </p>
              ) : (
                <ul className="mt-6 border-t border-primary/10 pt-5">
                  {booking.documents.map((doc, index) => (
                    <li key={doc.id} className={index ? "border-t border-primary/10" : ""}>
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 py-3.5 text-sm font-semibold text-primary transition-colors hover:text-accent"
                      >
                        <span>{DOC_LABELS[doc.doc_type] || "Document"}</span>
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent">
                          View →
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Notifications">
              {booking.notifications.length === 0 ? (
                <p className="text-sm text-foreground-muted">No notifications yet.</p>
              ) : (
                <ul className="space-y-4">
                  {booking.notifications.map((note) => (
                    <li
                      key={note.id}
                      className="border-l-2 border-primary/12 pl-4 text-sm leading-6"
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                        {note.channel}
                      </span>
                      <span className="mt-1 block text-foreground-muted">{note.message}</span>
                      <span className="tabular mt-1 block text-xs text-foreground-light">
                        {new Date(note.created_at).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
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
