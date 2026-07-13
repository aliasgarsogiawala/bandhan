"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface CTAProps {
  onStartPlanningClick: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartPlanningClick }) => {
  return (
    <section id="special-packages" className="relative py-32 overflow-hidden z-10">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=2000"
          alt="Adventure Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Navy/Coral Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/45 z-0" />
      </div>

      <Container className="relative z-10">
        <div className="max-w-2xl text-white space-y-6">
          <span className="px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-gold text-xs font-bold uppercase tracking-widest inline-block">
            Tailor-Made Trips
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-heading text-white leading-tight">
            Ready For Your Next Adventure?
          </h2>
          <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-light font-sans max-w-xl">
            Let us design a custom itinerary specifically configured for your group, dates, and choices. Tell us where you want to go and we will do the rest.
          </p>
          <div className="pt-4">
            <PrimaryButton
              variant="coral"
              size="lg"
              onClick={onStartPlanningClick}
              className="hover:scale-105 transition-transform duration-300 shadow-lg shadow-accent/20"
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
              Start Planning
            </PrimaryButton>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CTA;
