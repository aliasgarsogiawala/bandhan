import type { Destination, TourPackage } from "@/data/mockData";
import { normalizeSearchText } from "@/lib/fuzzySearch";
import { packageDestinationLabel } from "@/lib/packageCategory";

export interface PlaceSuggestion {
  label: string;
  kind: "destination" | "city";
}

const NOT_A_PLACE = /^(?:n\/?a|not applicable|tba|to be confirmed|onboard\b.*)$/i;
// Itinerary "stay" text describes lodging as well as the town: "Katra Hotel",
// "Deluxe Houseboat, Srinagar", "Ha Long Bay cruise", "Tuscany region".
const LODGING_WORDS = /\b(?:deluxe\s+)?(?:hotel|houseboat|cruise|area|region|railway station|(?:international\s+)?airport|heathrow|gatwick|cdg|charles de gaulle)\b/gi;

function cleanPlace(raw: string): string {
  const value = raw
    .replace(/\(.*?\)/g, " ")
    .replace(LODGING_WORDS, " ")
    .replace(/\s+/g, " ")
    .replace(/^[\s:.\-–—]+|[\s:.\-–—]+$/g, "");
  return value.length >= 3 && !NOT_A_PLACE.test(value) ? value : "";
}

function placesIn(text: string | undefined): string[] {
  return (text || "").split(/[/,|;]+/).map(cleanPlace).filter(Boolean);
}

/** "Narita International Airport, Tokyo" names the city last. */
function startingCity(text: string | undefined): string[] {
  const parts = (text || "").split(",");
  return parts.length > 1 ? placesIn(parts[parts.length - 1]) : placesIn(text);
}

/** Destinations and the cities their published trips visit, de-duplicated. */
export function buildPlaceIndex(packages: TourPackage[], destinations: Destination[]): PlaceSuggestion[] {
  const seen = new Set<string>();
  const index: PlaceSuggestion[] = [];
  const add = (label: string, kind: PlaceSuggestion["kind"]) => {
    const key = normalizeSearchText(label);
    if (!key || seen.has(key)) return;
    seen.add(key);
    index.push({ label, kind });
  };

  const livePackages = packages.filter((pkg) => pkg.status !== "draft");
  destinations.filter((item) => item.status !== "draft").forEach((item) => add(item.name.trim(), "destination"));
  livePackages.forEach((pkg) => add(packageDestinationLabel(pkg), "destination"));
  livePackages.forEach((pkg) => {
    (pkg.itinerary || []).forEach((day) => placesIn(day.stay).forEach((city) => add(city, "city")));
    startingCity(pkg.startingPoint).forEach((city) => add(city, "city"));
    // Some editors list the stops in the destination field instead.
    if (pkg.destination?.includes(",")) placesIn(pkg.destination).forEach((city) => add(city, "city"));
  });
  return index;
}

/** Places whose name, or any word in it, starts with what was typed: "m" -> Madurai, Milan, Munnar. */
export function matchPlaces(index: PlaceSuggestion[], query: string, limit = { destination: 6, city: 10 }) {
  const typed = normalizeSearchText(query);
  if (!typed) return { destinations: [], cities: [] };
  const compactTyped = typed.replace(/ /g, "");
  const scored = index
    .map((place) => {
      const name = normalizeSearchText(place.label);
      if (name.replace(/ /g, "").startsWith(compactTyped)) return { place, rank: 0 };
      return name.split(" ").some((word) => word.startsWith(typed)) ? { place, rank: 1 } : null;
    })
    .filter((entry): entry is { place: PlaceSuggestion; rank: number } => Boolean(entry))
    .sort((a, b) => a.rank - b.rank || a.place.label.localeCompare(b.place.label));
  const pick = (kind: PlaceSuggestion["kind"]) =>
    scored.filter((entry) => entry.place.kind === kind).slice(0, limit[kind]).map((entry) => entry.place);
  return { destinations: pick("destination"), cities: pick("city") };
}
