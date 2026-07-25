"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, CheckCircle2, MapPin, Calendar, ArrowRight, UserCheck, Languages } from "lucide-react";
import { TestimonialItem } from "@/data/testimonialData";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  onReadMore: (testimonial: TestimonialItem) => void;
  index?: number;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onReadMore,
  index = 0,
}) => {
  const {
    name,
    city,
    tour,
    destination,
    category,
    rating,
    review,
    shortReview,
    profileImage,
    tripImages,
    travelMonth,
    isVerified,
    tourManager,
    language = "English",
  } = testimonial;

  const displayReview = shortReview || review;
  const thumbnailPhoto = tripImages && tripImages.length > 0 ? tripImages[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4) }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="bg-slate-900/90 backdrop-blur-xl border border-white/15 hover:border-gold/60 rounded-3xl p-6 flex flex-col justify-between h-full shadow-xl hover:shadow-2xl hover:shadow-gold/15 transition-all duration-300 group text-white relative overflow-hidden"
    >
      {/* Top Gold Subtle Gradient Glow on Hover */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div>
        {/* Card Header: Rating & Category Badge */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < rating ? "fill-amber-400 text-amber-400" : "text-slate-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-amber-300">{rating}.0</span>
          </div>

          <div className="flex items-center gap-2">
            {language !== "English" && (
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/10 flex items-center gap-1" title={`Language: ${language}`}>
                <Languages className="w-3 h-3 text-gold" />
                {language}
              </span>
            )}
            <span className="text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-gold/15 text-gold border border-gold/30">
              {category}
            </span>
          </div>
        </div>

        {/* Tour Name & Destination */}
        <div className="mb-3">
          <h3 className="font-heading font-bold text-lg text-white group-hover:text-gold transition-colors line-clamp-1">
            {tour}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
            <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
            <span className="font-medium text-gold/90">{destination}</span>
          </div>
        </div>

        {/* Review snippet (supports English, Marathi, Hindi Devanagari) */}
        <div className="flex gap-4 items-start my-4">
          <div className="flex-1">
            <p className="text-sm text-slate-200 leading-relaxed font-sans line-clamp-3 font-light italic font-devanagari">
              &quot;{displayReview}&quot;
            </p>
            <button
              onClick={() => onReadMore(testimonial)}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold hover:text-amber-300 transition-colors group/btn cursor-pointer"
              aria-label={`Read full review by ${name}`}
            >
              <span>Read Full Review</span>
              <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {thumbnailPhoto && (
            <div
              onClick={() => onReadMore(testimonial)}
              className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-white/20 shadow-md group-hover:border-gold/50 cursor-pointer transition-colors"
            >
              <Image
                src={thumbnailPhoto}
                alt={`${tour} trip memory`}
                fill
                sizes="80px"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {tripImages.length > 1 && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center pb-1">
                  <span className="text-[9px] text-white font-medium bg-black/40 px-1.5 py-0.5 rounded">
                    +{tripImages.length} Photos
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: User Details & Verified Status */}
      <div className="pt-4 border-t border-white/10 mt-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-gold/60 shadow-inner flex-shrink-0">
            <Image
              src={profileImage}
              alt={name}
              fill
              sizes="44px"
              className="object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-semibold text-sm text-white leading-tight font-devanagari">
                {name}
              </h4>
              {isVerified && (
                <span title="Verified Customer">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{city}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {travelMonth}
              </span>
            </div>
          </div>
        </div>

        {tourManager && (
          <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-slate-400 bg-white/5 border border-white/10 px-2 py-1 rounded-lg">
            <UserCheck className="w-3 h-3 text-gold" />
            <span className="line-clamp-1 max-w-[90px]" title={`Manager: ${tourManager}`}>
              {tourManager}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
