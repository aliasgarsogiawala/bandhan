/**
 * Shared filter vocabulary for trip search.
 *
 * The hero search bar and the packages page both filter the same catalogue, so
 * the ranges live here rather than being redeclared in each component — they
 * previously disagreed (the hero treated ₹60k–₹1.2L as one band while the
 * packages page used ₹60k–₹1L), so the same search gave different results
 * depending on where you ran it.
 */

export type BudgetKey = "all" | "under-30k" | "30k-60k" | "60k-1l" | "above-1l";
export type DurationKey = "all" | "up-to-7" | "8-10" | "11-plus";

export const BUDGET_RANGES: { key: BudgetKey; label: string; test: (price: number) => boolean }[] = [
  { key: "all", label: "Any Budget", test: () => true },
  { key: "under-30k", label: "Under ₹30,000", test: (p) => p < 30000 },
  { key: "30k-60k", label: "₹30,000 – ₹60,000", test: (p) => p >= 30000 && p < 60000 },
  { key: "60k-1l", label: "₹60,000 – ₹1,00,000", test: (p) => p >= 60000 && p < 100000 },
  { key: "above-1l", label: "Above ₹1,00,000", test: (p) => p >= 100000 },
];

export const DURATION_RANGES: { key: DurationKey; label: string; test: (days: number) => boolean }[] = [
  { key: "all", label: "Any Duration", test: () => true },
  { key: "up-to-7", label: "Up to 7 Days", test: (d) => d <= 7 },
  { key: "8-10", label: "8 – 10 Days", test: (d) => d >= 8 && d <= 10 },
  { key: "11-plus", label: "11+ Days", test: (d) => d >= 11 },
];

export function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

/** "9 Nights / 10 Days" -> 10 (the larger of the two numbers found) */
export function parseDurationDays(duration: string): number {
  const numbers = duration.match(/\d+/g)?.map(Number) ?? [];
  return numbers.length ? Math.max(...numbers) : 0;
}

export function budgetRange(key: string | null) {
  return BUDGET_RANGES.find((r) => r.key === key) ?? BUDGET_RANGES[0];
}

export function durationRange(key: string | null) {
  return DURATION_RANGES.find((r) => r.key === key) ?? DURATION_RANGES[0];
}

const MONTH_NAMES = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];

/** The next 12 months, as {value:"2026-10", label:"October 2026"}. */
export function travelMonthOptions(from = new Date()): { value: string; label: string }[] {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(from.getFullYear(), from.getMonth() + i, 1);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return {
      value: `${d.getFullYear()}-${month}`,
      label: new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" }).format(d),
    };
  });
}

/** "2026-10" -> 10. Returns 0 when the value is empty or malformed. */
export function monthNumber(value: string): number {
  const month = Number(value.split("-")[1]);
  return Number.isInteger(month) && month >= 1 && month <= 12 ? month : 0;
}

/**
 * Whether a package's free-text `bestTime` covers the given month (1–12).
 *
 * Handles the shapes actually present in the catalogue: "April to October",
 * "October to April" (wrapping across the year end), a bare "November", and
 * "Year-round". An unrecognised string never excludes a package — a trip we
 * cannot classify should still be offered rather than silently disappear.
 */
export function bestTimeCoversMonth(bestTime: string | undefined, month: number): boolean {
  if (!month) return true;
  const text = (bestTime ?? "").toLowerCase();
  if (!text) return true;
  if (text.includes("year") || text.includes("all year") || text.includes("anytime")) return true;

  const found: number[] = [];
  for (const match of text.matchAll(/[a-z]+/g)) {
    const index = MONTH_NAMES.indexOf(match[0]);
    if (index !== -1) found.push(index + 1);
  }
  if (found.length === 0) return true;
  if (found.length === 1) return found[0] === month;

  // Treat the first and last month named as an inclusive span, wrapping at December.
  const [start, end] = [found[0], found[found.length - 1]];
  return start <= end
    ? month >= start && month <= end
    : month >= start || month <= end;
}
