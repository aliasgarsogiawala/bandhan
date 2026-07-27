"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2, MapPin, Calendar, Camera, Quote } from "lucide-react";
import { TestimonialItem } from "@/data/testimonialData";

interface ReviewModalProps {
  isOpen: boolean;
  testimonial: TestimonialItem | null;
  onClose: () => void;
  onOpenLightbox: (photoIndex: number) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  testimonial,
  onClose,
  onOpenLightbox,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !testimonial) return null;

  const {
    name,
    city,
    tour,
    destination,
    rating,
    review,
    profileImage,
    tripImages,
    travelMonth,
    isVerified,
  } = testimonial;

  const heroImage = tripImages?.[0];
  const galleryImages = tripImages?.slice(1) || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6 md:p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#020812]/85 backdrop-blur-xl transition-opacity"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 24 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          className="relative z-10 my-8 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/[0.12] bg-[#061625] text-white shadow-[0_40px_140px_-55px_rgba(0,0,0,0.95)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="pointer-events-none absolute inset-x-10 top-0 z-20 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

          <div className="relative min-h-[220px] overflow-hidden border-b border-white/[0.08] sm:min-h-[280px]">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={`${tour} memory`}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
                priority={false}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-primary-dark" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061625] via-[#061625]/25 to-[#061625]/10" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div className="max-w-2xl">
                  <div className="mb-3 flex items-center gap-2 text-xs font-medium text-white/70">
                    <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                    <span>{destination}</span>
                  </div>
                  <h2 id="modal-title" className="font-heading text-2xl font-semibold leading-tight text-white sm:text-4xl">
                    {tour}
                  </h2>
                </div>

                <div className="flex items-center gap-1 text-gold" aria-label={`${rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < rating ? "fill-gold text-gold" : "text-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/25 text-white backdrop-blur-md transition-colors duration-200 hover:bg-gold hover:text-primary"
              aria-label="Close review modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:p-10">
              <aside className="lg:border-r lg:border-white/[0.08] lg:pr-8">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-gold/55 ring-4 ring-gold/[0.06]">
                    <Image
                      src={profileImage}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-devanagari text-lg font-semibold text-white">
                        {name}
                      </h3>
                      {isVerified && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-label="Verified traveller" />
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/45">
                      <span>{city}</span>
                      <span aria-hidden="true">•</span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gold/80" aria-hidden="true" />
                        {travelMonth}
                      </span>
                    </div>
                  </div>
                </div>

                {galleryImages.length > 0 && (
                  <div className="mt-8 border-t border-white/[0.08] pt-6">
                    <div className="mb-4 flex items-center gap-2 text-sm text-white/70">
                      <Camera className="h-4 w-4 text-gold" aria-hidden="true" />
                      <span>{tripImages.length} photos</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-2">
                      {tripImages.map((imgUrl, idx) => (
                        <button
                          key={imgUrl}
                          onClick={() => onOpenLightbox(idx)}
                          className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.12] transition-all duration-300 hover:border-gold/70"
                          aria-label={`Open ${tour} photo ${idx + 1}`}
                        >
                          <Image
                            src={imgUrl}
                            alt={`${tour} photo ${idx + 1}`}
                            fill
                            sizes="160px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </aside>

              <div className="relative">
                <Quote className="pointer-events-none absolute -left-2 -top-4 h-14 w-14 rotate-180 fill-gold/[0.035] text-gold/[0.08]" />
                <p className="relative pl-6 font-devanagari text-lg font-light leading-[1.8] text-white/88 sm:text-xl">
                  {review}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/[0.08] bg-white/[0.025] p-4 text-xs text-white/45 sm:px-8">
            <span>Bandhan Tours</span>
            <button
              onClick={onClose}
              className="rounded-full bg-gold px-5 py-2.5 font-semibold text-primary transition-colors hover:bg-gold-light"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
