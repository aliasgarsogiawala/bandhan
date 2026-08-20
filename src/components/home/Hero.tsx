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
      overlay={70}
      priority
      className="w-full min-h-[100svh] lg:flex lg:h-[95vh] lg:min-h-[750px] lg:items-center lg:justify-center"
    >

      {/* Hero Content */}
      <div className="relative z-10 w-full pb-12 pt-28 sm:pb-16 sm:pt-32 lg:py-20">
        <Container className="flex flex-col items-center text-center text-white">
          {/* Badge */}
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/25 bg-ink-deep/40 px-4 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-md sm:mb-8 sm:gap-3 sm:px-5 sm:py-2 sm:text-[0.68rem] sm:tracking-[0.34em]">
            <span className="h-px w-5 bg-gold/50 sm:w-8" aria-hidden="true" />
            {banner?.badge || "Where Colours Come Alive"}
            <span className="h-px w-5 bg-gold/50 sm:w-8" aria-hidden="true" />
          </span>

          {/* Headline */}
          <h1 className="mb-5 max-w-4xl font-heading text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.015em] text-white [text-shadow:0_2px_10px_rgba(3,12,23,0.55),0_8px_40px_rgba(3,12,23,0.45)] min-[380px]:text-5xl sm:mb-7 sm:text-6xl md:text-7xl lg:text-[5.5rem] lg:leading-[1.05]">
            {banner?.title || "Explore Beyond"}{" "}
            <em className="not-italic font-extrabold text-gold">{banner?.highlightedTitle || "Boundaries"}</em>
          </h1>

          {/* Subheading */}
          <p className="mb-8 max-w-xl text-sm font-normal leading-relaxed tracking-wide text-white/90 [text-shadow:0_1px_12px_rgba(3,12,23,0.6)] sm:mb-11 sm:text-lg">
            {banner?.description || "Discover unforgettable domestic and international journeys custom-tailored for the discerning modern traveler."}
          </p>

          {/* Call to Actions */}
          <div className="mb-10 flex w-full max-w-xs flex-col justify-center gap-3 sm:mb-16 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4">
            <PrimaryButton
              variant="coral"
              size="lg"
              onClick={onPlanTripClick}
              className="w-full sm:w-auto"
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
            <SecondaryButton variant="glass" size="lg" onClick={onPlanTripClick} className="w-full sm:w-auto">
              {banner?.secondaryLabel || "Plan My Trip"}
            </SecondaryButton>
          </div>

          {/* Floating Search Card */}
          <div className="w-full max-w-5xl">
            <form
              onSubmit={handleSearch}
              className="rounded-2xl border border-white/25 bg-primary/40 p-2 shadow-glass backdrop-blur-xl sm:rounded-3xl sm:p-4"
            >
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_auto] lg:items-stretch">
              <div className="flex min-h-16 flex-col justify-center gap-1.5 border-b border-white/10 px-3 transition-colors hover:bg-white/10 sm:min-h-[76px] sm:rounded-2xl sm:border-0 sm:px-4">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Destination
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => {
                    setDestination(e.target.value);
                    if (searchError) setSearchError("");
                  }}
                  placeholder="e.g. Kashmir, Bali, Europe"
                  className="bg-transparent text-white outline-none font-medium placeholder:text-slate-300 text-sm w-full"
                />
              </div>

              <div className="flex min-h-16 flex-col justify-center gap-1.5 border-b border-white/10 px-3 transition-colors hover:bg-white/10 sm:min-h-[76px] sm:rounded-2xl sm:border-0 sm:px-4">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  Travel Month
                </label>
                <select
                  value={travelMonth}
                  onChange={(e) => setTravelMonth(e.target.value)}
                  className="bg-transparent text-white outline-none font-medium text-sm w-full border-none focus:ring-0 [&>option]:bg-primary [&>option]:text-white"
                >
                  <option value="">Any Month</option>
                  {TRAVEL_MONTHS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex min-h-16 flex-col justify-center gap-1.5 border-b border-white/10 px-3 transition-colors hover:bg-white/10 sm:min-h-[76px] sm:rounded-2xl sm:border-0 sm:px-4">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-transparent text-white outline-none font-medium text-sm w-full border-none focus:ring-0 [&>option]:bg-primary [&>option]:text-white"
                >
                  {DURATION_RANGES.map((r) => (
                    <option key={r.key} value={r.key === "all" ? "" : r.key}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex min-h-16 flex-col justify-center gap-1.5 border-b border-white/10 px-3 transition-colors hover:bg-white/10 sm:min-h-[76px] sm:rounded-2xl sm:border-0 sm:px-4">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Budget (Per Person)
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-transparent text-white outline-none font-medium text-sm w-full border-none focus:ring-0 [&>option]:bg-primary [&>option]:text-white"
                >
                  {BUDGET_RANGES.map((r) => (
                    <option key={r.key} value={r.key === "all" ? "" : r.key}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex min-h-16 items-center px-1 sm:min-h-[76px] sm:px-2 lg:px-1">
                <PrimaryButton
                  type="submit"
                  variant="coral"
                  size="md"
                  fullWidth
                  className="h-12 whitespace-nowrap px-6 shadow-md shadow-accent/20 hover:scale-[1.02] transition-transform duration-300"
                >
                  Find my trip
                </PrimaryButton>
              </div>
              </div>
            </form>
            {searchError ? (
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center" role="alert">
                <p className="text-xs font-semibold text-white">{searchError}</p>
                <button type="button" onClick={() => onSearchSubmit("/packages")} className="text-xs font-bold text-gold underline decoration-gold/40 underline-offset-4 hover:text-white">
                  Browse all tours
                </button>
              </div>
            ) : (
              <p className="mt-3 text-center text-xs font-medium text-white/65">Every field narrows the search — we&apos;ll show the tours that match.</p>
            )}
          </div>
        </Container>
      </div>
    </ParallaxBand>
  );
};

export default Hero;
