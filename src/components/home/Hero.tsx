"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { ParallaxBand } from "@/components/ui/ParallaxBand";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useRecentSearches } from "@/lib/recentSearches";
import { useCollection } from "@/lib/admin/store";
import { fuzzySearch } from "@/lib/fuzzySearch";
import {
  BUDGET_RANGES,
  DURATION_RANGES,
  bestTimeCoversMonth,
  budgetRange,
  durationRange,
  monthNumber,
  parseDurationDays,
  parsePrice,
  travelMonthOptions,
} from "@/lib/tripSearch";
import type { Destination, TourPackage } from "@/data/mockData";
import type { Banner } from "@/lib/admin/types";

export interface HeroSearch {
  destination: string;
  travelMonth: string;
  duration: string;
  budget: string;
}

interface HeroProps {
  onSearchSubmit: (href: string) => void;
  onPlanTripClick: () => void;
}

const TRAVEL_MONTHS = travelMonthOptions();

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit, onPlanTripClick }) => {
  const [destination, setDestination] = useState("");
  const [travelMonth, setTravelMonth] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const [searchError, setSearchError] = useState("");
  const { saveRecentSearch } = useRecentSearches();
  const { items: packages } = useCollection<TourPackage>("packages");
  const { items: destinations } = useCollection<Destination>("destinations");
  const { items: banners } = useCollection<Banner>("banners");
  const banner = banners.find((item) => item.isActive);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = destination.trim();
    const monthLabel = TRAVEL_MONTHS.find((m) => m.value === travelMonth)?.label ?? "";
    const budgetLabel = budget ? budgetRange(budget).label : "";
    const durationLabel = duration ? durationRange(duration).label : "";
    const searchLabel =
      [
        query,
        monthLabel ? `in ${monthLabel}` : "",
        durationLabel ? `for ${durationLabel.toLowerCase()}` : "",
        budgetLabel ? `at ${budgetLabel.toLowerCase()}` : "",
      ]
        .filter(Boolean)
        .join(", ") || "Any destination";

    saveRecentSearch({ label: searchLabel, destination: query || searchLabel });

    // Every control narrows the result set — month is matched against each
    // package's `bestTime` season rather than being collected and ignored.
    const month = monthNumber(travelMonth);
    const withinBudget = budgetRange(budget).test;
    const withinDuration = durationRange(duration).test;

    const matches = fuzzySearch(
      packages.filter((pkg) => pkg.status !== "draft"),
      query,
      ["title", "category", "tagline", "overview", "highlights", "themes"]
    ).filter(
      (pkg) =>
        withinBudget(parsePrice(pkg.price)) &&
        withinDuration(parseDurationDays(pkg.duration)) &&
        bestTimeCoversMonth(pkg.bestTime, month)
    );

    const filtersApplied = Boolean(travelMonth || duration || budget);

    // One confident match for a typed destination goes straight to that tour.
    // Anything broader belongs on the packages page, where the applied filters
    // stay visible and adjustable instead of collapsing to a single result.
    if (matches.length === 1 && query) {
      setSearchError("");
      onSearchSubmit(`/packages/${encodeURIComponent(matches[0].id)}`);
      return;
    }

    if (matches.length > 0) {
      setSearchError("");
      const params = new URLSearchParams();
      if (query) params.set("search", query);
      if (travelMonth) params.set("month", travelMonth);
      if (duration) params.set("duration", duration);
      if (budget) params.set("budget", budget);
      onSearchSubmit(`/packages${params.size ? `?${params}` : ""}`);
      return;
    }

    // No package fits. A destination page is still a useful landing spot when
    // the traveller named somewhere we cover.
    const destinationMatch = fuzzySearch(
      destinations.filter((item) => item.status !== "draft"),
      query,
      ["name", "country", "region", "tag", "description", "highlights"]
    )[0];

    if (destinationMatch && !filtersApplied) {
      setSearchError("");
      onSearchSubmit(`/destinations/${encodeURIComponent(destinationMatch.id)}`);
      return;
    }

    setSearchError(
      filtersApplied
        ? "No tour matches all of those filters yet. Try a wider budget, duration or month."
        : "No tour matches that destination. Try another spelling, or browse the full catalogue."
    );
  };

  return (
    <ParallaxBand
      image={banner?.image || "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=90&w=3200"}
      alt=""
      overlay={65}
      priority
      className="w-full"
    >
      <div className="relative z-10 pb-14 pt-28 sm:pb-16 sm:pt-36 lg:pb-20 lg:pt-44">
        <Container>
          <div className="max-w-3xl text-left text-white">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">
              {banner?.badge || "Thoughtful journeys, planned well"}
            </p>
            <h1 className="font-heading text-4xl font-bold leading-[1.04] tracking-[-0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
              {banner?.title || "Explore Beyond"}{" "}
              <span className="text-gold">{banner?.highlightedTitle || "Boundaries"}</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:text-lg">
              {banner?.description || "Discover unforgettable domestic and international journeys custom-tailored for the discerning modern traveler."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton
              variant="coral"
              size="md"
              onClick={() => onSearchSubmit("/packages")}
              className="w-full !rounded-lg sm:w-auto"
              rightIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
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
              }
            >
              {banner?.primaryLabel || "Explore Tours"}
            </PrimaryButton>
            <SecondaryButton variant="glass" size="md" onClick={onPlanTripClick} className="w-full !rounded-lg sm:w-auto">
              {banner?.secondaryLabel || "Plan My Trip"}
            </SecondaryButton>
          </div>
          </div>

          <div className="mt-12 w-full">
            <form
              onSubmit={handleSearch}
              className="rounded-xl bg-white p-3 shadow-[0_18px_50px_-20px_rgba(3,12,23,0.65)] sm:p-4"
            >
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] lg:items-end">
              <div className="px-2 py-2">
                <label htmlFor="hero-destination" className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Destination
                </label>
                <input
                  id="hero-destination"
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (searchError) setSearchError("");
                  }}
                  placeholder="e.g. Kashmir, Bali, Europe"
                  className="h-8 w-full border-0 bg-transparent text-sm font-semibold text-primary outline-none placeholder:font-normal placeholder:text-foreground-light"
                />
              </div>

              <div className="border-t border-slate-100 px-2 py-2 sm:border-l sm:border-t-0">
                <label htmlFor="hero-month" className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Travel Month
                </label>
                <select
                  id="hero-month"
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="h-8 w-full border-0 bg-transparent text-sm font-semibold text-primary outline-none focus:ring-0"
                >
                  <option value="">Any Month</option>
                  {TRAVEL_MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-100 px-2 py-2 sm:border-t-0 lg:border-l">
                <label htmlFor="hero-duration" className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Duration
                </label>
                <select
                  id="hero-duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="h-8 w-full border-0 bg-transparent text-sm font-semibold text-primary outline-none focus:ring-0"
                >
                  {DURATION_RANGES.map((r) => (
                    <option key={r.key} value={r.key === "all" ? "" : r.key}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-slate-100 px-2 py-2 sm:border-l sm:border-t-0">
                <label htmlFor="hero-budget" className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Budget (Per Person)
                </label>
                <select
                  id="hero-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="h-8 w-full border-0 bg-transparent text-sm font-semibold text-primary outline-none focus:ring-0"
                >
                  {BUDGET_RANGES.map((r) => (
                    <option key={r.key} value={r.key === "all" ? "" : r.key}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 sm:col-span-2 lg:col-span-1 lg:pt-0">
                <PrimaryButton
                  type="submit"
                  variant="coral"
                  size="md"
                  fullWidth
                  className="h-12 whitespace-nowrap !rounded-lg px-6"
                >
                  Find my trip
                </PrimaryButton>
              </div>
              </div>
            </form>
            {searchError ? (
              <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1" role="alert">
                <p className="text-xs font-semibold text-white">{searchError}</p>
                <button type="button" onClick={() => onSearchSubmit("/packages")} className="text-xs font-bold text-gold underline underline-offset-4 hover:text-white">
                  Browse all tours
                </button>
              </div>
            ) : null}
          </div>
        </Container>
      </div>
    </ParallaxBand>
  );
};

export default Hero;
