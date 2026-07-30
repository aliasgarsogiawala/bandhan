import type { Metadata } from "next";
import DestinationsPageClient from "@/components/destinations/DestinationsPageClient";

export const metadata: Metadata = {
  title: "Popular Destinations | Bandhan Tours",
  description: "Explore all domestic and international destinations available with Bandhan Tours.",
};

export default function DestinationsPage() {
  return <DestinationsPageClient />;
}
