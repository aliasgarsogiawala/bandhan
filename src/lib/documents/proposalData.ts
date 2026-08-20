import type { Booking } from "@/lib/bookings/types";
import type {
  BookingPackageSnapshot,
  QuoteSnapshot,
  TravellerBreakdown,
} from "@/lib/bookings/pricing";
import { parseMoney } from "@/lib/bookings/pricing";

export interface TravellerMixItem {
  key: keyof TravellerBreakdown;
  label: string;
  shortLabel: string;
  count: number;
  note: string;
}

export function safePackageSnapshot(booking: Booking): BookingPackageSnapshot {
  const snapshot = booking.package_snapshot || ({} as BookingPackageSnapshot);
  return {
    source: snapshot.source || booking.booking_source || "package",
    id: snapshot.id || booking.package_id || undefined,
    title:
      snapshot.title ||
      booking.package_title ||
      booking.destination ||
      "Personalised Holiday Proposal",
    destination: snapshot.destination || booking.destination || "To be confirmed",
    category: snapshot.category,
    duration: snapshot.duration || booking.duration_label || undefined,
    tagline: snapshot.tagline,
    overview: snapshot.overview,
    heroImage: snapshot.heroImage,
    bestTime: snapshot.bestTime,
    startingPoint: snapshot.startingPoint,
    groupSize: snapshot.groupSize,
    themes: snapshot.themes || [],
    highlights: snapshot.highlights || [],
    itinerary: snapshot.itinerary || [],
    inclusions: snapshot.inclusions || [],
    exclusions: snapshot.exclusions || [],
    gallery: snapshot.gallery || [],
  };
}

export function safeQuoteSnapshot(booking: Booking): QuoteSnapshot {
  const snapshot = booking.pricing_snapshot || ({} as QuoteSnapshot);
  const total = parseMoney(snapshot.total || booking.price_amount || 0);
  const depositPercent = Number(snapshot.depositPercent || 25);
  const depositAmount = Number(
    snapshot.depositAmount || Math.round((total * depositPercent) / 100)
  );
  return {
    currency: "INR",
    lineItems: Array.isArray(snapshot.lineItems) ? snapshot.lineItems : [],
    subtotal: Number(snapshot.subtotal || total),
    total,
    depositPercent,
    depositAmount,
    balanceAmount: Number(snapshot.balanceAmount || Math.max(0, total - depositAmount)),
    validityDays: Number(snapshot.validityDays || 7),
    generatedAt: snapshot.generatedAt || booking.created_at,
    isIndicative: snapshot.isIndicative !== false,
  };
}

export function travellerMix(booking: Booking): TravellerMixItem[] {
  const savedTotal = Math.max(1, Number(booking.travellers_count || 1));
  const explicitTotal =
    Number(booking.adults || 0) +
    Number(booking.children_with_bed || 0) +
    Number(booking.children_without_bed || 0) +
    Number(booking.infants || 0);
  const adults = explicitTotal > 0 ? Number(booking.adults || 0) : savedTotal;

  return [
    {
      key: "adults",
      label: "Adults",
      shortLabel: "Adult",
      count: adults,
      note: "12 years and above",
    },
    {
      key: "childrenWithBed",
      label: "Children with bed",
      shortLabel: "Child + bed",
      count: Number(booking.children_with_bed || 0),
      note: "2-11 years",
    },
    {
      key: "childrenWithoutBed",
      label: "Children without bed",
      shortLabel: "Child - no bed",
      count: Number(booking.children_without_bed || 0),
      note: "2-11 years",
    },
    {
      key: "infants",
      label: "Infants",
      shortLabel: "Infant",
      count: Number(booking.infants || 0),
      note: "Under 2 years",
    },
  ];
}

export function totalTravellersForBooking(booking: Booking): number {
  return travellerMix(booking).reduce((sum, item) => sum + item.count, 0);
}

export function travellerNames(booking: Booking): {
  names: string[];
  pendingCount: number;
} {
  const values = [booking.contact_name]
    .concat((booking.traveller_names || "").split(/[\n;]+/))
    .map((value) => value.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const names = values.filter((value) => {
    const key = value.toLocaleLowerCase("en-IN");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const total = totalTravellersForBooking(booking);
  return { names: names.slice(0, total), pendingCount: Math.max(0, total - names.length) };
}

export function roomSummary(booking: Booking): string {
  const rooms = booking.room_configuration || {
    singleRooms: 0,
    doubleRooms: 0,
    tripleRooms: 0,
  };
  const parts = [
    rooms.singleRooms
      ? `${rooms.singleRooms} single room${rooms.singleRooms === 1 ? "" : "s"}`
      : "",
    rooms.doubleRooms
      ? `${rooms.doubleRooms} double/twin room${rooms.doubleRooms === 1 ? "" : "s"}`
      : "",
    rooms.tripleRooms
      ? `${rooms.tripleRooms} triple room${rooms.tripleRooms === 1 ? "" : "s"}`
      : "",
  ].filter(Boolean);
  return parts.join(" + ") || "Rooming to be confirmed";
}

export function formatProposalDate(value?: string | null): string {
  if (!value) return "To be confirmed";
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T00:00:00`)
    : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function quotationValidUntil(quote: QuoteSnapshot): string {
  const generatedAt = new Date(quote.generatedAt);
  if (Number.isNaN(generatedAt.getTime())) return `${quote.validityDays} days from issue`;
  generatedAt.setDate(generatedAt.getDate() + quote.validityDays);
  return formatProposalDate(generatedAt.toISOString());
}

export function bookedByLabel(booking: Booking): string {
  if (!booking.booker_name) return "Self-booked by the lead traveller";
  return `${booking.booker_name}${booking.booker_relation ? ` (${booking.booker_relation})` : ""}`;
}
