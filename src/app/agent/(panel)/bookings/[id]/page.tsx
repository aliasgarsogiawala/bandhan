"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import BookingPartyPanel from "@/components/booking/BookingPartyPanel";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_PIPELINE,
} from "@/lib/bookings/types";
import type {
  BookingDetail,
  DocumentType,
  NotificationChannel,
} from "@/lib/bookings/types";

const DOC_TYPES: { value: DocumentType; label: string }[] = [
  { value: "quotation", label: "Quotation" },
  { value: "invoice", label: "Invoice" },
  { value: "itinerary", label: "Itinerary" },
  { value: "voucher", label: "Voucher" },
  { value: "other", label: "Other" },
];

const CHANNELS: { value: NotificationChannel; label: string }[] = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "in-app", label: "In-app" },
];

export default function AgentBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [priceInput, setPriceInput] = useState("");
  const [remarksInput, setRemarksInput] = useState("");
  const [docType, setDocType] = useState<DocumentType>("quotation");
  const [docUrl, setDocUrl] = useState("");
  const [channel, setChannel] = useState<NotificationChannel>("email");
  const [message, setMessage] = useState("");

  const refresh = useCallback(() => {
    return fetch(`/api/bookings/${params.id}`, { cache: "no-store" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.error || "Could not load this booking.");
          return;
        }
        setBooking(data.booking);
        setPriceInput(data.booking.price_amount || "");
        setRemarksInput(data.booking.internal_remarks || "");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const patch = async (body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/agent/bookings/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || "Action failed.");
        return;
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const addDocument = async () => {
    if (!docUrl.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/agent/bookings/${params.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, url: docUrl.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || "Could not attach document.");
        return;
      }
      setDocUrl("");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const sendNotification = async () => {
    if (!message.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/agent/bookings/${params.id}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, message: message.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || "Could not log notification.");
        return;
      }
      setMessage("");
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const sendBrochure = async (deliveryChannel: "email" | "whatsapp") => {
    setBusy(true);
    try {
      const res = await fetch(`/api/bookings/${params.id}/send-brochure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: deliveryChannel }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        alert(data.error || "Could not send the brochure.");
        return;
      }
      if (data.shareUrl) window.open(data.shareUrl, "_blank", "noopener,noreferrer");
      else if (data.mailtoUrl) window.location.assign(data.mailtoUrl);
      else alert(`Brochure sent to ${booking?.contact_email}.`);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p className="text-sm text-foreground-muted">Loading…</p>;
  if (error || !booking) {
    return <p className="text-sm text-foreground-muted">{error || "Booking not found."}</p>;
  }

  const isTerminal = booking.status === "rejected" || booking.status === "cancelled";
  const currentIndex = BOOKING_STATUS_PIPELINE.indexOf(booking.status);

  return (
    <div className="space-y-6">
      <Link href="/agent" className="text-sm font-semibold text-accent hover:text-accent-dark">
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
            <span className="font-semibold">{booking.travellers_count ?? "—"} — {booking.traveller_names || "—"}</span>
          </div>
          {booking.destination && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Destination</span>
              <span className="font-semibold">{booking.destination}</span>
            </div>
          )}
          {booking.budget && (
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Budget</span>
              <span className="font-semibold">{booking.budget}</span>
            </div>
          )}
        </div>

        {booking.special_requirements && (
          <div className="mt-4 text-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted block">Special Requirements</span>
            <span>{booking.special_requirements}</span>
          </div>
        )}

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

      <BookingPartyPanel booking={booking} />

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Actions</h2>
        <div className="flex flex-wrap gap-2">
          {!booking.agent_id && (
            <PrimaryButton size="sm" variant="navy" isLoading={busy} onClick={() => patch({ action: "assign" })}>
              Assign to Me
            </PrimaryButton>
          )}
          {booking.status === "quoted" && (
            <PrimaryButton size="sm" variant="navy" isLoading={busy} onClick={() => patch({ action: "approve" })}>
              Approve
            </PrimaryButton>
          )}
          {["new", "reviewing", "quoted", "approved"].includes(booking.status) && (
            <SecondaryButton size="sm" variant="outline-coral" onClick={() => patch({ action: "reject" })}>
              Reject
            </SecondaryButton>
          )}
          {booking.payment_status !== "received" && ["approved", "payment_pending"].includes(booking.status) && (
            <PrimaryButton size="sm" variant="gold" isLoading={busy} onClick={() => patch({ action: "markPaymentReceived" })}>
              Mark Payment Received
            </PrimaryButton>
          )}
          {booking.status === "confirmed" && (
            <PrimaryButton size="sm" variant="navy" isLoading={busy} onClick={() => patch({ action: "complete" })}>
              Mark Completed
            </PrimaryButton>
          )}
          {!isTerminal && booking.status !== "completed" && (
            <SecondaryButton size="sm" variant="ghost" onClick={() => patch({ action: "cancel" })}>
              Cancel Booking
            </SecondaryButton>
          )}
        </div>

        {["new", "reviewing", "quoted"].includes(booking.status) ? <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-slate-100">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Price</label>
            <input
              type="text"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              placeholder="E.g. ₹42,000"
              className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <PrimaryButton
            size="sm"
            variant="navy"
            isLoading={busy}
            onClick={() => priceInput.trim() && patch({ action: "setPricing", priceAmount: priceInput.trim() })}
          >
            Confirm Pricing
          </PrimaryButton>
        </div> : null}

        <div className="space-y-1 pt-2 border-t border-slate-100">
          <label className="text-xs font-semibold text-primary uppercase">Internal Remarks</label>
          <textarea
            value={remarksInput}
            onChange={(e) => setRemarksInput(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
          <SecondaryButton
            size="sm"
            variant="outline-navy"
            onClick={() => patch({ action: "setRemarks", remarks: remarksInput })}
          >
            Save Remarks
          </SecondaryButton>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Documents</h2>
        <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
          <p className="text-sm font-bold text-primary">Generated customer documents</p>
          <p className="mt-1 text-xs text-foreground-muted">
            Both files use the saved itinerary, exact traveller configuration, rooms, price breakdown and terms.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-primary p-4 text-white">
              <p className="text-sm font-bold">Personalised quotation</p>
              <p className="mt-1 text-[11px] text-slate-300">Commercial summary and traveller-wise price.</p>
              <div className="mt-3 flex gap-3 text-xs font-bold">
                <a href={`/api/bookings/${booking.id}/quotation`} target="_blank" rel="noreferrer" className="text-gold">Preview</a>
                <a href={`/api/bookings/${booking.id}/quotation?download=1`} className="text-white">Download</a>
              </div>
            </div>
            <div className="rounded-xl border border-primary/10 bg-white/70 p-4">
              <p className="text-sm font-bold text-primary">Personalised trip brochure</p>
              <p className="mt-1 text-[11px] text-foreground-muted">Itinerary, party, inclusions and pricing.</p>
              <div className="mt-3 flex gap-3 text-xs font-bold">
                <a href={`/api/bookings/${booking.id}/brochure`} target="_blank" rel="noreferrer" className="text-accent">Preview</a>
                <a href={`/api/bookings/${booking.id}/brochure?download=1`} className="text-primary">Download</a>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => sendBrochure("email")} className="rounded-full border border-primary/20 px-4 py-2 text-xs font-bold text-primary disabled:opacity-50">Send email</button>
            <button type="button" disabled={busy} onClick={() => sendBrochure("whatsapp")} className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">Share WhatsApp</button>
          </div>
        </div>
        <ul className="space-y-2">
          {booking.documents.map((doc) => (
            <li key={doc.id} className="text-sm">
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-accent font-semibold hover:underline">
                {doc.doc_type} — {doc.url}
              </a>
            </li>
          ))}
          {booking.documents.length === 0 && (
            <li className="text-sm text-foreground-muted">No documents attached yet.</li>
          )}
        </ul>
        <div className="flex flex-wrap items-end gap-3">
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocumentType)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
          >
            {DOC_TYPES.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={docUrl}
            onChange={(e) => setDocUrl(e.target.value)}
            placeholder="Document URL"
            className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
          <PrimaryButton size="sm" variant="navy" isLoading={busy} onClick={addDocument}>
            Attach
          </PrimaryButton>
        </div>
        <p className="text-xs text-foreground-muted">
          The generated proposal is always available at <code>/api/bookings/{booking.id}/brochure</code>.
        </p>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Notify Customer</h2>
        <ul className="space-y-2">
          {booking.notifications.map((note) => (
            <li key={note.id} className="text-sm">
              <span className="font-semibold text-accent mr-2">{note.channel}</span>
              {note.message}
            </li>
          ))}
          {booking.notifications.length === 0 && (
            <li className="text-sm text-foreground-muted">No notifications logged yet.</li>
          )}
        </ul>
        <div className="flex flex-wrap items-end gap-3">
          <select
            value={channel}
            onChange={(e) => setChannel(e.target.value as NotificationChannel)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-sm"
          >
            {CHANNELS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message to log"
            className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-200 text-sm"
          />
          <PrimaryButton size="sm" variant="navy" isLoading={busy} onClick={sendNotification}>
            Log Notification
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
