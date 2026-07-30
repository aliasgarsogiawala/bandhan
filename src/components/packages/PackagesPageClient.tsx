"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { TourPackage } from "@/data/mockData";
import { getFullPackageForPackage } from "@/data/packageDetails";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { useCollection } from "@/lib/admin/store";
import { fuzzySearch } from "@/lib/fuzzySearch";

type CategoryTab = "all" | "domestic" | "international" | "northeast";

const TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All Packages" },
  { key: "domestic", label: "Domestic Tours" },
  { key: "international", label: "International" },
  { key: "northeast", label: "North East" },
];

type BudgetKey = "all" | "under-30k" | "30k-60k" | "60k-1l" | "above-1l";

const BUDGET_RANGES: { key: BudgetKey; label: string; test: (price: number) => boolean }[] = [
  { key: "all", label: "Any Budget", test: () => true },
  { key: "under-30k", label: "Under ₹30,000", test: (p) => p < 30000 },
  { key: "30k-60k", label: "₹30,000 – ₹60,000", test: (p) => p >= 30000 && p < 60000 },
  { key: "60k-1l", label: "₹60,000 – ₹1,00,000", test: (p) => p >= 60000 && p < 100000 },
  { key: "above-1l", label: "Above ₹1,00,000", test: (p) => p >= 100000 },
];

type DurationKey = "all" | "up-to-7" | "8-10" | "11-plus";

const DURATION_RANGES: { key: DurationKey; label: string; test: (days: number) => boolean }[] = [
  { key: "all", label: "Any Duration", test: () => true },
  { key: "up-to-7", label: "Up to 7 Days", test: (d) => d <= 7 },
  { key: "8-10", label: "8 – 10 Days", test: (d) => d >= 8 && d <= 10 },
  { key: "11-plus", label: "11+ Days", test: (d) => d >= 11 },
];

// "₹34,500" -> 34500
function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9]/g, "")) || 0;
}

// "9 Nights / 10 Days" -> 10 (the larger of the two numbers found)
function parseDurationDays(duration: string): number {
  const numbers = duration.match(/\d+/g)?.map(Number) ?? [];
  return numbers.length ? Math.max(...numbers) : 0;
}

export const PackagesPageClient: React.FC = () => {
  const { items: packages } = useCollection<TourPackage>("packages");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const getInitialTab = (): CategoryTab => {
    if (!initialCategory) return "all";
    const cat = initialCategory.toLowerCase();
    if (cat === "domestic") return "domestic";
    if (cat === "international") return "international";
    if (cat === "northeast" || cat === "north-east" || cat === "north east") return "northeast";
    return "all";
  };

  const [activeTab, setActiveTab] = useState<CategoryTab>(getInitialTab());
  const [budget, setBudget] = useState<BudgetKey>("all");
  const [duration, setDuration] = useState<DurationKey>("all");
  const [query, setQuery] = useState(searchParams.get("search") || "");

  const handleEnquire = (destination: string = "") => {
    router.push(contactEnquiryHref(destination));
  };

  const budgetRange = BUDGET_RANGES.find((r) => r.key === budget) ?? BUDGET_RANGES[0];
  const durationRange = DURATION_RANGES.find((r) => r.key === duration) ?? DURATION_RANGES[0];

  const searchedPackages = fuzzySearch(packages, query, [
    "title",
    "category",
    "tagline",
    "overview",
    "highlights",
    "themes",
  ]);

  const filteredPackages = searchedPackages
    .filter((pkg) => pkg.status !== "draft")
    .filter((pkg) => {
      if (activeTab === "all") return true;
      if (activeTab === "northeast") {
        return (
          pkg.title.toLowerCase().includes("northeast") ||
          pkg.title.toLowerCase().includes("sikkim") ||
          pkg.highlights.some(
            (h) => h.toLowerCase().includes("northeast") || h.toLowerCase().includes("sikkim")
          )
        );
      }
      return pkg.category.toLowerCase() === activeTab;
    })
    .filter((pkg) => budgetRange.test(parsePrice(pkg.price)))
    .filter((pkg) => durationRange.test(parseDurationDays(pkg.duration)));

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={() => handleEnquire("")} />

      {/* Page hero */}
      <header className="relative bg-primary pt-32 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=2000"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/85 via-primary/75 to-primary" />
        {/* Soft radial glows echoing the brand palette */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />

        <Container className="relative">
          <nav className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Tour Packages</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-tight">
            Journeys Worth <span className="text-gold">Packing For</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Every itinerary below is hand-built by our destination designers —
            real routes we travel ourselves, with stays and moments we would
            book for our own families.
          </p>

          {/* Search box */}
          <div className="relative mt-8 max-w-md">
            <label className="sr-only" htmlFor="package-search">
              Search packages
            </label>
            <Search
              size={17}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/50"
            />
            <input
              id="package-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by destination, title or theme…"
              className="w-full rounded-full bg-white/10 backdrop-blur-md border border-white/15 pl-11 pr-10 py-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter tabs */}
          <div className="inline-flex max-w-full flex-wrap gap-1 p-1 bg-white/10 backdrop-blur-md rounded-3xl sm:rounded-full border border-white/15 mt-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab.key
                    ? "bg-gold text-primary shadow-md"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Budget & duration filters */}
          <div className="flex flex-wrap gap-3 mt-4">
            <label className="sr-only" htmlFor="budget-filter">
              Filter by budget
            </label>
            <select
              id="budget-filter"
              value={budget}
              onChange={(e) => setBudget(e.target.value as BudgetKey)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/15 text-white/90 focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
            >
              {BUDGET_RANGES.map((range) => (
                <option key={range.key} value={range.key} className="text-primary">
                  {range.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="duration-filter">
              Filter by duration
            </label>
            <select
              id="duration-filter"
              value={duration}
              onChange={(e) => setDuration(e.target.value as DurationKey)}
              className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 backdrop-blur-md border border-white/15 text-white/90 focus:outline-none focus:ring-2 focus:ring-gold cursor-pointer"
            >
              {DURATION_RANGES.map((range) => (
                <option key={range.key} value={range.key} className="text-primary">
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </Container>
      </header>

      {/* Packages grid */}
      <main className="flex-1 py-16 sm:py-20 bg-sand-bg/40">
        <Container>
          {filteredPackages.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg font-semibold text-primary">
                {query ? `No packages match "${query}".` : "No packages match these filters yet."}
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                Try widening the budget or duration range, or plan a custom trip below.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg, index) => {
              const detail = getFullPackageForPackage(pkg);
              const image = pkg.image || "/logo.svg";
              return (
                <ScrollReveal key={pkg.id} delay={(index % 3) * 100}>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full border border-slate-100/50"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={image}
                        alt={pkg.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />

                      {pkg.isPopular && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md shadow-accent/20">
                          Popular
                        </span>
                      )}
                      <span className="absolute top-4 right-4 px-3 py-1 bg-white/90 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                        {pkg.category}
                      </span>
                      <span className="absolute bottom-4 right-4 px-3.5 py-1 bg-primary/90 text-white rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
                        {pkg.duration}
                      </span>
                    </div>

                    <div className="p-6 sm:p-8 flex flex-col flex-1">
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                        {pkg.title}
                      </h2>

                      <p className="text-sm text-foreground-muted font-sans leading-relaxed mb-4 line-clamp-2">
                        {detail?.tagline || pkg.tagline || "Plan a custom journey around this destination."}
                      </p>

                      {(detail?.themes || pkg.themes || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {(detail?.themes || pkg.themes || []).slice(0, 3).map((theme) => (
                            <span
                              key={theme}
                              className="px-2.5 py-1 bg-sand-dark text-primary/80 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            >
                              {theme}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-foreground-muted uppercase tracking-wider font-bold block">
                            Starting price
                          </span>
                          <div className="text-xl font-extrabold text-primary">
                            {pkg.price}
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-primary text-white group-hover:bg-accent transition-colors duration-300">
                          View Itinerary
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>

          {/* Custom trip CTA */}
          <ScrollReveal className="mt-16">
            <div className="relative bg-primary rounded-3xl px-8 py-12 sm:px-12 text-center overflow-hidden">
              <div className="absolute -top-16 -left-16 w-64 h-64 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
              <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-accent/20 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  Didn&apos;t find your dream route?
                </h2>
                <p className="mt-3 text-slate-300 font-sans max-w-xl mx-auto text-sm sm:text-base">
                  Every package here can be reshaped — different dates, hotels,
                  pace, or an entirely new destination. Tell us what you have
                  in mind.
                </p>
                <button
                  onClick={() => router.push("/book?type=custom")}
                  className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white rounded-full text-sm font-bold hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20 transition-all duration-300"
                >
                  Build a Custom Trip
                </button>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default PackagesPageClient;
