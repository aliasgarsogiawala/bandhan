"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface CTAProps {
  onStartPlanningClick: () => void;
}

export const CTA: React.FC<CTAProps> = ({ onStartPlanningClick }) => {
  return (
    <section id="special-packages" className="relative z-10 overflow-hidden py-24 sm:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=90&w=3200"
          alt="Adventure Background"
          fill
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Calmer, deeper navy gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/80 via-45% to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,transparent_60%,rgba(3,12,23,0.22)_100%)]" />
      </div>

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
    </section>
  );
};

export default CTA;
