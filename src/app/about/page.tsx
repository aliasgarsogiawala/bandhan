import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import PageShell from "@/components/ui/PageShell";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "About Bandhan Tours | Trusted Travel Experts Since 2013",
  description:
    "Meet Bandhan Tours, a Thane-headquartered travel company trusted by more than 25,000 travellers for domestic, international, B2B, and Northeast India tours.",
};

const pillars = [
  {
    label: "Northeast India",
    copy: "Our specialism, run from a dedicated Guwahati branch — Meghalaya, Assam, Arunachal, Sikkim, Nagaland and beyond.",
    href: "/packages?category=north-east",
  },
  {
    label: "Domestic tours",
    copy: "Kerala, Kashmir, Rajasthan, Andaman, Karnataka and the temple circuits of South India, on fixed departures or your own dates.",
    href: "/packages?category=domestic",
  },
  {
    label: "International tours",
    copy: "Europe, Scandinavia, Japan, Bali, Thailand, Singapore, Vietnam and Bhutan, with visa and documentation support throughout.",
    href: "/packages?category=international",
  },
  {
    label: "Groups, MICE & corporate",
    copy: "Conferences, incentives, offsites and large family groups, planned end to end with a single point of contact.",
    href: "/mice",
  },
  {
    label: "B2B & agent partners",
    copy: "A dedicated agent portal with net rates, quotations, and booking support for travel partners across India.",
    href: "/agent/login",
  },
  {
    label: "Custom itineraries",
    copy: "A destination, a date, or a half-formed idea is enough — we build the route, stays, and pacing around you.",
    href: "/book?type=custom",
  },
];

const process = [
  {
    step: "01",
    title: "Tell us the idea",
    copy: "Share a destination, a window of dates, or simply the kind of break you need. We listen before we quote.",
  },
  {
    step: "02",
    title: "We design the route",
    copy: "You receive an itinerary with stays, transport, inclusions, and a clear price — refined until it reads right to you.",
  },
  {
    step: "03",
    title: "Confirm with clarity",
    copy: "Documents, vouchers, and visa paperwork are handled in one place, so nothing is left to the last week.",
  },
  {
    step: "04",
    title: "Travel supported",
    copy: "Our teams stay reachable through the journey, and our local knowledge fixes the small things before they grow.",
  },
];

const standards = [
  {
    number: "01",
    title: "Commitment to excellence",
    copy: "Every itinerary is planned with care, precision, and a clear standard for service from the first conversation to the journey home.",
  },
  {
    number: "02",
    title: "Customised travel",
    copy: "Journeys are shaped around the traveller—their interests, pace, dates, and priorities—not forced into a one-size-fits-all plan.",
  },
  {
    number: "03",
    title: "Quality & safety",
    copy: "Trusted professionals, considered stays, dependable transport, and practical route planning keep every experience comfortable and secure.",
  },
  {
    number: "04",
    title: "Customer satisfaction",
    copy: "Guest comfort and honest support guide every decision, because the experience matters as much as the destination.",
  },
  {
    number: "05",
    title: "Unmatched expertise",
    copy: "Years of domestic, international, B2B, and Northeast India experience help us turn complex travel details into a smooth journey.",
  },
];

const offices = [
  {
    city: "Thane",
    role: "Head office",
    address: "226, Lodha Supremus Tower 2, Road No. 22, Wagle Industrial Estate, Thane West – 400604",
  },
  {
    city: "Pune",
    role: "Corporate office",
    address: "Serving travellers and corporate groups across Pune and western Maharashtra.",
  },
  {
    city: "Guwahati",
    role: "Northeast branch",
    address: "On-ground team and local expertise behind every Northeast India itinerary we run.",
  },
];

const reviews = [
  {
    name: "Kishorkumar Soni",
    trip: "Kerala & Kanyakumari",
    quote:
      "Our seven-night Kerala and Kanyakumari journey was thoroughly enjoyable, with especially thoughtful food arrangements throughout the tour.",
  },
  {
    name: "Chandrakant Aade",
    trip: "Leh Ladakh",
    quote:
      "An incredible experience—from Leh’s striking landscapes to the high-altitude journey, the tour left us with memories to keep.",
  },
  {
    name: "Shweta Firake",
    trip: "Custom tour",
    quote:
      "The team managed the journey well and worked around our requirements, making the overall experience easy and enjoyable.",
  },
];

export default function AboutPage() {
  return (
    <PageShell tone="white" className="about-page">
      <PageHero
        size="lg"
        parallax
        priority
        eyebrow="About Bandhan Tours"
        title="See places. Meet faces. Together."
        description="Since 2013, Bandhan Tours has planned safe, personal, and memorable journeys across India and around the world — from a Thane head office, a Pune corporate office, and a Guwahati branch built for the Northeast."
        image="https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&q=90&w=3200"
        imageAlt="Travellers driving through a mountain landscape"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About us" }]}
        stats={[
          { value: "2013", label: "Journey began" },
          { value: "25K+", label: "Happy travellers" },
          { value: "3", label: "Offices in India" },
          { value: "A–Z", label: "Detail-led planning" },
        ]}
      />

      <section className="border-b border-slate-200 py-20 sm:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            <ScrollReveal className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Get to know us better
              </span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-5xl">
                A trusted name, wherever you go.
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-foreground-muted">
                We are a full-service travel company — not a listings page. Every
                enquiry reaches a person who plans tours for a living.
              </p>
            </ScrollReveal>
            <ScrollReveal className="lg:col-span-6 lg:col-start-7">
              <div className="space-y-5 text-base leading-8 text-foreground-muted">
                <p>
                  Bandhan Tours began in 2013 and is headquartered in Thane,
                  Maharashtra. Our certified travel professionals plan every
                  detail—from the first route idea to the final transfer—to make
                  each tour smooth, secure, and memorable.
                </p>
                <p>
                  More than 25,000 travellers have trusted our domestic,
                  international, and B2B travel services. Northeast India is a
                  particular area of expertise, supported by our dedicated
                  Guwahati branch and local destination knowledge.
                </p>
                <p>
                  Guest satisfaction is our priority. We believe the best trips
                  feel well prepared without feeling predictable—leaving room
                  for the good surprises that make travel unforgettable.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/packages"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-light"
                >
                  Browse our tours
                </Link>
                <Link
                  href="/testimonials"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-bold text-primary transition hover:border-primary"
                >
                  Read traveller reviews
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-b border-slate-200 bg-sand-light py-20 sm:py-28">
        <div className="pointer-events-none absolute -right-24 top-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <ScrollReveal className="lg:col-span-4">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                The Bandhan feeling
              </span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-5xl">
                The best journeys stay with you.
              </h2>
              <p className="mt-6 max-w-md text-base leading-8 text-foreground-muted">
                From misty mountain mornings to unhurried evenings by the sea,
                we plan the details that give every journey its own rhythm.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:col-span-8 lg:grid-cols-12">
              <ScrollReveal className="group relative col-span-2 aspect-[1.8] overflow-hidden rounded-3xl shadow-premium sm:aspect-[2.2] lg:col-span-7 lg:row-span-2 lg:aspect-auto lg:min-h-[480px]">
                <Image
                  src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&q=90&w=1800"
                  alt="A couple looking across a mountain valley"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/70 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 text-xs font-bold uppercase tracking-[0.2em] text-white">
                  Made for the moment
                </span>
              </ScrollReveal>

              <ScrollReveal className="group relative col-span-1 aspect-square overflow-hidden rounded-3xl shadow-soft lg:col-span-5 lg:aspect-[1.15]">
                <Image
                  src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=90&w=1200"
                  alt="A peaceful alpine lake surrounded by mountains"
                  fill
                  sizes="(max-width: 1024px) 50vw, 35vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                />
              </ScrollReveal>

              <ScrollReveal className="group relative col-span-1 aspect-square overflow-hidden rounded-3xl shadow-soft lg:col-span-5 lg:aspect-[1.15]">
                <Image
                  src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=90&w=1200"
                  alt="Friends sharing a joyful travel moment"
                  fill
                  sizes="(max-width: 1024px) 50vw, 35vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute bottom-4 right-4 rounded-full bg-white/90 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary backdrop-blur-sm">
                  Together
                </div>
              </ScrollReveal>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-sand-light py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  What we plan
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                  Six ways we take you there.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-foreground-muted lg:justify-self-end">
                Whether you travel as a couple, a family of twenty, a corporate
                group, or through your own agency, the planning desk behind it is
                the same one.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => (
              <ScrollReveal key={pillar.label}>
                <Link
                  href={pillar.href}
                  className="group flex h-full flex-col bg-white p-7 transition hover:bg-sand/60 sm:p-8"
                >
                  <h3 className="font-heading text-lg font-bold text-primary">
                    {pillar.label}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-7 text-foreground-muted">
                    {pillar.copy}
                  </p>
                  <span className="mt-6 text-sm font-bold text-accent transition group-hover:translate-x-1">
                    Explore →
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-white py-20 sm:py-28">
        <Container>
          <div className="grid gap-px bg-slate-200 lg:grid-cols-2">
            <ScrollReveal className="bg-primary p-8 text-white sm:p-12 lg:p-16">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                Our vision
              </span>
              <h2 className="mt-5 font-heading text-3xl font-extrabold sm:text-4xl">
                Personal service, backed by expertise and quality.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-slate-300">
                We aim to become a leading travel company by first leading
                travellers towards unforgettable experiences. That means
                continually evolving our tours, expanding what we offer, and
                answering every call for adventure or tranquillity with the
                right journey.
              </p>
            </ScrollReveal>
            <ScrollReveal className="bg-sand/55 p-8 sm:p-12 lg:p-16">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Our mission
              </span>
              <h2 className="mt-5 font-heading text-3xl font-extrabold text-primary sm:text-4xl">
                Travel experiences that inspire.
              </h2>
              <p className="mt-7 max-w-xl text-base leading-8 text-foreground-muted">
                Our mission is to meet a wide range of travel needs through
                high-quality, secure, and personalised packages. We bring
                attention to detail and service excellence to every step,
                building a lasting bond with travellers and encouraging their
                desire to explore.
              </p>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="surface-grain relative border-b border-slate-200 bg-ink py-20 text-white sm:py-28">
        <Container>
          <ScrollReveal>
            <span className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
              How a Bandhan trip comes together
            </span>
            <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold sm:text-5xl">
              Four steps, from first message to homecoming.
            </h2>
          </ScrollReveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
            {process.map((item) => (
              <ScrollReveal key={item.step}>
                <div className="h-full bg-ink p-7 sm:p-8">
                  <span className="font-heading text-sm font-bold text-gold">{item.step}</span>
                  <h3 className="mt-4 font-heading text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{item.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-sand/55 py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Reasons to believe in us
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                  What travellers can expect.
                </h2>
              </div>
              <p className="max-w-xl text-base leading-relaxed text-foreground-muted lg:justify-self-end">
                Five principles shape how our professionals plan, deliver, and
                support every Bandhan Tours journey.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 border-t border-slate-300">
            {standards.map((item) => (
              <ScrollReveal key={item.number}>
                <div className="grid gap-4 border-b border-slate-300 py-7 sm:grid-cols-[90px_0.8fr_1.2fr] sm:items-start sm:py-9">
                  <span className="font-heading text-sm font-bold text-accent">{item.number}</span>
                  <h3 className="font-heading text-xl font-bold text-primary">{item.title}</h3>
                  <p className="max-w-2xl text-sm leading-7 text-foreground-muted">{item.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 py-20 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
            <ScrollReveal className="relative min-h-[320px] overflow-hidden rounded-2xl lg:col-span-5">
              <Image
                src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=90&w=2400"
                alt="A quiet Himalayan landscape"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </ScrollReveal>

            <ScrollReveal className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                From Thane to every horizon
              </span>
              <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
                Deep roots. Wide-ranging journeys.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-foreground-muted">
                Three offices connect local knowledge with dependable support
                across India and abroad — so a Northeast itinerary is planned by
                people who live there, and a European tour is coordinated by the
                desk that books it every season.
              </p>

              <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-3">
                {offices.map((office) => (
                  <div key={office.city} className="h-full bg-white p-6">
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent">
                      {office.role}
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-bold text-primary">
                      {office.city}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-foreground-muted">
                      {office.address}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href="/contact"
                className="mt-8 inline-flex text-sm font-bold text-primary underline decoration-gold decoration-2 underline-offset-8"
              >
                Find us on the map
              </Link>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      <section className="border-b border-slate-200 bg-white py-20 sm:py-28">
        <Container>
          <ScrollReveal>
            <div className="flex flex-col gap-5 border-b border-slate-200 pb-10 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Traveller stories
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                  Real experiences, shared honestly.
                </h2>
              </div>
              <Link
                href="/testimonials"
                className="text-sm font-bold text-primary underline decoration-gold decoration-2 underline-offset-8"
              >
                Read more traveller stories
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid border-b border-slate-200 md:grid-cols-3">
            {reviews.map((review) => (
              <ScrollReveal
                key={review.name}
                className="border-t border-slate-200 px-0 py-9 md:border-l md:border-t-0 md:px-8 first:md:border-l-0 first:md:pl-0 last:md:pr-0"
              >
                <div className="text-sm tracking-[0.2em] text-gold" aria-label="5 out of 5 stars">
                  ★★★★★
                </div>
                <blockquote className="mt-5 text-base leading-8 text-foreground-muted">
                  “{review.quote}”
                </blockquote>
                <p className="mt-7 font-heading text-base font-bold text-primary">{review.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground-muted">
                  {review.trip}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-white py-20 sm:py-24">
        <Container>
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Your journey, next
                </span>
                <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                  Tell us what you have in mind.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted">
                  A destination, a date, or even a half-formed idea is enough to begin.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/book?type=custom"
                  className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white transition hover:bg-accent-dark"
                >
                  Plan a custom trip
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-primary px-7 py-3.5 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  Talk to our team
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </section>
    </PageShell>
  );
}
