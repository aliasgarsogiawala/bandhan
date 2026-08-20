"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ArrowRight, CalendarDays, Clock3, Download, Expand, MapPin, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Lightbox } from "@/components/ui/Lightbox";
import type { TourPackage } from "@/data/mockData";
import type { FullPackage } from "@/data/packageDetails";
import { contactEnquiryHref } from "@/lib/enquiryLink";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import PackageServiceDetails from "./PackageServiceDetails";

interface PackageDetailClientProps {
  pkg: FullPackage;
  relatedPackages: TourPackage[];
}

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
  const [openDay, setOpenDay] = useState<number | null>(() => pkg.itinerary[0]?.day ?? null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const enquire = () => router.push(contactEnquiryHref(pkg.title));

  const quickFacts = [
    { label: "Duration", value: pkg.duration, icon: Clock3 },
    { label: "Best Time", value: pkg.bestTime, icon: CalendarDays },
    { label: "Starts From", value: pkg.startingPoint, icon: MapPin },
    { label: "Group Size", value: pkg.groupSize, icon: Users },
  ];
  const sectionLinks = [
    { id: "overview", label: "Overview" },
    ...(pkg.itinerary.length ? [{ id: "itinerary", label: "Itinerary" }] : []),
    { id: "inclusions", label: "What's Included" },
    ...(pkg.gallery.length ? [{ id: "gallery", label: "Gallery" }] : []),
    ...(pkg.faqs.length ? [{ id: "faqs", label: "FAQs" }] : []),
  ];
  const sidebarHighlights = pkg.inclusions.length
    ? pkg.inclusions.slice(0, 4)
    : ["Itinerary tailored to your dates", "Hand-picked stays and transfers", "On-trip assistance from our team"];

  return (
    <div className="package-detail min-h-screen bg-sand-light flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={enquire} />

      {/* Immersive hero */}
      <header className="relative flex min-h-[72svh] items-end pt-28 sm:h-[72vh] sm:min-h-[580px] sm:max-h-[760px] sm:pt-0">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-deep/60" />

        <Container className="relative pb-9 sm:pb-14">
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

          <h1 className="max-w-5xl break-words font-heading text-3xl font-extrabold leading-[1.04] tracking-[-0.02em] text-white min-[380px]:text-4xl sm:text-5xl lg:text-[4rem]">
            {pkg.title}
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-slate-200 sm:text-xl">
            {pkg.tagline}
          </p>

          <div className="mt-8 grid max-w-4xl grid-cols-2 overflow-hidden rounded-[8px] border border-white/15 bg-ink-deep/45 backdrop-blur-md sm:grid-cols-4">
            {quickFacts.map((fact) => {
              const Icon = fact.icon;
              return (
              <div
                key={fact.label}
                className="min-w-0 border-b border-r border-white/10 px-4 py-3 last:border-r-0 sm:border-b-0"
              >
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-gold"><Icon size={12} />{fact.label}</span>
                <span className="mt-1 block truncate text-sm font-semibold text-white">{fact.value}</span>
              </div>
              );
            })}
          </div>

          {pkg.brochureUrl && (
            <a
              href={pkg.brochureUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-[5px] border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-gold hover:bg-gold hover:text-primary"
            >
              <Download size={15} /> View original brochure
            </a>
          )}
        </Container>
      </header>

      {/* Sticky in-page section nav */}
      <div className="sticky top-16 z-30 border-b border-primary/10 bg-white/95 shadow-soft backdrop-blur-xl sm:top-[76px]">
        <Container className="flex items-center gap-2 py-2.5">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Package sections">
          {sectionLinks.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="whitespace-nowrap rounded-[4px] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-foreground-muted transition-colors duration-300 hover:bg-sand-dark hover:text-primary sm:px-4 sm:text-xs"
            >
              {section.label}
            </a>
          ))}
          </nav>
          <Link
            href={`/book?type=package&id=${encodeURIComponent(pkg.id)}`}
            className="ml-auto inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[5px] bg-accent px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-accent-dark sm:px-5 sm:text-xs"
          >
            Book Now <ArrowRight size={14} />
          </Link>
        </Container>
      </div>

      <main className="flex-1 py-12 sm:py-16">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
          {/* ——— Main column ——— */}
          <div className="min-w-0 space-y-14 sm:space-y-16">
            {/* Overview */}
            <ScrollReveal>
              <section id="overview" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Overview
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  The Journey at a Glance
                </h2>
                <p className="mt-4 max-w-4xl whitespace-pre-line text-sm leading-relaxed text-foreground-muted sm:text-base sm:leading-7">
                  {pkg.overview || pkg.tagline}
                </p>

                {pkg.highlights.length > 0 && <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {pkg.highlights.map((highlight) => (
                    <div
                      key={highlight}
                      className="flex items-start gap-3 rounded-[6px] border border-primary/10 bg-white px-4 py-3 shadow-soft"
                    >
                      <CheckIcon className="text-accent" />
                      <span className="text-sm font-semibold text-primary">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>}
              </section>
            </ScrollReveal>

            {/* Itinerary timeline */}
            {pkg.itinerary.length > 0 && (
            <ScrollReveal>
              <section id="itinerary" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Day by Day
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  Detailed Itinerary
                </h2>

                <div className="relative mt-8">
                  {/* Timeline spine */}
                  <div
                    className="absolute bottom-4 left-[19px] top-4 w-px bg-primary/15"
                    aria-hidden="true"
                  />

                  <div className="space-y-3">
                    {pkg.itinerary.map((day) => {
                      const isOpen = openDay === day.day;
                      return (
                        <div key={day.day} className="relative pl-[3.25rem] sm:pl-[3.75rem]">
                          {/* Day marker */}
                          <span
                            className={`absolute left-0 top-3 flex h-10 w-10 items-center justify-center rounded-[6px] border-4 border-sand-light text-xs font-extrabold transition-colors duration-300 ${
                              isOpen
                                ? "bg-accent text-white"
                                : "bg-white text-primary shadow-soft"
                            }`}
                            aria-hidden="true"
                          >
                            {String(day.day).padStart(2, "0")}
                          </span>

                          <div
                            className={`rounded-[8px] border bg-white transition-all duration-300 ${
                              isOpen
                                ? "border-accent/30 shadow-premium"
                                : "border-slate-100/80 shadow-soft"
                            }`}
                          >
                            <button
                              onClick={() => setOpenDay(isOpen ? null : day.day)}
                              aria-expanded={isOpen}
                              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
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
                                <div className="border-t border-primary/10 px-5 pb-5 pt-1 sm:px-6">
                                  <p className="whitespace-pre-line break-words pt-3 text-sm leading-7 text-foreground-muted">
                                    {day.description}
                                  </p>
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="rounded-[4px] bg-sand-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/80">
                                      Meals: {day.meals}
                                    </span>
                                    {day.stay && (
                                      <span className="rounded-[4px] bg-sand-dark px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary/80">
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
            )}

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

                {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {pkg.inclusions.length > 0 && <div className="rounded-[8px] border border-primary/10 bg-white p-6 shadow-soft sm:p-7">
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
                  </div>}

                  {pkg.exclusions.length > 0 && <div className="rounded-[8px] border border-primary/10 bg-white p-6 shadow-soft sm:p-7">
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
                  </div>}
                </div>}
              </section>
            </ScrollReveal>

            {/* Gallery */}
            {pkg.gallery.length > 0 && <ScrollReveal>
              <section id="gallery" className="scroll-mt-28">
                <span className="text-xs font-bold uppercase tracking-widest text-accent">
                  Postcards From the Route
                </span>
                <h2 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary tracking-[-0.01em]">
                  Trip Gallery
                </h2>

                <div className="mt-8 grid auto-rows-[160px] grid-cols-2 gap-3 sm:auto-rows-[200px]">
                  {pkg.gallery.map((item, index) => (
                    <button
                      key={item.image + index}
                      type="button"
                      onClick={() => setGalleryIndex(index)}
                      aria-label={`View ${item.caption}, enlarged`}
                      className={`group relative block cursor-zoom-in overflow-hidden rounded-[6px] transition duration-300 hover:ring-2 hover:ring-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                        index === 0 ? "col-span-2 row-span-2 sm:col-span-1" : ""
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-ink-deep/50 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100" />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-3 hidden h-10 w-10 items-center justify-center rounded-full bg-gold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:flex"
                      >
                        <Expand size={17} />
                      </span>
                      <span className="absolute bottom-4 left-4 right-4 text-left text-sm font-semibold text-white opacity-100 transition-all duration-300 sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100">
                        {item.caption}
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </ScrollReveal>}

            <Lightbox
              slides={(pkg.gallery ?? []).map((item) => ({ image: item.image, caption: item.caption }))}
              index={galleryIndex}
              onClose={() => setGalleryIndex(null)}
              onNavigate={setGalleryIndex}
            />

            {/* FAQs */}
            {pkg.faqs.length > 0 && <ScrollReveal>
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
                        className={`rounded-[8px] border bg-white transition-all duration-300 ${
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
            </ScrollReveal>}
          </div>

          {/* ——— Sticky booking sidebar ——— */}
          <aside className="space-y-5 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[8px] border border-primary/10 bg-white shadow-premium">
              <div className="relative overflow-hidden bg-primary px-6 py-6 text-white">
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

              <div className="space-y-5 p-6">
                <div className="rounded-[6px] border border-gold/35 bg-gold/10 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Make this trip yours</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground-muted">Dates, hotels, room type and daily pace can be adjusted before you book.</p>
                </div>

                <ul className="space-y-2.5">
                  {sidebarHighlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-xs text-foreground-muted font-sans"
                    >
                      <CheckIcon className="text-emerald-500 mt-0.5" />
                      <span className="line-clamp-2">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/book?type=package&id=${encodeURIComponent(pkg.id)}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-dark"
                >
                  Book Now <ArrowRight size={16} />
                </Link>

                <SecondaryButton
                  variant="outline-navy"
                  size="md"
                  fullWidth
                  onClick={enquire}
                  className="rounded-[5px]"
                >
                  Enquire About This Tour
                </SecondaryButton>

                <a
                  href="tel:+919422332610"
                  className="flex w-full items-center justify-center gap-2 rounded-[5px] border border-primary/20 px-6 py-3 text-sm font-semibold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white"
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
            <div className="rounded-[8px] border border-primary/10 bg-sand-dark/60 p-6">
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
                    className="group relative h-64 overflow-hidden rounded-[8px] shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0"
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
