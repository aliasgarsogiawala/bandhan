"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import type { Destination } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";
import { placeholderImage } from "@/lib/placeholderImages";

export const PopularDestinations: React.FC = () => {
  const { items } = useCollection<Destination>("destinations");
  const destinations = items
    .filter((destination) => destination.status !== "draft" && destination.isFeatured !== false)
    .slice(0, 8);

  return (
    <section id="domestic-tours" className="relative z-10 bg-white py-16 sm:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            align="left"
            badge="Where to go"
            title="Destinations travellers return to"
            description="A short list of places we know well, with routes designed around the best of each region."
            className="max-w-2xl"
          />
          <Link
            href="/destinations"
            className="group inline-flex shrink-0 items-center gap-2 self-start text-sm font-bold text-primary transition-colors hover:text-accent md:self-end"
          >
            Explore all destinations
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.05}>
          {destinations.map((dest) => (
            <StaggerItem key={dest.id} as="article" y={30}>
              <Link
                href={`/destinations/${encodeURIComponent(dest.id)}`}
                className="group block overflow-hidden rounded-lg border border-primary/10 bg-white transition-colors hover:border-primary/25"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Image src={dest.image || placeholderImage(dest.id)} alt={dest.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  {dest.tag && <span className="absolute left-3 top-3 rounded-md bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">{dest.tag}</span>}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-xl font-bold text-primary">{dest.name}</h3>
                    <ArrowRight size={17} className="mt-1 shrink-0 text-accent transition-transform group-hover:translate-x-1" />
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground-muted">{dest.description}</p>
                  <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-primary/55">From {dest.price}</p>
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
