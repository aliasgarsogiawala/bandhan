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
    <div className="mt-10 border-y border-primary/15 bg-transparent">
      <div className="grid grid-cols-3 border-b border-primary/15 sm:grid-cols-6">
        {SERVICES.map((service) => {
          const isActive = active === service.kind;
          const Icon = service.icon;
          return (
            <button
              key={service.kind}
              type="button"
              onClick={() => setActive(service.kind)}
              aria-pressed={isActive}
              className={`group relative flex min-h-20 flex-col items-center justify-center gap-2 border-r border-primary/10 px-2 py-3 text-center transition-colors last:border-r-0 sm:min-h-24 ${isActive ? "bg-white text-primary" : "text-primary/65 hover:bg-white/60"}`}
            >
              <span className={`flex h-8 w-8 items-center justify-center transition-transform group-hover:-translate-y-0.5 ${isActive ? "text-gold-dark" : "text-primary/45"}`}>
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <span className={`text-[9px] font-bold uppercase tracking-[0.14em] sm:text-[10px] ${isActive ? "text-primary" : "text-foreground-muted"}`}>
                {service.label}
              </span>
              {isActive && <span className="absolute inset-x-5 bottom-0 h-0.5 bg-gold-dark" />}
            </button>
          );
        })}
      </div>

      <div className="bg-white/55 px-5 py-7 sm:px-8 sm:py-8">
        <div className="mb-6 flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center border border-gold-dark/35 text-gold-dark"><SelectedIcon size={18} strokeWidth={1.6} /></span>
          <div><p className="font-heading text-lg font-bold text-primary">{selected.label} details</p><p className="text-xs text-foreground-muted">Arrangements planned for this journey</p></div>
        </div>
        {items.length ? (
          <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3 border-t border-primary/10 pt-4 text-sm leading-6 text-foreground-muted">
                <span className="mt-2.5 h-px w-4 shrink-0 bg-gold-dark" /><span>{item}</span>
              </li>
            ))}
          </ul>
        ) : <p className="border-l-2 border-gold-dark bg-sand px-4 py-3 text-sm text-foreground-muted">Details will be confirmed with your travel consultant.</p>}
      </div>
    </div>
  );
}
