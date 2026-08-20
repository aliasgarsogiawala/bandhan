"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import type { WhyChooseItem } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";

export const WhyChooseUs: React.FC = () => {
  const { items: whyChooseUs } = useCollection<WhyChooseItem>("features");
  // Render custom icons based on name
  const renderIcon = (name: string) => {
    const baseClass = "w-6 h-6 stroke-[2]";
    switch (name) {
      case "experience":
        return (
          <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
          </svg>
        );
      case "happy":
        return (
          <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case "planning":
        return (
          <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21 3 6" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        );
      case "support":
        return (
          <svg className={baseClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <section id="why-choose-us" className="relative z-10 bg-white py-16 sm:py-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <SectionTitle
              align="left"
              badge="Why Bandhan"
              title="Good planning should feel invisible"
              description="We take care of the decisions that make a trip work: sensible routes, reliable stays, clear pricing, and help when you need it."
              className="max-w-xl"
            />
            <div className="mt-8 flex items-center gap-7 border-t border-primary/10 pt-6">
              <div>
                <span className="font-heading text-3xl font-bold text-primary">15+</span>
                <span className="mt-1 block text-xs text-foreground-muted">years planning travel</span>
              </div>
              <div className="h-10 w-px bg-primary/10" />
              <div>
                <span className="font-heading text-3xl font-bold text-primary">120+</span>
                <span className="mt-1 block text-xs text-foreground-muted">destinations covered</span>
              </div>
            </div>
          </div>

          <Stagger className="grid border-t border-primary/10 sm:grid-cols-2" stagger={0.05}>
            {whyChooseUs.map((item) => (
              <StaggerItem key={item.id} as="div" y={16}>
                <div className="h-full border-b border-primary/10 px-0 py-7 sm:px-6 sm:odd:border-r">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-sand text-primary">
                    {renderIcon(item.iconName)}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-foreground-muted">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
