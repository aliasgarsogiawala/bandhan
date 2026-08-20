import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Bus,
  CalendarCheck,
  Check,
  ChevronDown,
  CircleDot,
  ClipboardList,
  FileCheck2,
  Gift,
  Headset,
  MapPin,
  Plane,
  Presentation,
  Receipt,
  ShieldCheck,
  Sparkles,
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
  { value: "03", label: "Offices across India" },
  { value: "A–Z", label: "One accountable team" },
];

const pillars = [
  {
    letter: "M",
    title: "Meetings",
    eyebrow: "Think clearly",
    copy: "Leadership offsites, sales reviews, training programmes and board meets—held somewhere that helps people focus, then run to the minute.",
    items: ["Residential offsites", "Sales & review meets", "Board & AGM travel"],
    style: "bg-[#FFE7D7] text-primary",
    accent: "text-accent",
  },
  {
    letter: "I",
    title: "Incentives",
    eyebrow: "Reward brilliantly",
    copy: "Trips your top performers talk about all year, designed around surprise, recognition and shared moments—not a copied sightseeing list.",
    items: ["Top-performer trips", "Channel-partner rewards", "Family incentives"],
    style: "bg-gold text-primary",
    accent: "text-primary/45",
  },
  {
    letter: "C",
    title: "Conferences",
    eyebrow: "Gather at scale",
    copy: "Multi-day conventions, dealer meets and product launches with delegate logistics, session flow and hospitality managed as one system.",
    items: ["Annual conventions", "Product launches", "Speaker & guest travel"],
    style: "bg-primary text-white",
    accent: "text-gold",
  },
  {
    letter: "E",
    title: "Exhibitions",
    eyebrow: "Show up ready",
    copy: "Trade-fair travel for teams and buyer delegations: badges, stay near the venue, visas and transfers timed to hall hours.",
    items: ["Trade-fair delegations", "Buyer-seller meets", "Stand crew travel"],
    style: "bg-accent text-white",
    accent: "text-white/55",
  },
];

const capabilities = [
  {
    icon: Building2,
    title: "Venue intelligence",
    copy: "Shortlists with capacities, room dimensions, rates, hold dates and site inspections before you commit.",
    featured: true,
  },
  {
    icon: Plane,
    title: "Group air",
    copy: "Group fares, name-change windows, staggered arrivals and a single rebooking desk.",
  },
  {
    icon: Bus,
    title: "Movement control",
    copy: "Airport batches, coach fleets, VIP vehicles and live driver coordination.",
  },
  {
    icon: FileCheck2,
    title: "Visas & documents",
    copy: "Bulk filings, invitation letters, forex, insurance and delegate-level tracking.",
  },
  {
    icon: UtensilsCrossed,
    title: "Food & hospitality",
    copy: "Session breaks, dietary preferences, theme dinners and awards-night catering.",
  },
  {
    icon: Presentation,
    title: "Stage & production",
    copy: "AV, stage sets, screens, brand environments, signage and run-of-show scripting.",
    featured: true,
  },
  {
    icon: ClipboardList,
    title: "Delegate desk",
    copy: "Registration, rooming charts, kits, badges and a live manifest your team can access.",
  },
  {
    icon: Gift,
    title: "Gifting & experiences",
    copy: "Activities matched to group energy, thoughtful moments and beautifully branded keepsakes.",
  },
  {
    icon: Headset,
    title: "On-ground command",
    copy: "Bandhan managers travel with the group: one escalation number, start to finish.",
  },
];

const reasons = [
  {
    icon: BadgeCheck,
    title: "One owner, no hand-offs",
    copy: "A single programme lead carries the context from your first brief through the closing report.",
  },
  {
    icon: Receipt,
    title: "Finance-ready clarity",
    copy: "Itemised proposals, GST-compliant invoices and a clean reconciliation against the approved budget.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted on the ground",
    copy: "Hotels, coaches and partners checked for your actual dates, route and delegate profile.",
  },
  {
    icon: CalendarCheck,
    title: "Built to absorb change",
    copy: "Rooming, transport and F&B plans that can flex when delegate counts move late.",
  },
];

const destinations = [
  {
    place: "Goa",
    country: "India",
    use: "Offsites · Awards nights",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=85&w=1600",
    tone: "from-[#f47951]",
  },
  {
    place: "Dubai",
    country: "UAE",
    use: "Conventions · Exhibitions",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=85&w=1600",
    tone: "from-[#16446b]",
  },
  {
    place: "Bali",
    country: "Indonesia",
    use: "Incentives · Leadership retreats",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=85&w=1600",
    tone: "from-[#17493f]",
  },
];

const destinationIdeas = [
  "Udaipur & Jaipur",
  "Kerala",
  "Northeast India",
  "Singapore",
  "Thailand",
  "Vietnam",
  "Sri Lanka",
  "Malaysia",
];

const process = [
  { step: "01", title: "Decode the brief", copy: "Objective, people, dates, energy and budget. One sharp call is enough to start." },
  { step: "02", title: "Design the possibilities", copy: "Destination and venue routes, an experience idea and transparent per-delegate costing." },
  { step: "03", title: "Inspect & lock", copy: "Site visits where they matter, then contracts, inventory holds and a practical payment schedule." },
  { step: "04", title: "Run the room", copy: "Our team travels with the group and delivers against one live manifest and run-of-show." },
  { step: "05", title: "Close the loop", copy: "Final reconciliation, feedback and operating notes that make the next edition even better." },
];

const faqs = [
  {
    question: "What group sizes can Bandhan Tours manage?",
    answer: "From focused leadership offsites to large dealer conventions. Once we know the delegate count, purpose and city tier, we recommend the right venue model—including split hotels when a single property would compromise the experience.",
  },
  {
    question: "How quickly will we receive a proposal?",
    answer: "Our corporate desk reviews new briefs within one working day. A costed proposal normally follows in two to three working days, depending on the number of destinations, venues and live inventory checks involved.",
  },
  {
    question: "Can you manage visas for the whole international group?",
    answer: "Yes. We coordinate bulk filings, invitation and sponsorship letters, travel insurance and forex, with a delegate-level tracker so your team always knows what is pending and why.",
  },
  {
    question: "Will a Bandhan manager be present at the event?",
    answer: "For MICE programmes, our event managers travel with the group and remain on the ground through delivery. The exact team size is planned against delegate count, complexity and programme spread.",
  },
  {
    question: "Can you work with our existing agency or booked venue?",
    answer: "Absolutely. We can own travel, rooming, transport, visas and delegate hospitality while coordinating tightly with your production agency or the venue team already in place.",
  },
  {
    question: "What information do you need to begin?",
    answer: "An approximate delegate count, rough dates, event type and budget band are enough for a first conversation. The form below captures the useful details without forcing you to finish the entire RFP first.",
  },
];

export default function MicePage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />
      <MiceHero />

      <main>
        <section id="story" className="relative overflow-hidden bg-sand-light py-20 sm:py-28 lg:py-36">
          <div className="absolute -right-28 top-20 h-80 w-80 rounded-full bg-gold/20 blur-3xl" aria-hidden="true" />
          <Container className="relative">
            <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
              <ScrollReveal>
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-accent">
                  <CircleDot size={13} aria-hidden="true" /> The real brief
                </span>
                <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] text-primary sm:text-5xl lg:text-6xl">
                  The stage is one moment. The journey is every moment around it.
                </h2>
                <p className="mt-7 max-w-xl text-base leading-8 text-foreground-muted">
                  Corporate programmes rarely fail on the big idea. They fail in the
                  gaps: a flight that lands after the opening session, a rooming list
                  that never quite matches, a visa still pending two days out.
                </p>
              </ScrollReveal>

              <ScrollReveal className="lg:pt-14">
                <div className="relative overflow-hidden rounded-[2rem] bg-primary p-6 text-white shadow-lifted sm:p-9">
                  <div className="mice-grid absolute inset-0 opacity-20" aria-hidden="true" />
                  <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold">Event control room</span>
                      <h3 className="mt-2 font-heading text-2xl font-bold">Everyone arrives ready.</h3>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-300">All systems green</span>
                  </div>

                  <div className="relative mt-6 space-y-3">
                    {[
                      ["T−30", "Venue, rooms and air inventory locked", "240 / 240"],
                      ["T−14", "Visas and delegate documentation", "238 / 240"],
                      ["T−01", "Arrival manifest and transport cells", "Ready"],
                      ["LIVE", "One command channel on the ground", "Active"],
                    ].map(([time, task, state], index) => (
                      <div key={time} className="grid grid-cols-[3.4rem_1fr] gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.045] p-4 sm:grid-cols-[4rem_1fr_auto] sm:items-center">
                        <span className={`font-heading text-sm font-extrabold ${index === 3 ? "text-emerald-300" : "text-gold"}`}>{time}</span>
                        <span className="text-sm font-semibold text-white/80">{task}</span>
                        <span className="col-start-2 text-xs font-bold text-white/45 sm:col-start-auto">{state}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-primary/10 sm:grid-cols-4 lg:mt-24">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/70 px-5 py-7 backdrop-blur-sm sm:px-7 sm:py-8">
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <strong className="block font-heading text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">{stat.value}</strong>
                    <span className="mt-2 block max-w-32 text-xs font-medium leading-5 text-foreground-muted">{stat.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        <section className="bg-white py-20 sm:py-28 lg:py-36">
          <Container>
            <ScrollReveal>
              <div className="grid gap-7 lg:grid-cols-[1fr_0.8fr] lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Four formats. Infinite energy.</span>
                  <h2 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold tracking-[-0.04em] text-primary sm:text-6xl">M·I·C·E, without the corporate beige.</h2>
                </div>
                <p className="max-w-xl text-base leading-8 text-foreground-muted lg:justify-self-end">
                  Each programme has a different job to do. We begin with that job,
                  then build the destination, flow and hospitality around it.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-4 md:grid-cols-2">
              {pillars.map((pillar, index) => (
                <ScrollReveal key={pillar.letter} delay={index * 55}>
                  <article className={`group relative min-h-[430px] overflow-hidden rounded-[2rem] p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-10 ${pillar.style}`}>
                    <span className={`pointer-events-none absolute -bottom-14 -right-3 select-none font-heading text-[15rem] font-extrabold leading-none tracking-[-0.12em] opacity-15 ${pillar.accent}`} aria-hidden="true">{pillar.letter}</span>
                    <div className="relative flex h-full min-h-[370px] flex-col">
                      <span className={`text-xs font-bold uppercase tracking-[0.2em] ${pillar.accent}`}>{pillar.eyebrow}</span>
                      <div className="mt-7 flex items-baseline gap-4">
                        <span className={`font-heading text-5xl font-extrabold ${pillar.accent}`}>{pillar.letter}</span>
                        <h3 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl">{pillar.title}</h3>
                      </div>
                      <p className="mt-6 max-w-md text-sm leading-7 opacity-75 sm:text-base">{pillar.copy}</p>
                      <ul className="mt-auto space-y-3 border-t border-current/15 pt-6">
                        {pillar.items.map((item) => (
                          <li key={item} className="flex items-center gap-3 text-sm font-semibold">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current/30"><Check size={11} aria-hidden="true" /></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="capabilities" className="surface-grain relative overflow-hidden bg-ink-deep py-20 text-white sm:py-28 lg:py-36">
          <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-gold/45 to-transparent" aria-hidden="true" />
          <Container className="relative">
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-gold">One operating system</span>
                  <h2 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold tracking-[-0.045em] sm:text-6xl">Everything talks to everything.</h2>
                </div>
                <p className="max-w-xl text-base leading-8 text-white/55 lg:justify-self-end">
                  Travel, hospitality, production and people live in one plan—so a
                  delayed arrival changes the coach, the rooming desk and the welcome,
                  not your blood pressure.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 35} className={item.featured ? "sm:col-span-2 lg:col-span-1" : ""}>
                  <article className={`group h-full min-h-[260px] rounded-[1.75rem] border p-7 transition duration-300 hover:-translate-y-1 hover:border-gold/35 ${item.featured ? "border-gold/20 bg-[linear-gradient(145deg,rgba(254,209,79,0.16),rgba(255,255,255,0.04))]" : "border-white/[0.08] bg-white/[0.045]"}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-gold transition group-hover:rotate-3 group-hover:bg-gold group-hover:text-primary">
                      <item.icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="mt-8 font-heading text-xl font-bold">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/55">{item.copy}</p>
                    <span className="mt-7 flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/30">
                      Integrated by Bandhan <span className="h-px w-8 bg-gold/45" aria-hidden="true" />
                    </span>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section className="overflow-hidden bg-[#F4EEE6] py-20 sm:py-28 lg:py-36">
          <Container>
            <div className="grid gap-6 lg:grid-cols-12">
              <ScrollReveal className="relative min-h-[480px] overflow-hidden rounded-[2rem] lg:col-span-5 lg:min-h-[700px]">
                <Image
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=85&w=2000"
                  alt="Delegates networking during a conference break"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-transparent to-transparent" />
                <div className="absolute inset-x-7 bottom-7 text-white sm:inset-x-9 sm:bottom-9">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-gold">The promise</span>
                  <p className="mt-3 max-w-sm font-heading text-2xl font-bold leading-tight sm:text-3xl">Your people feel the experience. You see the control.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={80} className="lg:col-span-7">
                <div className="relative h-full overflow-hidden rounded-[2rem] bg-white p-7 sm:p-10 lg:p-14">
                  <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
                  <span className="relative text-xs font-bold uppercase tracking-[0.22em] text-accent">Why corporate teams stay with us</span>
                  <h2 className="relative mt-5 max-w-2xl font-heading text-4xl font-extrabold tracking-[-0.04em] text-primary sm:text-5xl">Built for the people who have to answer for every detail.</h2>

                  <div className="relative mt-10 grid gap-px overflow-hidden rounded-2xl bg-slate-200 sm:grid-cols-2">
                    {reasons.map((reason) => (
                      <article key={reason.title} className="bg-white p-5 sm:p-6">
                        <reason.icon size={21} className="text-accent" aria-hidden="true" />
                        <h3 className="mt-5 font-heading text-lg font-bold text-primary">{reason.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-foreground-muted">{reason.copy}</p>
                      </article>
                    ))}
                  </div>

                  <div className="relative mt-10 flex flex-col gap-4 border-t border-slate-200 pt-7 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-md text-sm leading-6 text-foreground-muted">Thane head office · Pune corporate office · Guwahati branch for Northeast programmes</p>
                    <a href="#enquiry" className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-primary transition hover:text-accent">Start the brief <ArrowRight size={16} aria-hidden="true" /></a>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </Container>
        </section>

        <section className="bg-white py-20 sm:py-28 lg:py-36">
          <Container>
            <ScrollReveal>
              <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Choose for purpose, not popularity</span>
                  <h2 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold tracking-[-0.04em] text-primary sm:text-6xl">The right place changes the room.</h2>
                </div>
                <p className="max-w-lg text-base leading-8 text-foreground-muted lg:justify-self-end">We shortlist against access, inventory, season, energy and budget—then shape an experience that belongs there.</p>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-4 lg:grid-cols-3">
              {destinations.map((destination, index) => (
                <ScrollReveal key={destination.place} delay={index * 65}>
                  <article className="group relative min-h-[470px] overflow-hidden rounded-[2rem] bg-primary">
                    <Image src={destination.image} alt={`${destination.place} MICE travel inspiration`} fill sizes="(max-width: 1024px) 100vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${destination.tone} via-transparent to-transparent opacity-90`} />
                    <div className="absolute inset-0 flex flex-col justify-between p-7 text-white sm:p-8">
                      <span className="flex w-fit items-center gap-2 rounded-full border border-white/20 bg-black/15 px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-[0.16em] backdrop-blur-md"><MapPin size={12} aria-hidden="true" /> {destination.country}</span>
                      <div>
                        <h3 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">{destination.place}</h3>
                        <p className="mt-2 text-sm font-semibold text-white/80">{destination.use}</p>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {destinationIdeas.map((destination) => (
                <span key={destination} className="rounded-full border border-slate-200 bg-sand-light px-4 py-2 text-xs font-semibold text-primary">{destination}</span>
              ))}
              <span className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-white">+ Wherever the brief leads</span>
            </div>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-accent py-20 text-white sm:py-28 lg:py-36">
          <div className="pointer-events-none absolute -right-10 -top-14 font-heading text-[16rem] font-extrabold leading-none text-white/[0.07] sm:text-[24rem]" aria-hidden="true">05</div>
          <Container className="relative">
            <ScrollReveal>
              <span className="text-xs font-bold uppercase tracking-[0.22em] text-white/65">From spark to showtime</span>
              <h2 className="mt-5 max-w-4xl font-heading text-4xl font-extrabold tracking-[-0.045em] sm:text-6xl">A process with momentum—and no mystery.</h2>
            </ScrollReveal>

            <div className="mt-14 border-t border-white/25">
              {process.map((item, index) => (
                <ScrollReveal key={item.step} delay={index * 45}>
                  <article className="group grid gap-3 border-b border-white/25 py-7 sm:grid-cols-[5rem_0.8fr_1.2fr_auto] sm:items-center sm:gap-6 sm:py-8">
                    <span className="font-heading text-sm font-extrabold text-gold">{item.step}</span>
                    <h3 className="font-heading text-xl font-bold sm:text-2xl">{item.title}</h3>
                    <p className="max-w-2xl text-sm leading-7 text-white/70">{item.copy}</p>
                    <span className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/25 transition group-hover:bg-white group-hover:text-accent sm:flex"><ArrowRight size={15} aria-hidden="true" /></span>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </Container>
        </section>

        <section id="enquiry" className="scroll-mt-20 overflow-hidden bg-ink-deep py-20 text-white sm:py-28 lg:py-36">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start lg:gap-16">
              <ScrollReveal className="lg:sticky lg:top-28">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-gold"><Sparkles size={13} aria-hidden="true" /> The first move</span>
                <h2 className="mt-5 font-heading text-4xl font-extrabold leading-[1.02] tracking-[-0.045em] sm:text-6xl">Give us the rough brief. We&apos;ll make it real.</h2>
                <p className="mt-6 max-w-lg text-base leading-8 text-white/55">Delegate count, rough dates and a budget band are enough. We will come back with destination logic, venue routes and an initial cost frame.</p>

                <ul className="mt-9 space-y-4 border-t border-white/10 pt-7">
                  {[
                    [Users, "Reviewed by the corporate desk—not a generic inbox."],
                    [CalendarCheck, "A human response within one working day."],
                    [Receipt, "Transparent, itemised, GST-compliant costing."],
                  ].map(([Icon, copy]) => {
                    const ItemIcon = Icon as typeof Users;
                    return (
                      <li key={String(copy)} className="flex gap-3 text-sm leading-6 text-white/65">
                        <ItemIcon size={18} className="mt-0.5 shrink-0 text-gold" aria-hidden="true" />
                        <span>{String(copy)}</span>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-9 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/35">Need the fast lane?</span>
                  <a href="tel:+919830012345" className="mt-2 block font-heading text-xl font-bold text-white transition hover:text-gold">+91 98300 12345</a>
                  <a href="mailto:info@bandhantours.com" className="mt-1 block text-sm text-white/55 transition hover:text-gold">info@bandhantours.com</a>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={70}>
                <MiceEnquiryForm />
              </ScrollReveal>
            </div>
          </Container>
        </section>

        <section className="bg-sand-light py-20 sm:py-28 lg:py-32">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
              <ScrollReveal>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Before you brief us</span>
                <h2 className="mt-5 font-heading text-4xl font-extrabold tracking-[-0.04em] text-primary sm:text-5xl">The useful questions, answered.</h2>
                <p className="mt-5 text-sm leading-7 text-foreground-muted">Still deciding what you need? That is exactly when the first conversation is most useful.</p>
              </ScrollReveal>

              <div className="border-t border-primary/15">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group border-b border-primary/15">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-left font-heading text-base font-bold text-primary marker:content-none sm:text-lg">
                      {faq.question}
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/15 transition group-open:rotate-180 group-open:bg-primary group-open:text-white"><ChevronDown size={17} aria-hidden="true" /></span>
                    </summary>
                    <p className="max-w-2xl pb-7 pr-12 text-sm leading-7 text-foreground-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>

        <section className="relative overflow-hidden bg-gold py-20 sm:py-24">
          <div className="mice-grid absolute inset-0 opacity-25" aria-hidden="true" />
          <Container className="relative">
            <div className="grid gap-9 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-primary/55">Your next programme</span>
                <h2 className="mt-4 max-w-4xl font-heading text-4xl font-extrabold tracking-[-0.05em] text-primary sm:text-6xl">Let&apos;s make the one they remember.</h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <a href="#enquiry" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-primary-light">Build an event brief <ArrowRight size={16} aria-hidden="true" /></a>
                <Link href="/contact" className="inline-flex min-h-13 items-center justify-center rounded-full border border-primary/30 px-7 py-3.5 text-sm font-bold text-primary transition hover:border-primary hover:bg-white/35">Talk to the team</Link>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  );
}
