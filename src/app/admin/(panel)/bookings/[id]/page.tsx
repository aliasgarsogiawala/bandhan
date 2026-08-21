"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import BookingPartyPanel from "@/components/booking/BookingPartyPanel";
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
  const canEditDetails = ["new", "reviewing"].includes(booking.status);
  const activeAgents = agents.filter((agent) => agent.status === "active" || agent.id === booking.agent_id);
  const assignedAgent = agents.find((agent) => agent.id === booking.agent_id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/bookings" className="inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:text-accent-dark">
          &larr; Back to Bookings
        </Link>
        <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary">
          {BOOKING_STATUS_LABELS[booking.status]}
        </span>
      </div>

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

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
              {booking.type === "customized" ? "Custom trip" : "Standard booking"} · {booking.booking_code}
            </span>
            <h1 className="mt-1 font-heading text-2xl font-bold text-primary">
              {booking.package_title || booking.destination || "Trip request"}
            </h1>
            <p className="mt-1 text-xs text-foreground-muted">Quotation {booking.quotation_number}</p>
          </div>
          <label className="min-w-56 space-y-1.5">
            <span className={labelClass}>Assigned agent</span>
            <select
              aria-label="Assigned agent"
              value={booking.agent_id || ""}
              disabled={Boolean(busy)}
              onChange={(event) => void changeAssignment(event.target.value)}
              className={inputClass}
            >
              <option value="">Unassigned</option>
              {activeAgents.map((agent) => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3 lg:grid-cols-6">
          <Info label="Travel date" value={booking.travel_date || "TBC"} />
          <Info label="Travellers" value={String(booking.travellers_count ?? "—")} />
          <Info label="Duration" value={booking.duration_label || "TBC"} />
          <Info label="Price" value={booking.price_amount || "Pending"} />
          <Info label="Payment" value={booking.payment_status === "received" ? "Received" : "Pending"} />
          <Info label="Agent" value={assignedAgent?.name || "Unassigned"} />
        </div>

        <div className="mt-7 border-t border-slate-100 pt-5">
          <span className={`${labelClass} mb-3`}>Booking pipeline</span>
          {isTerminalFailure ? (
            <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-700">
              {BOOKING_STATUS_LABELS[booking.status]}
            </span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {BOOKING_STATUS_PIPELINE.map((status, index) => (
                <span
                  key={status}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                    index <= currentIndex
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {BOOKING_STATUS_LABELS[status]}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      <BookingPartyPanel booking={booking} />

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-base font-bold text-primary">Trip and traveller details</h2>
            <p className="mt-1 text-xs text-foreground-muted">Edit these details during verification, before pricing is confirmed.</p>
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
            <span className="text-xs font-semibold text-foreground-muted">Locked after pricing</span>
          )}
        </div>

        {editing && draft ? (
          <div className="mt-5 space-y-5 border-t border-slate-100 pt-5">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Lead traveller name"><input value={draft.contactName} onChange={(event) => setDraft({ ...draft, contactName: event.target.value })} className={inputClass} /></Field>
              <Field label="Email"><input type="email" value={draft.contactEmail} onChange={(event) => setDraft({ ...draft, contactEmail: event.target.value })} className={inputClass} /></Field>
              <Field label="Phone"><input type="tel" value={draft.contactPhone} onChange={(event) => setDraft({ ...draft, contactPhone: event.target.value })} className={inputClass} /></Field>
              <Field label="Destination"><input value={draft.destination} onChange={(event) => setDraft({ ...draft, destination: event.target.value })} className={inputClass} /></Field>
              <Field label="Travel date"><input value={draft.travelDate} onChange={(event) => setDraft({ ...draft, travelDate: event.target.value })} className={inputClass} /></Field>
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

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
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

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
        <h2 className="font-heading text-base font-bold text-primary">Customer documents</h2>
        <p className="mt-1 text-xs text-foreground-muted">Generated files always use the latest saved traveller and pricing data.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DocumentCard title="Personalised quotation" description="Traveller pricing, advance, balance, and validity." preview={`/api/bookings/${booking.id}/quotation`} download={`/api/bookings/${booking.id}/quotation?download=1`} />
          <DocumentCard title="Trip brochure" description="Itinerary, inclusions, rooms, and party details." preview={`/api/bookings/${booking.id}/brochure`} download={`/api/bookings/${booking.id}/brochure?download=1`} />
          {booking.status === "confirmed" || booking.status === "completed" ? <DocumentCard title="Booking confirmation" description="Confirmed travel voucher and payment summary." preview={`/api/bookings/${booking.id}/confirmation`} download={`/api/bookings/${booking.id}/confirmation?download=1`} /> : null}
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
          <div className="mt-4 grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-end">
            <Field label="Document type"><select value={docType} onChange={(event) => setDocType(event.target.value as DocumentType)} className={inputClass}>{DOC_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}</select></Field>
            <Field label="Secure document URL"><input type="url" value={docUrl} onChange={(event) => setDocUrl(event.target.value)} className={inputClass} placeholder="https://…" /></Field>
            <button type="button" disabled={Boolean(busy) || !docUrl.trim()} onClick={() => void addDocument()} className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy === "document" ? "Attaching…" : "Attach"}</button>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
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

      <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
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
  return <article className="rounded-xl border border-primary/10 bg-sand/60 p-4"><h3 className="text-sm font-bold text-primary">{title}</h3><p className="mt-1 text-xs leading-relaxed text-foreground-muted">{description}</p><div className="mt-3 flex gap-4 text-xs font-bold"><a href={preview} target="_blank" rel="noreferrer" className="text-accent">Preview</a><a href={download} className="text-primary">Download</a></div></article>;
}
