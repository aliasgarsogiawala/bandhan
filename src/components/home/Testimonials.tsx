"use client";

import React from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { testimonials } from "@/data/mockData";

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative z-10">
      {/* Decorative backdrop blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] rounded-full bg-white blur-3xl transform rotate-12" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[120%] rounded-full bg-accent blur-3xl" />
      </div>

      <Container className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto space-y-4">
          <SectionTitle
            align="center"
            title="Traveler Stories"
            description="Read authentic experiences shared by our loyal community of travelers."
            className="text-white"
          />
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl flex flex-col justify-between hover:bg-white/15 transition-all duration-300 shadow-glass"
            >
              <div>
                {/* Stars */}
                <div className="flex gap-1 text-gold mb-6">
                  {Array.from({ length: test.rating }).map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-base leading-relaxed text-slate-200 mb-8 font-light italic font-sans">
                  &quot;{test.review}&quot;
                </p>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 border-t border-white/10 pt-6 mt-auto">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/30">
                  <Image
                    src={test.photo}
                    alt={test.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-base leading-tight">
                    {test.name}
                  </h4>
                  <span className="text-xs text-gold uppercase tracking-wider font-semibold">
                    {test.destination}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
