"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { featuredPackages } from "@/data/mockData";

export const FeaturedPackages: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"all" | "domestic" | "international">("all");

  const filteredPackages = featuredPackages.filter((pkg) => {
    if (activeTab === "all") return true;
    return pkg.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <section id="international-tours" className="py-16 sm:py-24 bg-sand-bg/40 relative z-10">
      <Container>
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <SectionTitle
            align="center"
            badge="Exclusive Offers"
            title="Featured Tour Packages"
            description="Hand-crafted holiday plans curated for couples, families, and group travelers."
          />

          {/* Filter Tabs */}
          <div className="inline-flex max-w-full flex-wrap justify-center gap-1 p-1 bg-white rounded-3xl sm:rounded-full shadow-soft border border-slate-100/50 mt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-primary text-white shadow-md"
                  : "text-foreground-muted hover:text-primary"
              }`}
            >
              All Packages
            </button>
            <button
              onClick={() => setActiveTab("domestic")}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "domestic"
                  ? "bg-primary text-white shadow-md"
                  : "text-foreground-muted hover:text-primary"
              }`}
            >
              Domestic Tours
            </button>
            <button
              onClick={() => setActiveTab("international")}
              className={`px-4 sm:px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                activeTab === "international"
                  ? "bg-primary text-white shadow-md"
                  : "text-foreground-muted hover:text-primary"
              }`}
            >
              International
            </button>
          </div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <Link
              key={pkg.id}
              href={`/packages/${pkg.id}`}
              className="group bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-xl hover:-translate-y-1 transition-all duration-500 flex flex-col h-full border border-slate-100/50 animate-scale-up"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <span className="absolute top-4 left-4 px-3 py-1 bg-accent text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md shadow-accent/20">
                    Popular
                  </span>
                )}
                
                {/* Duration Badge */}
                <span className="absolute bottom-4 right-4 px-3.5 py-1 bg-primary/90 text-white rounded-full text-xs font-semibold backdrop-blur-md shadow-sm">
                  {pkg.duration}
                </span>
              </div>

              {/* Package Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-primary mb-4 group-hover:text-accent transition-colors duration-300 line-clamp-1">
                  {pkg.title}
                </h3>

                {/* Highlights List */}
                <ul className="space-y-2 mb-6 flex-1">
                  {pkg.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-xs text-foreground-muted">
                      <svg
                        className="w-4 h-4 text-accent mt-0.5 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-sans line-clamp-1">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Footer and Price */}
                <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-foreground-muted uppercase tracking-wider font-bold block">
                      Starting price
                    </span>
                    <div className="text-xl font-extrabold text-primary">{pkg.price}</div>
                  </div>
                  
                  <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-full bg-primary text-white group-hover:bg-accent transition-colors duration-300">
                    View Details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all packages */}
        <div className="mt-14 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-primary/15 text-primary text-sm font-bold hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            View All Tour Packages
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedPackages;
