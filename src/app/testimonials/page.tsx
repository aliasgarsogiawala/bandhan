import React from "react";
import Image from "next/image";
import type { Metadata } from "next";
import TestimonialsSection from "@/components/testimonials/TestimonialsSection";

export const metadata: Metadata = {
  title: "Guest Testimonials & Reviews | Bandhan Tours",
  description:
    "Read authentic guest reviews and travel stories from thousands of happy travellers who explored Kashmir, Sikkim, Kerala, Rajasthan, Scandinavia, Dubai, Thailand, and Singapore with Bandhan Tours.",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Top Page Banner */}
      <div className="relative overflow-hidden border-b border-white/10 py-12 pt-24 text-center">
        <Image
          src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&q=80&w=2000"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950" />
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="text-xs font-bold text-gold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
            Authentic Guest Feedback
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl text-white mt-4">
            Traveller Stories & Reviews
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mt-3 font-light">
            Discover why thousands of couples, families, and solo travellers trust Bandhan Tours to craft their dream vacations.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <TestimonialsSection />
    </main>
  );
}
