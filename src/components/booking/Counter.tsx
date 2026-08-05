"use client";

import { Minus, Plus } from "lucide-react";

/** Stepper used for traveller and room counts across the booking journeys. */
export default function Counter({
  label,
  hint,
  value,
  min = 0,
  max = 20,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-bold text-primary">{label}</p>
        <p className="mt-0.5 text-xs text-foreground-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-primary hover:border-primary"
          aria-label={`Remove ${label}`}
        >
          <Minus size={15} />
        </button>
        <span className="w-5 text-center text-sm font-extrabold text-primary">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-accent"
          aria-label={`Add ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
