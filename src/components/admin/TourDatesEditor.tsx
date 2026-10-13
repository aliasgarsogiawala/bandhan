"use client";

import type { PackageDepartureDate } from "@/data/mockData";

const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-primary focus:border-accent focus:outline-none";

export default function TourDatesEditor({ values, onChange }: {
  values: PackageDepartureDate[];
  onChange: (dates: PackageDepartureDate[]) => void;
}) {
  const patch = (index: number, update: Partial<PackageDepartureDate>) => onChange(values.map((date, i) => i === index ? { ...date, ...update } : date));
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h5 className="font-bold text-primary">Departure dates</h5>
          <p className="mt-1 text-xs leading-5 text-foreground-muted">Add one entry for each departure. Start dates appear on the tour page; end dates are optional.</p>
        </div>
        <button type="button" onClick={() => onChange([...values, { startDate: "", endDate: "" }])} className="rounded-full bg-sand-dark px-3 py-2 text-xs font-bold text-primary hover:bg-gold">+ Add departure date</button>
      </div>
      {values.length === 0 ? <p className="rounded-xl border border-dashed border-slate-200 px-4 py-3 text-xs text-foreground-muted">No fixed dates yet. Travellers can still request their preferred dates.</p> : null}
      {values.map((date, index) => (
        <div key={index} className="grid items-end gap-3 rounded-2xl border border-slate-100 bg-sand/50 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="space-y-1.5"><span className="text-xs font-bold text-primary">Start date</span><input type="date" aria-label={`Departure ${index + 1} start date`} value={date.startDate} onChange={(event) => patch(index, { startDate: event.target.value })} className={inputClass} /></label>
          <label className="space-y-1.5"><span className="text-xs font-bold text-primary">End date (optional)</span><input type="date" aria-label={`Departure ${index + 1} end date`} min={date.startDate || undefined} value={date.endDate || ""} onChange={(event) => patch(index, { endDate: event.target.value })} className={inputClass} /></label>
          <button type="button" aria-label={`Remove departure ${index + 1}`} onClick={() => onChange(values.filter((_, i) => i !== index))} className="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-foreground-muted hover:text-accent">Remove date</button>
        </div>
      ))}
    </div>
  );
}
