"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, CircleDollarSign, FileText, Mail, MapPin, Phone, ReceiptText, ShieldCheck, Upload, Users } from "lucide-react";
import BookingPartyPanel from "@/components/booking/BookingPartyPanel";
import { uploadFiles } from "@/lib/uploadthing";
import { formatMoney, parseMoney, type RoomConfiguration, type TravellerBreakdown } from "@/lib/bookings/pricing";
import { BOOKING_STATUS_LABELS, BOOKING_STATUS_PIPELINE } from "@/lib/bookings/types";
import type { BookingDetail, DocumentType, NotificationChannel } from "@/lib/bookings/types";
import type { PublicAgent } from "@/lib/auth/agents";

const inputClass =
  "w-full min-h-11 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10";
const labelClass = "block text-xs font-bold uppercase tracking-wider text-primary";

const DOC_TYPES: Array<{ value: DocumentType; label: string }> = [
  { value: "quotation", label: "Quotation" },
  { value: "invoice", label: "Invoice" },
  { value: "receipt", label: "Receipt" },
  { value: "itinerary", label: "Itinerary" },
  { value: "voucher", label: "Voucher" },
  { value: "other", label: "Other" },
];

const CHANNELS: Array<{ value: NotificationChannel; label: string }> = [
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "in-app", label: "In-app" },
];

interface EditDraft {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  destination: string;
  travelDate: string;
  departureCity: string;
  durationLabel: string;
  travellerNames: string;
  budget: string;
  specialRequirements: string;
  travellers: TravellerBreakdown;
  rooms: RoomConfiguration;
}

function draftFromBooking(booking: BookingDetail): EditDraft {
  return {
    contactName: booking.contact_name,
    contactEmail: booking.contact_email,
    contactPhone: booking.contact_phone,
    destination: booking.destination || "",
    travelDate: booking.travel_date || "",
    departureCity: booking.departure_city || "",
    durationLabel: booking.duration_label || "",
    travellerNames: booking.traveller_names || "",
    budget: booking.budget || "",
    specialRequirements: booking.special_requirements || "",
    travellers: {
      adults: Number(booking.adults || 0),
      childrenWithBed: Number(booking.children_with_bed || 0),
      childrenWithoutBed: Number(booking.children_without_bed || 0),
      infants: Number(booking.infants || 0),
    },
    rooms: {
      singleRooms: Number(booking.room_configuration?.singleRooms || 0),
      doubleRooms: Number(booking.room_configuration?.doubleRooms || 0),
      tripleRooms: Number(booking.room_configuration?.tripleRooms || 0),
    },
  };
}

export default function AdminBookingDetailPage() {
  const params = useParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [price, setPrice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<EditDraft | null>(null);
  const [docType, setDocType] = useState<DocumentType>("itinerary");
  const [docUrl, setDocUrl] = useState("");
  const [channel, setChannel] = useState<NotificationChannel>("email");
  const [customerMessage, setCustomerMessage] = useState("");

  const refresh = useCallback(() => {
    return Promise.all([
      fetch(`/api/bookings/${params.id}`, { cache: "no-store" }),
      fetch("/api/admin/agents", { cache: "no-store" }),
    ])
      .then(async ([bookingResponse, agentsResponse]) => {
        const [bookingData, agentsData] = await Promise.all([
          bookingResponse.json(),
          agentsResponse.json(),
        ]);
        if (!bookingResponse.ok || !bookingData.ok) {
          throw new Error(bookingData.error || "Could not load this booking.");
        }
        const next = bookingData.booking as BookingDetail;
        setBooking(next);
        setAgents(agentsData.agents || []);
        const savedPrice = parseMoney(next.price_amount || next.pricing_snapshot?.total || 0);
        setPrice(savedPrice ? String(savedPrice) : "");
        setRemarks(next.internal_remarks || "");
        setDraft(draftFromBooking(next));
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : "Could not load this booking.");
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const mutate = async (body: Record<string, unknown>, successMessage: string) => {
    const action = String(body.action || "update");
    setBusy(action);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/bookings/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not update the booking.");
      await refresh();
      setNotice({ tone: "success", text: successMessage });
      return true;
    } catch (error) {
      setNotice({
        tone: "error",
        text: error instanceof Error ? error.message : "Could not update the booking.",
      });
      return false;
    } finally {
      setBusy("");
    }
  };

  const changeAssignment = async (agentId: string) => {
    const agent = agents.find((item) => item.id === agentId);
    await mutate(
      agentId ? { action: "assignTo", agentId } : { action: "unassign" },
      agent ? `Assigned to ${agent.name}.` : "Booking moved to the unassigned queue."
    );
  };

  const saveDetails = async () => {
    if (!draft) return;
    const saved = await mutate({ action: "updateDetails", details: draft }, "Booking details saved.");
    if (saved) setEditing(false);
  };

  const addDocument = async () => {
    if (!docUrl.trim()) return;
    setBusy("document");
    setNotice(null);
    try {
      const response = await fetch(`/api/agent/bookings/${params.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, url: docUrl.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not attach the document.");
      setDocUrl("");
      await refresh();
      setNotice({ tone: "success", text: "Document attached and available to the customer." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not attach the document." });
    } finally {
      setBusy("");
    }
  };

  const uploadDocument = async (file: File | undefined) => {
    if (!file) return;
    setBusy("document-upload");
    setNotice(null);
    try {
      const uploaded = await uploadFiles("documentUploader", { files: [file] });
      const url = uploaded[0]?.url;
      if (!url) throw new Error("The upload did not return a document URL.");
      const response = await fetch(`/api/agent/bookings/${params.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docType, url }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not attach the document.");
      await refresh();
      setNotice({ tone: "success", text: "Document uploaded and added to the customer file." });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not upload the document." });
    } finally {
      setBusy("");
    }
  };

  const notifyCustomer = async () => {
    if (!customerMessage.trim()) return;
    setBusy("notification");
    setNotice(null);
    try {
      const response = await fetch(`/api/agent/bookings/${params.id}/notify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, message: customerMessage.trim() }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not send the update.");
      setCustomerMessage("");
      if (data.shareUrl) window.open(data.shareUrl, "_blank", "noopener,noreferrer");
      if (data.mailtoUrl) window.location.assign(data.mailtoUrl);
      await refresh();
      setNotice({
        tone: "success",
        text: data.delivered ? "Customer update sent." : "Customer update prepared and logged.",
      });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not send the update." });
    } finally {
      setBusy("");
    }
  };

  const sendBrochure = async (deliveryChannel: "email" | "whatsapp") => {
    setBusy(`brochure-${deliveryChannel}`);
    setNotice(null);
    try {
      const response = await fetch(`/api/bookings/${params.id}/send-brochure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: deliveryChannel }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not share the documents.");
      if (data.shareUrl) window.open(data.shareUrl, "_blank", "noopener,noreferrer");
      if (data.mailtoUrl) window.location.assign(data.mailtoUrl);
      await refresh();
      setNotice({
        tone: "success",
        text: data.delivered ? "Quotation and brochure sent." : "Quotation and brochure sharing prepared.",
      });
    } catch (error) {
      setNotice({ tone: "error", text: error instanceof Error ? error.message : "Could not share the documents." });
    } finally {
      setBusy("");
    }
  };

  if (loading) return <p className="py-10 text-sm text-foreground-muted">Loading booking…</p>;
  if (loadError || !booking) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
        {loadError || "Booking not found."}
      </div>
    );
  }

  const isClosed = ["rejected", "cancelled", "completed"].includes(booking.status);
  const isTerminalFailure = booking.status === "rejected" || booking.status === "cancelled";
  const currentIndex = BOOKING_STATUS_PIPELINE.indexOf(booking.status);
  const canEditDetails = ["new", "reviewing", "quoted", "approved", "payment_pending"].includes(booking.status);
  const activeAgents = agents.filter((agent) => agent.status === "active" || agent.id === booking.agent_id);
  const assignedAgent = agents.find((agent) => agent.id === booking.agent_id);

  return (
    <div className="space-y-6 pb-10">

      {notice ? (
        <div
          role="status"
          className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
            notice.tone === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      <section className="relative overflow-hidden rounded-[28px] bg-primary p-5 text-white shadow-xl shadow-primary/10 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link href="/admin/bookings" className="inline-flex min-h-10 items-center gap-2 text-xs font-bold text-white/60 transition hover:text-white"><ArrowLeft size={15} /> Booking queue</Link>
            <span className="rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">{BOOKING_STATUS_LABELS[booking.status]}</span>
          </div>
          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="font-mono text-xs font-bold tracking-wider text-gold">{booking.booking_code} · {booking.type === "customized" ? "CUSTOM JOURNEY" : "STANDARD BOOKING"}</span>
              <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">{booking.package_title || booking.destination || "Trip request"}</h1>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/60">
                <a href={`mailto:${booking.contact_email}`} className="inline-flex items-center gap-1.5 transition hover:text-white"><Mail size={14} /> {booking.contact_email}</a>
                <a href={`tel:${booking.contact_phone}`} className="inline-flex items-center gap-1.5 transition hover:text-white"><Phone size={14} /> {booking.contact_phone}</a>
              </div>
            </div>
            <label id="booking-owner" className="min-w-60 scroll-mt-24 space-y-1.5">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/45">Booking owner</span>
            <select
              aria-label="Assigned agent"
              value={booking.agent_id || ""}
              disabled={Boolean(busy)}
              onChange={(event) => void changeAssignment(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white outline-none focus:border-accent [&>option]:text-primary"
            >
              <option value="">Unassigned</option>
              {activeAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
            </label>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-6">
            <HeroInfo icon={CalendarDays} label="Travel date" value={formatDisplayDate(booking.travel_date)} />
            <HeroInfo icon={Users} label="Travellers" value={String(booking.travellers_count ?? "—")} />
            <HeroInfo icon={MapPin} label="Destination" value={booking.destination || "TBC"} />
            <HeroInfo icon={CircleDollarSign} label="Price" value={booking.price_amount ? formatMoney(parseMoney(booking.price_amount)) : "Pending"} />
            <HeroInfo icon={ReceiptText} label="Payment" value={booking.payment_status === "received" ? "Received" : "Pending"} />
            <HeroInfo icon={ShieldCheck} label="Owner" value={assignedAgent?.name || "Unassigned"} />
          </div>

          <div className="mt-7 border-t border-white/10 pt-5">
          <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/40">Booking pipeline</span>
          {isTerminalFailure ? (
            <span className="inline-flex rounded-full border border-red-300/25 bg-red-400/15 px-4 py-2 text-sm font-bold text-red-100">
              {BOOKING_STATUS_LABELS[booking.status]}
            </span>
          ) : (
            <div className="grid gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {BOOKING_STATUS_PIPELINE.map((status, index) => (
                <span
                  key={status}
                  className={`rounded-full border px-3 py-2 text-center text-[10px] font-bold uppercase tracking-wide ${
                    index <= currentIndex
                      ? "border-accent/40 bg-accent text-white"
                      : "border-white/10 bg-white/5 text-white/35"
                  }`}
                >
                  {BOOKING_STATUS_LABELS[status]}
                </span>
              ))}
            </div>
          )}
          </div>
        </div>
      </section>

      {!isClosed ? <NextAction status={booking.status} assigned={Boolean(booking.agent_id)} /> : null}

      <nav aria-label="Booking workspace sections" className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
        {[{ href: "#trip-details", label: "Trip details" }, { href: "#workflow", label: "Workflow" }, { href: "#documents", label: "Documents" }, { href: "#communication", label: "Communication" }, { href: "#audit", label: "Audit trail" }].map((item) => <a key={item.href} href={item.href} className="whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-sand hover:text-primary">{item.label}</a>)}
      </nav>

      <BookingPartyPanel booking={booking} />

      <section id="trip-details" className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-bold text-primary">Trip and traveller details</h2>
            <p className="mt-1 text-xs text-foreground-muted">Revise traveller or trip data when needed. Changes after quoting automatically invalidate the old quotation.</p>
          </div>
          {canEditDetails ? (
            <button
              type="button"
              onClick={() => setEditing((value) => !value)}
              className="min-h-11 rounded-full border border-primary/20 px-4 py-2 text-xs font-bold text-primary hover:bg-primary hover:text-white"
            >
              {editing ? "Close editor" : "Edit details"}
            </button>
          ) : (
            <span className="text-xs font-semibold text-foreground-muted">Locked after confirmation</span>
          )}
        </div>

        {editing && draft ? (
          <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Lead traveller name"><input value={draft.contactName} onChange={(event) => setDraft({ ...draft, contactName: event.target.value })} className={inputClass} /></Field>
              <Field label="Email"><input type="email" value={draft.contactEmail} onChange={(event) => setDraft({ ...draft, contactEmail: event.target.value })} className={inputClass} /></Field>
              <Field label="Phone"><input type="tel" value={draft.contactPhone} onChange={(event) => setDraft({ ...draft, contactPhone: event.target.value })} className={inputClass} /></Field>
              <Field label="Destination"><input value={draft.destination} onChange={(event) => setDraft({ ...draft, destination: event.target.value })} className={inputClass} /></Field>
              <Field label="Travel date"><input type="date" value={draft.travelDate.slice(0, 10)} disabled={Boolean(booking.departure_id)} onChange={(event) => setDraft({ ...draft, travelDate: event.target.value })} className={inputClass} /></Field>
              <Field label="Departure city"><input value={draft.departureCity} onChange={(event) => setDraft({ ...draft, departureCity: event.target.value })} className={inputClass} /></Field>
              <Field label="Duration"><input value={draft.durationLabel} onChange={(event) => setDraft({ ...draft, durationLabel: event.target.value })} className={inputClass} /></Field>
              <Field label="Budget preference"><input value={draft.budget} onChange={(event) => setDraft({ ...draft, budget: event.target.value })} className={inputClass} /></Field>
              <Field label="Traveller names"><input value={draft.travellerNames} onChange={(event) => setDraft({ ...draft, travellerNames: event.target.value })} className={inputClass} /></Field>
            </div>
            <div>
              <span className={`${labelClass} mb-3`}>Traveller mix</span>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <CountField label="Adults" value={draft.travellers.adults} onChange={(value) => setDraft({ ...draft, travellers: { ...draft.travellers, adults: value } })} />
                <CountField label="Child + bed" value={draft.travellers.childrenWithBed} onChange={(value) => setDraft({ ...draft, travellers: { ...draft.travellers, childrenWithBed: value } })} />
                <CountField label="Child no bed" value={draft.travellers.childrenWithoutBed} onChange={(value) => setDraft({ ...draft, travellers: { ...draft.travellers, childrenWithoutBed: value } })} />
                <CountField label="Infants" value={draft.travellers.infants} onChange={(value) => setDraft({ ...draft, travellers: { ...draft.travellers, infants: value } })} />
              </div>
            </div>
            <div>
              <span className={`${labelClass} mb-3`}>Room configuration</span>
              <div className="grid grid-cols-3 gap-3">
                <CountField label="Single" value={draft.rooms.singleRooms} onChange={(value) => setDraft({ ...draft, rooms: { ...draft.rooms, singleRooms: value } })} />
                <CountField label="Double/Twin" value={draft.rooms.doubleRooms} onChange={(value) => setDraft({ ...draft, rooms: { ...draft.rooms, doubleRooms: value } })} />
                <CountField label="Triple" value={draft.rooms.tripleRooms} onChange={(value) => setDraft({ ...draft, rooms: { ...draft.rooms, tripleRooms: value } })} />
              </div>
            </div>
            <Field label="Special requirements"><textarea rows={3} value={draft.specialRequirements} onChange={(event) => setDraft({ ...draft, specialRequirements: event.target.value })} className={inputClass} /></Field>
            <button type="button" disabled={Boolean(busy)} onClick={() => void saveDetails()} className="min-h-11 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">
              {busy === "updateDetails" ? "Saving…" : "Save details"}
            </button>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Destination" value={booking.destination || "TBC"} />
            <Info label="Departure city" value={booking.departure_city || "TBC"} />
            <Info label="Traveller names" value={booking.traveller_names || "Pending"} />
            <Info label="Rooms" value={`${booking.room_configuration?.singleRooms || 0} single · ${booking.room_configuration?.doubleRooms || 0} double · ${booking.room_configuration?.tripleRooms || 0} triple`} />
            {booking.budget ? <Info label="Budget" value={booking.budget} /> : null}
            {booking.special_requirements ? <div className="sm:col-span-2 lg:col-span-3"><Info label="Special requirements" value={booking.special_requirements} /></div> : null}
          </div>
        )}
      </section>

      <section id="workflow" className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-heading text-base font-bold text-primary">Workflow controls</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <Field label="Final quoted price (INR)">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input type="number" min={1} value={price} onChange={(event) => setPrice(event.target.value)} className={inputClass} placeholder="85000" />
                <button type="button" disabled={Boolean(busy) || !price} onClick={() => void mutate({ action: "setPricing", priceAmount: price }, `Pricing confirmed at ${formatMoney(Number(price))}.`)} className="min-h-11 whitespace-nowrap rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">
                  {busy === "setPricing" ? "Saving…" : "Confirm pricing"}
                </button>
              </div>
            </Field>
            <p className="mt-2 text-xs text-foreground-muted">Updates the quotation total, advance, balance, and downloadable PDFs together.</p>
          </div>
          <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
            <Field label="Internal remarks"><textarea rows={2} value={remarks} onChange={(event) => setRemarks(event.target.value)} className={inputClass} /></Field>
            <button type="button" disabled={Boolean(busy)} onClick={() => void mutate({ action: "setRemarks", remarks }, "Internal remarks saved.")} className="mt-2 min-h-11 rounded-xl border border-primary/20 px-4 py-2 text-sm font-bold text-primary disabled:opacity-50">
              {busy === "setRemarks" ? "Saving…" : "Save remarks"}
            </button>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-5">
          <Field label="Status note (optional)"><input value={statusNote} onChange={(event) => setStatusNote(event.target.value)} className={inputClass} placeholder="Reason or verification note for the audit trail" /></Field>
          <div className="mt-3 flex flex-wrap gap-2">
            {booking.status === "quoted" ? <ActionButton label="Approve booking" tone="success" disabled={Boolean(busy)} loading={busy === "approve"} onClick={() => void mutate({ action: "approve", note: statusNote }, "Booking approved and ready for payment.")} /> : null}
            {booking.payment_status !== "received" && ["approved", "payment_pending"].includes(booking.status) ? <ActionButton label="Mark payment received" tone="accent" disabled={Boolean(busy)} loading={busy === "markPaymentReceived"} onClick={() => void mutate({ action: "markPaymentReceived" }, "Payment recorded and booking confirmed.")} /> : null}
            {booking.status === "confirmed" ? <ActionButton label="Complete trip" tone="primary" disabled={Boolean(busy)} loading={busy === "complete"} onClick={() => void mutate({ action: "complete", note: statusNote }, "Trip marked as completed.")} /> : null}
            {["new", "reviewing", "quoted", "approved"].includes(booking.status) ? <ActionButton label="Reject" tone="danger" disabled={Boolean(busy)} loading={busy === "reject"} onClick={() => window.confirm("Reject this booking request?") && void mutate({ action: "reject", note: statusNote }, "Booking rejected.")} /> : null}
            {!isClosed ? <ActionButton label="Cancel booking" tone="neutral" disabled={Boolean(busy)} loading={busy === "cancel"} onClick={() => window.confirm("Cancel this booking? Confirmed departure seats will be released.") && void mutate({ action: "cancel", note: statusNote }, "Booking cancelled.")} /> : null}
          </div>
        </div>
      </section>

      <section id="documents" className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-heading text-base font-bold text-primary">Customer documents</h2>
        <p className="mt-1 text-xs text-foreground-muted">Generated files always use the latest saved traveller and pricing data.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <DocumentCard title="Personalised quotation" description="Traveller pricing, advance, balance, and validity." preview={`/api/bookings/${booking.id}/quotation`} download={`/api/bookings/${booking.id}/quotation?download=1`} />
          <DocumentCard title="Trip brochure" description="Editorial journey overview, itinerary and inclusions." preview={`/api/bookings/${booking.id}/brochure`} download={`/api/bookings/${booking.id}/brochure?download=1`} />
          <DocumentCard title="Detailed itinerary" description="A clean itinerary-only copy for the travel file." preview={`/api/bookings/${booking.id}/documents/itinerary`} download={`/api/bookings/${booking.id}/documents/itinerary?download=1`} />
          {booking.price_amount || booking.pricing_snapshot?.total ? <DocumentCard title="Invoice" description="Verified booking value and payment reference." preview={`/api/bookings/${booking.id}/documents/invoice`} download={`/api/bookings/${booking.id}/documents/invoice?download=1`} /> : null}
          {booking.status === "confirmed" || booking.status === "completed" ? <DocumentCard title="Booking confirmation" description="Confirmed booking and payment summary." preview={`/api/bookings/${booking.id}/confirmation`} download={`/api/bookings/${booking.id}/confirmation?download=1`} /> : null}
          {booking.status === "confirmed" || booking.status === "completed" ? <DocumentCard title="Travel voucher" description="Presentable service voucher for the journey." preview={`/api/bookings/${booking.id}/documents/voucher`} download={`/api/bookings/${booking.id}/documents/voucher?download=1`} /> : null}
          {booking.payment_status === "received" ? <DocumentCard title="Payment receipt" description="Customer receipt for the recorded payment." preview={`/api/bookings/${booking.id}/documents/receipt`} download={`/api/bookings/${booking.id}/documents/receipt?download=1`} /> : null}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" disabled={Boolean(busy)} onClick={() => void sendBrochure("email")} className="min-h-11 rounded-full border border-primary/20 px-4 py-2 text-xs font-bold text-primary disabled:opacity-50">{busy === "brochure-email" ? "Sending…" : "Email quotation + brochure"}</button>
          <button type="button" disabled={Boolean(busy)} onClick={() => void sendBrochure("whatsapp")} className="min-h-11 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{busy === "brochure-whatsapp" ? "Preparing…" : "Share on WhatsApp"}</button>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-primary">Additional documents</h3>
          {booking.documents.length ? (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {booking.documents.map((document) => (
                <li key={document.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 text-sm">
                  <a href={document.url} target="_blank" rel="noopener noreferrer" className="font-bold capitalize text-accent hover:underline">{document.doc_type}</a>
                  <span className="mt-1 block truncate text-xs text-foreground-muted">Added by {document.uploaded_by}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-2 text-sm text-foreground-muted">No additional documents attached.</p>}
          <div className="mt-4 grid gap-3 lg:grid-cols-[160px_1fr_auto_auto] lg:items-end">
            <Field label="Document type"><select value={docType} onChange={(event) => setDocType(event.target.value as DocumentType)} className={inputClass}>{DOC_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></Field>
            <Field label="Secure document URL"><input type="url" value={docUrl} onChange={(event) => setDocUrl(event.target.value)} className={inputClass} placeholder="https://…" /></Field>
            <button type="button" disabled={Boolean(busy) || !docUrl.trim()} onClick={() => void addDocument()} className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy === "document" ? "Attaching…" : "Attach"}</button>
            <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition hover:bg-accent-dark">
              <Upload size={15} /> {busy === "document-upload" ? "Uploading…" : "Upload file"}
              <input type="file" accept="application/pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg" disabled={Boolean(busy)} onChange={(event) => { void uploadDocument(event.target.files?.[0]); event.currentTarget.value = ""; }} className="sr-only" />
            </label>
          </div>
          <p className="mt-2 text-xs text-foreground-muted">Upload PDFs, office documents or scans up to 16MB, or attach a secure HTTPS URL.</p>
        </div>
      </section>

      <section id="communication" className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-heading text-base font-bold text-primary">Customer communication</h2>
        <p className="mt-1 text-xs text-foreground-muted">Email sends directly when configured; otherwise a ready-to-send draft opens. WhatsApp opens the customer chat.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-end">
          <Field label="Channel"><select value={channel} onChange={(event) => setChannel(event.target.value as NotificationChannel)} className={inputClass}>{CHANNELS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
          <Field label="Message"><textarea rows={2} maxLength={2000} value={customerMessage} onChange={(event) => setCustomerMessage(event.target.value)} className={inputClass} placeholder="Booking update for the customer" /></Field>
          <button type="button" disabled={Boolean(busy) || !customerMessage.trim()} onClick={() => void notifyCustomer()} className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy === "notification" ? "Sending…" : channel === "in-app" ? "Post update" : "Send update"}</button>
        </div>
        {booking.notifications.length ? (
          <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
            {booking.notifications.map((notification) => (
              <li key={notification.id} className="rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="mr-2 text-[10px] font-bold uppercase tracking-wider text-accent">{notification.channel}</span>
                <span className="text-primary">{notification.message}</span>
                <span className="mt-1 block text-xs text-foreground-muted">{new Date(notification.created_at).toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section id="audit" className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="font-heading text-base font-bold text-primary">Audit trail</h2>
        {booking.history.length ? (
          <ol className="mt-4 space-y-3">
            {booking.history.map((entry) => (
              <li key={entry.id} className="border-l-2 border-slate-200 pl-4 text-sm">
                <strong className="text-primary">{BOOKING_STATUS_LABELS[entry.to_status]}</strong>
                <span className="text-foreground-muted"> · {entry.changed_by}</span>
                {entry.note ? <p className="mt-0.5 text-foreground-muted">{entry.note}</p> : null}
                <time className="mt-1 block text-xs text-slate-400">{new Date(entry.created_at).toLocaleString("en-IN")}</time>
              </li>
            ))}
          </ol>
        ) : <p className="mt-3 text-sm text-foreground-muted">No history recorded.</p>}
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><span className="block text-[10px] font-bold uppercase tracking-wider text-foreground-muted">{label}</span><span className="mt-1 block font-semibold text-primary">{value}</span></div>;
}

function HeroInfo({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string }) {
  return <div className="min-w-0 bg-primary/70 p-3.5"><span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-white/35"><Icon size={12} /> {label}</span><span className="mt-1.5 block truncate text-xs font-bold text-white sm:text-sm">{value}</span></div>;
}

function NextAction({ status, assigned }: { status: BookingDetail["status"]; assigned: boolean }) {
  const action = !assigned
    ? { title: "Assign a booking owner", detail: "This booking is still unassigned. Give one person responsibility before progressing it.", href: "#booking-owner" }
    : status === "new"
      ? { title: "Verify the request", detail: "Check the traveller and journey details, then confirm the final quoted price.", href: "#trip-details" }
      : status === "reviewing"
        ? { title: "Confirm pricing", detail: "Finish verification and lock the price to generate the customer-ready quotation.", href: "#workflow" }
        : status === "quoted"
          ? { title: "Approve the booking", detail: "Review the confirmed quotation and move the booking forward for payment.", href: "#workflow" }
          : status === "approved" || status === "payment_pending"
            ? { title: "Record the payment", detail: "Once funds arrive, record payment to confirm the booking and unlock travel documents.", href: "#workflow" }
            : { title: "Prepare the travel file", detail: "Send the itinerary, voucher and customer updates, then complete the trip after travel.", href: "#documents" };
  return <a href={action.href} className="group flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950 transition hover:border-amber-300 hover:bg-amber-100/70"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><ShieldCheck size={17} /></span><div className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-amber-700">Recommended next action</span><strong className="mt-1 block text-sm">{action.title}</strong><p className="mt-0.5 text-xs leading-5 text-amber-800/75">{action.detail}</p></div><ArrowRight size={18} className="shrink-0 text-amber-700 transition group-hover:translate-x-1" /></a>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className={labelClass}>{label}</span>{children}</label>;
}

function CountField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <Field label={label}><input type="number" min={0} max={99} value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} className={inputClass} /></Field>;
}

function ActionButton({ label, tone, disabled, loading, onClick }: { label: string; tone: "success" | "accent" | "primary" | "danger" | "neutral"; disabled: boolean; loading: boolean; onClick: () => void }) {
  const styles = { success: "bg-emerald-700 text-white", accent: "bg-accent text-white", primary: "bg-primary text-white", danger: "border border-red-200 text-red-700", neutral: "border border-slate-300 text-slate-700" };
  return <button type="button" disabled={disabled} onClick={onClick} className={`min-h-11 rounded-full px-4 py-2 text-xs font-bold disabled:opacity-50 ${styles[tone]}`}>{loading ? "Working…" : label}</button>;
}

function DocumentCard({ title, description, preview, download }: { title: string; description: string; preview: string; download: string }) {
  return <article className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-sand/50 p-4 transition hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-md"><a href={preview} target="_blank" rel="noreferrer" aria-label={`Preview ${title}`} className="block"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white"><FileText size={16} /></span><h3 className="mt-4 text-sm font-bold text-primary">{title}</h3><p className="mt-1 min-h-10 text-xs leading-relaxed text-foreground-muted">{description}</p></a><div className="mt-3 flex gap-4 border-t border-slate-200/70 pt-3 text-xs font-bold"><a href={preview} target="_blank" rel="noreferrer" className="text-accent hover:underline">Preview</a><a href={download} className="text-primary hover:underline">Download</a></div></article>;
}

function formatDisplayDate(value: string | null) {
  if (!value) return "TBC";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
