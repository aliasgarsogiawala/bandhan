"use client";

import { useState, type FormEvent } from "react";
import type { BookingDetail } from "@/lib/bookings/types";

export function BookingTravellerEditor({ booking, onSaved }: { booking: BookingDetail; onSaved: (booking: BookingDetail) => void }) {
  const [values, setValues] = useState({
    travellerNames: booking.traveller_names || "",
    contactPhone: booking.contact_phone || "",
    specialRequirements: booking.special_requirements || "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const editable = ["new", "reviewing", "quoted", "approved"].includes(booking.status);

  async function save(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await response.json()) as { ok: boolean; booking?: BookingDetail; error?: string };
      if (!response.ok || !data.booking) throw new Error(data.error || "Could not save traveller details.");
      onSaved({ ...data.booking, documents: booking.documents, history: booking.history, notifications: booking.notifications });
      setMessage("Traveller details updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save traveller details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border border-slate-100/80 bg-white p-6 shadow-premium sm:p-8">
      <h2 className="font-heading text-lg font-bold text-primary">Traveller details</h2>
      <p className="mt-1 text-sm text-foreground-muted">
        {editable ? "Keep names and contact details accurate before confirmation." : "Contact your travel advisor to change confirmed traveller details."}
      </p>
      <form onSubmit={save} className="mt-4 space-y-3">
        <textarea disabled={!editable} value={values.travellerNames} onChange={(e) => setValues({ ...values, travellerNames: e.target.value })} placeholder="Traveller names, one per line" rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent disabled:bg-slate-50" />
        <input disabled={!editable} value={values.contactPhone} onChange={(e) => setValues({ ...values, contactPhone: e.target.value })} placeholder="Primary contact phone" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent disabled:bg-slate-50" />
        <textarea disabled={!editable} value={values.specialRequirements} onChange={(e) => setValues({ ...values, specialRequirements: e.target.value })} placeholder="Meal, accessibility or room requirements" rows={3} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-accent disabled:bg-slate-50" />
        {editable ? <button disabled={busy} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{busy ? "Saving…" : "Save traveller details"}</button> : null}
        {message ? <p role="status" className="text-sm font-semibold text-primary">{message}</p> : null}
      </form>
    </section>
  );
}
