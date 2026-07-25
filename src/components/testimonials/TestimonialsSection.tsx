"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, MessageSquarePlus, Compass } from "lucide-react";
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
      className={`py-16 sm:py-24 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white relative overflow-hidden ${className}`}
    >
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[140px] pointer-events-none" />

      <Container className="relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs sm:text-sm font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Guest Reviews & Experiences</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-white tracking-tight leading-tight"
          >
            Trusted by Thousands of <span className="text-gold">Happy Travellers</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 font-light leading-relaxed"
          >
            Real experiences shared by our valued customers who explored incredible destinations with
            Bandhan Tours.
          </motion.p>
        </div>

        {/* Trust Statistics Section */}
        <TrustStatistics />

        {/* Horizontal Testimonials Carousel (3 cards visible on desktop, 2 on tablet, 1 on mobile) */}
        <div className="mt-4">
          <TestimonialCarousel
            testimonials={testimonialData}
            onReadMore={handleOpenReviewModal}
          />
        </div>

        {/* Bottom CTA Bar */}
        <div className="mt-16 bg-gradient-to-r from-gold/10 via-white/5 to-gold/10 border border-gold/30 rounded-3xl p-6 sm:p-10 flex flex-wrap items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">
              Have you travelled with Bandhan Tours recently?
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Share your wonderful journey and inspire thousands of fellow travellers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto">
            <a
              href="https://g.page/r/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gold hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg hover:shadow-gold/20"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </a>
            <a
              href="/packages"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <Compass className="w-4 h-4 text-gold" />
              <span>Explore All Tours</span>
            </a>
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
