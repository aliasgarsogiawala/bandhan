import type { TourPackage, TravelStyle } from "@/data/mockData";

export type CategoryTab = "all" | "domestic" | "international" | "north-east" | "group-tours";

export const PACKAGE_CATEGORIES = ["Domestic", "North East", "International", "Group Tours"] as const;

export const CATEGORY_TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All Packages" },
  { key: "north-east", label: "North East" },
  { key: "domestic", label: "Domestic Tours" },
  { key: "international", label: "International" },
  { key: "group-tours", label: "Group Tours" },
];

export type TravelStyleFilter = "all" | TravelStyle;

export const TRAVEL_STYLE_FILTERS: { key: TravelStyleFilter; label: string }[] = [
  { key: "all", label: "Every journey" },
  { key: "group", label: "Group tours" },
  { key: "customized", label: "Customizable" },
  { key: "seasonal", label: "Seasonal" },
  { key: "special-departure", label: "Special departures" },
];

const VALID_TABS: CategoryTab[] = ["north-east", "domestic", "international", "group-tours"];

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

const DESTINATION_PATTERNS: Array<[RegExp, string, "india" | "abroad"]> = [
  [/sikkim|darjeeling/i, "Sikkim & Darjeeling", "india"],
  [/3 sisters|4 sisters/i, "North East India", "india"],
  [/andaman/i, "Andaman", "india"],
  [/kerala|kanyakumari/i, "Kerala", "india"],
  [/rajasthan/i, "Rajasthan", "india"],
  [/karnataka/i, "Karnataka", "india"],
  [/south india|temple/i, "South India", "india"],
  [/ayodhya|varanasi/i, "Ayodhya & Varanasi", "india"],
  [/kashmir|vaishno/i, "Kashmir", "india"],
  [/singapore.*malaysia.*thailand/i, "Singapore, Malaysia & Thailand", "abroad"],
  [/singapore.*malaysia/i, "Singapore & Malaysia", "abroad"],
  [/thailand/i, "Thailand", "abroad"],
  [/vietnam/i, "Vietnam", "abroad"],
  [/bhutan/i, "Bhutan", "abroad"],
  [/bali/i, "Bali", "abroad"],
  [/sri\s*lanka/i, "Sri Lanka", "abroad"],
  [/swiss|paris/i, "France & Switzerland", "abroad"],
  [/austria/i, "Austria", "abroad"],
  [/italy/i, "Italy", "abroad"],
  [/london|edinburgh/i, "United Kingdom", "abroad"],
  [/germany/i, "Germany", "abroad"],
  [/turkish|turkey/i, "Turkey", "abroad"],
  [/south africa/i, "South Africa", "abroad"],
  [/japan/i, "Japan", "abroad"],
  [/scandinavia/i, "Scandinavia", "abroad"],
  [/georgia/i, "Georgia", "abroad"],
  [/azerbaijan/i, "Azerbaijan", "abroad"],
  [/almaty/i, "Kazakhstan", "abroad"],
  [/eastern europe/i, "Eastern Europe", "abroad"],
  [/grand tour of europe|best of europe/i, "Europe", "abroad"],
];

/** The admin field, unless an editor typed the list of stops there ("Katra, Srinagar, …"). */
function explicitDestination(pkg: TourPackage): string {
  const value = pkg.destination?.replace(/^[\s:;,.-]+/, "").trim() || "";
  return value.includes(",") ? "" : value;
}

export function packageDestinationLabel(pkg: TourPackage): string {
  return explicitDestination(pkg)
    || DESTINATION_PATTERNS.find(([pattern]) => pattern.test(pkg.title))?.[1]
    || pkg.title.split(/\s+[—–-]\s+/)[0]?.trim()
    || pkg.title;
}

/** India-only trips have no visa step, so visa details are hidden for them. */
export function isDomesticPackage(pkg: TourPackage): boolean {
  const slug = categorySlug(pkg.category);
  if (slug === "domestic" || slug === "north-east") return true;
  if (slug === "international") return false;
  // "Group Tours" holds both, so decide by where the trip actually goes.
  const place = `${pkg.title} ${pkg.destination || ""}`;
  const known = DESTINATION_PATTERNS.find(([pattern]) => pattern.test(place));
  if (known) return known[2] === "india";
  return !/\b(?:visa|passport)\b/i.test([...(pkg.inclusions || []), ...(pkg.exclusions || [])].join(" "));
}

export function packageTravelStyles(pkg: TourPackage): TravelStyle[] {
  const isGroupCategory = categorySlug(pkg.category) === "group-tours";
  if (Array.isArray(pkg.travelStyles)) {
    return [...new Set<TravelStyle>([...pkg.travelStyles, ...(isGroupCategory ? ["group" as const] : [])])];
  }
  const source = `${pkg.title} ${pkg.groupSize || ""} ${(pkg.themes || []).join(" ")}`;
  const styles = new Set<TravelStyle>();
  if (isGroupCategory) styles.add("group");
  if (/group|min\s*25|tour manager/i.test(source)) styles.add("group");
  if (/departure|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b.*\b20\d{2}\b/i.test(source)) {
    styles.add("special-departure");
  }
  if (pkg.bestTime && !/^year[- ]round$/i.test(pkg.bestTime.trim())) styles.add("seasonal");
  if (!styles.has("special-departure") || /2\+|custom|private/i.test(source)) styles.add("customized");
  return [...styles];
}

/** Bandhan runs every group tour as a 24-guest batch, whatever older records say. */
export const GROUP_TOUR_SIZE = "24 guests";

export function isGroupTour(pkg: TourPackage): boolean {
  return packageTravelStyles(pkg).includes("group");
}

export function packageGroupSize(pkg: TourPackage, fallback = "2+ guests"): string {
  return isGroupTour(pkg) ? GROUP_TOUR_SIZE : pkg.groupSize?.trim() || fallback;
}

export function matchesTravelStyle(pkg: TourPackage, style: TravelStyleFilter): boolean {
  return style === "all" || packageTravelStyles(pkg).includes(style);
}

export function parseTravelStyle(value: string | null): TravelStyleFilter {
  return TRAVEL_STYLE_FILTERS.some((item) => item.key === value)
    ? (value as TravelStyleFilter)
    : "all";
}

export function matchesPackageCategory(pkg: TourPackage, tab: CategoryTab): boolean {
  return tab === "group-tours"
    ? isGroupTour(pkg)
    : matchesCategory(pkg.category, tab);
}

/** Only classification fields change; itinerary, prices, photos and publish status stay intact. */
export function packageCategoryPatch(pkg: TourPackage, target: string, mode: "move" | "add-group") {
  const styles = packageTravelStyles(pkg);
  if (mode === "add-group") return { travelStyles: [...new Set<TravelStyle>([...styles, "group"])] };
  if (!(PACKAGE_CATEGORIES as readonly string[]).includes(target)) throw new Error("Choose a valid category.");
  return {
    category: target,
    travelStyles: target === "Group Tours"
      ? [...new Set<TravelStyle>([...styles, "group"])]
      : styles.filter((style) => style !== "group"),
  };
}

/** New published trips lead the homepage instead of being permanently below its six-card cutoff. */
export function homepagePackages(packages: TourPackage[], category: CategoryTab, limit = 6) {
  return packages.filter((pkg) => pkg.status !== "draft" && matchesPackageCategory(pkg, category))
    .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0))
    .slice(0, limit);
}
