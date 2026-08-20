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

// Varied aspect ratios give the grid a natural masonry rhythm
// while keeping next/image dimensions explicit (no CLS).
const aspectClasses = [
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[5/6]",
  "aspect-square",
  "aspect-[4/5]",
  "aspect-[5/6]",
  "aspect-square",
  "aspect-[4/5]",
];

export const TravelGallery: React.FC = () => {
  const { items: galleryImages } = useCollection<GalleryItem>("gallery");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const slides = galleryImages.map((item) => ({
    image: item.image,
    title: item.title,
    caption: item.location,
  }));

  return (
    <section className="surface-grain edge-hairline-top relative z-10 overflow-hidden bg-ink-deep py-20 sm:py-28">
      <Container className="relative">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <SectionTitle
            align="center"
            badge="Visual Inspiration"
            title="Our Travel Gallery"
            description="Moments captured by our travelers across scenic mountains, tranquil beaches, and historical monuments."
            tone="dark"
          />
        </div>

        {/* Masonry-style grid */}
        <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {galleryImages.map((item, idx) => (
            <StaggerItem key={item.id} as="div" className={idx % 5 === 0 ? "sm:row-span-2" : ""}>
              {/* A real button, so the tile is reachable by keyboard and
                  announces itself as opening a viewer rather than navigating. */}
              <button
                type="button"
                onClick={() => setOpenIndex(idx)}
                aria-label={`View ${item.title} in ${item.location}, enlarged`}
                className={`group relative block h-full w-full cursor-zoom-in overflow-hidden rounded-[1.25rem] ring-1 ring-white/10 shadow-lifted transition duration-300 hover:ring-2 hover:ring-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${aspectClasses[idx % aspectClasses.length]}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                />

                {/* Flat scrim: always on below sm so captions stay legible on
                    touch, revealed on hover on pointer devices. */}
                <div className="absolute inset-0 bg-ink-deep/55 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100" />

                {/* Zoom affordance — signals the tile opens rather than links. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-3 hidden h-10 w-10 items-center justify-center rounded-full bg-gold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex"
                >
                  <Expand size={17} />
                </span>

                <div className="absolute inset-x-0 bottom-0 p-3 text-left opacity-100 transition-all duration-300 sm:translate-y-2 sm:p-5 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                    {item.location}
                  </span>
                  <h4 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-tight text-white sm:text-xl">
                    {item.title}
                  </h4>
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
