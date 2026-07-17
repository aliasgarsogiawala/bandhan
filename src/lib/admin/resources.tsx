import React from "react";
import { Thumb } from "@/components/admin/ResourceManager";
import type {
  ResourceConfig,
  Destination,
  TourPackage,
  GroupDeparture,
  Testimonial,
  GalleryItem,
  WhyChooseItem,
} from "./types";

const truncate = (s: unknown, n = 60) => {
  const str = String(s ?? "");
  return str.length > n ? `${str.slice(0, n)}…` : str;
};

const badge = (text: string, cls: string) => (
  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${cls}`}>{text}</span>
);

export const destinationsResource: ResourceConfig<Destination> = {
  key: "destinations",
  title: "Destinations",
  singular: "Destination",
  description: "Popular destinations shown on the homepage.",
  searchKeys: ["name", "tag", "description"],
  columns: [
    { key: "image", label: "", render: (d) => <Thumb src={d.image} alt={d.name} /> },
    { key: "name", label: "Name", className: "font-semibold text-primary" },
    { key: "price", label: "Price" },
    { key: "tag", label: "Tag", render: (d) => (d.tag ? badge(d.tag, "bg-gold/20 text-gold-dark border-gold/30") : "—") },
    { key: "description", label: "Description", render: (d) => truncate(d.description) },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "e.g. Kashmir" },
    { name: "price", label: "Starting Price", type: "text", placeholder: "e.g. ₹34,500" },
    { name: "tag", label: "Tag", type: "text", placeholder: "e.g. Romantic" },
    { name: "image", label: "Image URL", type: "image", fullWidth: true, placeholder: "https://…" },
    { name: "description", label: "Description", type: "textarea", fullWidth: true },
  ],
  empty: { name: "", price: "", tag: "", image: "", description: "" },
};

export const packagesResource: ResourceConfig<TourPackage> = {
  key: "packages",
  title: "Packages",
  singular: "Package",
  description: "Featured tour packages and itineraries.",
  searchKeys: ["title", "category", "duration"],
  columns: [
    { key: "image", label: "", render: (p) => <Thumb src={p.image} alt={p.title} /> },
    { key: "title", label: "Title", className: "font-semibold text-primary" },
    { key: "category", label: "Category" },
    { key: "duration", label: "Duration" },
    { key: "price", label: "Price" },
    {
      key: "isPopular",
      label: "Popular",
      render: (p) => (p.isPopular ? badge("Popular", "bg-accent/10 text-accent-dark border-accent/20") : "—"),
    },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true, fullWidth: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        { value: "Domestic", label: "Domestic" },
        { value: "International", label: "International" },
        { value: "North East", label: "North East" },
      ],
    },
    { name: "duration", label: "Duration", type: "text", placeholder: "e.g. 6 Nights / 7 Days" },
    { name: "price", label: "Price", type: "text", placeholder: "e.g. ₹38,000" },
    { name: "isPopular", label: "Popular", type: "boolean", help: "Show a 'Popular' badge" },
    { name: "image", label: "Image URL", type: "image", fullWidth: true, placeholder: "https://…" },
    { name: "highlights", label: "Highlights", type: "tags", fullWidth: true, placeholder: "Dal Lake, Gulmarg, …" },
  ],
  empty: { title: "", category: "Domestic", duration: "", price: "", isPopular: false, image: "", highlights: [] },
};

const seatStatusOptions = [
  { value: "filling-fast", label: "Filling Fast" },
  { value: "limited-seats", label: "Limited Seats" },
  { value: "guaranteed", label: "Guaranteed" },
];

export const departuresResource: ResourceConfig<GroupDeparture> = {
  key: "departures",
  title: "Departures",
  singular: "Departure",
  description: "Upcoming group departure dates.",
  searchKeys: ["destination", "date", "status"],
  columns: [
    { key: "destination", label: "Destination", className: "font-semibold text-primary" },
    { key: "date", label: "Date" },
    { key: "duration", label: "Duration" },
    { key: "price", label: "Price" },
    { key: "seats", label: "Seats", render: (d) => `${d.seatsLeft}/${d.totalSeats}` },
    {
      key: "status",
      label: "Status",
      render: (d) =>
        badge(
          d.status.replace("-", " "),
          d.status === "guaranteed"
            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
            : d.status === "filling-fast"
            ? "bg-gold/20 text-gold-dark border-gold/30"
            : "bg-accent/10 text-accent-dark border-accent/20"
        ),
    },
  ],
  fields: [
    { name: "destination", label: "Destination / Title", type: "text", required: true, fullWidth: true },
    { name: "date", label: "Departure Date", type: "text", placeholder: "e.g. Aug 15, 2026" },
    { name: "duration", label: "Duration", type: "text", placeholder: "e.g. 7 Nights / 8 Days" },
    { name: "price", label: "Price", type: "text", placeholder: "e.g. ₹42,500" },
    { name: "seatsLeft", label: "Seats Left", type: "number" },
    { name: "totalSeats", label: "Total Seats", type: "number" },
    { name: "status", label: "Status", type: "select", options: seatStatusOptions },
  ],
  empty: { destination: "", date: "", duration: "", price: "", seatsLeft: 0, totalSeats: 0, status: "guaranteed" },
};

export const testimonialsResource: ResourceConfig<Testimonial> = {
  key: "testimonials",
  title: "Testimonials",
  singular: "Testimonial",
  description: "Customer reviews shown on the homepage.",
  searchKeys: ["name", "destination", "review"],
  columns: [
    { key: "photo", label: "", render: (t) => <Thumb src={t.photo} alt={t.name} /> },
    { key: "name", label: "Name", className: "font-semibold text-primary" },
    { key: "destination", label: "Trip" },
    { key: "rating", label: "Rating", render: (t) => "★".repeat(Math.max(0, Math.min(5, t.rating || 0))) },
    { key: "review", label: "Review", render: (t) => truncate(t.review, 50) },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "destination", label: "Trip / Destination", type: "text", placeholder: "e.g. Explored Sikkim" },
    {
      name: "rating",
      label: "Rating",
      type: "select",
      options: [5, 4, 3, 2, 1].map((n) => ({ value: String(n), label: `${n} Star${n > 1 ? "s" : ""}` })),
    },
    { name: "photo", label: "Photo URL", type: "image", fullWidth: true, placeholder: "https://…" },
    { name: "review", label: "Review", type: "textarea", fullWidth: true, required: true },
  ],
  empty: { name: "", destination: "", rating: 5, photo: "", review: "" },
};

export const galleryResource: ResourceConfig<GalleryItem> = {
  key: "gallery",
  title: "Gallery",
  singular: "Image",
  description: "Photos in the travel gallery.",
  searchKeys: ["title", "location"],
  columns: [
    { key: "image", label: "", render: (g) => <Thumb src={g.image} alt={g.title} /> },
    { key: "title", label: "Title", className: "font-semibold text-primary" },
    { key: "location", label: "Location" },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "location", label: "Location", type: "text", placeholder: "e.g. Kerala" },
    { name: "image", label: "Image URL", type: "image", fullWidth: true, placeholder: "https://…" },
  ],
  empty: { title: "", location: "", image: "" },
};

export const featuresResource: ResourceConfig<WhyChooseItem> = {
  key: "features",
  title: "Features",
  singular: "Feature",
  description: "The 'Why Choose Us' highlights.",
  searchKeys: ["title", "description", "stat"],
  columns: [
    { key: "title", label: "Title", className: "font-semibold text-primary" },
    { key: "stat", label: "Stat" },
    { key: "iconName", label: "Icon" },
    { key: "description", label: "Description", render: (f) => truncate(f.description) },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "stat", label: "Stat", type: "text", placeholder: "e.g. 15+ Years" },
    {
      name: "iconName",
      label: "Icon",
      type: "select",
      options: [
        { value: "experience", label: "Experience (globe)" },
        { value: "happy", label: "Happy (people)" },
        { value: "planning", label: "Planning (map)" },
        { value: "support", label: "Support (chat)" },
      ],
    },
    { name: "description", label: "Description", type: "textarea", fullWidth: true, required: true },
  ],
  empty: { title: "", stat: "", iconName: "experience", description: "" },
};
