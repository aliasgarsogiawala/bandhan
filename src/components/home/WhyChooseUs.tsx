"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { whyChooseUs } from "@/data/mockData";

export const WhyChooseUs: React.FC = () => {
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
    <section id="why-choose-us" className="relative z-10 bg-sand-bg/50 py-20 sm:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Text details */}
          <div className="space-y-7 lg:col-span-5">
            <SectionTitle
              align="left"
              badge="Why Choose Us"
              title="We Guide You Across Every Detail"
              description="For over 15 years, Bandhan Tours has been leading domestic & international getaways. We believe that traveling is about exploring the true colors of life. Our group tours, family packages, and custom getaways ensure stress-free bookings, professional drivers, hand-picked hotels, and unique memories."
              className="max-w-xl"
            />

            {/* Quiet figures with hairline dividers */}
            <div className="flex items-center gap-8 border-t border-slate-200 pt-7">
              <div>
                <span className="font-heading text-4xl font-extrabold text-primary">98%</span>
                <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Customer Satisfaction
                </span>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div>
                <span className="font-heading text-4xl font-extrabold text-primary">120+</span>
                <span className="mt-1 block text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Unique Destinations
                </span>
              </div>
            </div>
          </div>

          {/* Right Metrics Grid */}
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7" stagger={0.09}>
            {whyChooseUs.map((item) => (
              <StaggerItem key={item.id} as="div" y={26}>
                <div className="group h-full rounded-[1.5rem] border border-slate-100 bg-white p-8 shadow-soft transition-all duration-500 hover:-translate-y-1 hover:border-primary/15 hover:shadow-[0_24px_55px_-30px_rgba(7,32,60,0.3)]">
                  {/* Icon Wrapper */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gold/12 text-gold-dark transition-colors duration-500 group-hover:bg-gold group-hover:text-primary">
                    {renderIcon(item.iconName)}
                  </div>

                  {/* Stat Number */}
                  <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-accent">
                    {item.stat}
                  </span>

                  {/* Title */}
                  <h4 className="mb-3 font-heading text-xl font-bold text-primary">{item.title}</h4>

                  {/* Description */}
                  <p className="font-sans text-sm leading-relaxed text-foreground-muted">
                    {item.description}
                  </p>
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
