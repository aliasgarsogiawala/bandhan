import {
  blogPosts,
  destinations,
  featuredPackages,
  galleryImages,
  whyChooseUs,
} from "@/data/mockData";
import { testimonialData } from "@/data/testimonialData";
import type { Banner, CollectionKey, WithId } from "@/lib/admin/types";

const defaultBanners: Banner[] = [
  {
    id: "homepage-primary",
    title: "Explore Beyond",
    highlightedTitle: "Boundaries",
    badge: "Where Colours Come Alive",
    description:
      "Thoughtfully designed holidays, seamless planning, and journeys that stay with you.",
    image:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=90&w=3200",
    primaryLabel: "Explore Tours",
    secondaryLabel: "Plan My Trip",
    isActive: true,
  },
];

export const contentSeeds: Record<CollectionKey, WithId[]> = {
  destinations,
  packages: featuredPackages,
  testimonials: testimonialData.map((item) => ({
    ...item,
    photo: item.profileImage,
  })),
  gallery: galleryImages,
  features: whyChooseUs,
  blog: blogPosts,
  banners: defaultBanners,
  announcements: [],
  enquiries: [],
};

export function seedForCollection<T extends WithId = WithId>(key: CollectionKey): T[] {
  return contentSeeds[key] as T[];
}
