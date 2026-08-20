"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ParallaxBand } from "@/components/ui/ParallaxBand";

interface CTAProps {
  onStartPlanningClick: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartPlanningClick }) => {
  return (
    <ParallaxBand
      id="special-packages"
      image="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=90&w=3200"
      overlay={65}
      className="py-28 sm:py-36 lg:py-44"
    >
      <Container className="relative z-10">
        <div className="max-w-2xl space-y-7 text-white">
          <span className="inline-flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-gold">
            <span className="h-px w-7 bg-gold/60" aria-hidden="true" />
            Tailor-Made Trips
          </span>
          <h2 className="font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-5xl lg:text-[3.5rem]">
            Ready For Your Next Adventure?
          </h2>
          <p className="max-w-xl font-sans text-base font-light leading-relaxed text-slate-200 sm:text-lg">
            Let us design a custom itinerary specifically configured for your group, dates, and choices. Tell us where you want to go and we will do the rest.
          </p>
          <div className="pt-3">
            <PrimaryButton
              variant="coral"
              size="lg"
              onClick={onStartPlanningClick}
              className="shadow-lg shadow-accent/20 transition-transform duration-300 hover:scale-[1.02]"
              rightIcon={<ArrowRight size={18} />}
            >
              Start Planning
            </PrimaryButton>
          </div>
        </div>
      </Container>
    </ParallaxBand>
  );
};

export default CTA;
