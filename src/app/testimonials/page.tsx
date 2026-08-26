import React from "react";
import type { Metadata } from "next";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";
import PageShell from "@/components/ui/PageShell";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Guest Testimonials & Reviews | Bandhan Tours",
  description:
    "Read authentic guest reviews and travel stories from thousands of happy travellers who explored Kashmir, Sikkim, Kerala, Rajasthan, Scandinavia, Dubai, Thailand, and Singapore with Bandhan Tours.",
};

export default function TestimonialsPage() {
  return (
    <PageShell tone="ink">
      <PageHero
        align="center"
        priority
        eyebrow="Authentic guest feedback"
        title="Traveller stories & reviews"
        description="Discover why thousands of couples, families, and solo travellers trust Bandhan Tours to craft their dream vacations."
        image="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=90&w=3200"
        imageAlt=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
      />

      <TestimonialsSection />
    </PageShell>
  );
}
