import type { TourPackage, TravelStyle } from "@/data/mockData";

export type CategoryTab = "all" | "domestic" | "international" | "north-east";

export const CATEGORY_TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All Packages" },
  { key: "north-east", label: "North East" },
  { key: "domestic", label: "Domestic Tours" },
  { key: "international", label: "International" },
];

export type TravelStyleFilter = "all" | TravelStyle;

export const TRAVEL_STYLE_FILTERS: { key: TravelStyleFilter; label: string }[] = [
  { key: "all", label: "Every journey" },
  { key: "group", label: "Group tours" },
  { key: "customized", label: "Customizable" },
  { key: "seasonal", label: "Seasonal" },
  { key: "special-departure", label: "Special departures" },
];

const VALID_TABS: CategoryTab[] = ["north-east", "domestic", "international"];

/** "North East" -> "north-east", so free-text category strings compare cleanly against tab keys. */
export function categorySlug(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

export function matchesCategory(pkgCategory: string, tab: CategoryTab): boolean {
  return tab === "all" || categorySlug(pkgCategory) === tab;
}

export function parseCategoryParam(value: string | null): CategoryTab {
  if (!value) return "all";
  // Tolerate the legacy "northeast" spelling still present in old links.
  const normalised = categorySlug(value.replace(/^northeast$/i, "north east"));
  return VALID_TABS.includes(normalised as CategoryTab) ? (normalised as CategoryTab) : "all";
}

const DESTINATION_PATTERNS: Array<[RegExp, string]> = [
  [/sikkim|darjeeling/i, "Sikkim & Darjeeling"],
  [/3 sisters|4 sisters/i, "North East India"],
  [/andaman/i, "Andaman"],
  [/kerala|kanyakumari/i, "Kerala"],
  [/rajasthan/i, "Rajasthan"],
  [/karnataka/i, "Karnataka"],
  [/south india|temple/i, "South India"],
  [/ayodhya|varanasi/i, "Ayodhya & Varanasi"],
  [/singapore.*malaysia.*thailand/i, "Singapore, Malaysia & Thailand"],
  [/singapore.*malaysia/i, "Singapore & Malaysia"],
  [/thailand/i, "Thailand"],
  [/vietnam/i, "Vietnam"],
  [/bhutan/i, "Bhutan"],
  [/bali/i, "Bali"],
  [/swiss|paris/i, "France & Switzerland"],
  [/austria/i, "Austria"],
  [/italy/i, "Italy"],
  [/london|edinburgh/i, "United Kingdom"],
  [/germany/i, "Germany"],
  [/turkish|turkey/i, "Turkey"],
  [/south africa/i, "South Africa"],
  [/japan/i, "Japan"],
  [/scandinavia/i, "Scandinavia"],
  [/georgia/i, "Georgia"],
  [/azerbaijan/i, "Azerbaijan"],
  [/almaty/i, "Kazakhstan"],
  [/eastern europe/i, "Eastern Europe"],
  [/grand tour of europe|best of europe/i, "Europe"],
];

export function packageDestinationLabel(pkg: TourPackage): string {
  if (pkg.destination?.trim()) return pkg.destination.trim();
  return DESTINATION_PATTERNS.find(([pattern]) => pattern.test(pkg.title))?.[1]
    || pkg.title.split(/\s+[—–-]\s+/)[0]?.trim()
    || pkg.title;
}

export function packageTravelStyles(pkg: TourPackage): TravelStyle[] {
  if (pkg.travelStyles?.length) return pkg.travelStyles;
  const source = `${pkg.title} ${pkg.groupSize || ""} ${(pkg.themes || []).join(" ")}`;
  const styles = new Set<TravelStyle>();
  if (/group|min\s*25|tour manager/i.test(source)) styles.add("group");
  if (/departure|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b.*\b20\d{2}\b/i.test(source)) {
    styles.add("special-departure");
  }
  if (pkg.bestTime && !/^year[- ]round$/i.test(pkg.bestTime.trim())) styles.add("seasonal");
  if (!styles.has("special-departure") || /2\+|custom|private/i.test(source)) styles.add("customized");
  return [...styles];
}

export function matchesTravelStyle(pkg: TourPackage, style: TravelStyleFilter): boolean {
  return style === "all" || packageTravelStyles(pkg).includes(style);
}

export function parseTravelStyle(value: string | null): TravelStyleFilter {
  return TRAVEL_STYLE_FILTERS.some((item) => item.key === value)
    ? (value as TravelStyleFilter)
    : "all";
}
