"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { Destination } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";

export const PopularDestinations: React.FC = () => {
  const { items } = useCollection<Destination>("destinations");
  const destinations = items.filter((destination) => destination.status !== "draft" && destination.isFeatured !== false);
  return (
    <section id="domestic-tours" className="py-16 sm:py-24 bg-white relative z-10">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <SectionTitle
            align="left"
            badge="Top Rated Locations"
            title="Popular Destinations"
            description="Explore our hand-picked domestic and international gateways curated for unforgettable memories."
            className="max-w-2xl"
          />
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {destinations.map((dest, idx) => (
            <Link
              key={dest.id}
              href={`/book?type=destination&id=${encodeURIComponent(dest.id)}`}
              className="group relative h-[380px] rounded-3xl overflow-hidden cursor-pointer shadow-soft hover:shadow-xl transition-all duration-500 border border-slate-100/50"
              style={{
                animationDelay: `${idx * 100}ms`,
              }}
            >
              {/* Image */}
              <Image
                src={dest.image}
                alt={dest.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/20 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300" />

              {/* Tag/Badge inside Card */}
              {dest.tag && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-[10px] font-bold text-accent uppercase tracking-wider shadow-sm">
                  {dest.tag}
                </span>
              )}

              {/* Card Details */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end text-white">
                <span className="text-gold text-xs uppercase tracking-widest font-bold mb-1">
                  Starting from {dest.price}
                </span>
                <h3 className="text-white font-heading font-bold text-2xl tracking-wide group-hover:text-gold transition-colors mb-2">
                  {dest.name}
                </h3>
                <p className="text-slate-200 text-xs line-clamp-2 font-sans opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-3 transition-all duration-500">
                  {dest.description}
                </p>

                {/* Call To Action indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span>Plan This Destination</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default PopularDestinations;
