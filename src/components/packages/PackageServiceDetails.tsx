"use client";

import { useMemo, useState } from "react";
import type { PackageServiceDetails, PackageServiceKey } from "@/data/mockData";

const SERVICES: { kind: PackageServiceKey; label: string; emoji: string; tint: string }[] = [
  { kind: "hotel", label: "Hotel", emoji: "🏨", tint: "bg-rose-50 text-rose-600 ring-rose-100" },
  { kind: "meals", label: "Meals", emoji: "🍽️", tint: "bg-orange-50 text-orange-600 ring-orange-100" },
  { kind: "flights", label: "Flights", emoji: "✈️", tint: "bg-red-50 text-red-600 ring-red-100" },
  { kind: "sightseeing", label: "Sightseeing", emoji: "📷", tint: "bg-purple-50 text-purple-600 ring-purple-100" },
  { kind: "transfer", label: "Transfer", emoji: "🚐", tint: "bg-amber-50 text-amber-600 ring-amber-100" },
  { kind: "visa", label: "Visa", emoji: "🛂", tint: "bg-cyan-50 text-cyan-600 ring-cyan-100" },
];

export default function PackageServiceDetails({ details }: { details: PackageServiceDetails[] }) {
  const [active, setActive] = useState<PackageServiceKey>("hotel");
  const entries = useMemo(() => new Map(details.map((detail) => [detail.kind, detail.items.filter(Boolean)])), [details]);
  const selected = SERVICES.find((service) => service.kind === active) ?? SERVICES[0];
  const items = entries.get(active) || [];

  return <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
    <div className="grid grid-cols-3 border-b border-slate-100 sm:grid-cols-6">
      {SERVICES.map((service) => {
        const isActive = active === service.kind;
        return <button key={service.kind} type="button" onClick={() => setActive(service.kind)} aria-pressed={isActive} className={`group flex min-h-24 flex-col items-center justify-center gap-2 border-r border-slate-100 px-2 py-3 text-center transition-colors last:border-r-0 sm:min-h-28 ${isActive ? "bg-sand" : "hover:bg-sand/60"}`}>
          <span className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ring-1 transition-transform group-hover:-translate-y-0.5 ${service.tint}`}>{service.emoji}</span>
          <span className={`text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${isActive ? "text-primary" : "text-foreground-muted"}`}>{service.label}</span>
        </button>;
      })}
    </div>
    <div className="px-5 py-5 sm:px-7 sm:py-6">
      <div className="mb-4 flex items-center gap-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full text-base ring-1 ${selected.tint}`}>{selected.emoji}</span><div><p className="font-heading text-base font-bold text-primary">{selected.label} details</p><p className="text-xs text-foreground-muted">Included arrangements for this journey</p></div></div>
      {items.length ? <ul className="space-y-2.5">{items.map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-relaxed text-foreground-muted"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" /><span>{item}</span></li>)}</ul> : <p className="rounded-2xl bg-sand px-4 py-3 text-sm text-foreground-muted">Details will be confirmed with your travel consultant.</p>}
    </div>
  </div>;
}
