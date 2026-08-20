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
      className="py-24 sm:py-32 lg:py-40"
    >
      <Container>
        <div className="max-w-2xl text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Tailor-made trips</p>
          <h2 className="mt-4 font-heading text-4xl font-bold leading-tight tracking-[-0.03em] sm:text-5xl">
            Have a trip in mind? Let&apos;s make it practical.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">
            Tell us the destination, dates, and pace you prefer. We&apos;ll return with a clear route and honest pricing.
          </p>
          <PrimaryButton variant="coral" size="md" onClick={onStartPlanningClick} className="mt-8 !rounded-lg" rightIcon={<ArrowRight size={18} />}>
            Start planning
          </PrimaryButton>
        </div>
      </Container>
    </ParallaxBand>
  );
};

export default CTA;
