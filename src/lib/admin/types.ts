import type {
  Destination,
  TourPackage,
  GalleryItem,
  WhyChooseItem,
  BlogPost,
} from "@/data/mockData";

export type {
  Destination,
  TourPackage,
  GalleryItem,
  WhyChooseItem,
  BlogPost,
};

export interface Testimonial {
  id: string;
  name: string;
  photo?: string;
  profileImage?: string;
  destination: string;
  city?: string;
  tour?: string;
  category?: "Family" | "Honeymoon" | "Group" | "Friends" | "Corporate" | "Solo";
  review: string;
  shortReview?: string;
  rating: number;
  tripImages?: string[];
  travelMonth?: string;
  isVerified?: boolean;
  tourManager?: string;
  language?: "English" | "Marathi" | "Hindi";
}

export interface Banner {
  id: string;
  title: string;
  highlightedTitle?: string;
  badge?: string;
  description?: string;
  image: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  link?: string;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelMonth?: string;
  guests?: string;
  subject?: string;
  message: string;
  source: "enquiry-modal" | "contact-page" | "mice-page";
  status: "new" | "contacted" | "closed";
  createdAt: string; // ISO timestamp
}

export type CollectionKey =
  | "destinations"
  | "packages"
  | "testimonials"
  | "gallery"
  | "features"
  | "blog"
  | "banners"
  | "announcements"
  | "enquiries";

/** A record stored in any collection always has a string id. */
export interface WithId {
  id: string;
}

// ---- Form/resource configuration types (drive the generic CRUD UI) ----

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "image"
  | "media"
  | "itinerary"
  | "faqs"
  | "guideExperiences"
  | "guideRoute"
  | "guideSeasons"
  | "select"
  | "tags"
  | "boolean";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  fullWidth?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  multiple?: boolean;
}

export interface ColumnConfig<T = WithId> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

export interface ResourceConfig<T = WithId> {
  key: Exclude<CollectionKey, "enquiries">;
  title: string;
  singular: string;
  description: string;
  searchKeys: string[];
  columns: ColumnConfig<T>[];
  fields: FieldConfig[];
  visibleFields?: string[];
  empty: Record<string, unknown>;
}
