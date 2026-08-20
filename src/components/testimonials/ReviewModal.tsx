"use client";

import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Camera, CheckCircle2, MapPin, Quote, Star, X } from "lucide-react";
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
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    },
    [isOpen, onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !testimonial) return null;

  const { name, city, tour, destination, rating, review, profileImage, tripImages, travelMonth, isVerified } = testimonial;
  const heroImage = tripImages?.[0];

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-center justify-center overflow-hidden p-0 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#020812]/90 backdrop-blur-xl"
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 20 }}
          transition={{ type: "spring", duration: 0.45, bounce: 0.08 }}
          className="relative z-10 flex h-[100dvh] max-h-[100dvh] w-full max-w-6xl flex-col overflow-hidden border border-gold/25 bg-[#061625] text-white shadow-[0_40px_140px_-55px_rgba(0,0,0,0.95)] sm:my-6 sm:h-auto sm:max-h-[92vh] sm:rounded-[1.75rem]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="pointer-events-none absolute inset-x-12 top-0 z-20 h-px bg-gold/50" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-[max(0.75rem,env(safe-area-inset-top))] z-30 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-[#061625]/75 text-white backdrop-blur-md transition-colors hover:border-gold hover:bg-gold hover:text-primary sm:right-4 sm:top-4"
            aria-label="Close review modal"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[220px] overflow-hidden sm:min-h-[340px] lg:min-h-[390px]">
                {heroImage ? (
                  <Image
                    src={heroImage}
                    alt={`${tour} memory`}
                    fill
                    sizes="(min-width: 1024px) 55vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] hover:scale-105"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary" />
                )}
                <div className="absolute inset-0 bg-ink-deep/55 lg:" />
                <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-white/15 bg-[#061625]/70 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur-md sm:bottom-7 sm:left-7">
                  <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
                  {destination}
                </div>
              </div>

              <div className="flex flex-col justify-center bg-ink-soft p-6 sm:p-9 lg:p-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">A traveller story</p>
                <h2 id="modal-title" className="mt-4 max-w-xl font-heading text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  {tour}
                </h2>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 text-gold" aria-label={`${rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className={`h-4 w-4 ${index < rating ? "fill-gold text-gold" : "text-white/20"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-white/70">{rating}.0 rating</span>
                </div>
                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-gold/60">
                    <Image src={profileImage} alt="" fill sizes="48px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate font-devanagari text-base font-semibold text-white">{name}</h3>
                      {isVerified && <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-label="Verified traveller" />}
                    </div>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
                      <span>{city}</span><span aria-hidden="true">•</span>
                      <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3 text-gold/80" aria-hidden="true" />{travelMonth}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1fr_280px] lg:p-10">
              <div className="relative">
                <Quote className="pointer-events-none absolute -left-2 -top-5 h-16 w-16 rotate-180 fill-gold/[0.05] text-gold/[0.15]" aria-hidden="true" />
                <p className="relative max-w-2xl pl-7 font-devanagari text-lg font-light leading-[1.85] text-white/85 sm:text-xl">{review}</p>
              </div>

              {tripImages && tripImages.length > 0 && (
                <aside className="border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white/75">
                      <Camera className="h-4 w-4 text-gold" aria-hidden="true" />
                      Trip memories
                    </div>
                    <span className="text-xs text-white/40">{tripImages.length} photos</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2.5 lg:grid-cols-2">
                    {tripImages.map((image, index) => (
                      <button
                        type="button"
                        key={image}
                        onClick={() => onOpenLightbox(index)}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 transition-colors hover:border-gold/70"
                        aria-label={`Open ${tour} photo ${index + 1}`}
                      >
                        <Image src={image} alt={`${tour} photo ${index + 1}`} fill sizes="140px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-transparent" />
                      </button>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-white/10 bg-white/[0.03] px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 sm:px-9 sm:py-4">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">Bandhan Tours</span>
            <button type="button" onClick={onClose} className="rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-gold-light">Close story</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body,
  );
};

export default ReviewModal;
