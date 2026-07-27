"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Compass, MessageSquarePlus, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { testimonialData, TestimonialItem } from "@/data/testimonialData";
import { TrustStatistics } from "./TrustStatistics";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { ReviewModal } from "./ReviewModal";
import { ImageLightbox } from "./ImageLightbox";

interface TestimonialsSectionProps {
  className?: string;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  className = "",
}) => {
  const [activeModalItem, setActiveModalItem] = useState<TestimonialItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Lightbox state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const handleOpenReviewModal = (testimonial: TestimonialItem) => {
    setActiveModalItem(testimonial);
    setIsModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsModalOpen(false);
    setActiveModalItem(null);
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
      className={`relative isolate z-30 overflow-hidden bg-[#061625] py-14 text-white sm:py-16 lg:py-20 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="pointer-events-none absolute -left-48 top-1/4 h-[460px] w-[460px] rounded-full bg-primary-light/15 blur-[150px]" />
      <div className="pointer-events-none absolute -right-52 bottom-0 h-[500px] w-[500px] rounded-full bg-gold/[0.03] blur-[150px]" />

      <Container className="relative z-10">
        <div className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold"
          >
            <span className="text-sm" aria-hidden="true">✨</span>
            <span>The Bandhan standard</span>
          </motion.div>

          <motion.h2
            id="guest-stories-title"
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-3xl font-semibold leading-[1.08] tracking-normal text-white sm:text-4xl md:text-5xl"
          >
            Journeys remembered.
            <span className="block font-light text-white/55">Stories worth sharing.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-2xl text-sm font-light leading-relaxed text-white/55 sm:text-base"
          >
            In their own words—thoughtful itineraries, warm hospitality, and the
            little details that turned a holiday into a lifelong memory.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-5 flex items-center justify-center gap-3 text-xs text-white/45"
          >
            <span className="flex items-center gap-1 text-gold" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-3.5 w-3.5 fill-gold" aria-hidden="true" />
              ))}
            </span>
            <span>5.0 average from verified travellers</span>
          </motion.div>
        </div>

        <TrustStatistics />

        <div>
          <TestimonialCarousel
            testimonials={testimonialData}
            onReadMore={handleOpenReviewModal}
          />
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/[0.08] pt-7 text-center sm:flex-row sm:text-left">
          <div>
            <h3 className="font-heading text-xl font-semibold text-white">
              Your journey deserves a chapter here.
            </h3>
            <p className="mt-1.5 text-sm text-white/45">
              Travelled with us recently? Share the moment you still talk about.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://g.page/r/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-semibold text-primary shadow-[0_12px_35px_-15px_rgba(254,209,79,0.75)] transition-colors hover:bg-gold-light"
            >
              <MessageSquarePlus className="h-4 w-4" aria-hidden="true" />
              <span>Write a Review</span>
            </a>
            <Link
              href="/packages"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Compass className="h-4 w-4" aria-hidden="true" />
              <span>Explore All Tours</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </Container>

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        testimonial={activeModalItem}
        onClose={handleCloseReviewModal}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Image Lightbox */}
      {activeModalItem && (
        <ImageLightbox
          isOpen={isLightboxOpen}
          images={activeModalItem.tripImages || []}
          currentIndex={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
          title={`${activeModalItem.name}'s ${activeModalItem.tour} Photos`}
        />
      )}
    </section>
  );
};

export default TestimonialsSection;
