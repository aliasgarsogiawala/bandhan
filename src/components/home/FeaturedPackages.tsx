"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { TourPackage } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";
import { CATEGORY_TABS, matchesCategory, type CategoryTab } from "@/lib/packageCategory";

function PackageCard({ pkg }: { pkg: TourPackage }) {
  return (
    <Link href={`/packages/${pkg.id}`} className="group flex h-full flex-col overflow-hidden rounded-lg border border-primary/10 bg-white transition-colors hover:border-primary/25">
      <div className="relative aspect-[16/10] overflow-hidden bg-sand">
        <Image src={pkg.image} alt={pkg.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        {pkg.isPopular && <span className="absolute left-3 top-3 rounded-md bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Popular</span>}
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-3 text-xs font-semibold text-foreground-muted">
          <span className="uppercase tracking-[0.12em] text-accent">{pkg.category}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="flex items-center gap-1.5"><Clock3 size={13} />{pkg.duration}</span>
        </div>
        <h3 className="mt-3 font-heading text-xl font-bold leading-snug text-primary sm:text-2xl">{pkg.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground-muted">{pkg.tagline || pkg.overview || pkg.highlights?.[0]}</p>
        <div className="mt-auto flex items-end justify-between gap-4 border-t border-primary/10 pt-5">
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-foreground-light">From</p><p className="mt-1 text-lg font-bold text-primary">{pkg.price}</p></div>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors group-hover:text-accent">View trip <ArrowRight size={15} /></span>
        </div>
      </div>
    </Link>
  );
}

export const FeaturedPackages: React.FC = () => {
  const { items: packages } = useCollection<TourPackage>("packages");
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const visiblePackages = packages
    .filter((pkg) => pkg.status !== "draft")
    .filter((pkg) => matchesCategory(pkg.category, activeTab))
    .slice(0, 6);

  return (
    <section id="international-tours" className="relative z-10 bg-sand-light py-16 sm:py-24">
      <Container>
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle align="left" badge="Curated trips" title="A few good places to start" description="Clear itineraries, sensible pacing, and the flexibility to make each journey your own." />
          <div className="flex max-w-full gap-1 overflow-x-auto rounded-lg border border-primary/10 bg-white p-1" role="tablist" aria-label="Package categories">
            {CATEGORY_TABS.map((tab) => (
              <button key={tab.key} type="button" role="tab" aria-selected={activeTab === tab.key} onClick={() => setActiveTab(tab.key)} className={`shrink-0 rounded-md px-3.5 py-2.5 text-xs font-bold transition-colors ${activeTab === tab.key ? "bg-primary text-white" : "text-foreground-muted hover:bg-sand hover:text-primary"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {visiblePackages.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visiblePackages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        ) : (
          <div className="mt-10 rounded-lg border border-primary/10 bg-white p-10 text-center text-sm text-foreground-muted">No published journeys match this category yet.</div>
        )}

        <div className="mt-8">
          <Link href="/packages" className="inline-flex items-center gap-2 rounded-lg border border-primary px-5 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-white">Browse all packages <ArrowRight size={16} /></Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedPackages;
