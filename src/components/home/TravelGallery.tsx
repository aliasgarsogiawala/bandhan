"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { galleryImages } from "@/data/mockData";

export const TravelGallery: React.FC = () => {
  return (
    <section className="py-24 bg-white relative z-10">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <SectionTitle
            align="center"
            badge="Visual Inspiration"
            title="Our Travel Gallery"
            description="Moments captured by our travelers across scenic mountains, tranquil beaches, and historical monuments."
          />
        </div>

        {/* Pinterest-style Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {galleryImages.map((item, idx) => (
            <div
              key={item.id}
              className="break-inside-avoid relative rounded-3xl overflow-hidden shadow-soft group cursor-pointer border border-slate-100/50"
              style={{
                marginBottom: "24px",
              }}
            >
              {/* Image */}
              <div className="relative w-full h-auto min-h-[220px]">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-auto rounded-3xl object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                <span className="text-gold text-xs uppercase tracking-widest font-bold mb-1">
                  {item.location}
                </span>
                <h4 className="text-white font-heading font-bold text-lg">
                  {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TravelGallery;
