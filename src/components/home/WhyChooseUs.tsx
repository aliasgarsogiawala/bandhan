"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
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
    <section id="why-choose-us" className="py-16 sm:py-24 bg-white relative z-10">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          
          {/* Left Text details */}
          <div className="lg:col-span-5 space-y-6">
            <SectionTitle
              align="left"
              badge="Why Choose Us"
              title="We Guide You Across Every Detail"
              description="For over 15 years, Bandhan Tours has been leading domestic & international getaways. We believe that traveling is about exploring the true colors of life. Our group tours, family packages, and custom getaways ensure stress-free bookings, professional drivers, hand-picked hotels, and unique memories."
              className="max-w-xl"
            />
            
            {/* Soft decorative element */}
            <div className="pt-6 border-t border-slate-100 flex items-center gap-6">
              <div>
                <span className="text-4xl font-extrabold text-primary font-heading block">98%</span>
                <span className="text-xs text-foreground-muted uppercase font-bold tracking-wider">Customer Satisfaction</span>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div>
                <span className="text-4xl font-extrabold text-primary font-heading block">120+</span>
                <span className="text-xs text-foreground-muted uppercase font-bold tracking-wider">Unique Destinations</span>
              </div>
            </div>
          </div>

          {/* Right Metrics Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyChooseUs.map((item) => (
              <div
                key={item.id}
                className="group p-8 rounded-3xl bg-sand/35 hover:bg-primary hover:text-white transition-all duration-500 border border-slate-100/50 shadow-soft hover:shadow-xl hover:-translate-y-1"
              >
                {/* Icon Wrapper */}
                <div className="w-12 h-12 rounded-2xl bg-accent/10 group-hover:bg-white/10 text-accent group-hover:text-gold flex items-center justify-center mb-6 transition-colors duration-500 shadow-inner">
                  {renderIcon(item.iconName)}
                </div>

                {/* Stat Number */}
                <span className="text-xs font-bold text-accent group-hover:text-gold uppercase tracking-wider block mb-1">
                  {item.stat}
                </span>

                {/* Title */}
                <h4 className="text-xl font-bold font-heading text-primary group-hover:text-white mb-3 transition-colors duration-300">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-sm text-foreground-muted group-hover:text-slate-300 leading-relaxed font-sans transition-colors duration-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </Container>
    </section>
  );
};

export default WhyChooseUs;
