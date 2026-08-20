"use client";

import { useMemo, useState } from "react";
import { BedDouble, BusFront, Camera, Plane, Stamp, UtensilsCrossed, type LucideIcon } from "lucide-react";
import type { PackageServiceDetails, PackageServiceKey } from "@/data/mockData";

const SERVICES: { kind: PackageServiceKey; label: string; icon: LucideIcon }[] = [
  { kind: "hotel", label: "Stay", icon: BedDouble },
  { kind: "meals", label: "Meals", icon: UtensilsCrossed },
  { kind: "flights", label: "Flights", icon: Plane },
  { kind: "sightseeing", label: "Experiences", icon: Camera },
  { kind: "transfer", label: "Transfers", icon: BusFront },
  { kind: "visa", label: "Visa", icon: Stamp },
];

export default function PackageServiceDetails({ details }: { details: PackageServiceDetails[] }) {
  const [active, setActive] = useState<PackageServiceKey>("hotel");
  const entries = useMemo(
    () => new Map(details.map((detail) => [detail.kind, detail.items.filter(Boolean)])),
    [details]
  );
  const selected = SERVICES.find((service) => service.kind === active) ?? SERVICES[0];
  const items = entries.get(active) || [];
  const SelectedIcon = selected.icon;

  return (
    <div className="mt-8 overflow-hidden rounded-[8px] border border-primary/10 bg-white shadow-soft">
      <div className="grid grid-cols-3 border-b border-primary/10 bg-sand-light sm:grid-cols-6">
        {SERVICES.map((service) => {
          const isActive = active === service.kind;
          const Icon = service.icon;
          return (
            <button
              key={service.kind}
              type="button"
              onClick={() => setActive(service.kind)}
              aria-pressed={isActive}
              className={`group flex min-h-20 flex-col items-center justify-center gap-2 border-r border-primary/10 px-2 py-3 text-center transition-colors last:border-r-0 sm:min-h-24 ${isActive ? "bg-primary text-white" : "text-primary hover:bg-sand"}`}
            >
              <span className={`flex h-9 w-9 items-center justify-center rounded-[6px] border transition-transform group-hover:-translate-y-0.5 ${isActive ? "border-gold/40 bg-gold/15 text-gold" : "border-primary/10 bg-white text-accent"}`}>
                <Icon size={17} strokeWidth={2} />
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wide sm:text-[11px] ${isActive ? "text-white" : "text-foreground-muted"}`}>
                {service.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="px-5 py-5 sm:px-7 sm:py-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[6px] bg-primary text-gold"><SelectedIcon size={17} /></span>
          <div><p className="font-heading text-base font-bold text-primary">{selected.label} details</p><p className="text-xs text-foreground-muted">Arrangements planned for this journey</p></div>
        </div>
        {items.length ? (
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3 border-t border-primary/10 pt-3 text-sm leading-relaxed text-foreground-muted">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-dark" /><span>{item}</span>
              </li>
            ))}
          </ul>
        ) : <p className="rounded-[6px] bg-sand px-4 py-3 text-sm text-foreground-muted">Details will be confirmed with your travel consultant.</p>}
      </div>
    </div>
  );
}
