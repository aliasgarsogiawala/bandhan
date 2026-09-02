"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

/**
 * The booking journey's field vocabulary.
 *
 * The engine, the traveller step and the inline auth modal each carried their
 * own `inputClass` string, which is how one continuous form ended up with
 * three different borders, radii and focus treatments. Everything routes
 * through here now, and the shapes follow the rest of the site — hairline
 * rules and near-square corners rather than the pill radii this flow had
 * drifted into on its own.
 */

const base =
  "w-full rounded-[4px] border bg-white px-4 py-3 text-sm font-medium text-primary outline-none transition-colors duration-200 placeholder:font-normal placeholder:text-foreground-light";

export const fieldClass = `${base} border-primary/15 hover:border-primary/30 focus:border-accent`;

/** Identity fields owned by the account: shown, but not editable here. */
export const fieldClassLocked = `${base} cursor-not-allowed border-primary/10 bg-sand-light text-foreground-muted hover:border-primary/10`;

export const labelClass =
  "flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-primary";

/**
 * Label above a control, with the whole thing as one click target.
 * `hint` sits under the control for guidance that isn't a placeholder.
 */
export function Field({
  label,
  hint,
  icon,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className={labelClass}>
        {icon}
        {label}
      </span>
      {children}
      {hint ? <span className="text-xs leading-5 text-foreground-muted">{hint}</span> : null}
    </label>
  );
}

/**
 * Native select with the platform chevron swapped for the site's own — the
 * default arrow is the one part of a styled form that still reads as OS chrome.
 */
export function Select({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={`${fieldClass} appearance-none pr-11 ${className}`}>
        {children}
      </select>
      <ChevronDown
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted"
      />
    </span>
  );
}

/**
 * Checkbox rows — add-ons, terms. A hairline block whose selected state is a
 * tint rather than a second border, so a list of them stays quiet.
 */
export function CheckRow({
  checked,
  onChange,
  className = "",
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 p-4 transition-colors duration-200 sm:p-5 ${
        checked ? "bg-accent/[0.05]" : "hover:bg-sand-light"
      } ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
      />
      {children}
    </label>
  );
}
