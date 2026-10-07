"use client";

import { usePathname } from "next/navigation";

function Field({ label, value, className = "" }: { label: string; value: string; className?: string }) {
  return (
    <div className={className}>
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground-light">{label}</p>
      <p className="mt-1 truncate font-heading text-sm font-bold text-primary">{value}</p>
    </div>
  );
}

/** A "boarding pass" for the page the visitor tried to reach. */
export default function BoardingPass() {
  const pathname = usePathname() || "/";

  return (
    <div className="notfound-float relative mx-auto w-full max-w-sm drop-shadow-[0_40px_60px_rgba(3,12,23,0.55)]">
      <div className="notfound-ticket-top overflow-hidden rounded-t-3xl bg-white">
        <div className="flex items-center justify-between bg-primary px-6 py-4 text-white">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Bandhan Tours</p>
            <p className="font-heading text-sm font-semibold">Boarding pass</p>
          </div>
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold" fill="currentColor" aria-hidden="true">
            <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
          </svg>
        </div>

        <div className="space-y-5 px-6 pb-5 pt-6">
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground-light">From</p>
              <p className="mt-1 truncate font-heading text-2xl font-extrabold text-primary" title={pathname}>
                {pathname.length > 14 ? `${pathname.slice(0, 13)}…` : pathname}
              </p>
            </div>
            <span className="mb-3 min-w-8 flex-1 border-t-2 border-dashed border-slate-200" aria-hidden="true" />
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground-light">To</p>
              <p className="mt-1 font-heading text-2xl font-extrabold text-accent">???</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Flight" value="BT 404" />
            <Field label="Gate" value="—" />
            <Field label="Seat" value="4·04" />
          </div>

          <div className="flex items-center justify-between rounded-2xl bg-accent/10 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent-dark">Status</p>
            <p className="flex items-center gap-2 text-sm font-bold text-accent-dark">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" aria-hidden="true" />
              Page not found
            </p>
          </div>
        </div>
      </div>

      {/* Tear-off stub; the masks punch see-through notches at the perforation */}
      <div className="notfound-ticket-stub relative rounded-b-3xl bg-white">
        <span className="absolute inset-x-6 top-0 border-t-2 border-dashed border-slate-200" aria-hidden="true" />
        <div className="flex items-center gap-4 px-6 pb-6 pt-5">
          <div
            className="h-12 flex-1 opacity-80"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, #07203c 0 2px, transparent 2px 4px, #07203c 4px 5px, transparent 5px 8px, #07203c 8px 11px, transparent 11px 13px)",
            }}
            aria-hidden="true"
          />
          <p className="font-heading text-[10px] font-bold uppercase leading-tight tracking-[0.2em] text-foreground-muted">
            Diverted
            <br />
            <span className="text-primary">to home</span>
          </p>
        </div>
      </div>
    </div>
  );
}
