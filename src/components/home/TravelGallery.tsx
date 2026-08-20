"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
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
        <Stagger
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6"
          stagger={0.06}
        >
          {galleryImages.map((item, idx) => (
            <StaggerItem key={item.id} as="div" y={26} className={idx % 5 === 0 ? "sm:row-span-2" : ""}>
              <div
                className={`group relative h-full w-full overflow-hidden rounded-[1.25rem] ring-1 ring-white/10 shadow-lifted transition-all duration-500 hover:ring-gold/30 ${aspectClasses[idx % aspectClasses.length]}`}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-ink-deep/55 opacity-100 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100" />
                <div className="absolute inset-x-0 bottom-0 translate-y-0 p-3 opacity-100 transition-all duration-500 sm:translate-y-2 sm:p-5 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                    {item.location}
                  </span>
                  <h4 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-tight text-white sm:text-xl">{item.title}</h4>
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
};

export default TravelGallery;
