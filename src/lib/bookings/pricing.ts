import type {
  Destination,
  PackageAddon,
  PackagePricing,
  TourPackage,
} from "@/data/mockData";

export type BookingSource = "package" | "destination" | "custom";

export interface TravellerBreakdown {
  adults: number;
  childrenWithBed: number;
  childrenWithoutBed: number;
  infants: number;
}

export interface RoomConfiguration {
  singleRooms: number;
  doubleRooms: number;
  tripleRooms: number;
}

export interface SelectedAddon {
  id: string;
  title: string;
  quantity: number;
  unitPrice: number;
  pricing: PackageAddon["pricing"];
}

export interface QuoteLineItem {
  key: string;
  label: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface QuoteSnapshot {
  currency: "INR";
  lineItems: QuoteLineItem[];
  subtotal: number;
  total: number;
  depositPercent: number;
  depositAmount: number;
  balanceAmount: number;
  validityDays: number;
  generatedAt: string;
  isIndicative: boolean;
}

export interface BookingPackageSnapshot {
  source: BookingSource;
  id?: string;
  title: string;
  destination: string;
  category?: string;
  duration?: string;
  tagline?: string;
  overview?: string;
  heroImage?: string;
  bestTime?: string;
  startingPoint?: string;
  groupSize?: string;
  themes?: string[];
  highlights?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
    meals: string;
    stay?: string;
  }>;
  inclusions?: string[];
  exclusions?: string[];
  gallery?: Array<{ image: string; caption: string }>;
}

const DEFAULT_ADDONS: PackageAddon[] = [
  {
    id: "private-airport-transfer",
    title: "Private airport transfer",
    description: "Dedicated arrival and departure transfer for your travelling party.",
    price: 2500,
    pricing: "per-booking",
  },
  {
    id: "travel-insurance-support",
    title: "Travel insurance support",
    description: "Policy assistance and documentation support for each traveller.",
    price: 1500,
    pricing: "per-person",
  },
  {
    id: "premium-room-upgrade",
    title: "Premium room upgrade",
    description: "Upgrade from the standard room category, subject to hotel availability.",
    price: 4500,
    pricing: "per-person",
  },
];

export function parseMoney(value?: string | number | null): number {
  if (typeof value === "number") return Number.isFinite(value) ? Math.max(0, value) : 0;
  if (!value) return 0;
  const numeric = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(numeric) ? Math.max(0, numeric) : 0;
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function pricingForStartingPrice(
  startingPrice: string | number | undefined,
  configured?: Partial<PackagePricing>
): PackagePricing {
  const adultPrice = configured?.adultPrice || parseMoney(startingPrice) || 25000;
  return {
    adultPrice,
    childWithBedPrice: configured?.childWithBedPrice || Math.round(adultPrice * 0.75),
    childWithoutBedPrice: configured?.childWithoutBedPrice || Math.round(adultPrice * 0.5),
    infantPrice: configured?.infantPrice || Math.round(adultPrice * 0.1),
    singleRoomSupplement: configured?.singleRoomSupplement || Math.round(adultPrice * 0.25),
    depositPercent: configured?.depositPercent || 25,
    quoteValidityDays: configured?.quoteValidityDays || 7,
    addons: configured?.addons?.length ? configured.addons : DEFAULT_ADDONS,
  };
}

export function calculateQuote(input: {
  travellers: TravellerBreakdown;
  rooms: RoomConfiguration;
  pricing: PackagePricing;
  addons: SelectedAddon[];
  indicative?: boolean;
}): QuoteSnapshot {
  const { travellers, rooms, pricing, addons } = input;
  const lines: QuoteLineItem[] = [];
  const addLine = (key: string, label: string, quantity: number, unitPrice: number) => {
    if (quantity <= 0 || unitPrice < 0) return;
    lines.push({ key, label, quantity, unitPrice, amount: quantity * unitPrice });
  };

  addLine("adults", "Adult package", travellers.adults, pricing.adultPrice);
  addLine(
    "children-with-bed",
    "Child package - with bed",
    travellers.childrenWithBed,
    pricing.childWithBedPrice
  );
  addLine(
    "children-without-bed",
    "Child package - without bed",
    travellers.childrenWithoutBed,
    pricing.childWithoutBedPrice
  );
  addLine("infants", "Infant package", travellers.infants, pricing.infantPrice);
  addLine(
    "single-room-supplement",
    "Single room supplement",
    rooms.singleRooms,
    pricing.singleRoomSupplement
  );
  for (const addon of addons) {
    addLine(`addon-${addon.id}`, addon.title, addon.quantity, addon.unitPrice);
  }

  const subtotal = lines.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal;
  const depositPercent = Math.min(100, Math.max(0, pricing.depositPercent));
  const depositAmount = Math.round((total * depositPercent) / 100);

  return {
    currency: "INR",
    lineItems: lines,
    subtotal,
    total,
    depositPercent,
    depositAmount,
    balanceAmount: Math.max(0, total - depositAmount),
    validityDays: pricing.quoteValidityDays,
    generatedAt: new Date().toISOString(),
    isIndicative: input.indicative ?? true,
  };
}

export function totalTravellers(travellers: TravellerBreakdown): number {
  return (
    travellers.adults +
    travellers.childrenWithBed +
    travellers.childrenWithoutBed +
    travellers.infants
  );
}

export function packageSnapshot(pkg: TourPackage): BookingPackageSnapshot {
  return {
    source: "package",
    id: pkg.id,
    title: pkg.title,
    destination: pkg.title,
    category: pkg.category,
    duration: pkg.duration,
    tagline: pkg.tagline,
    overview: pkg.overview,
    heroImage: pkg.heroImage || pkg.image,
    bestTime: pkg.bestTime,
    startingPoint: pkg.startingPoint,
    groupSize: pkg.groupSize,
    themes: pkg.themes,
    highlights: pkg.highlights,
    itinerary: pkg.itinerary,
    inclusions: pkg.inclusions,
    exclusions: pkg.exclusions,
    gallery: pkg.gallery,
  };
}

export function destinationSnapshot(destination: Destination): BookingPackageSnapshot {
  return {
    source: "destination",
    id: destination.id,
    title: `${destination.name} Custom Holiday`,
    destination: destination.name,
    category: destination.country,
    duration: destination.duration || "Custom duration",
    tagline: destination.tagline || destination.description,
    overview: destination.overview || destination.description,
    heroImage: destination.image,
    bestTime: destination.bestTime,
    startingPoint: destination.startingPoint,
    groupSize: destination.groupSize,
    themes: destination.themes || [destination.tag || "", destination.region || ""].filter(Boolean),
    highlights: destination.highlights,
    itinerary: destination.itinerary,
    inclusions: destination.inclusions,
    exclusions: destination.exclusions,
    gallery: destination.gallery?.map((image, index) => ({
      image,
      caption: `${destination.name} - view ${index + 1}`,
    })),
  };
}
