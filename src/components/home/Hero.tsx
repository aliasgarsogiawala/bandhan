"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { useRecentSearches } from "@/lib/recentSearches";

interface HeroProps {
  onSearchSubmit: (destination: string) => void;
  onPlanTripClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearchSubmit, onPlanTripClick }) => {
  const [destination, setDestination] = useState("");
  const [travelMonth, setTravelMonth] = useState("");
  const [duration, setDuration] = useState("");
  const [budget, setBudget] = useState("");
  const { items: recentSearches, saveRecentSearch, clearRecentSearches } = useRecentSearches();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = [
      destination,
      travelMonth ? `in ${travelMonth}` : "",
      duration ? `for ${duration}` : "",
      budget ? `with budget ${budget}` : "",
    ]
      .filter(Boolean)
      .join(", ");
    const searchLabel = query || destination || "Any Destination";

    saveRecentSearch({
      label: searchLabel,
      destination: destination || searchLabel,
    });
    onSearchSubmit(searchLabel);
  };

  return (
    <section className="relative w-full h-[95vh] min-h-[620px] sm:min-h-[750px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2000"
          alt="Bandhan Tours Luxury Travel"
          fill
          priority
          className="object-cover object-center scale-105 animate-scale-up"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/35 to-primary/85 z-0" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full pt-28 pb-16 sm:pt-24 sm:pb-20">
        <Container className="flex flex-col items-center text-center text-white">
          {/* Badge */}
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold text-xs font-semibold uppercase tracking-widest mb-6 inline-block animate-fade-in">
            Where Colours Come Alive
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight max-w-4xl tracking-tight text-gold drop-shadow-md font-heading animate-fade-in-up">
            Explore Beyond Boundaries
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-slate-200 mb-10 max-w-2xl font-light leading-relaxed animate-fade-in-up">
            Discover unforgettable domestic and international journeys custom-tailored for the discerning modern traveler.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fade-in-up">
            <PrimaryButton
              variant="coral"
              size="lg"
              onClick={onPlanTripClick}
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
              Explore Tours
            </PrimaryButton>
            <SecondaryButton variant="glass" size="lg" onClick={onPlanTripClick}>
              Plan My Trip
            </SecondaryButton>
          </div>

          {/* Floating Search Card */}
          <div className="w-full max-w-4xl px-4 sm:px-0 animate-fade-in-up">
            <form
              onSubmit={handleSearch}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 rounded-3xl shadow-glass grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-center text-left"
            >
              {/* Destination */}
              <div className="flex flex-col gap-1.5 border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0 sm:pr-4">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Destination
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?"
                  className="bg-transparent text-white outline-none font-medium placeholder:text-slate-300 text-sm w-full"
                />
              </div>

              {/* Month */}
              <div className="flex flex-col gap-1.5 border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0 sm:pr-4">
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
                  <option value="August 2026">August 2026</option>
                  <option value="September 2026">September 2026</option>
                  <option value="October 2026">October 2026</option>
                  <option value="November 2026">November 2026</option>
                  <option value="December 2026">December 2026</option>
                </select>
              </div>

              {/* Duration */}
              <div className="flex flex-col gap-1.5 border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0 sm:pr-4">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-transparent text-white outline-none font-medium text-sm w-full border-none focus:ring-0 [&>option]:bg-primary [&>option]:text-white"
                >
                  <option value="">Any Duration</option>
                  <option value="3-5 Days">Short (3-5 Days)</option>
                  <option value="6-9 Days">Medium (6-9 Days)</option>
                  <option value="10+ Days">Long (10+ Days)</option>
                </select>
              </div>

              {/* Budget */}
              <div className="flex flex-col gap-1.5 pb-3 sm:pb-0">
                <label className="text-[10px] uppercase tracking-widest text-gold font-bold flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  Budget (Per Person)
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-transparent text-white outline-none font-medium text-sm w-full border-none focus:ring-0 [&>option]:bg-primary [&>option]:text-white"
                >
                  <option value="">Any Budget</option>
                  <option value="Under ₹30,000">Under ₹30k</option>
                  <option value="₹30,000 - ₹60,000">₹30k - ₹60k</option>
                  <option value="₹60,000 - ₹1,20,000">₹60k - ₹1.2L</option>
                  <option value="Over ₹1,20,000">Over ₹1.2L</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="w-full lg:col-span-1">
                <PrimaryButton
                  type="submit"
                  variant="coral"
                  size="md"
                  fullWidth
                  className="shadow-md shadow-accent/20 py-3.5 hover:scale-102 transition-transform duration-300"
                >
                  Search Tours
                </PrimaryButton>
              </div>
            </form>

            {recentSearches.length > 0 ? (
              <div className="mt-4 rounded-[1.75rem] border border-white/15 bg-primary/25 px-4 py-4 text-left backdrop-blur-md sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
                      Recent searches
                    </p>
                    <p className="mt-1 text-sm text-slate-200">
                      Pick up a trip idea you searched for recently.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearRecentSearches}
                    className="text-xs font-semibold uppercase tracking-wider text-white/70 transition hover:text-white"
                  >
                    Clear
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {recentSearches.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onSearchSubmit(item.label)}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-semibold text-white transition hover:border-gold/40 hover:bg-white/15"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </Container>
      </div>
    </section>
  );
};

export default Hero;
