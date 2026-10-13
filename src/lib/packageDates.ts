import type { PackageDepartureDate } from "@/data/mockData";

export class PackageDateError extends Error {}

export function isCalendarDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

/** Shared by the editor and API so a saved date has the same meaning everywhere. */
export function normalizePackageDates(value: unknown): PackageDepartureDate[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new PackageDateError("Departure dates must be a list.");
  const dates: PackageDepartureDate[] = [];
  const seen = new Set<string>();
  value.forEach((row: unknown, index) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) throw new PackageDateError(`Departure ${index + 1} is invalid.`);
    const { startDate, endDate } = row as Record<string, unknown>;
    if ((startDate === "" || startDate === undefined) && (endDate === "" || endDate === undefined)) return;
    if (!isCalendarDate(startDate)) throw new PackageDateError(`Choose a valid start date for departure ${index + 1}.`);
    if (endDate !== "" && endDate !== undefined && !isCalendarDate(endDate)) {
      throw new PackageDateError(`Choose a valid end date for departure ${index + 1}.`);
    }
    if (typeof endDate === "string" && endDate && endDate < startDate) {
      throw new PackageDateError(`Departure ${index + 1} cannot end before it starts.`);
    }
    if (seen.has(startDate)) throw new PackageDateError(`The start date ${startDate} is repeated. Keep one entry per departure.`);
    seen.add(startDate);
    dates.push({ startDate, ...(endDate ? { endDate: String(endDate) } : {}) });
  });
  return dates.sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function todayInIndia(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Asia/Kolkata", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((value) => value.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function upcomingPackageDates(value: unknown, today = todayInIndia()) {
  try {
    return normalizePackageDates(value).filter((date) => date.startDate >= today);
  } catch {
    // Keep the tour readable if older content contains an invalid schedule.
    return [];
  }
}

export function formatPackageDate(date: PackageDepartureDate) {
  const format = (value: string) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
  return date.endDate && date.endDate !== date.startDate
    ? `${format(date.startDate)} – ${format(date.endDate)}`
    : format(date.startDate);
}

export function packageDateBookingHref(packageId: string, startDate: string) {
  return `/book?${new URLSearchParams({ type: "package", id: packageId, date: startDate })}`;
}

export function initialBookingDate(date: string | null, month: string | null) {
  if (isCalendarDate(date)) return date;
  const monthStart = month ? `${month}-01` : "";
  return isCalendarDate(monthStart) ? monthStart : "";
}
