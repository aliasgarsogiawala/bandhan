"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
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
  const [isPaused, setIsPaused] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Responsive items count detector
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else {
        setCardsToShow(3);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.ceil(testimonials.length / cardsToShow);
  const maxIndex = Math.max(0, testimonials.length - cardsToShow);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) {
        return 0; // Infinite loop wrap around
      }
      return prev + 1;
    });
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) {
        return maxIndex; // Infinite loop wrap around
      }
      return prev - 1;
    });
  }, [maxIndex]);

  // Auto-play timer
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, autoPlayInterval, nextSlide, totalPages]);

  // Handle mobile touch swipe
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
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (testimonials.length === 0) return null;

  // Active page indicator calculation
  const activePage = Math.floor(currentIndex / cardsToShow);

  return (
    <div
      className="relative w-full py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Carousel Track Window */}
      <div className="overflow-hidden px-1 py-4">
        <motion.div
          className="flex gap-6 transition-transform duration-500 ease-out"
          animate={{
            x: `-${currentIndex * (100 / cardsToShow + 24 / cardsToShow)}%`,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 28 }}
        >
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / cardsToShow}% - ${(24 * (cardsToShow - 1)) / cardsToShow}px)`,
              }}
            >
              <TestimonialCard testimonial={item} onReadMore={onReadMore} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation Controls Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 px-2">
        {/* Play/Pause indicator & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-gold transition-colors bg-white/5 border border-white/10 px-3 py-1.5 rounded-full"
            aria-label={isPaused ? "Play carousel auto-scroll" : "Pause carousel auto-scroll"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5 text-gold" /> : <Pause className="w-3.5 h-3.5 text-gold" />}
            <span className="font-medium">{isPaused ? "Paused" : "Auto-scrolling"}</span>
          </button>
          <span className="hidden sm:inline-block text-xs text-slate-400">
            Showing {currentIndex + 1} to {Math.min(currentIndex + cardsToShow, testimonials.length)} of{" "}
            {testimonials.length} reviews
          </span>
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, pageIdx) => {
            const isActive = pageIdx === activePage;
            return (
              <button
                key={pageIdx}
                onClick={() => setCurrentIndex(Math.min(pageIdx * cardsToShow, maxIndex))}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-8 bg-gold border border-amber-300"
                    : "w-2.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`Go to testimonial page ${pageIdx + 1}`}
              />
            );
          })}
        </div>

        {/* Previous & Next Arrows */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            className="w-11 h-11 rounded-full bg-slate-900 border border-white/20 hover:border-gold hover:bg-gold hover:text-slate-950 text-white flex items-center justify-center transition-all duration-300 shadow-md group active:scale-95"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={nextSlide}
            className="w-11 h-11 rounded-full bg-slate-900 border border-white/20 hover:border-gold hover:bg-gold hover:text-slate-950 text-white flex items-center justify-center transition-all duration-300 shadow-md group active:scale-95"
            aria-label="Next testimonials"
          >
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCarousel;
