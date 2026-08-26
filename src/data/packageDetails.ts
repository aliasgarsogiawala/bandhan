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
import { packageDestinationLabel } from "@/lib/packageCategory";
import { padGallery, placeholderImage } from "@/lib/placeholderImages";

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

function serviceDetailsFromInclusions(
  inclusions: string[],
  itinerary: ItineraryDay[] = [],
  groupSize = "2+ guests"
): PackageServiceDetails[] {
  const stays = [...new Set(itinerary.map((day) => day.stay?.trim()).filter((stay): stay is string => Boolean(stay && stay !== "—")))];
  return (Object.keys(serviceKeywords) as PackageServiceKey[]).map((kind) => {
    const items = inclusions.filter((item) => serviceKeywords[kind].test(item));
    if (kind === "hotel" && stays.length) {
      return {
        kind,
        items: [
          ...items,
          `Planned overnight route: ${stays.join(" · ")}.`,
          "Exact hotel names, room category and check-in details are confirmed on the final voucher.",
        ],
      };
    }
    if (kind === "transfer" && !items.length) {
      return { kind, items: [`Transfers are planned for ${groupSize}; vehicle type is confirmed with the final party size.`] };
    }
    return { kind, items: items.length ? items : [serviceFallbacks[kind]] };
  });
}

function defaultFaqs(pkg: TourPackage): PackageFaq[] {
  const destination = packageDestinationLabel(pkg);
  const includedSummary = (pkg.inclusions || []).slice(0, 3).join(", ");
  const stayNames = [...new Set((pkg.itinerary || []).map((day) => day.stay?.trim()).filter((stay): stay is string => Boolean(stay && stay !== "—")))];
  return [
    {
      question: `What is included in the ${destination} package price?`,
      answer: includedSummary
        ? `The published starting price covers the core itinerary services, including ${includedSummary}. The final quotation shows every traveller-wise charge, tax and optional upgrade before you confirm.`
        : "The final quotation lists accommodation, transfers, sightseeing, meals, taxes and optional upgrades separately, so you can review the complete cost before confirming.",
    },
    {
      question: "Which hotels and room categories are used?",
      answer: stayNames.length
        ? `The planned overnight route includes ${stayNames.join(", ")}. Hotel names, star category, room type and meal plan are verified against your dates and printed on the final itinerary and voucher.`
        : "Hotels are selected after checking your dates, preferred category and room configuration. Exact names, room type and meal plan are printed on the final itinerary and voucher.",
    },
    {
      question: "Can this itinerary be customized?",
      answer: `Yes. The ${pkg.duration} plan can be adjusted for your dates, pace, hotel category, departure city, room mix and special requirements before the quotation is approved.`,
    },
    {
      question: `When is the best time to visit ${destination}?`,
      answer: `${pkg.bestTime || "This journey operates through most of the year"}. Weather, local closures and live availability are rechecked for your selected travel dates.`,
    },
    {
      question: "How do booking, payment and cancellation work?",
      answer: "Submit the booking request with traveller details, then a Bandhan travel consultant verifies availability and issues the final quotation. Payment milestones and the applicable cancellation terms are shared before you approve the booking.",
    },
  ];
}

export const getFullPackage = (id: string): FullPackage | undefined => {
  const base = featuredPackages.find((pkg) => pkg.id === id);
  return base ? getFullPackageForPackage(base) : undefined;
};

/**
 * Converts the compact package card model into the complete itinerary model.
 * Document-backed catalogue entries and admin-created packages carry their
 * complete detail fields directly.
 */
export const getFullPackageForPackage = (pkg: TourPackage): FullPackage => {
  return {
    ...pkg,
    tagline: pkg.tagline ?? `${pkg.title} — thoughtfully planned by Bandhan Tours.`,
    overview: pkg.overview ?? "",
    heroImage: pkg.heroImage || pkg.image || placeholderImage(pkg.id),
    // Most catalogue entries ship one or two photographs. The gallery grid
    // lays its first tile out 2x2 in a 3-column track, so anything that isn't
    // a multiple of three leaves a visible hole — pad with stand-ins.
    gallery: padGallery(
      pkg.gallery?.length ? pkg.gallery : [{ image: pkg.image || placeholderImage(pkg.id), caption: pkg.title }],
      pkg.id
    ),
    itinerary: pkg.itinerary?.length ? pkg.itinerary : [],
    inclusions: pkg.inclusions?.length ? pkg.inclusions : [],
    exclusions: pkg.exclusions?.length ? pkg.exclusions : [],
    serviceDetails: pkg.serviceDetails?.length ? pkg.serviceDetails : serviceDetailsFromInclusions(pkg.inclusions ?? [], pkg.itinerary ?? [], pkg.groupSize),
    bestTime: pkg.bestTime ?? "Year-round",
    startingPoint: pkg.startingPoint ?? "To be confirmed",
    groupSize: pkg.groupSize ?? "2+ guests",
    themes: pkg.themes ?? [],
    faqs: pkg.faqs?.length ? pkg.faqs : defaultFaqs(pkg),
  };
};

/** Makes a destination record render through the same full itinerary page. */
export const getFullPackageForDestination = (destination: Destination): FullPackage => {
  const image = destination.image || placeholderImage(destination.id);
  const gallery = padGallery(
    destination.gallery?.length
      ? destination.gallery.map((galleryImage, index) => ({ image: galleryImage, caption: `${destination.name} — view ${index + 1}` }))
      : [{ image, caption: destination.name }],
    destination.id
  );
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
    serviceDetails: serviceDetailsFromInclusions(destination.inclusions || [], itinerary, destination.groupSize),
    bestTime: destination.bestTime || "Year-round",
    startingPoint: destination.startingPoint || "To be confirmed",
    groupSize: destination.groupSize || "2+ guests",
    themes: destination.themes?.length ? destination.themes : [destination.tag, destination.region].filter(Boolean) as string[],
    faqs: destination.faqs?.length
      ? destination.faqs
      : defaultFaqs({
          id: `destination-${destination.id}`,
          title: destination.name,
          destination: destination.name,
          image,
          duration: destination.duration || "Custom trip",
          price: destination.price || "Enquire",
          highlights: destination.highlights || [],
          category: destination.country === "International" ? "International" : "Domestic",
          bestTime: destination.bestTime,
          itinerary,
          inclusions: destination.inclusions,
        }),
  };
};

export const getAllPackageIds = (): string[] =>
  featuredPackages.map((pkg) => pkg.id);

export const getRelatedPackages = (id: string, count = 3): TourPackage[] =>
  featuredPackages.filter((pkg) => pkg.id !== id).slice(0, count);
