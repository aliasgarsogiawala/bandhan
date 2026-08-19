"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock3 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { TourPackage } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";
import { CATEGORY_TABS, matchesCategory, type CategoryTab } from "@/lib/packageCategory";

function SpotlightPackage({ pkg }: { pkg: TourPackage }) {
  return (
    <Link href={`/packages/${pkg.id}`} className="group relative flex min-h-[34rem] overflow-hidden rounded-[1.75rem] bg-primary shadow-[0_24px_70px_-34px_rgba(7,32,60,0.55)] lg:min-h-[39rem]">
      <Image src={pkg.image} alt={pkg.title} fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover transition-transform duration-1000 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/35 to-primary/5" />
      <div className="absolute left-6 top-6 flex flex-wrap gap-2 sm:left-8 sm:top-8">
        <span className="rounded-full border border-white/20 bg-primary/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur-md">Featured route</span>
        {pkg.isPopular && <span className="rounded-full bg-gold px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Popular</span>}
      </div>
      <div className="absolute inset-x-6 bottom-6 text-white sm:inset-x-8 sm:bottom-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-white/75"><span className="uppercase tracking-[0.16em] text-gold">{pkg.category}</span><span className="h-1 w-1 rounded-full bg-white/40" /><span className="flex items-center gap-1.5"><Clock3 size={13} />{pkg.duration}</span></div>
        <h3 className="mt-3 max-w-xl font-display text-4xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-[2.75rem]">{pkg.title}</h3>
        <p className="mt-3 max-w-xl line-clamp-2 text-sm leading-relaxed text-white/75 sm:text-base">{pkg.tagline || pkg.overview || pkg.highlights?.[0]}</p>
        <div className="mt-7 flex items-end justify-between gap-4 border-t border-white/20 pt-5"><div><p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/55">Starting from</p><p className="mt-1 text-2xl font-extrabold text-white">{pkg.price}</p></div><span className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-xs font-bold text-primary transition-colors group-hover:bg-gold-light">View itinerary <ArrowUpRight size={15} /></span></div>
      </div>
    </Link>
  );
}

function CompactPackage({ pkg, index }: { pkg: TourPackage; index: number }) {
  return (
    <Link href={`/packages/${pkg.id}`} className="group grid grid-cols-[2.2rem_minmax(0,1fr)_auto] items-center gap-3 border-b border-slate-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-sand/60 sm:grid-cols-[2.5rem_minmax(0,1fr)_auto] sm:gap-4 sm:px-6">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/10 text-xs font-bold text-foreground-light transition-colors group-hover:border-gold group-hover:bg-gold group-hover:text-primary">{String(index).padStart(2, "0")}</span>
      <div className="min-w-0"><div className="flex items-center gap-2"><span className="text-[9px] font-bold uppercase tracking-[0.15em] text-accent">{pkg.category}</span>{pkg.isPopular && <span className="text-[9px] font-bold uppercase tracking-wider text-gold-dark">Popular</span>}</div><h3 className="mt-1 truncate font-display text-lg font-medium text-primary transition-colors group-hover:text-accent sm:text-xl">{pkg.title}</h3><span className="mt-1 flex items-center gap-1 text-[11px] text-foreground-muted"><Clock3 size={12} />{pkg.duration}</span></div>
      <div className="flex items-center gap-3"><span className="hidden text-sm font-extrabold text-primary sm:block">{pkg.price}</span><ArrowUpRight size={17} className="text-foreground-light transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" /></div>
    </Link>
  );
}

export const FeaturedPackages: React.FC = () => {
  const { items: packages } = useCollection<TourPackage>("packages");
  const [activeTab, setActiveTab] = useState<CategoryTab>("all");
  const filteredPackages = packages.filter((pkg) => pkg.status !== "draft").filter((pkg) => matchesCategory(pkg.category, activeTab)).slice(0, 6);
  const spotlight = filteredPackages[0];
  const supportingPackages = filteredPackages.slice(1);

  return (
    <section id="international-tours" className="relative z-10 overflow-hidden bg-[#f7f5f1] py-20 sm:py-24">
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-gold/[0.08] blur-3xl" />
      <Container className="relative">
        <div className="flex flex-col gap-8 border-b border-primary/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle align="left" badge="The Bandhan collection" title="Journeys worth planning for." description="A considered shortlist of holidays, selected for the way they make you feel." className="max-w-2xl" />
          <div className="flex max-w-full shrink-0 flex-wrap gap-1 rounded-2xl border border-primary/10 bg-white p-1.5 shadow-soft lg:max-w-[38rem] lg:justify-end">
            {CATEGORY_TABS.map((tab) => <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`rounded-xl px-3.5 py-2.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all sm:px-4 ${activeTab === tab.key ? "bg-primary text-white shadow-sm" : "text-foreground-muted hover:bg-sand hover:text-primary"}`}>{tab.label}</button>)}
          </div>
        </div>

        {spotlight ? <div className="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]"><SpotlightPackage pkg={spotlight} /><div className="flex flex-col gap-5"><div className="overflow-hidden rounded-[1.75rem] border border-primary/[0.08] bg-white shadow-[0_18px_50px_-32px_rgba(7,32,60,0.35)]"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">More journeys</p><span className="text-[10px] text-foreground-light">{supportingPackages.length} routes</span></div>{supportingPackages.map((pkg, index) => <CompactPackage key={pkg.id} pkg={pkg} index={index + 2} />)}</div><div className="rounded-2xl border border-dashed border-primary/20 bg-white/60 p-5"><p className="text-sm font-semibold text-primary">Want something completely yours?</p><p className="mt-1 text-xs leading-relaxed text-foreground-muted">Tell us your dates, pace and destination. We will shape a trip around you.</p><Link href="/book?type=custom" className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-dark">Design a custom trip <ArrowRight size={14} /></Link></div></div></div> : <div className="mt-10 rounded-2xl border border-dashed border-primary/15 bg-white p-10 text-center text-sm text-foreground-muted">No published journeys match this collection yet.</div>}

        <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/10 bg-primary px-6 py-5 text-center sm:flex-row sm:text-left"><p className="text-sm text-white/65">Explore every itinerary or ask our travel designers to create a route from scratch.</p><Link href="/packages" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-gold-light">View all journeys <ArrowRight size={15} /></Link></div>
      </Container>
    </section>
  );
};

export default FeaturedPackages;
