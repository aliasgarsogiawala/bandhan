"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import { Container } from "@/components/ui/Container";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Download, Expand, MapPin, Phone, Quote, Star, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Lightbox } from "@/components/ui/Lightbox";
import type { TourPackage } from "@/data/mockData";
import type { FullPackage } from "@/data/packageDetails";
import { testimonialData } from "@/data/testimonialData";
import { packageDestinationLabel } from "@/lib/packageCategory";
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
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const testimonials = useMemo(() => {
    const destination = packageDestinationLabel(pkg).toLowerCase();
    const title = pkg.title.toLowerCase();
    const exact = testimonialData.filter((item) => {
      const reviewDestination = item.destination.toLowerCase();
      const reviewTour = item.tour.toLowerCase();
      return destination.includes(reviewDestination)
        || reviewDestination.includes(destination)
        || title.includes(reviewDestination)
        || reviewTour.split(/\s+/).some((word) => word.length > 5 && title.includes(word));
    });
    const candidates = exact.length ? exact : testimonialData.filter((item) => item.language === "English");
    return candidates.slice(0, 2);
  }, [pkg]);

  const enquire = () => router.push(contactEnquiryHref(pkg.title));
  // The catalogue brochure for this trip — no booking required. A brochure
  // personalised with traveller names comes out of the booking engine instead.
  const brochureHref = `/api/packages/${encodeURIComponent(pkg.id)}/brochure?v=1`;

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
    ...(testimonials.length ? [{ id: "reviews", label: "Reviews" }] : []),
    ...(pkg.faqs.length ? [{ id: "faqs", label: "FAQs" }] : []),
  ];
  const sidebarHighlights = pkg.inclusions.length
    ? pkg.inclusions.slice(0, 4)
    : ["Itinerary tailored to your dates", "Hand-picked stays and transfers", "On-trip assistance from our team"];

  return (
    <PageShell tone="custom" className="package-detail bg-sand-light" onEnquiryClick={enquire}>

      {/* Editorial image-led hero shared by every package page. */}
      <header className="relative flex min-h-[86svh] items-end overflow-hidden pt-28 sm:min-h-[720px] sm:pt-0 lg:min-h-[780px]">
        <Image
          src={pkg.heroImage}
          alt={pkg.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-ink-deep/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/25 to-ink-deep/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/25" />

        <Container className="relative pb-12 sm:pb-16 lg:pb-20">
          <nav
            className="mb-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60"
            aria-label="Breadcrumb"
          >
            <Link href="/packages" className="transition-colors hover:text-gold">
              ← Tour Packages
            </Link>
          </nav>

          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            {[pkg.category, ...pkg.themes].join(" · ")}
          </p>

          <h1 className="max-w-6xl break-words font-heading text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-white min-[420px]:text-5xl sm:text-6xl lg:text-[4.5rem]">
            {pkg.title}
          </h1>
          <p className="mt-6 max-w-4xl text-sm leading-7 text-white/80 sm:text-lg sm:leading-8">
            {pkg.tagline}
          </p>

          <div className="mt-10 grid w-full grid-cols-2 border-y border-white/20 sm:grid-cols-4">
            {quickFacts.map((fact) => {
              const Icon = fact.icon;
              return (
              <div
                key={fact.label}
                className="min-w-0 border-b border-r border-white/15 px-0 py-4 pr-4 last:border-r-0 even:pl-4 sm:border-b-0 sm:px-5 sm:first:pl-0"
              >
                <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-gold"><Icon size={12} strokeWidth={1.7} />{fact.label}</span>
                <span className="mt-1.5 block text-xs font-medium leading-5 text-white sm:text-sm">{fact.value}</span>
              </div>
              );
            })}
          </div>
        </Container>
      </header>

      {/* In-page section nav. Sits under the hero and scrolls away with it. */}
      <div className="border-b border-primary/10 bg-[#fbfaf7]">
        <Container className="flex items-center gap-2 py-3">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Package sections">
          {sectionLinks.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="whitespace-nowrap border-b border-transparent px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted transition-colors duration-300 hover:border-gold-dark hover:text-primary sm:px-4"
            >
              {section.label}
            </a>
          ))}
          </nav>
          <a
            href={`${brochureHref}&download=1`}
            className="ml-auto inline-flex shrink-0 items-center gap-2 whitespace-nowrap border border-primary/25 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white sm:px-5"
          >
            <Download size={13} aria-hidden="true" /> Brochure
          </a>
          {/* The sticky price card in the sidebar carries Book Now from `lg`
              up, so this one only appears where that card is out of view. */}
          <Link
            href={`/book?type=package&id=${encodeURIComponent(pkg.id)}`}
            className="ml-2 inline-flex shrink-0 items-center gap-2 whitespace-nowrap bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors duration-300 hover:bg-gold hover:text-primary sm:px-6 lg:hidden"
          >
            Book Now <ArrowRight size={14} />
          </Link>
        </Container>
      </div>

      <section className="bg-[#fbfaf7] py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div className="min-w-0 space-y-20 sm:space-y-28">
            {/* Overview */}
            <ScrollReveal>
              <section id="overview" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">The destination</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight tracking-[-0.03em] text-primary sm:text-5xl">
                  The journey, thoughtfully composed
                </h2>
                <p className="mt-6 w-full whitespace-pre-line text-sm leading-7 text-foreground-muted sm:text-base sm:leading-8">
                  {pkg.overview || pkg.tagline}
                </p>

                <figure className="relative mt-10 h-[280px] w-full overflow-hidden bg-sand-dark sm:h-[420px]">
                  <Image
                    src={pkg.gallery[0]?.image || pkg.heroImage}
                    alt={pkg.gallery[0]?.caption || pkg.title}
                    fill
                    sizes="(max-width: 1023px) 100vw, 70vw"
                    className="object-cover"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 to-transparent px-5 pb-5 pt-16 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">
                    {pkg.gallery[0]?.caption || pkg.title}
                  </figcaption>
                </figure>

                {pkg.highlights.length > 0 && (
                  <div className="mt-12 border-y border-primary/15 sm:grid sm:grid-cols-2">
                    {pkg.highlights.map((highlight, index) => (
                      <div key={highlight} className="flex items-start gap-4 border-b border-primary/10 py-5 last:border-b-0 sm:px-5 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r">
                        <span className="tabular font-heading text-xl font-extrabold text-gold-dark">{String(index + 1).padStart(2, "0")}</span>
                        <span className="pt-1 text-sm font-semibold leading-6 text-primary">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </ScrollReveal>

            {/* Itinerary timeline */}
            {pkg.itinerary.length > 0 && (
            <ScrollReveal>
              <section id="itinerary" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Day by day</span>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-primary/15 pb-7">
                  <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Your proposed itinerary</h2>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">{pkg.itinerary.length} days</span>
                </div>

                <div>
                  {pkg.itinerary.map((day, index) => {
                    const galleryItem = pkg.gallery.length
                      ? pkg.gallery[index % pkg.gallery.length]
                      : undefined;
                    const image = galleryItem?.image;
                    const showImage = Boolean(image) && (index === 0 || index % 3 === 2);
                    return (
                      <article key={day.day} className="grid gap-5 border-b border-primary/12 py-8 sm:grid-cols-[72px_minmax(0,1fr)] sm:gap-8">
                        <div>
                          <span className="block text-[9px] font-bold uppercase tracking-[0.18em] text-gold-dark">Day</span>
                          <span className="tabular mt-1 block font-heading text-4xl font-extrabold leading-none text-primary">{String(day.day).padStart(2, "0")}</span>
                        </div>
                        <div className={showImage ? "grid gap-6 md:grid-cols-[minmax(0,1fr)_260px]" : ""}>
                          <div>
                            <h3 className="font-heading text-2xl font-bold leading-tight text-primary">{day.title}</h3>
                            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-foreground-muted">{day.description}</p>
                            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-bold uppercase tracking-[0.13em] text-primary/65">
                              <span>Meals / {day.meals}</span>
                              {day.stay && <span>Stay / {day.stay}</span>}
                            </div>
                          </div>
                          {showImage && (
                            <div className="relative min-h-36 overflow-hidden bg-sand-dark md:min-h-full">
                              <Image src={image!} alt={galleryItem?.caption || day.title} fill sizes="260px" className="object-cover" />
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            </ScrollReveal>
            )}

            {/* Inclusions / Exclusions */}
            <ScrollReveal>
              <section id="inclusions" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">The details</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Everything, clearly arranged</h2>

                <PackageServiceDetails details={pkg.serviceDetails} />

                {(pkg.inclusions.length > 0 || pkg.exclusions.length > 0) && <div className="mt-10 grid grid-cols-1 gap-10 border-t border-primary/15 pt-8 md:grid-cols-2">
                  {pkg.inclusions.length > 0 && <div className="md:border-r md:border-primary/12 md:pr-10">
                    <h3 className="mb-6 font-heading text-2xl font-bold text-primary">Included in your journey</h3>
                    <ul className="space-y-3">
                      {pkg.inclusions.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-foreground-muted"
                        >
                          <CheckIcon className="text-emerald-500 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>}

                  {pkg.exclusions.length > 0 && <div>
                    <h3 className="mb-6 font-heading text-2xl font-bold text-primary">Not included</h3>
                    <ul className="space-y-3">
                      {pkg.exclusions.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-sm leading-6 text-foreground-muted"
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
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Postcards from the route</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">A sense of place</h2>

                <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] sm:grid-cols-3">
                  {pkg.gallery.map((item, index) => (
                    <button
                      key={item.image + index}
                      type="button"
                      onClick={() => setGalleryIndex(index)}
                      aria-label={`View ${item.caption}, enlarged`}
                      className={`group relative block cursor-zoom-in overflow-hidden bg-sand-dark transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${
                        index === 0 ? "col-span-2 row-span-2" : ""
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.caption}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-premium group-hover:scale-[1.06]"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-ink-deep/50 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100" />
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

            {testimonials.length > 0 && (
              <ScrollReveal>
                <section id="reviews" className="scroll-mt-28">
                  <div className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Guest book</span>
                      <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Stories from the road</h2>
                    </div>
                    <Link href="/testimonials" className="text-xs font-bold uppercase tracking-[0.14em] text-accent hover:text-accent-dark">
                      Read all reviews →
                    </Link>
                  </div>
                  <div className="mt-10 grid gap-5 md:grid-cols-2">
                    {testimonials.map((item) => (
                      <article key={item.id} className="relative overflow-hidden border border-primary/12 bg-white p-6 shadow-soft sm:p-7">
                        <Quote className="absolute -right-3 -top-4 h-24 w-24 text-gold/10" strokeWidth={1} aria-hidden="true" />
                        <div className="relative flex items-center justify-between gap-3">
                          <div className="flex" aria-label={`${item.rating} out of 5 stars`}>
                            {Array.from({ length: 5 }, (_, index) => (
                              <Star key={index} size={13} className={index < item.rating ? "fill-gold text-gold" : "text-primary/15"} />
                            ))}
                          </div>
                          {item.isVerified ? <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-700"><CheckCircle2 size={12} /> Verified traveller</span> : null}
                        </div>
                        <blockquote className="relative mt-5 text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">“{item.shortReview || item.review}”</blockquote>
                        <div className="relative mt-6 flex items-center gap-3 border-t border-primary/10 pt-5">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-sand-dark">
                            <Image src={item.profileImage} alt="" fill sizes="44px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-primary">{item.name}</p>
                            <p className="truncate text-[10px] uppercase tracking-[0.12em] text-foreground-muted">{item.tour} · {item.travelMonth}</p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            )}

            {/* FAQs */}
            {pkg.faqs.length > 0 && <ScrollReveal>
              <section id="faqs" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Good to know</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Before you travel</h2>

                <div className="mt-10 border-t border-primary/15">
                  {pkg.faqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={faq.question}
                        className="border-b border-primary/15"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          aria-expanded={isOpen}
                          className="flex w-full items-center justify-between gap-4 py-5 text-left"
                        >
                          <span className="font-heading text-lg font-bold text-primary sm:text-xl">
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
                            <p className="w-full pb-6 pr-8 text-sm leading-7 text-foreground-muted">
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

          {/* ——— Booking rail. Sticks now that PageShell no longer creates a
              scroll container, so it tracks the reader down the page. ——— */}
          <aside id="book" className="space-y-4 scroll-mt-28 lg:sticky lg:top-32">
            <div className="overflow-hidden border border-primary/12 bg-white shadow-premium">
              <div className="bg-primary px-7 py-7 text-white">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                  Starting From
                </span>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="tabular font-heading text-[2.5rem] font-extrabold leading-none tracking-[-0.03em]">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-white/55">per person</span>
                </div>
                <span className="mt-2 block text-xs text-white/55">
                  {pkg.duration} · twin sharing
                </span>
              </div>

              <div className="space-y-5 p-7">
                <p className="border-l-2 border-gold pl-4 text-xs leading-relaxed text-foreground-muted">
                  Dates, hotels, room type and daily pace can all be adjusted before you book.
                </p>

                <ul className="space-y-2.5 border-t border-primary/10 pt-5">
                  {sidebarHighlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-xs leading-5 text-foreground-muted">
                      <CheckIcon className="mt-0.5 text-emerald-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="space-y-2.5 pt-1">
                  <Link
                    href={`/book?type=package&id=${encodeURIComponent(pkg.id)}`}
                    className="hidden w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-gold hover:text-primary lg:inline-flex"
                  >
                    Book Now <ArrowRight size={15} />
                  </Link>

                  <a
                    href={`${brochureHref}&download=1`}
                    className="flex w-full items-center justify-center gap-2 border border-primary/15 px-6 py-3 text-xs font-semibold text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <Download size={14} strokeWidth={2} aria-hidden="true" />
                    Download Brochure
                  </a>

                  <SecondaryButton
                    variant="outline-navy"
                    size="md"
                    fullWidth
                    onClick={enquire}
                    className="rounded-none"
                  >
                    Enquire About This Tour
                  </SecondaryButton>

                  <a
                    href="tel:+919422332610"
                    className="flex w-full items-center justify-center gap-2 border border-primary/15 px-6 py-3 text-xs font-semibold text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <Phone size={14} strokeWidth={2} aria-hidden="true" />
                    Talk to a Trip Designer
                  </a>
                </div>

                <p className="text-center text-[11px] leading-relaxed text-foreground-light">
                  No advance needed to enquire · Free itinerary customisation ·
                  Response within 24 hours
                </p>
              </div>
            </div>

            {/* Trust points */}
            <div className="border border-primary/12 px-6 py-5">
              <ul className="space-y-3 text-xs text-foreground-muted">
                {[
                  "15+ years crafting group & custom tours",
                  "5,000+ happy travellers and counting",
                  "24×7 on-tour support in every destination",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckIcon className="mt-0.5 text-gold-dark" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </Container>

        {/* Related packages */}
        {relatedPackages.length > 0 && (
          <Container className="mt-24 border-t border-primary/15 pt-16 sm:mt-32 sm:pt-20">
            <ScrollReveal>
              <div className="flex items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Keep exploring</span>
                  <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Journeys you may also like</h2>
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {relatedPackages.map((related) => (
                  <Link
                    key={related.id}
                    href={`/packages/${related.id}`}
                    className="group relative h-80 overflow-hidden bg-sand-dark transition-all duration-500 hover:-translate-y-1 hover:shadow-xl motion-reduce:hover:translate-y-0"
                  >
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-premium group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold block">
                        {related.duration}
                      </span>
                      <h3 className="mt-2 line-clamp-2 font-heading text-xl font-bold leading-tight text-white transition-colors duration-300 group-hover:text-gold">
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
      </section>
    </PageShell>
  );
};

export default PackageDetailClient;
