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
  const atMin = value <= min;
  const atMax = value >= max;

  // One button treatment for both ends. The old stepper filled the plus in
  // navy and outlined the minus, which read as "add" being the safe action and
  // "remove" being secondary — they are the same weight of decision.
  const control =
    "flex h-10 w-10 items-center justify-center border border-primary/15 text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white disabled:border-primary/8 disabled:bg-transparent disabled:text-foreground-light disabled:hover:bg-transparent disabled:hover:text-foreground-light";

  return (
    <div className="flex items-center justify-between gap-4 border border-primary/12 bg-white px-4 py-3.5 transition-colors duration-200 focus-within:border-primary/30">
      <div className="min-w-0">
        <p className="text-sm font-bold text-primary">{label}</p>
        <p className="mt-0.5 text-xs text-foreground-muted">{hint}</p>
      </div>
      <div className="flex shrink-0 items-center">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={atMin}
          className={`${control} rounded-l-[4px]`}
          aria-label={`Remove ${label}`}
        >
          <Minus size={15} />
        </button>
        <span
          aria-live="polite"
          className="tabular w-11 border-y border-primary/15 py-[0.6875rem] text-center text-sm font-extrabold text-primary"
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={atMax}
          className={`${control} rounded-r-[4px]`}
          aria-label={`Add ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}
