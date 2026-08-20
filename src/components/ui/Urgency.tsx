"use client";

import React, { useEffect, useState } from "react";

/**
 * Urgency / social-proof widgets. Baseline numbers are derived deterministically
 * from a seed (the package/departure id) so server and client render the same
 * markup — no hydration mismatch — while the live bits (countdown, gentle
 * "viewing" fluctuation) only start ticking after mount.
 */

// Stable pseudo-random integer in [min, max] from a string seed (FNV-1a).
export function seededInt(seed: string, min: number, max: number): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const range = max - min + 1;
  return min + (Math.abs(h) % range);
}

const FlameIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1 .3-1.8.7-2.5C7 8.5 6 10 6 12.5A6 6 0 0 0 18 13c0-4.5-3.5-7-6-11z" />
  </svg>
);

/** "🔥 N people are viewing this right now" — nudges up/down slightly after mount. */
export const ViewingNow: React.FC<{ seed: string; className?: string }> = ({ seed, className = "" }) => {
  const base = seededInt(seed, 8, 27);
  const [count, setCount] = useState(base);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => Math.max(5, c + (Math.random() < 0.5 ? -1 : 1)));
    }, 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <FlameIcon className="w-3.5 h-3.5 text-accent" />
      <span>
        <strong className="font-bold">{count}</strong> people are viewing this now
      </span>
    </span>
  );
};

/** Seats-left pill, deterministic per seed. Turns red when scarce. */
export const SeatsLeft: React.FC<{ seed: string; className?: string }> = ({ seed, className = "" }) => {
  const seats = seededInt(seed, 2, 7);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
        seats <= 4
          ? "bg-accent/10 text-accent-dark border-accent/20"
          : "bg-gold/15 text-gold-dark border-gold/30"
      } ${className}`}
    >
      <FlameIcon className="w-3 h-3" />
      Only {seats} seats left
    </span>
  );
};

/** "N booked in the last 24 hours" social proof. */
export const RecentlyBooked: React.FC<{ seed: string; className?: string }> = ({ seed, className = "" }) => {
  const n = seededInt(seed + "book", 6, 19);
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      {n} booked in the last 24h
    </span>
  );
};

/** Live HH:MM:SS countdown to a target timestamp; placeholder until mounted. */
export const Countdown: React.FC<{ target: number; className?: string }> = ({ target, className = "" }) => {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const initial = window.setTimeout(() => setNow(Date.now()), 0);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(t);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  let display = "--:--:--";
  if (now !== null) {
    let diff = Math.max(0, target - now);
    const h = Math.floor(diff / 3_600_000);
    diff -= h * 3_600_000;
    const m = Math.floor(diff / 60_000);
    diff -= m * 60_000;
    const s = Math.floor(diff / 1000);
    display = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  return <span className={`tabular-nums font-bold tracking-tight ${className}`}>{display}</span>;
};

/** Timestamp for end of the current day — a natural "offer ends today" target. */
export function endOfToday(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}
