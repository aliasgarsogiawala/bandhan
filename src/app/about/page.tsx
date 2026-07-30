import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "About Bandhan Tours | Thoughtful Travel, Personally Planned",
  description:
    "Meet Bandhan Tours, a Kolkata-based travel company creating considered group tours, family holidays, and personalised journeys across India and abroad.",
};

const standards = [
  {
    number: "01",
    title: "We listen before we plan",
    copy: "The destination is only the beginning. We understand the people travelling, the pace they enjoy, and what will make the journey feel worthwhile.",
  },
  {
    number: "02",
    title: "We make the details visible",
    copy: "Hotels, transfers, meals, sightseeing, and exclusions are set out clearly so travellers know what they are choosing.",
  },
  {
    number: "03",
    title: "We stay close to the journey",
    copy: "From the first conversation to the return home, one accountable team remains available to support the trip.",
  },
  {
    number: "04",
    title: "We value the memory, not the rush",
    copy: "Good itineraries leave room to experience a place. We plan for meaningful days rather than simply adding more stops.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      <header className="relative flex min-h-[680px] items-end overflow-hidden bg-primary pt-36">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=85&w=2200"
          alt="Travellers driving through a mountain landscape"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-primary/35" />
        <Container className="relative pb-20 sm:pb-24">
          <div className="max-w-4xl">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold">
              About Bandhan Tours
            </span>
            <h1 className="mt-5 font-heading text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Travel feels different when someone truly understands the journey.
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              We are a Kolkata-based travel company planning group tours, family holidays, and
              personalised journeys across India and the world.
            </p>
          </div>
        </Container>
      </header>

      <main>
        <section className="border-b border-slate-200 py-20 sm:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
              <ScrollReveal className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Our perspective
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-5xl">
                  A journey should feel cared for, never manufactured.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={90} className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-5 text-base leading-8 text-foreground-muted">
                  <p>
                    Bandhan began with a simple belief: the best travel plans come from knowing
                    the traveller, not just knowing the destination. That belief continues to
                    guide how we work today.
                  </p>
                  <p>
                    We combine destination knowledge with patient, practical planning. Some
                    guests travel with a large group, some with family, and some want a journey
                    designed entirely around them. Each deserves the same clarity, care, and
                    attention.
                  </p>
                </div>
                <div className="mt-9 grid grid-cols-3 border-y border-slate-200 py-6">
                  <div>
                    <strong className="block font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                      15+
                    </strong>
                    <span className="mt-1 block text-xs text-foreground-muted">Years planning travel</span>
                  </div>
                  <div className="border-x border-slate-200 px-5">
                    <strong className="block font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                      120+
                    </strong>
                    <span className="mt-1 block text-xs text-foreground-muted">Destinations</span>
                  </div>
                  <div className="pl-5">
                    <strong className="block font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                      24h
                    </strong>
                    <span className="mt-1 block text-xs text-foreground-muted">Typical response</span>
                  </div>
                </div>
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
                    The Bandhan standard
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                    How we earn your trust.
                  </h2>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-foreground-muted lg:justify-self-end">
                  Our standards are less about grand promises and more about doing the important
                  things consistently well.
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
                    From Kolkata, outward
                  </span>
                  <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                    Local accountability. A world of possibilities.
                  </h2>
                  <p className="mt-6 text-sm leading-7 text-slate-300">
                    Our team works from Rash Behari Avenue in Kolkata, bringing together
                    trusted partners, practical route knowledge, and personal support for every
                    itinerary we create.
                  </p>
                  <p className="mt-7 border-l-2 border-gold pl-5 text-sm font-semibold text-white">
                    One team, from the first idea to the final return.
                  </p>
                </div>
              </ScrollReveal>
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
