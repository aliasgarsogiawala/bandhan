import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import AboutHero from "@/components/about/AboutHero";

export const metadata: Metadata = {
  title: "About Bandhan Tours | Trusted Travel Experts Since 2013",
  description:
    "Meet Bandhan Tours, a Thane-headquartered travel company trusted by more than 25,000 travellers for domestic, international, B2B, and Northeast India tours.",
};

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
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      <AboutHero />

      <main>
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
              </ScrollReveal>
              <ScrollReveal delay={90} className="lg:col-span-6 lg:col-start-7">
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
                <div className="mt-9 grid grid-cols-3 border-y border-slate-200 py-6">
                  <div>
                    <strong className="block font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                      2013
                    </strong>
                    <span className="mt-1 block text-xs text-foreground-muted">Our journey began</span>
                  </div>
                  <div className="border-x border-slate-200 px-5">
                    <strong className="block font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                      25K+
                    </strong>
                    <span className="mt-1 block text-xs text-foreground-muted">Happy travellers</span>
                  </div>
                  <div className="pl-5">
                    <strong className="block font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                      A–Z
                    </strong>
                    <span className="mt-1 block text-xs text-foreground-muted">Detail-led planning</span>
                  </div>
                </div>
              </ScrollReveal>
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
              <ScrollReveal delay={90} className="bg-sand/55 p-8 sm:p-12 lg:p-16">
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

        <section className="bg-sand/55 py-20 sm:py-28">
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
              {standards.map((item, index) => (
                <ScrollReveal key={item.number} delay={index * 55}>
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

        <section className="py-20 sm:py-28">
          <Container>
            <div className="grid gap-6 lg:grid-cols-12">
              <ScrollReveal className="relative min-h-[520px] overflow-hidden lg:col-span-7">
                <Image
                  src="https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1500"
                  alt="A quiet Himalayan landscape"
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </ScrollReveal>
              <ScrollReveal delay={90} className="flex bg-primary p-8 text-white sm:p-12 lg:col-span-5 lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                    From Thane to every horizon
                  </span>
                  <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                    Deep roots. Wide-ranging journeys.
                  </h2>
                  <p className="mt-6 text-sm leading-7 text-slate-300">
                    Our head office is in Thane, Maharashtra, with a corporate
                    office in Pune and a dedicated branch in Guwahati for our
                    Northeast India tours. Together, our teams connect local
                    knowledge with dependable support across India and abroad.
                  </p>
                  <p className="mt-7 border-l-2 border-gold pl-5 text-sm font-semibold text-white">
                    226, Lodha Supremus Tower 2, Wagle Estate, Thane West.
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </section>

        <section className="border-t border-slate-200 bg-white py-20 sm:py-28">
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
                <Link href="/testimonials" className="text-sm font-bold text-primary underline decoration-gold decoration-2 underline-offset-8">
                  Read more traveller stories
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid border-b border-slate-200 md:grid-cols-3">
              {reviews.map((review, index) => (
                <ScrollReveal
                  key={review.name}
                  delay={index * 70}
                  className="border-t border-slate-200 px-0 py-9 md:border-l md:border-t-0 md:px-8 first:md:border-l-0 first:md:pl-0 last:md:pr-0"
                >
                  <div className="text-sm tracking-[0.2em] text-gold" aria-label="5 out of 5 stars">
                    ★★★★★
                  </div>
                  <blockquote className="mt-5 text-base leading-8 text-foreground-muted">
                    “{review.quote}”
                  </blockquote>
                  <p className="mt-7 font-heading text-base font-bold text-primary">{review.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-foreground-muted">{review.trip}</p>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="border-y border-slate-200 bg-white py-20 sm:py-24">
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
      </main>

      <Footer />
    </div>
  );
}
