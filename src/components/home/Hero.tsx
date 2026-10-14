"use client";

import React, { useState } from "react";
import { Container } from "@/components/ui/Container";
import { ParallaxBand } from "@/components/ui/ParallaxBand";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useRecentSearches } from "@/lib/recentSearches";
import { useCollection } from "@/lib/admin/store";
import { fuzzySearch, PACKAGE_SEARCH_KEYS } from "@/lib/fuzzySearch";
import { PlaceSearchInput } from "@/components/ui/PlaceSearchInput";
import type { Destination, TourPackage } from "@/data/mockData";
import type { Banner } from "@/lib/admin/types";

interface HeroProps {
  onSearchSubmit: (href: string) => void;
  onPlanTripClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit, onPlanTripClick }) => {
  const [destination, setDestination] = useState("");
  const [searchError, setSearchError] = useState("");
  const { saveRecentSearch } = useRecentSearches();
  const { items: packages } = useCollection<TourPackage>("packages");
  const { items: destinations } = useCollection<Destination>("destinations");
  const { items: banners } = useCollection<Banner>("banners");
  const banner = banners.find((item) => item.isActive);

  const runSearch = (text: string) => {
    const query = text.trim();
    if (!query) {
      setSearchError("");
      onSearchSubmit("/packages");
      return;
    }
    saveRecentSearch({ label: query, destination: query });

    const matches = fuzzySearch(packages.filter((pkg) => pkg.status !== "draft"), query, PACKAGE_SEARCH_KEYS);

    // One confident match goes straight to that tour; anything broader lands
    // on the packages page with the search still applied and adjustable.
    if (matches.length === 1) {
      setSearchError("");
      onSearchSubmit(`/packages/${encodeURIComponent(matches[0].id)}`);
      return;
    }
    if (matches.length > 1) {
      setSearchError("");
      onSearchSubmit(`/packages?${new URLSearchParams({ search: query })}`);
      return;
    }

    // No package fits. A destination page is still a useful landing spot when
    // the traveller named somewhere we cover.
    const destinationMatch = fuzzySearch(
      destinations.filter((item) => item.status !== "draft"),
      query,
      ["name", "country", "region", "tag", "description", "highlights"]
    )[0];
    if (destinationMatch) {
      setSearchError("");
      onSearchSubmit(`/destinations/${encodeURIComponent(destinationMatch.id)}`);
      return;
    }

    setSearchError("No tour matches that destination. Try another spelling, or browse the full catalogue.");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(destination);
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
              <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="px-2 py-2">
                <label htmlFor="hero-destination" className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary/60">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Destination or city
                </label>
                <PlaceSearchInput
                  id="hero-destination"
                  value={destination}
                  onValueChange={(value) => {
                    setDestination(value);
                    if (searchError) setSearchError("");
                  }}
                  onPick={(place) => runSearch(place.label)}
                  placeholder="e.g. Kashmir, Munnar, Bali, Europe"
                  className="h-8 w-full border-0 bg-transparent text-base font-semibold text-primary outline-none placeholder:font-normal placeholder:text-foreground-light sm:text-sm"
                />
              </div>

              <div className="pt-2 sm:pt-0">
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
