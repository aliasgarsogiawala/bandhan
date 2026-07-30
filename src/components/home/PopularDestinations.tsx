"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { CompassMark } from "./HomeDecor";
import type { Destination } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";

export const PopularDestinations: React.FC = () => {
  const { items } = useCollection<Destination>("destinations");
  const destinations = items
    .filter((destination) => destination.status !== "draft" && destination.isFeatured !== false)
    .slice(0, 8);

  return (
    <section id="domestic-tours" className="relative z-10 bg-white py-20 sm:py-28">
      <CompassMark className="pointer-events-none absolute -right-16 top-10 h-72 w-72 text-primary/[0.035]" />
      <Container>
        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            align="left"
            badge="Top Rated Locations"
            title="Popular Destinations"
            description="Explore our hand-picked domestic and international gateways curated for unforgettable memories."
            className="max-w-2xl"
          />
          <Link
            href="/destinations"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/15 px-5 py-3 text-sm font-bold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white md:self-end"
          >
            Explore all destinations
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Destination Cards Grid */}
        <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" stagger={0.07}>
          {destinations.map((dest) => (
            <StaggerItem key={dest.id} as="article" y={30}>
              <Link
                href={`/destinations/${encodeURIComponent(dest.id)}`}
                className="group relative block h-[400px] overflow-hidden rounded-[1.5rem] border border-slate-100 bg-primary shadow-soft transition-all duration-500 hover:shadow-[0_30px_60px_-30px_rgba(7,32,60,0.45)]"
              >
                {/* Image */}
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

                {/* Tag */}
                {dest.tag && (
                  <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {dest.tag}
                  </span>
                )}

                {/* Card Details */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                    From {dest.price}
                  </span>
                  <h3 className="mt-1.5 font-heading text-2xl font-bold tracking-tight transition-colors duration-300 group-hover:text-gold">
                    {dest.name}
                  </h3>
                  <p className="mt-2 max-h-0 overflow-hidden text-xs leading-relaxed text-slate-200 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100">
                    {dest.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    Plan this destination
                    <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
};

export default PopularDestinations;
