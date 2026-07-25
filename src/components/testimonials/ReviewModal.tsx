"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, CheckCircle2, MapPin, Calendar, UserCheck, Camera, Quote } from "lucide-react";
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
    category,
    rating,
    review,
    profileImage,
    tripImages,
    travelMonth,
    isVerified,
    tourManager,
  } = testimonial;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-white/20 rounded-3xl shadow-2xl overflow-hidden z-10 text-white my-8 max-h-[90vh] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Top Decorative Gradient */}
          <div className="h-2 w-full bg-gradient-to-r from-amber-500 via-gold to-amber-300" />

          {/* Modal Header */}
          <div className="p-6 sm:p-8 border-b border-white/10 flex items-start justify-between gap-4 relative bg-slate-900/80">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold flex-shrink-0 shadow-lg">
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="modal-title" className="font-heading font-bold text-xl sm:text-2xl text-white">
                    {name}
                  </h2>
                  {isVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified Guest
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                  <span>{city}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {travelMonth}
                  </span>
                  <span>•</span>
                  <span className="font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                    {category}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/10 hover:bg-gold hover:text-slate-950 text-white transition-colors duration-200"
              aria-label="Close review modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Tour & Rating Banner */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Tour Experience
                </div>
                <h3 className="font-heading font-bold text-lg text-gold mt-0.5">{tour}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  <span>{destination}</span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-400 mt-1">{rating}.0 / 5.0 Star Rating</span>
              </div>
            </div>

            {/* Full Review Text */}
            <div className="relative">
              <Quote className="w-10 h-10 text-gold/20 absolute -top-4 -left-2 rotate-180 pointer-events-none" />
              <p className="text-base text-slate-200 leading-relaxed font-light pl-6 font-devanagari">
                {review}
              </p>
            </div>

            {/* Tour Manager / Guide Badge (if present) */}
            {tourManager && (
              <div className="bg-gold/10 border border-gold/30 rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gold uppercase tracking-wider font-semibold">
                    Tour Manager / Guide
                  </div>
                  <div className="text-sm font-semibold text-white">{tourManager}</div>
                </div>
              </div>
            )}

            {/* Travel Photo Gallery */}
            {tripImages && tripImages.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                    <Camera className="w-4 h-4 text-gold" />
                    Guest Photo Memories ({tripImages.length})
                  </h4>
                  <span className="text-xs text-slate-400">Click any image to enlarge</span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {tripImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => onOpenLightbox(idx)}
                      className="relative h-24 sm:h-28 rounded-xl overflow-hidden border border-white/20 hover:border-gold transition-all duration-300 group shadow-md"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${tour} photo ${idx + 1}`}
                        fill
                        sizes="200px"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 sm:px-8 border-t border-white/10 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
            <span>Bandhan Tours • Authentic Verified Feedback</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gold text-slate-950 font-bold hover:bg-amber-400 transition-colors"
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
