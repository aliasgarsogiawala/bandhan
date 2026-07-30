import {
  featuredPackages,
  type Destination,
  type ItineraryDay,
  type PackageFaq,
  type PackageGalleryImage,
  type PackageServiceDetails,
  type PackageServiceKey,
  type TourPackage,
} from "./mockData";

export type { ItineraryDay, PackageFaq, PackageServiceDetails, PackageServiceKey } from "./mockData";

export type GalleryImage = PackageGalleryImage;

export interface PackageDetail {
  id: string;
  tagline: string;
  overview: string;
  heroImage: string;
  gallery: GalleryImage[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  serviceDetails: PackageServiceDetails[];
  bestTime: string;
  startingPoint: string;
  groupSize: string;
  themes: string[];
  faqs: PackageFaq[];
}

export type FullPackage = TourPackage & PackageDetail;

const serviceKeywords: Record<PackageServiceKey, RegExp> = {
  hotel: /hotel|accommodation|stay|room|resort/i,
  meals: /meal|breakfast|lunch|dinner|food|restaurant/i,
  flights: /flight|airfare|air ticket|airport/i,
  sightseeing: /sightseeing|tour|entry|activity|water sports|safari|temple|guide/i,
  transfer: /transfer|transport|vehicle|coach|pickup|drop|speedboat/i,
  visa: /visa|insurance|permit/i,
};

const serviceFallbacks: Record<PackageServiceKey, string> = {
  hotel: "Accommodation is arranged as per the confirmed itinerary.",
  meals: "Meal plan follows the day-by-day itinerary.",
  flights: "Flight arrangements can be added on request.",
  sightseeing: "Sightseeing follows the confirmed itinerary.",
  transfer: "Airport and route transfers are arranged as per the itinerary.",
  visa: "Visa and travel-document support is available on request.",
};

function serviceDetailsFromInclusions(inclusions: string[]): PackageServiceDetails[] {
  return (Object.keys(serviceKeywords) as PackageServiceKey[]).map((kind) => {
    const items = inclusions.filter((item) => serviceKeywords[kind].test(item));
    return { kind, items: items.length ? items : [serviceFallbacks[kind]] };
  });
}

const details: Record<string, PackageDetail> = {};

export const getFullPackage = (id: string): FullPackage | undefined => {
  const base = featuredPackages.find((pkg) => pkg.id === id);
  return base ? getFullPackageForPackage(base) : undefined;
};

/**
 * Converts the compact package card model into the complete itinerary model.
 * Existing seeded packages use the editorial detail data below; packages
 * created in the admin panel carry their own detail fields.
 */
export const getFullPackageForPackage = (pkg: TourPackage): FullPackage => {
  const detail = details[pkg.id];
  return {
    ...pkg,
    tagline: pkg.tagline ?? detail?.tagline ?? `${pkg.title} — thoughtfully planned by Bandhan Tours.`,
    overview: pkg.overview ?? detail?.overview ?? "",
    heroImage: pkg.heroImage ?? pkg.image ?? detail?.heroImage ?? "",
    gallery: pkg.gallery?.length ? pkg.gallery : detail?.gallery ?? [{ image: pkg.image, caption: pkg.title }],
    itinerary: pkg.itinerary?.length ? pkg.itinerary : detail?.itinerary ?? [],
    inclusions: pkg.inclusions?.length ? pkg.inclusions : detail?.inclusions ?? [],
    exclusions: pkg.exclusions?.length ? pkg.exclusions : detail?.exclusions ?? [],
    serviceDetails: pkg.serviceDetails?.length ? pkg.serviceDetails : serviceDetailsFromInclusions(pkg.inclusions?.length ? pkg.inclusions : detail?.inclusions ?? []),
    bestTime: pkg.bestTime ?? detail?.bestTime ?? "Year-round",
    startingPoint: pkg.startingPoint ?? detail?.startingPoint ?? "To be confirmed",
    groupSize: pkg.groupSize ?? detail?.groupSize ?? "2+ guests",
    themes: pkg.themes?.length ? pkg.themes : detail?.themes ?? [],
    faqs: pkg.faqs?.length ? pkg.faqs : detail?.faqs ?? [],
  };
};

/** Makes a destination record render through the same full itinerary page. */
export const getFullPackageForDestination = (destination: Destination): FullPackage => {
  const image = destination.image || "/logo.svg";
  const gallery = destination.gallery?.length
    ? destination.gallery.map((galleryImage, index) => ({ image: galleryImage, caption: `${destination.name} — view ${index + 1}` }))
    : [{ image, caption: destination.name }];
  const itinerary = destination.itinerary?.length
    ? destination.itinerary
    : [{ day: 1, title: `Discover ${destination.name}`, description: destination.overview || destination.description, meals: "To be confirmed", stay: destination.name }];

  return {
    id: `destination-${destination.id}`,
    title: destination.name,
    image,
    duration: destination.duration || "Custom trip",
    price: destination.price || "Enquire",
    highlights: destination.highlights || [],
    category: destination.country === "International" ? "International" : "Domestic",
    isPopular: destination.isFeatured,
    tagline: destination.tagline || destination.description,
    overview: destination.overview || destination.description,
    heroImage: image,
    gallery,
    itinerary,
    inclusions: destination.inclusions || [],
    exclusions: destination.exclusions || [],
    serviceDetails: serviceDetailsFromInclusions(destination.inclusions || []),
    bestTime: destination.bestTime || "Year-round",
    startingPoint: destination.startingPoint || "To be confirmed",
    groupSize: destination.groupSize || "2+ guests",
    themes: destination.themes?.length ? destination.themes : [destination.tag, destination.region].filter(Boolean) as string[],
    faqs: destination.faqs || [],
  };
};

export const getAllPackageIds = (): string[] =>
  featuredPackages.filter((pkg) => details[pkg.id]).map((pkg) => pkg.id);

export const getRelatedPackages = (id: string, count = 3): TourPackage[] =>
  featuredPackages.filter((pkg) => pkg.id !== id).slice(0, count);
