import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Building2,
  Bus,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  Gift,
  Headset,
  Plane,
  Presentation,
  Receipt,
  ShieldCheck,
  UtensilsCrossed,
  Users,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import MiceHero from "@/components/mice/MiceHero";
import MiceEnquiryForm from "@/components/mice/MiceEnquiryForm";

export const metadata: Metadata = {
  title: "Corporate & MICE Travel | Bandhan Tours",
  description:
    "Meetings, incentives, conferences and exhibitions planned end to end by Bandhan Tours — venue sourcing, group air travel, visas, delegate management and on-ground event teams across India and abroad.",
  alternates: { canonical: "/mice" },
};

const stats = [
  { value: "2013", label: "Planning group travel since" },
  { value: "25K+", label: "Travellers served" },
  { value: "3", label: "Offices — Thane, Pune, Guwahati" },
  { value: "A–Z", label: "Venue to reporting, one team" },
];

const pillars = [
  {
    letter: "M",
    title: "Meetings",
    copy: "Leadership offsites, sales reviews, training programmes and board meets — held somewhere that helps people think, then run to the minute.",
    items: ["Residential offsites", "Sales & review meets", "Training programmes", "Board & AGM travel"],
  },
  {
    letter: "I",
    title: "Incentives",
    copy: "Reward trips your top performers talk about all year — designed around recognition moments, not just a sightseeing list.",
    items: ["Top-performer trips", "Channel-partner rewards", "Awards nights", "Family incentive tours"],
  },
  {
    letter: "C",
    title: "Conferences",
    copy: "Multi-day conventions and dealer meets, with delegate logistics, session flow and hospitality handled as one plan.",
    items: ["Annual conventions", "Dealer & distributor meets", "Product launches", "Speaker & guest travel"],
  },
  {
    letter: "E",
    title: "Exhibitions",
    copy: "Trade-fair travel for teams and buyer delegations — badges, stay near the venue, transfers timed to hall hours.",
    items: ["Trade-fair delegations", "Buyer-seller meets", "Stand crew travel", "Visa & invitation support"],
  },
];

const capabilities = [
  {
    icon: Building2,
    title: "Venue & hotel sourcing",
    copy: "Shortlists with meeting-room dimensions, seating capacity, rates and hold dates — plus site inspections before you commit.",
  },
  {
    icon: Plane,
    title: "Group air travel",
    copy: "Group fares, name-change windows, staggered arrivals for leadership, and single-point rebooking when plans move.",
  },
  {
    icon: Bus,
    title: "Ground transport",
    copy: "Airport transfers by arrival batch, coach fleets for session movement, and standby vehicles for VIPs.",
  },
  {
    icon: FileCheck2,
    title: "Visas & documentation",
    copy: "Bulk visa filings, invitation letters, forex and travel insurance, tracked delegate by delegate.",
  },
  {
    icon: UtensilsCrossed,
    title: "Banquets & F&B",
    copy: "Menus for every session break, dietary and regional preferences, theme dinners and awards-night catering.",
  },
  {
    icon: Presentation,
    title: "AV, stage & production",
    copy: "Stage sets, sound and screens, branding and signage, run-of-show scripting with your event lead.",
  },
  {
    icon: ClipboardList,
    title: "Delegate management",
    copy: "Registration lists, rooming charts, kits and badges, and a live manifest your team can check any time.",
  },
  {
    icon: Gift,
    title: "Team building & gifting",
    copy: "Activity formats suited to the group's size and energy, plus curated gifting with your branding.",
  },
  {
    icon: Headset,
    title: "On-ground event managers",
    copy: "Bandhan staff travel with the group — one escalation number for the whole programme, start to finish.",
  },
];

const reasons = [
  {
    icon: BadgeCheck,
    title: "One accountable point of contact",
    copy: "A single manager owns your programme from brief to closing report — no handoffs between desks mid-event.",
  },
  {
    icon: Receipt,
    title: "Documentation your finance team accepts",
    copy: "Itemised quotations, GST-compliant invoicing and a closing reconciliation against the approved budget.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted suppliers, inspected venues",
    copy: "Hotels, coaches and activity partners we have used before, checked again for your dates and group size.",
  },
  {
    icon: CalendarCheck,
    title: "Plans that survive change",
    copy: "Delegate counts move late. Rooming, transport and F&B are built to absorb that without repricing the whole trip.",
  },
];

const domesticIdeas = [
  { name: "Goa", note: "Conference resorts, offsites, awards nights" },
  { name: "Kerala", note: "Backwater incentives, wellness offsites" },
  { name: "Udaipur & Jaipur", note: "Palace venues, dealer meets, gala dinners" },
  { name: "Northeast India", note: "Distinctive incentives — our Guwahati desk" },
  { name: "Rishikesh & Mussoorie", note: "Team building, leadership retreats" },
  { name: "Mumbai, Pune & Delhi NCR", note: "City conferences, exhibition travel" },
];

const internationalIdeas = [
  { name: "Dubai & Abu Dhabi", note: "Conventions, exhibitions, short incentives" },
  { name: "Thailand", note: "High-value incentives on a modest budget" },
  { name: "Singapore & Malaysia", note: "Conferences, trade fairs, twin-centre meets" },
  { name: "Bali", note: "Reward trips and residential offsites" },
  { name: "Vietnam", note: "Emerging incentive destination, strong value" },
  { name: "Sri Lanka", note: "Short-haul incentives and dealer meets" },
];

const process = [
  {
    step: "01",
    title: "Brief",
    copy: "We take your objective, delegate profile, dates and budget band — a call is usually enough to start.",
  },
  {
    step: "02",
    title: "Proposal",
    copy: "Destination options with venues, an outline programme and transparent per-delegate costing.",
  },
  {
    step: "03",
    title: "Inspection & lock-in",
    copy: "Site visit where it matters, then contracts, holds and an approved payment schedule.",
  },
  {
    step: "04",
    title: "Delivery",
    copy: "Our managers travel with the group and run the programme against the agreed run-of-show.",
  },
  {
    step: "05",
    title: "Close-out",
    copy: "Final reconciliation, delegate feedback and notes that make next year's edition easier to plan.",
  },
];

const faqs = [
  {
    question: "What group sizes do you handle?",
    answer:
      "From small leadership offsites to full dealer conventions. Tell us your delegate count in the brief and we will confirm the venues and formats that suit it — including whether a single property or a multi-hotel plan works better.",
  },
  {
    question: "How quickly can we get a proposal?",
    answer:
      "Our corporate desk responds to briefs within one working day, and a costed proposal with destination and venue options usually follows within two to three working days, depending on how many hotels we need to hold.",
  },
  {
    question: "Do you handle international visas for the whole group?",
    answer:
      "Yes. Bulk visa filing, invitation and sponsorship letters, forex and group travel insurance are part of the programme, tracked per delegate so you always know who is cleared.",
  },
  {
    question: "Will someone from Bandhan Tours be present on site?",
    answer:
      "For MICE programmes our event managers travel with the group and stay through the event, so there is one escalation point on the ground rather than a call centre in another city.",
  },
  {
    question: "Can you work with our existing venue or event partner?",
    answer:
      "Often, yes. If the venue is already booked or you have a production agency in place, we can take on travel, delegate logistics and hospitality and coordinate with them.",
  },
  {
    question: "What does the invoicing look like?",
    answer:
      "Itemised quotations up front, GST-compliant invoicing, an agreed payment schedule, and a closing statement reconciled against the approved budget for your finance team.",
  },
];

export default function MicePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      <MiceHero />

      <main>
        {/* Positioning + verifiable numbers */}
        <section className="border-b border-slate-200 py-20 sm:py-28">
          <Container>
            <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
              <ScrollReveal className="lg:col-span-5">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Why a travel company, not just a venue
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-5xl">
                  The event is one day. The travel is the whole week.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={90} className="lg:col-span-6 lg:col-start-7">
                <div className="space-y-5 text-base leading-8 text-foreground-muted">
                  <p>
                    Most corporate programmes come apart in the gaps — a
                    connecting flight that lands after the opening session, forty
                    delegates and thirty-eight confirmed rooms, a visa still
                    pending two days out.
                  </p>
                  <p>
                    We plan MICE programmes the way we plan tours: every movement
                    sequenced, every supplier already known to us, and a manager
                    travelling with the group who can fix things in the moment
                    rather than escalate them.
                  </p>
                  <p>
                    Bandhan Tours has planned domestic, international and B2B
                    group travel since 2013 from our Thane head office, with a
                    corporate office in Pune and a dedicated Guwahati branch for
                    Northeast India programmes.
                  </p>
                </div>
                <dl className="mt-9 grid grid-cols-2 gap-6 border-y border-slate-200 py-6 sm:grid-cols-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="sr-only">{stat.label}</dt>
                      <dd>
                        <strong className="block font-heading text-2xl font-extrabold text-primary sm:text-3xl">
                          {stat.value}
                        </strong>
                        <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                          {stat.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </ScrollReveal>
            </div>
          </Container>
        </section>

        {/* The four pillars */}
        <section className="border-b border-slate-200 bg-sand/55 py-20 sm:py-28">
          <Container>
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                    What MICE covers
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                    Four kinds of programme.
                  </h2>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-foreground-muted lg:justify-self-end">
                  Meetings, incentives, conferences and exhibitions each ask for
                  something different from travel. Here is how we approach them.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-px bg-slate-200 sm:grid-cols-2">
              {pillars.map((pillar, index) => (
                <ScrollReveal key={pillar.letter} delay={index * 70} className="bg-white p-8 sm:p-10">
                  <div className="flex items-baseline gap-4">
                    <span className="font-heading text-4xl font-extrabold text-gold">
                      {pillar.letter}
                    </span>
                    <h3 className="font-heading text-2xl font-bold text-primary">{pillar.title}</h3>
                  </div>
                  <p className="mt-5 text-sm leading-7 text-foreground-muted">{pillar.copy}</p>
                  <ul className="mt-7 space-y-2.5 border-t border-slate-100 pt-6">
                    {pillar.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-primary">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Capabilities */}
        <section className="border-b border-slate-200 py-20 sm:py-28">
          <Container>
            <ScrollReveal>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Handled end to end
              </span>
              <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                Everything between the approval and the closing report.
              </h2>
            </ScrollReveal>

            <div className="mt-14 grid gap-x-10 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 45}>
                  <div className="border-t border-slate-200 py-7">
                    <item.icon size={22} className="text-accent" aria-hidden="true" />
                    <h3 className="mt-4 font-heading text-lg font-bold text-primary">{item.title}</h3>
                    <p className="mt-2.5 text-sm leading-7 text-foreground-muted">{item.copy}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Why corporates work with us */}
        <section className="border-b border-slate-200 py-20 sm:py-28">
          <Container>
            <div className="grid gap-6 lg:grid-cols-12">
              <ScrollReveal className="relative min-h-[420px] overflow-hidden lg:col-span-5 lg:min-h-[560px]">
                <Image
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=85&w=1400"
                  alt="Delegates networking during a conference break"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
              </ScrollReveal>
              <ScrollReveal delay={90} className="lg:col-span-7">
                <div className="h-full bg-primary p-8 text-white sm:p-12">
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-gold">
                    Working with us
                  </span>
                  <h2 className="mt-5 font-heading text-3xl font-extrabold leading-tight sm:text-4xl">
                    Built for the people who have to answer for it.
                  </h2>
                  <div className="mt-10 space-y-8">
                    {reasons.map((reason) => (
                      <div key={reason.title} className="flex gap-5">
                        <reason.icon size={22} className="mt-1 shrink-0 text-gold" aria-hidden="true" />
                        <div>
                          <h3 className="font-heading text-lg font-bold">{reason.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-slate-300">{reason.copy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </section>

        {/* Destinations */}
        <section className="border-b border-slate-200 bg-sand/55 py-20 sm:py-28">
          <Container>
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                    Where corporate groups go
                  </span>
                  <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                    Destinations that suit the purpose.
                  </h2>
                </div>
                <p className="max-w-xl text-base leading-relaxed text-foreground-muted lg:justify-self-end">
                  A starting point, not a menu. Tell us the objective and budget
                  band and we will shortlist against both.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-10 lg:grid-cols-2">
              {[
                { heading: "Within India", ideas: domesticIdeas },
                { heading: "International", ideas: internationalIdeas },
              ].map((group, groupIndex) => (
                <ScrollReveal key={group.heading} delay={groupIndex * 90}>
                  <h3 className="font-heading text-sm font-bold uppercase tracking-[0.2em] text-primary">
                    {group.heading}
                  </h3>
                  <ul className="mt-6 border-t border-slate-300">
                    {group.ideas.map((idea) => (
                      <li
                        key={idea.name}
                        className="flex flex-col gap-1 border-b border-slate-300 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                      >
                        <span className="font-heading text-lg font-bold text-primary">{idea.name}</span>
                        <span className="text-sm text-foreground-muted sm:text-right">{idea.note}</span>
                      </li>
                    ))}
                  </ul>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Process */}
        <section className="border-b border-slate-200 py-20 sm:py-28">
          <Container>
            <ScrollReveal>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                How it works
              </span>
              <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                From brief to closing report.
              </h2>
            </ScrollReveal>

            <div className="mt-14 border-t border-slate-300">
              {process.map((item, index) => (
                <ScrollReveal key={item.step} delay={index * 55}>
                  <div className="grid gap-4 border-b border-slate-300 py-7 sm:grid-cols-[90px_0.8fr_1.2fr] sm:items-start sm:py-9">
                    <span className="font-heading text-sm font-bold text-accent">{item.step}</span>
                    <h3 className="font-heading text-xl font-bold text-primary">{item.title}</h3>
                    <p className="max-w-2xl text-sm leading-7 text-foreground-muted">{item.copy}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Enquiry */}
        <section id="enquiry" className="scroll-mt-24 border-b border-slate-200 bg-sand/55 py-20 sm:py-28">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <ScrollReveal>
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                  Request a proposal
                </span>
                <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight text-primary sm:text-5xl">
                  Send us the brief.
                </h2>
                <p className="mt-5 text-base leading-8 text-foreground-muted">
                  Delegate count, rough dates and a budget band are enough to
                  begin. We will come back with destination options, venues and
                  per-delegate costing.
                </p>

                <ul className="mt-10 space-y-5 border-t border-slate-300 pt-8">
                  <li className="flex gap-4">
                    <Users size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <span className="text-sm leading-7 text-foreground-muted">
                      Reviewed by our corporate desk, not a generic enquiry inbox.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <CalendarCheck size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <span className="text-sm leading-7 text-foreground-muted">
                      First response within one working day.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <Receipt size={20} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                    <span className="text-sm leading-7 text-foreground-muted">
                      Itemised, GST-compliant costing you can take to finance.
                    </span>
                  </li>
                </ul>

                <div className="mt-10 border-t border-slate-300 pt-8 text-sm">
                  <p className="font-semibold text-primary">Prefer to talk first?</p>
                  <a href="tel:+919830012345" className="mt-3 block font-heading text-xl font-bold text-primary hover:text-accent">
                    +91 98300 12345
                  </a>
                  <a href="mailto:info@bandhantours.com" className="mt-1 block text-foreground-muted hover:text-accent">
                    info@bandhantours.com
                  </a>
                  <p className="mt-4 leading-7 text-foreground-muted">
                    226, Lodha Supremus Tower 2, Wagle Estate, Thane West.
                  </p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={90}>
                <MiceEnquiryForm />
              </ScrollReveal>
            </div>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-b border-slate-200 py-20 sm:py-28">
          <Container>
            <ScrollReveal>
              <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Common questions
              </span>
              <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                Before you send the brief.
              </h2>
            </ScrollReveal>

            <div className="mt-14 grid gap-x-14 gap-y-2 lg:grid-cols-2">
              {faqs.map((faq, index) => (
                <ScrollReveal key={faq.question} delay={index * 45}>
                  <div className="border-t border-slate-200 py-7">
                    <h3 className="font-heading text-lg font-bold text-primary">{faq.question}</h3>
                    <p className="mt-3 text-sm leading-7 text-foreground-muted">{faq.answer}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Closing CTA */}
        <section className="bg-white py-20 sm:py-24">
          <Container>
            <ScrollReveal>
              <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.24em] text-accent">
                    Your next programme
                  </span>
                  <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold text-primary sm:text-5xl">
                    Let&apos;s plan the one they remember.
                  </h2>
                  <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted">
                    Offsite, incentive trip or full convention — start with a
                    conversation and we will take it from there.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#enquiry"
                    className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white transition hover:bg-accent-dark"
                  >
                    Request a proposal
                  </a>
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
