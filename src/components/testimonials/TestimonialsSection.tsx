"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, MessageSquarePlus, ShieldCheck, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { testimonialData, TestimonialItem } from "@/data/testimonialData";
import { TrustStatistics } from "./TrustStatistics";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { ReviewModal } from "./ReviewModal";
import { ImageLightbox } from "./ImageLightbox";

interface TestimonialsSectionProps {
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ className = "" }) => {
  const [activeModalItem, setActiveModalItem] = useState<TestimonialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenReviewModal = (testimonial: TestimonialItem) => {
    setActiveModalItem(testimonial);
    setIsModalOpen(true);
  };

  const handleOpenLightbox = (photoIndex: number) => {
    setLightboxIndex(photoIndex);
    setIsLightboxOpen(true);
  };

  return (
    <section
      id="guest-stories"
      data-plane-safe-zone="testimonials"
      aria-labelledby="guest-stories-title"
      className={`relative isolate z-30 overflow-hidden bg-[#061625] py-14 text-white sm:py-20 lg:py-24 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute -left-52 top-0 h-[520px] w-[520px] rounded-full bg-primary-light/20 blur-[150px]" />
      <div className="pointer-events-none absolute -right-48 top-12 h-[430px] w-[430px] rounded-full bg-gold/[0.08] blur-[140px]" />

      <Container className="relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-16">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-5 inline-flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-gold"
            >
              <span className="h-px w-8 bg-gold/70" aria-hidden="true" />
              Traveller voices
            </motion.div>

            <motion.h2
              id="guest-stories-title"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="font-heading text-3xl font-semibold leading-[1.06] text-white min-[380px]:text-4xl sm:text-5xl lg:text-6xl"
            >
              Not just trips.
              <span className="block font-light text-white/55">Memories worth carrying home.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.16 }}
              className="mt-5 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base"
            >
              Thoughtful itineraries, warm hospitality, and the little details that turn a holiday
              into a story guests keep telling.
            </motion.p>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[1.75rem] border border-gold/30 bg-gradient-to-br from-[#102c47] to-[#081a2d] p-5 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.9)] sm:p-6"
          >
            <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full border border-gold/10" />
            <div className="relative">
              <div className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-gold">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Trusted by travellers
              </div>
              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="font-heading text-4xl font-semibold text-white">15,000+</p>
                  <p className="mt-1 text-sm text-white/55">happy travellers</p>
                </div>
                <div className="border-l border-white/15 pl-5">
                  <p className="font-heading text-2xl font-semibold text-white">5.0<span className="text-sm text-white/45">/5</span></p>
                  <div className="mt-1 flex gap-0.5 text-gold" aria-label="5 out of 5 stars">
                    {Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-3.5 w-3.5 fill-gold" aria-hidden="true" />)}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center">
                {testimonialData.slice(0, 5).map((testimonial, index) => (
                  <Image
                    key={testimonial.id}
                    src={testimonial.profileImage}
                    alt=""
                    width={40}
                    height={40}
                    className={`h-10 w-10 rounded-full border-2 border-[#102c47] object-cover ${index ? "-ml-2" : ""}`}
                  />
                ))}
                <span className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#102c47] bg-white/10 text-[10px] font-bold text-white/75">25K+</span>
              </div>
              <p className="mt-4 text-xs text-white/45">And many more stories still being written.</p>
            </div>
          </motion.aside>
        </div>

        <div className="mt-12">
          <TrustStatistics />
        </div>

        <div className="mt-3">
          <TestimonialCarousel testimonials={testimonialData} onReadMore={handleOpenReviewModal} />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-gold/20 bg-gradient-to-r from-[#0d263f] to-[#091c30] px-6 py-6 shadow-[0_24px_70px_-42px_rgba(0,0,0,0.9)] sm:flex-row sm:px-8 sm:text-left">
          <div>
            <h3 className="font-heading text-xl font-semibold text-white">Every journey has a story.</h3>
            <p className="mt-1.5 text-sm text-white/45">Share yours and inspire the next traveller.</p>
          </div>
          <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
            <a href="https://g.page/r/review" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-primary shadow-[0_12px_35px_-15px_rgba(254,209,79,0.75)] transition-colors hover:bg-gold-light">
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" /> Write a Review
            </a>
            <Link href="/packages" className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gold/35 px-5 py-3 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-primary">
              <Compass className="h-4 w-4" aria-hidden="true" /> Explore Journeys <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>

      <ReviewModal isOpen={isModalOpen} testimonial={activeModalItem} onClose={() => { setIsModalOpen(false); setActiveModalItem(null); }} onOpenLightbox={handleOpenLightbox} />
      {activeModalItem && <ImageLightbox isOpen={isLightboxOpen} images={activeModalItem.tripImages || []} currentIndex={lightboxIndex} onClose={() => setIsLightboxOpen(false)} onNavigate={setLightboxIndex} title={`${activeModalItem.name}'s ${activeModalItem.tour} Photos`} />}
    </section>
  );
};

export default TestimonialsSection;
