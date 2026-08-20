"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TestimonialItem } from "@/data/testimonialData";
import { TestimonialCard } from "./TestimonialCard";

interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
  onReadMore: (testimonial: TestimonialItem) => void;
  autoPlayInterval?: number;
}

export const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  onReadMore,
  autoPlayInterval = 4500,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalSlides = testimonials.length;
  const maxStartIndex = Math.max(0, totalSlides - visibleCount);
  const isPaused = isInteracting || Boolean(shouldReduceMotion);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setVisibleCount(3);
      } else if (window.matchMedia("(min-width: 640px)").matches) {
        setVisibleCount(2);
      } else {
        setVisibleCount(1);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const safeIndex = Math.min(prev, maxStartIndex);
      return safeIndex >= maxStartIndex ? 0 : safeIndex + 1;
    });
  }, [maxStartIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      const safeIndex = Math.min(prev, maxStartIndex);
      return safeIndex <= 0 ? maxStartIndex : safeIndex - 1;
    });
  }, [maxStartIndex]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(nextSlide, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoPlayInterval, nextSlide, totalSlides]);

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (testimonials.length === 0) return null;

  const activeIndex = Math.min(currentIndex, maxStartIndex);
  const currentTestimonial = testimonials[activeIndex];
  const slideWidth = `(100% - ${(visibleCount - 1) * 24}px) / ${visibleCount}`;

  return (
    <section
      className="relative w-full select-none"
      aria-roledescription="carousel"
      aria-label="Traveller stories"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") prevSlide();
        if (event.key === "ArrowRight") nextSlide();
      }}
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(false);
      }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="relative overflow-visible">
        <button
          type="button"
          onClick={prevSlide}
          className="group absolute left-0 top-1/2 z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-[#0b2138] text-white shadow-[0_18px_45px_-24px_rgba(0,0,0,0.9)] transition-all hover:border-gold hover:bg-gold hover:text-primary active:scale-95 max-sm:left-4 max-sm:translate-x-0"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="h-5 w-5 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="group absolute right-0 top-1/2 z-20 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-gold/45 bg-gold text-primary shadow-[0_18px_45px_-18px_rgba(254,209,79,0.42)] transition-all hover:bg-gold-light active:scale-95 max-sm:right-4 max-sm:translate-x-0"
          aria-label="Next testimonial"
        >
          <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </button>

        <div className="overflow-hidden rounded-[8px]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={visibleCount}
              initial={shouldReduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-6 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(calc(-${activeIndex} * (${slideWidth} + 24px)))`,
              }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="shrink-0"
                  style={{ flexBasis: `calc(${slideWidth})` }}
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${totalSlides}`}
                >
                  <TestimonialCard
                    testimonial={testimonial}
                    onReadMore={onReadMore}
                  />
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing reviews starting with {currentTestimonial.name}
      </p>
    </section>
  );
};

export default TestimonialCarousel;
