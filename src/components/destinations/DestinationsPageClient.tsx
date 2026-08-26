"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import PageShell from "@/components/ui/PageShell";
import PageHero from "@/components/ui/PageHero";
import type { Destination } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";
import { placeholderImage } from "@/lib/placeholderImages";

export default function DestinationsPageClient() {
  const { items } = useCollection<Destination>("destinations");
  const destinations = items.filter((destination) => destination.status !== "draft");

  return (
    <PageShell tone="sand">
      <PageHero
        align="center"
        priority
        eyebrow="Explore the world"
        title="All popular destinations"
        description="Browse every destination currently available for planning with Bandhan Tours."
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=90&w=3200"
        imageAlt=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Destinations" }]}
      />

      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${encodeURIComponent(dest.id)}`}
                className="group relative h-[340px] overflow-hidden rounded-3xl border border-slate-100/50 bg-primary shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:h-[380px]"
              >
                <Image
                  src={dest.image || placeholderImage(dest.id)}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-ink-deep/50 opacity-85 transition-opacity duration-300 group-hover:opacity-95" />
                {dest.tag && (
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent shadow-sm backdrop-blur-sm">
                    {dest.tag}
                  </span>
                )}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">
                    Starting from {dest.price}
                  </span>
                  <h2 className="mb-2 mt-1 font-heading text-2xl font-bold tracking-wide transition-colors group-hover:text-gold">
                    {dest.name}
                  </h2>
                  <p className="line-clamp-2 translate-y-0 text-xs text-slate-200 opacity-100 transition-all duration-500 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                    {dest.description}
                  </p>
                  <span className="mt-3 flex items-center gap-1.5 text-xs font-bold text-gold opacity-100 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100">
                    Plan This Destination <span className="text-base">→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {destinations.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-sm text-foreground-muted">
              No destinations are currently available.
            </div>
          )}
        </Container>
      </section>
    </PageShell>
  );
}
