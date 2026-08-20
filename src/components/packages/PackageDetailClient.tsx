"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { TourPackage } from "@/data/mockData";
import type { FullPackage } from "@/data/packageDetails";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { ViewingNow, SeatsLeft, RecentlyBooked, Countdown, endOfToday } from "@/components/ui/Urgency";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import PackageServiceDetails from "./PackageServiceDetails";

interface PackageDetailClientProps {
  pkg: FullPackage;
  relatedPackages: TourPackage[];
}

const SECTION_LINKS = [
  { id: "overview", label: "Overview" },
  { id: "itinerary", label: "Itinerary" },
  { id: "inclusions", label: "What's Included" },
  { id: "gallery", label: "Gallery" },
  { id: "faqs", label: "FAQs" },
];

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={`w-4 h-4 flex-shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

const CrossIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={`w-4 h-4 flex-shrink-0 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
      clipRule="evenodd"
    />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    aria-hidden="true"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export const PackageDetailClient: React.FC<PackageDetailClientProps> = ({
  pkg,
  relatedPackages,
}) => {
  const router = useRouter();
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const enquire = () => router.push(contactEnquiryHref(pkg.title));

  const quickFacts = [
    { label: "Duration", value: pkg.duration },
    { label: "Best Time", value: pkg.bestTime },
    { label: "Starts From", value: pkg.startingPoint },
    { label: "Group Size", value: pkg.groupSize },
  ];

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={enquire} />

      {/* Immersive hero */}
      <header className="relative flex min-h-[100svh] items-end pt-28 sm:h-[78vh] sm:min-h-[540px] sm:pt-0">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-deep/60" />

        <Container className="relative pb-10 sm:pb-20">
          <nav
            className="text-xs font-semibold uppercase tracking-wider text-white/70 mb-5"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="hover:text-gold transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/packages" className="hover:text-gold transition-colors">
              Tour Packages
            </Link>
            <span className="mx-2">/</span>
            <span className="hidden text-gold sm:inline">{pkg.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-gold text-primary rounded-full text-[10px] font-bold uppercase tracking-wider">
              {pkg.category}
            </span>
            {pkg.isPopular && (
              <span className="px-3 py-1 bg-accent text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                Popular
              </span>
            )}
            {pkg.themes.map((theme) => (
              <span
                key={theme}
                className="px-3 py-1 bg-white/15 backdrop-blur-md text-white rounded-full text-[10px] font-bold uppercase tracking-wider border border-white/20"
              >
                {theme}
              </span>
            ))}
          </div>

          <h1 className="max-w-4xl font-heading text-3xl font-extrabold leading-[1.06] tracking-[-0.015em] text-white min-[380px]:text-4xl sm:text-5xl lg:text-[4.25rem]">
            {pkg.title}
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-slate-200 sm:text-xl">
            {pkg.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {quickFacts.map((fact) => (
              <div
                key={fact.label}
                className="max-w-full rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md"
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider text-gold">
                  {fact.label}
                </span>
                <span className="block text-sm font-semibold text-white mt-0.5">
                  {fact.value}
                </span>
              </div>
            ))}
          </div>

          {pkg.brochureUrl && (
            <a
              href={pkg.brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-primary"
            >
              View original brochure
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </Container>
      </header>

      {/* Sticky in-page section nav */}
      <div className="sticky top-16 z-30 border-b border-slate-200/60 bg-blur-glass shadow-soft sm:top-[76px]">
        <Container className="flex items-center gap-1 overflow-x-auto py-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTION_LINKS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-foreground-muted hover:text-primary hover:bg-sand-dark whitespace-nowrap transition-colors duration-300"
            >
              {section.label}
            </a>
          ))}
          <Link
            href={`/book?type=package&id=${encodeURIComponent(pkg.id)}`}
            className="ml-auto hidden sm:inline-flex px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-accent text-white hover:bg-accent-dark transition-colors duration-300 whitespace-nowrap"
          >
            Book Now
          </Link>
        </Container>
      </div>

      <main className="flex-1 py-14 sm:py-20">
        <Container className="grid grid-cols-1 lg:grid-cols-[1fr_370px] gap-10 lg:gap-14 items-start">
          {/* ——— Main column ——— */}
          <div className="space-y-16 min-w-0">
            {/* Overview */}
            <ScrollReveal>
              <section id="overview" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Overview
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  The Journey at a Glance
                </h2>
                <p className="mt-4 text-foreground-muted font-sans leading-relaxed text-sm sm:text-base">
                  {pkg.overview}
                </p>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-center gap-3 px-4 py-3 bg-white rounded-2xl border border-slate-100/80 shadow-soft"
                    >
                      <CheckIcon className="text-accent" />
                      <span className="text-sm font-semibold text-primary">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* Itinerary timeline */}
            <ScrollReveal>
              <section id="itinerary" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Day by Day
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  Detailed Itinerary
                </h2>

                <div className="mt-8 relative">
                  {/* Timeline spine */}
                  <div
                    className="absolute left-[21px] top-4 bottom-4 w-px bg-slate-200"
                    aria-hidden="true"
                  />

                  <div className="space-y-3">
                    {pkg.itinerary.map((day) => {
                      const isOpen = openDay === day.day;
                      return (
                        <div key={day.day} className="relative pl-14">
                          {/* Day marker */}
                          <span
                            className={`absolute left-0 top-2.5 w-[43px] h-[43px] rounded-full flex-center text-xs font-extrabold border-4 border-sand transition-colors duration-300 ${
                              isOpen
                                ? "bg-accent text-white"
                                : "bg-white text-primary shadow-soft"
                            }`}
                            aria-hidden="true"
                          >
                            {String(day.day).padStart(2, "0")}
                          </span>

                          <div
                            className={`bg-white rounded-2xl border transition-all duration-300 ${
                              isOpen
                                ? "border-accent/30 shadow-premium"
                                : "border-slate-100/80 shadow-soft"
                            }`}
                          >
                            <button
                              onClick={() => setOpenDay(isOpen ? null : day.day)}
                              aria-expanded={isOpen}
                              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                            >
                              <div>
                                <span className="block text-[10px] font-bold uppercase tracking-wider text-accent">
                                  Day {day.day}
                                </span>
                                <span className="block text-sm sm:text-base font-heading font-bold text-primary mt-0.5">
                                  {day.title}
                                </span>
                              </div>
                              <ChevronIcon open={isOpen} />
                            </button>

                            <div
                              className={`grid transition-all duration-300 ease-out ${
                                isOpen
                                  ? "grid-rows-[1fr] opacity-100"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                                  <p className="text-sm text-foreground-muted font-sans leading-relaxed pt-3">
                                    {day.description}
                                  </p>
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="px-3 py-1 bg-sand-dark rounded-full text-[10px] font-bold uppercase tracking-wider text-primary/80">
                                      Meals: {day.meals}
                                    </span>
                                    {day.stay && (
                                      <span className="px-3 py-1 bg-sand-dark rounded-full text-[10px] font-bold uppercase tracking-wider text-primary/80">
                                        Overnight: {day.stay}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* Inclusions / Exclusions */}
            <ScrollReveal>
              <section id="inclusions" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  The Fine Print, Upfront
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  What&apos;s Included
                </h2>

                <PackageServiceDetails details={pkg.serviceDetails} />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl border border-slate-100/80 shadow-soft p-6 sm:p-8">
                    <h3 className="text-base font-heading font-bold text-primary flex items-center gap-2 mb-5">
                      <CheckIcon className="text-emerald-500 w-5 h-5" />
                      Inclusions
                    </h3>
                    <ul className="space-y-3">
                      {pkg.inclusions.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-foreground-muted font-sans"
                        >
                          <CheckIcon className="text-emerald-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-white rounded-3xl border border-slate-100/80 shadow-soft p-6 sm:p-8">
                    <h3 className="text-base font-heading font-bold text-primary flex items-center gap-2 mb-5">
                      <CrossIcon className="text-accent w-5 h-5" />
                      Exclusions
                    </h3>
                    <ul className="space-y-3">
                      {pkg.exclusions.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm text-foreground-muted font-sans"
                        >
                          <CrossIcon className="text-accent mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            </ScrollReveal>

            {/* Gallery */}
            <ScrollReveal>
              <section id="gallery" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Postcards From the Route
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  Trip Gallery
                </h2>

                <div className="mt-8 grid grid-cols-2 gap-4 auto-rows-[160px] sm:auto-rows-[200px]">
                  {pkg.gallery.map((item, index) => (
                    <div
                      key={item.image + index}
                      className={`group relative rounded-3xl overflow-hidden ${
                        index === 0 ? "col-span-2 row-span-2 sm:col-span-1" : ""
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-ink-deep/50 opacity-100 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100" />
                      <span className="absolute bottom-4 left-4 right-4 translate-y-0 text-sm font-semibold text-white opacity-100 transition-all duration-500 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
                        {item.caption}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {/* FAQs */}
            <ScrollReveal>
              <section id="faqs" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Good to Know
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  Frequently Asked Questions
                </h2>

                <div className="mt-8 space-y-3">
                  {pkg.faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={faq.question}
                        className={`bg-white rounded-2xl border transition-all duration-300 ${
                          isOpen
                            ? "border-accent/30 shadow-premium"
                            : "border-slate-100/80 shadow-soft"
                        }`}
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                        >
                          <span className="text-sm sm:text-base font-heading font-bold text-primary">
                            {faq.question}
                          </span>
                          <ChevronIcon open={isOpen} />
                        </button>
                        <div
                          className={`grid transition-all duration-300 ease-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="px-5 pb-5 text-sm text-foreground-muted font-sans leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </ScrollReveal>
          </div>

          {/* ——— Sticky booking sidebar ——— */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 overflow-hidden">
              <div className="bg-primary px-6 py-6 text-white relative overflow-hidden">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold block">
                  Starting From
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold font-heading">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-slate-300">per person</span>
                </div>
                <span className="text-xs text-slate-300 block mt-1">
                  {pkg.duration} · twin sharing
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Urgency / scarcity */}
                <div className="rounded-2xl bg-sand-dark/50 border border-slate-100 p-4 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <SeatsLeft seed={pkg.id} />
                    <RecentlyBooked seed={pkg.id} />
                  </div>
                  <ViewingNow seed={pkg.id} className="text-xs text-foreground-muted" />
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/70">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Offer ends in
                    </span>
                    <Countdown target={endOfToday()} className="text-accent text-base" />
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {pkg.inclusions.slice(0, 4).map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs text-foreground-muted font-sans"
                    >
                      <CheckIcon className="text-emerald-500 mt-0.5" />
                      <span className="line-clamp-1">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/book?type=package&id=${encodeURIComponent(pkg.id)}`}
                  className="inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
                >
                  Book Now
                </Link>

                <SecondaryButton
                  variant="outline-navy"
                  size="md"
                  fullWidth
                  onClick={enquire}
                >
                  Enquire About This Tour
                </SecondaryButton>

                <a
                  href="tel:+919876543210"
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full border-2 border-primary/15 text-primary text-sm font-semibold hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Talk to a Trip Designer
                </a>

                <p className="text-[11px] text-foreground-light text-center font-sans leading-relaxed">
                  No advance needed to enquire · Free itinerary customisation ·
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Trust card */}
            <div className="bg-sand-dark/60 rounded-3xl p-6 border border-slate-100/60">
              <h3 className="text-sm font-heading font-bold text-primary mb-4">
                Why book with Bandhan?
              </h3>
              <ul className="space-y-3 text-xs text-foreground-muted font-sans">
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="text-gold-dark mt-0.5" />
                  <span>15+ years crafting group & custom tours</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="text-gold-dark mt-0.5" />
                  <span>5,000+ happy travellers and counting</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon className="text-gold-dark mt-0.5" />
                  <span>24×7 on-tour support in every destination</span>
                </li>
              </ul>
            </div>
          </aside>
        </Container>

        {/* Related packages */}
        {relatedPackages.length > 0 && (
          <Container className="mt-20 sm:mt-28">
            <ScrollReveal>
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Keep Exploring
                  </span>
                  <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href="/packages"
                  className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors duration-300 whitespace-nowrap"
                >
                  View all packages
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPackages.map((related) => (
                  <Link
                    key={related.id}
                    href={`/packages/${related.id}`}
                    className="group relative h-64 rounded-3xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-500"
                  >
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink-deep/55" />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                        {related.duration}
                      </span>
                      <h3 className="text-base font-heading font-bold text-white mt-1 group-hover:text-gold transition-colors duration-300 line-clamp-2">
                        {related.title}
                      </h3>
                      <span className="text-xs text-slate-300 mt-1 block">
                        from{" "}
                        <span className="font-bold text-white">
                          {related.price}
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          </Container>
        )}
      </main>

      <Footer />

    </div>
  );
};

export default PackageDetailClient;
