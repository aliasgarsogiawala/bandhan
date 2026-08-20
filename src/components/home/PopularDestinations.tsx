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
    <section id="domestic-tours" className="relative z-10 overflow-hidden bg-ink py-20 sm:py-28">
      <CompassMark className="pointer-events-none absolute -right-16 top-10 h-72 w-72 text-white/[0.035]" />
      {/* Soft brand glows so the ink field has depth rather than reading flat. */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[460px] w-[460px] rounded-full bg-primary-light/20 blur-[150px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[380px] w-[380px] rounded-full bg-gold/[0.07] blur-[130px]" aria-hidden="true" />
      <Container>
        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            align="left"
            badge="Top Rated Locations"
            title="Popular Destinations"
            description="Explore our hand-picked domestic and international gateways curated for unforgettable memories."
            className="max-w-2xl"
            tone="dark"
          />
          <Link
            href="/destinations"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white/85 transition-all duration-300 hover:border-gold hover:bg-gold hover:text-primary md:self-end"
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
                className="group relative block h-[360px] overflow-hidden rounded-[1.75rem] bg-primary shadow-lifted ring-1 ring-white/10 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-lifted hover:ring-gold/30 motion-reduce:hover:translate-y-0 sm:h-[430px]"
              >
                {/* Image */}
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]"
                />

                {/* Cinematic scrim — deep at the base so the type always holds */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/45 via-45% to-transparent transition-opacity duration-500" />
                <div className="absolute inset-0 bg-primary-dark/0 transition-colors duration-500 group-hover:bg-primary-dark/15" />

                {/* Tag */}
                {dest.tag && (
                  <span className="absolute left-5 top-5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
                    {dest.tag}
                  </span>
                )}

                {/* Card Details */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 text-white">
                  <span className="flex items-center gap-2.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-gold">
                    <span className="h-px w-5 bg-gold/50 transition-all duration-500 group-hover:w-8" aria-hidden="true" />
                    From {dest.price}
                  </span>
                  <h3 className="mt-2 font-heading text-[1.9rem] font-extrabold leading-[1.1] tracking-[-0.01em] transition-colors duration-300 group-hover:text-gold">
                    {dest.name}
                  </h3>
                  <p className="mt-2 max-h-24 overflow-hidden text-xs leading-relaxed text-slate-200/90 opacity-100 transition-all duration-500 sm:max-h-0 sm:opacity-0 sm:group-hover:max-h-24 sm:group-hover:opacity-100">
                    {dest.description}
                  </p>
                  <span className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold opacity-100 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100">
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
