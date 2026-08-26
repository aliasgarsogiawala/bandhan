"use client";

import React, { useState } from "react";
import { CalendarDays, MapPin, PencilLine, Users } from "lucide-react";
import type { BookingDetail } from "@/lib/bookings/types";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface BookingDetailsEditorProps {
  booking: BookingDetail;
  busy: boolean;
  onSave: (body: Record<string, unknown>) => Promise<void>;
}

const fieldClass = "min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm font-medium text-primary outline-none transition focus:border-accent focus:bg-white";
const labelClass = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.13em] text-foreground-muted";

function count(value: number | undefined) {
  return Number.isFinite(value) ? Number(value) : 0;
}

export default function BookingDetailsEditor({ booking, busy, onSave }: BookingDetailsEditorProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => ({
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
    adults: count(booking.adults) || 1,
    childrenWithBed: count(booking.children_with_bed),
    childrenWithoutBed: count(booking.children_without_bed),
    infants: count(booking.infants),
    singleRooms: count(booking.room_configuration?.singleRooms),
    doubleRooms: count(booking.room_configuration?.doubleRooms) || 1,
    tripleRooms: count(booking.room_configuration?.tripleRooms),
  }));
  const editable = ["new", "reviewing", "quoted", "approved", "payment_pending"].includes(booking.status);
  const set = (key: keyof typeof draft, value: string | number) => setDraft((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave({
      action: "updateDetails",
      details: {
        contactName: draft.contactName,
        contactEmail: draft.contactEmail,
        contactPhone: draft.contactPhone,
        destination: draft.destination,
        travelDate: draft.travelDate,
        departureCity: draft.departureCity,
        durationLabel: draft.durationLabel,
        travellerNames: draft.travellerNames,
        budget: draft.budget,
        specialRequirements: draft.specialRequirements,
        travellers: {
          adults: draft.adults,
          childrenWithBed: draft.childrenWithBed,
          childrenWithoutBed: draft.childrenWithoutBed,
          infants: draft.infants,
        },
        rooms: {
          singleRooms: draft.singleRooms,
          doubleRooms: draft.doubleRooms,
          tripleRooms: draft.tripleRooms,
        },
      },
    });
    setOpen(false);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <button type="button" onClick={() => setOpen((current) => !current)} disabled={!editable} aria-expanded={open} className="flex w-full items-center justify-between gap-4 p-5 text-left disabled:cursor-not-allowed disabled:opacity-60 sm:p-6">
        <span>
          <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary"><PencilLine size={16} className="text-accent" /> Modify booking</span>
          <span className="mt-1 block text-xs leading-relaxed text-foreground-muted">Update dates, destination, lead traveller, party size, rooms and requirements.</span>
        </span>
        <span className="shrink-0 rounded-full border border-primary/15 px-3 py-1.5 text-[10px] font-bold uppercase text-primary">{editable ? (open ? "Close" : "Edit") : "Locked"}</span>
      </button>

      {open ? (
        <form onSubmit={submit} className="border-t border-slate-100 bg-sand/35 p-5 sm:p-6">
          {["quoted", "approved", "payment_pending"].includes(booking.status) ? (
            <p className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">Saving revised trip details returns this booking to review and expires the earlier quotation.</p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label><span className={labelClass}>Lead traveller</span><input required value={draft.contactName} onChange={(event) => set("contactName", event.target.value)} className={fieldClass} /></label>
            <label><span className={labelClass}>Email</span><input required type="email" value={draft.contactEmail} onChange={(event) => set("contactEmail", event.target.value)} className={fieldClass} /></label>
            <label><span className={labelClass}>Phone</span><input required value={draft.contactPhone} onChange={(event) => set("contactPhone", event.target.value)} className={fieldClass} /></label>
            <label><span className={labelClass}><MapPin size={11} className="inline" /> Destination</span><input value={draft.destination} onChange={(event) => set("destination", event.target.value)} className={fieldClass} /></label>
            <label><span className={labelClass}><CalendarDays size={11} className="inline" /> Travel date</span><input required type="date" disabled={Boolean(booking.departure_id)} value={draft.travelDate} onChange={(event) => set("travelDate", event.target.value)} className={fieldClass} /></label>
            <label><span className={labelClass}>Duration</span><input value={draft.durationLabel} onChange={(event) => set("durationLabel", event.target.value)} placeholder="7 Nights / 8 Days" className={fieldClass} /></label>
            <label><span className={labelClass}>Departure city</span><input value={draft.departureCity} onChange={(event) => set("departureCity", event.target.value)} className={fieldClass} /></label>
            <label><span className={labelClass}>Budget</span><input value={draft.budget} onChange={(event) => set("budget", event.target.value)} className={fieldClass} /></label>
            <label className="sm:col-span-2 lg:col-span-1"><span className={labelClass}>Traveller names</span><input value={draft.travellerNames} onChange={(event) => set("travellerNames", event.target.value)} placeholder="Comma-separated names" className={fieldClass} /></label>
          </div>

          <div className="mt-5 grid gap-4 rounded-2xl border border-primary/10 bg-white p-4 sm:grid-cols-2">
            <fieldset>
              <legend className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary"><Users size={14} className="text-accent" /> Travellers</legend>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {([['adults', 'Adults'], ['childrenWithBed', 'Children + bed'], ['childrenWithoutBed', 'Children no bed'], ['infants', 'Infants']] as const).map(([key, label]) => <label key={key}><span className={labelClass}>{label}</span><input type="number" min={key === "adults" ? 1 : 0} max={99} value={draft[key]} onChange={(event) => set(key, Number(event.target.value))} className={fieldClass} /></label>)}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-wider text-primary">Room configuration</legend>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {([['singleRooms', 'Single'], ['doubleRooms', 'Double'], ['tripleRooms', 'Triple']] as const).map(([key, label]) => <label key={key}><span className={labelClass}>{label}</span><input type="number" min={0} max={99} value={draft[key]} onChange={(event) => set(key, Number(event.target.value))} className={fieldClass} /></label>)}
              </div>
            </fieldset>
          </div>

          <label className="mt-4 block"><span className={labelClass}>Special requirements</span><textarea rows={3} value={draft.specialRequirements} onChange={(event) => set("specialRequirements", event.target.value)} className={fieldClass} /></label>
          {booking.departure_id ? <p className="mt-3 text-xs text-foreground-muted">This date is locked to the selected group departure. Party-size changes are checked against remaining seats when saved.</p> : null}
          <div className="mt-5 flex justify-end"><PrimaryButton type="submit" size="sm" variant="navy" isLoading={busy}>Save revised details</PrimaryButton></div>
        </form>
      ) : null}
    </section>
  );
}
