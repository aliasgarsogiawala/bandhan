"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  MapPin,
  Quote,
  Star,
} from "lucide-react";
import { TestimonialItem } from "@/data/testimonialData";

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  onReadMore: (testimonial: TestimonialItem) => void;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  testimonial,
  onReadMore,
}) => {
  const {
    name,
    city,
    tour,
    destination,
    rating,
    review,
    shortReview,
    profileImage,
    tripImages,
    travelMonth,
    isVerified,
  } = testimonial;

  const displayReview = shortReview || review;
  const thumbnailPhoto = tripImages && tripImages.length > 0 ? tripImages[0] : null;

  return (
    <article
      className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/[0.11] bg-white/[0.04] shadow-[0_28px_80px_-54px_rgba(0,0,0,0.95)] backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-x-8 top-0 z-20 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative h-40 shrink-0 overflow-hidden sm:h-44">
        {thumbnailPhoto ? (
          <Image
            src={thumbnailPhoto}
            alt={`${tour} trip memory`}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
            priority={false}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-primary-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#061625]/85 via-[#061625]/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <div className="mb-1.5 flex items-center gap-2 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-white/65">
            <MapPin className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            {destination}
          </div>
          <p className="line-clamp-2 font-heading text-lg font-semibold leading-snug text-white">
            {tour}
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col justify-between p-5 sm:p-6">
        <Quote
          className="absolute right-5 top-5 h-12 w-12 fill-gold/[0.03] text-gold/[0.07]"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-gold" aria-label={`${rating} out of 5 stars`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < rating ? "fill-gold text-gold" : "text-white/15"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-white/75">{rating}.0</span>
            </div>
          </div>
          <blockquote className="line-clamp-4 font-devanagari text-base font-light leading-[1.65] text-white/86">
            “{displayReview}”
          </blockquote>

          <button
            type="button"
            onClick={() => onReadMore(testimonial)}
            className="group/button mt-5 inline-flex cursor-pointer items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:text-gold-light"
            aria-label={`Read the full review by ${name}`}
          >
            Read their full story
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>

        <footer className="mt-6 border-t border-white/[0.08] pt-5">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-3.5">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-gold/45 ring-4 ring-gold/[0.05]">
                <Image
                  src={profileImage}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate font-devanagari text-sm font-semibold text-white">
                    {name}
                  </h3>
                  {isVerified && (
                    <span title="Verified Bandhan traveller">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                    </span>
                  )}
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-[0.7rem] text-white/45">
                  <span>{city}</span>
                  <span aria-hidden="true">•</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    {travelMonth}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default TestimonialCard;
