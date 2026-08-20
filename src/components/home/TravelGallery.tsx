"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { Lightbox } from "@/components/ui/Lightbox";
import type { GalleryItem } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";

export const TravelGallery: React.FC = () => {
  const { items: galleryImages } = useCollection<GalleryItem>("gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const slides = galleryImages.map((item) => ({
    image: item.image,
    title: item.title,
    caption: item.location,
  }));

  return (
    <section className="relative z-10 bg-white py-16 sm:py-24">
      <Container>
        <div className="mb-10 max-w-2xl">
          <SectionTitle
            align="left"
            badge="From the road"
            title="A glimpse of the journey"
            description="Real places, small moments, and the views that stay with you after the trip ends."
          />
        </div>

        <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {galleryImages.map((item, idx) => (
            <StaggerItem key={item.id} as="div">
              <button
                type="button"
                onClick={() => setOpenIndex(idx)}
                aria-label={`View ${item.title} in ${item.location}, enlarged`}
                className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-lg bg-sand focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />

                <div className="absolute inset-0 bg-ink-deep/35 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100" />

                {/* Zoom affordance — signals the tile opens rather than links. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-3 hidden h-9 w-9 items-center justify-center rounded-md bg-white text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex"
                >
                  <Expand size={17} />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3 text-left opacity-100 transition-opacity duration-300 sm:p-5 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                    {item.location}
                  </span>
                  <h3 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-tight text-white sm:text-lg">
                    {item.title}
                  </h3>
                </div>
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>

      <Lightbox
        slides={slides}
        index={openIndex}
        onClose={() => setOpenIndex(null)}
        onNavigate={setOpenIndex}
      />
    </section>
  );
};

export default TravelGallery;
