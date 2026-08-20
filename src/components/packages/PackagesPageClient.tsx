"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpRight, CalendarClock, MapPin, Search, X } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { TourPackage } from "@/data/mockData";
import { getFullPackageForPackage } from "@/data/packageDetails";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { useCollection } from "@/lib/admin/store";
import { fuzzySearch } from "@/lib/fuzzySearch";
import {
  CATEGORY_TABS as TABS,
  matchesCategory,
  parseCategoryParam,
  type CategoryTab,
} from "@/lib/packageCategory";
import {
  BUDGET_RANGES,
  DURATION_RANGES,
  bestTimeCoversMonth,
  budgetRange,
  durationRange,
  monthNumber,
  parseDurationDays,
  parsePrice,
  resolveTravelMonth,
  travelMonthOptions,
  type BudgetKey,
  type DurationKey,
} from "@/lib/tripSearch";

const TRAVEL_MONTHS = travelMonthOptions();

export const PackagesPageClient: React.FC = () => {
  const { items: packages } = useCollection<TourPackage>("packages");
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [activeTab, setActiveTab] = useState<CategoryTab>(() => parseCategoryParam(initialCategory));
  const [budget, setBudget] = useState<BudgetKey>(
    () => budgetRange(searchParams.get("budget")).key
  );
  const [duration, setDuration] = useState<DurationKey>(
    () => durationRange(searchParams.get("duration")).key
  );
  // A link may carry a month that has since passed. Carry it forward to the
  // same month next year rather than dropping the filter, and remember that we
  // did so, so the change can be surfaced instead of silently applied.
  const [resolvedMonth] = useState(() =>
    resolveTravelMonth(searchParams.get("month"), TRAVEL_MONTHS)
  );
  const [month, setMonth] = useState(resolvedMonth.value);
  const monthWasRolledForward = resolvedMonth.rolledForward && month === resolvedMonth.value;
  const [query, setQuery] = useState(searchParams.get("search") || "");

  // Keep the address bar in step with the visible filters, so the link a
  // traveller copies or bookmarks reproduces what they are actually looking at.
  // `replace` rather than `push` — adjusting a filter should not stack up
  // history entries to back out of.
  const filterQuery = React.useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (activeTab !== "all") params.set("category", activeTab);
    if (month) params.set("month", month);
    if (duration !== "all") params.set("duration", duration);
    if (budget !== "all") params.set("budget", budget);
    return params.toString();
  }, [query, activeTab, month, duration, budget]);

  React.useEffect(() => {
    router.replace(`/packages${filterQuery ? `?${filterQuery}` : ""}`, { scroll: false });
  }, [filterQuery, router]);

  const handleEnquire = (destination: string = "") => {
    router.push(contactEnquiryHref(destination));
  };

  const withinBudget = budgetRange(budget).test;
  const withinDuration = durationRange(duration).test;
  const monthFilter = monthNumber(month);

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
    .filter((pkg) => matchesCategory(pkg.category, activeTab))
    .filter((pkg) => withinBudget(parsePrice(pkg.price)))
    .filter((pkg) => withinDuration(parseDurationDays(pkg.duration)))
    .filter((pkg) => bestTimeCoversMonth(pkg.bestTime, monthFilter));

  return (
    <div className="package-catalogue min-h-screen bg-sand-light flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={() => handleEnquire("")} />

      {/* Page hero */}
      <header className="relative bg-primary pt-32 pb-16 sm:pt-36 sm:pb-20 overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=90&w=3200"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/80" />
        {/* Soft radial glows echoing the brand palette */}

        <Container className="relative">
          <nav className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gold">Tour Packages</span>
          </nav>
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-[-0.015em] text-white min-[380px]:text-5xl sm:text-6xl md:text-7xl">
            Journeys Worth <span className="text-gold">Packing For</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-300 font-sans leading-relaxed">
            Every itinerary below is hand-built by our destination designers —
            real routes we travel ourselves, with stays and moments we would
            book for our own families.
          </p>

          {/* Search box */}
          <div className="relative mt-8 max-w-xl">
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
              className="min-h-12 w-full rounded-[8px] border border-white/20 bg-ink-deep/35 py-3 pl-11 pr-10 text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-gold sm:text-sm"
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
          <div className="inline-flex max-w-full flex-wrap gap-1 rounded-[8px] border border-white/15 bg-white/10 p-1 backdrop-blur-md mt-4">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`min-h-11 rounded-[5px] px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 sm:px-6 ${
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
              className="min-h-11 rounded-[6px] border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
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
              className="min-h-11 rounded-[6px] border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
            >
              {DURATION_RANGES.map((range) => (
                <option key={range.key} value={range.key} className="text-primary">
                  {range.label}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="month-filter">
              Filter by travel month
            </label>
            <select
              id="month-filter"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="min-h-11 rounded-[6px] border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/90 backdrop-blur-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="" className="text-primary">
                Any Month
              </option>
              {TRAVEL_MONTHS.map((m) => (
                <option key={m.value} value={m.value} className="text-primary">
                  {m.label}
                </option>
              ))}
            </select>

            {(budget !== "all" || duration !== "all" || month || query) && (
              <button
                type="button"
                onClick={() => {
                  setBudget("all");
                  setDuration("all");
                  setMonth("");
                  setQuery("");
                }}
                className="inline-flex items-center gap-1.5 rounded-[6px] border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/70 transition-colors hover:border-gold/50 hover:text-gold"
              >
                <X size={13} />
                Clear filters
              </button>
            )}
          </div>

          {monthWasRolledForward && (
            <p className="mt-3 flex items-center gap-2 text-xs text-white/70" role="status">
              <CalendarClock size={14} className="shrink-0 text-gold" />
              <span>
                {resolvedMonth.requestedLabel ?? "That travel month"} has passed — showing{" "}
                <span className="font-semibold text-gold">
                  {TRAVEL_MONTHS.find((m) => m.value === month)?.label}
                </span>{" "}
                instead.
              </span>
            </p>
          )}
        </Container>
      </header>

      {/* Packages grid */}
      <main className="flex-1 bg-sand-light py-14 sm:py-20">
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
          {filteredPackages.length > 0 && (
            <div className="mb-7 flex items-end justify-between gap-4 border-b border-primary/10 pb-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">Curated journeys</p>
                <h2 className="mt-1 font-heading text-2xl font-bold text-primary">{filteredPackages.length} trips ready to explore</h2>
              </div>
              <p className="hidden max-w-sm text-right text-xs leading-relaxed text-foreground-muted sm:block">Choose a route, then tailor the dates, stays and pace with our trip designers.</p>
            </div>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPackages.map((pkg, index) => {
              const detail = getFullPackageForPackage(pkg);
              const image = pkg.image || "/logo.svg";
              return (
                <ScrollReveal key={pkg.id} delay={(index % 3) * 100}>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-primary/10 bg-white shadow-soft transition-all duration-500 ease-out hover:-translate-y-1 hover:border-gold/45 hover:shadow-lifted motion-reduce:hover:translate-y-0"
                  >
                    <div className="relative h-60 overflow-hidden">
                      <Image
                        src={image}
                        alt={pkg.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-ink-deep/45" />

                      {pkg.isPopular && (
                        <span className="absolute top-4 left-4 rounded-[4px] bg-accent px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-accent/20">
                          Popular
                        </span>
                      )}
                      <span className="absolute top-4 right-4 rounded-[4px] bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
                        {pkg.category}
                      </span>
                      <span className="absolute bottom-4 right-4 rounded-[4px] bg-primary/90 px-3.5 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-md">
                        {pkg.duration}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="mb-2.5 font-heading text-2xl font-extrabold leading-[1.15] tracking-[-0.01em] text-primary transition-colors duration-300 group-hover:text-accent">
                        {pkg.title}
                      </h2>

                      <p className="text-sm text-foreground-muted font-sans leading-relaxed mb-4 line-clamp-2">
                        {detail?.tagline || pkg.tagline || "Plan a custom journey around this destination."}
                      </p>

                      {detail?.startingPoint && (
                        <p className="mb-4 flex items-center gap-2 text-xs font-semibold text-foreground-muted">
                          <MapPin size={14} className="shrink-0 text-accent" />
                          Starts from {detail.startingPoint}
                        </p>
                      )}

                      {(detail?.themes || pkg.themes || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {(detail?.themes || pkg.themes || []).slice(0, 3).map((theme) => (
                            <span
                              key={theme}
                              className="rounded-[4px] bg-sand-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/80"
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
                        <span className="inline-flex items-center gap-2 rounded-[5px] bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors duration-300 group-hover:bg-accent">
                          View itinerary
                          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
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
            <div className="relative overflow-hidden rounded-[8px] bg-primary px-8 py-12 text-center sm:px-12">
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
                  className="mt-6 inline-flex items-center gap-2 rounded-[5px] bg-accent px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-accent-dark hover:shadow-lg hover:shadow-accent/20"
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
