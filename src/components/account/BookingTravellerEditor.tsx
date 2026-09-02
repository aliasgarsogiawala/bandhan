"use client";

import { useState, type FormEvent } from "react";
import type { BookingDetail } from "@/lib/bookings/types";
import { Field, fieldClass, fieldClassLocked } from "@/components/booking/fields";

export function BookingTravellerEditor({
  booking,
  onSaved,
}: {
  booking: BookingDetail;
  onSaved: (booking: BookingDetail) => void;
}) {
  const [values, setValues] = useState({
    travellerNames: booking.traveller_names || "",
    contactPhone: booking.contact_phone || "",
    specialRequirements: booking.special_requirements || "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const editable = ["new", "reviewing", "quoted", "approved"].includes(booking.status);
  const inputClass = editable ? fieldClass : fieldClassLocked;

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
      const data = (await response.json()) as {
        ok: boolean;
        booking?: BookingDetail;
        error?: string;
      };
      if (!response.ok || !data.booking) {
        throw new Error(data.error || "Could not save traveller details.");
      }
      onSaved({
        ...data.booking,
        documents: booking.documents,
        history: booking.history,
        notifications: booking.notifications,
      });
      setMessage("Traveller details updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save traveller details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border border-primary/12 bg-white shadow-premium">
      <header className="border-b border-primary/10 px-6 py-5 sm:px-8">
        <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-primary">
          Traveller details
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
          {editable
            ? "Keep names and contact details accurate before confirmation."
            : "Contact your travel advisor to change confirmed traveller details."}
        </p>
      </header>

      <form onSubmit={save} className="space-y-5 px-6 py-6 sm:px-8">
        <Field label="Traveller names" hint="One traveller per line.">
          <textarea
            disabled={!editable}
            value={values.travellerNames}
            onChange={(e) => setValues({ ...values, travellerNames: e.target.value })}
            placeholder="Aditi Sharma&#10;Rohan Sharma"
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </Field>
        <Field label="Primary contact phone">
          <input
            type="tel"
            disabled={!editable}
            value={values.contactPhone}
            onChange={(e) => setValues({ ...values, contactPhone: e.target.value })}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </Field>
        <Field label="Special requirements">
          <textarea
            disabled={!editable}
            value={values.specialRequirements}
            onChange={(e) => setValues({ ...values, specialRequirements: e.target.value })}
            placeholder="Meal, accessibility or room requirements"
            rows={3}
            className={`${inputClass} resize-y`}
          />
        </Field>

        {editable ? (
          <button
            disabled={busy}
            className="inline-flex min-h-12 items-center justify-center rounded-[4px] bg-primary px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-gold hover:text-primary disabled:cursor-not-allowed disabled:opacity-55"
          >
            {busy ? "Saving…" : "Save traveller details"}
          </button>
        ) : null}

        {message ? (
          <p
            role="status"
            className="border-l-2 border-emerald-500 bg-emerald-500/[0.07] px-4 py-3 text-sm leading-6 text-emerald-800"
          >
            {message}
          </p>
        ) : null}
      </form>
    </section>
  );
}
