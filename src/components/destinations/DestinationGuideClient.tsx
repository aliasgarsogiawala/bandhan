"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  Clock3,
  MapPin,
  Plane,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import { Container } from "@/components/ui/Container";
import type { Destination, DestinationExperience, DestinationRouteStop, DestinationSeason } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";
import { Reveal } from "./Reveal";
import {
  Compass,
  CornerFlourish,
  DottedRoute,
  InkUnderline,
  LeafSprig,
  MountainSilhouette,
  PaperPlane,
  SunMark,
  TopoPattern,
  WaveDivider,
} from "./Decor";

type GuideProfile = {
  duration: string;
  bestTime: string;
  startingPoint: string;
  overview: string[];
  characterTitle?: string;
  planningTitle?: string;
  planningDescription?: string;
  planningPoints?: string[];
  experiences: DestinationExperience[];
  route: DestinationRouteStop[];
  seasons: DestinationSeason[];
  notes: string[];
};

const guides: Record<string, GuideProfile> = {
  kerala: {
    duration: "6 - 8 days",
    bestTime: "September - March",
    startingPoint: "Kochi International Airport",
    overview: [
      "Kerala is at its best when you travel slowly. The route moves from Fort Kochi's old-world lanes into the cool tea country of Munnar, through spice-scented hills and finally to the quiet backwaters of Alleppey.",
      "It works beautifully for couples, families and first-time visitors because every stop feels distinct: heritage, mountains, wildlife, food and a night on the water - all within one unhurried journey.",
    ],
    experiences: [
      { title: "Munnar's tea country", description: "Wake up among rolling plantations, misty viewpoints and small mountain roads made for an unhurried day out." },
      { title: "A night on the backwaters", description: "Cruise through palm-lined canals and paddy fields, then watch the sunset from your private houseboat deck." },
      { title: "Thekkady's spice trails", description: "Explore cardamom gardens, forest edges and local flavours with time set aside for a calm, nature-led stay." },
      { title: "Fort Kochi after dark", description: "Colonial streets, art spaces, seafood cafés and Chinese fishing nets offer a graceful beginning or finish to the trip." },
    ],
    route: [
      { label: "Days 1 - 2", title: "Kochi to Munnar", description: "Arrive in Kochi, then climb through waterfalls and tea gardens to a hill-station stay." },
      { label: "Days 3 - 4", title: "Munnar and Thekkady", description: "Mix scenic viewpoints with a spice plantation visit, light forest experiences and relaxed evenings." },
      { label: "Days 5 - 6", title: "Backwaters", description: "Travel down to Kumarakom or Alleppey for village lanes, a houseboat night and slow water views." },
      { label: "Days 7 - 8", title: "Beach or Kochi departure", description: "Add Marari Beach for downtime, or return to Kochi for your onward journey." },
    ],
    seasons: [
      { title: "October to February", detail: "Cooler, clearer days for hills, backwaters and easy sightseeing." },
      { title: "March to May", detail: "Warmer weather; ideal if you prefer quieter stays and a slower coastal pace." },
      { title: "June to September", detail: "Lush monsoon landscapes, wellness escapes and dramatic green scenery." },
    ],
    notes: ["Private vehicle and driver make the hill-to-backwater route far more comfortable.", "A houseboat night is best paired with a land stay so the trip keeps its rhythm.", "Choose Munnar hotels by view and access - not just by star rating."],
  },
  kashmir: {
    duration: "5 - 7 days", bestTime: "March - October", startingPoint: "Srinagar Airport",
    overview: ["Kashmir is a journey of contrasts: quiet mornings on Dal Lake, flower-filled gardens, wide alpine meadows and high mountain roads.", "A thoughtful route gives each valley its own time, rather than treating Srinagar, Gulmarg and Pahalgam as quick checkboxes."],
    experiences: [{ title: "Dal Lake mornings", description: "Stay on the water and begin the day with a shikara ride before the city wakes." }, { title: "Gulmarg heights", description: "Ride up for expansive mountain views, meadow walks and winter snow experiences." }, { title: "Pahalgam valleys", description: "Slow down beside the Lidder River, pine forests and open countryside." }, { title: "Srinagar gardens", description: "Pair Mughal gardens, old-city craft and local cuisine with a gentle first or final day." }],
    route: [{ label: "Days 1 - 2", title: "Srinagar", description: "Lake, gardens and local culture with a houseboat or boutique stay." }, { label: "Days 3 - 4", title: "Gulmarg", description: "A scenic mountain escape for gondola views and alpine air." }, { label: "Days 5 - 6", title: "Pahalgam", description: "A quieter valley finish with river views and unhurried walks." }],
    seasons: [{ title: "March to May", detail: "Blooming gardens and fresh spring colour." }, { title: "June to October", detail: "Green valleys, clear roads and pleasant sightseeing." }, { title: "December to February", detail: "Snow, skiing and a true winter landscape." }],
    notes: ["Keep one flexible day for mountain weather.", "Houseboats and hotels offer very different experiences - combine both if time allows.", "Higher-altitude activities depend on road and weather conditions."],
  },
};

function genericGuide(destination: Destination): GuideProfile {
  const duration = destination.duration || "4 - 6 days";
  const bestTime = destination.bestTime || "Choose dates with your travel designer";
  const highlights = destination.highlights?.length ? destination.highlights : ["Signature local sights", "Regional food and culture", "Scenic experiences", "Time to unwind"];
  return {
    duration,
    bestTime,
    startingPoint: destination.startingPoint || "Nearest major airport",
    characterTitle: destination.characterTitle || `Travel ${destination.name} with room to feel it.`,
    planningTitle: destination.planningTitle || "Make the guide yours.",
    planningDescription: destination.planningDescription || "We shape a day-by-day plan around your dates, budget, hotel style and who is travelling.",
    planningPoints: destination.planningPoints?.length ? destination.planningPoints : ["Private transfers and handpicked stays", "Flexible pacing and optional experiences", "Support from first enquiry to departure"],
    overview: [destination.overview || destination.description, "We tailor the pace, stays and route around the experiences that matter to your group."],
    experiences: highlights.slice(0, 4).map((title) => ({ title, description: `A memorable ${destination.name} experience, fitted naturally into your route.` })),
    route: [{ label: "Days 1 - 2", title: "Arrive and settle in", description: "Start gently with the destination's essential sights and local character." }, { label: "Days 3 - 4", title: "Explore more deeply", description: "Add the experiences, stays and pace that suit the way you travel." }, { label: "Final day", title: "Return at your own pace", description: "Keep the last day relaxed and timed comfortably for your departure." }],
    seasons: [{ title: "Best travel window", detail: bestTime }, { title: "A quieter escape", detail: "Ask us for shoulder-season dates with more space and value." }, { title: "Built around you", detail: "We will match weather, route and hotel style to your travel plan." }],
    notes: ["Private transfers keep the route comfortable and flexible.", "Choose hotels by location and experience, not only category.", "We can adjust the plan for families, celebrations and special interests."],
  };
}

function prepareGuide(destination: Destination) {
  const profile = guides[destination.id] || genericGuide(destination);
  const customHighlights = destination.highlights?.length
    ? destination.highlights.slice(0, 4).map((title) => ({ title, description: `A signature ${destination.name} experience, planned at the right pace for your trip.` }))
    : profile.experiences;
  return {
    ...profile,
    characterTitle: destination.characterTitle || profile.characterTitle,
    planningTitle: destination.planningTitle || profile.planningTitle,
    planningDescription: destination.planningDescription || profile.planningDescription,
    planningPoints: destination.planningPoints?.length ? destination.planningPoints : profile.planningPoints,
    duration: destination.duration || profile.duration,
    bestTime: destination.bestTime || profile.bestTime,
    startingPoint: destination.startingPoint || profile.startingPoint,
    overview: destination.overview ? destination.overview.split(/\n\s*\n/).filter(Boolean) : profile.overview,
    experiences: destination.experiences?.filter((item) => item.title || item.description).length ? destination.experiences.filter((item) => item.title || item.description) : customHighlights,
    route: destination.route?.filter((item) => item.title || item.description).length ? destination.route.filter((item) => item.title || item.description) : profile.route,
    seasons: destination.seasons?.filter((item) => item.title || item.detail).length ? destination.seasons.filter((item) => item.title || item.detail) : profile.seasons,
    notes: destination.designerNotes?.length ? destination.designerNotes : profile.notes,
    themes: [...new Set([...(destination.themes || []), ...(destination.tag ? [destination.tag] : [])])].slice(0, 5),
    gallery: [...new Set([destination.image, ...(destination.gallery || [])].filter(Boolean))],
  };
}

/* ---------------------------------- bits ---------------------------------- */

function StatPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="group relative flex flex-col gap-2 px-5 py-4 sm:px-6 sm:py-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 text-gold ring-1 ring-inset ring-gold/20 transition-transform duration-300 group-hover:-translate-y-0.5">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-light">{label}</p>
        <p className="mt-0.5 text-sm font-bold leading-snug text-primary">{value}</p>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-px w-8 bg-accent" />
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-accent">{children}</p>
    </div>
  );
}

/* --------------------------------- page ----------------------------------- */

export default function DestinationGuideClient({ id }: { id: string }) {
  const { items } = useCollection<Destination>("destinations");
  const destination = useMemo(() => items.find((item) => item.id === id && item.status !== "draft"), [id, items]);

  if (!destination) {
    return (
      <div className="min-h-screen bg-sand">
        <Navbar />
        <main className="flex min-h-screen items-center justify-center px-6 pt-24 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-accent">Destination unavailable</p>
            <h1 className="mt-3 font-heading text-3xl font-extrabold text-primary">This guide is off the map.</h1>
            <Link href="/destinations" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">
              Explore destinations
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const guide = prepareGuide(destination);
  const bookingHref = `/book?type=destination&id=${encodeURIComponent(destination.id)}`;
  const isNature = (destination.tag || "").toLowerCase() === "nature" || (destination.themes || []).some((t) => t.toLowerCase() === "nature");

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f7f5f1] text-primary">
      <Navbar />
      <main>
        {/* ============================ HERO ============================ */}
        <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-primary">
          {/* background image */}
          <div className="absolute inset-0">
            <Image src={destination.image} alt={destination.name} fill priority sizes="100vw" className="object-cover opacity-70 animate-scale-up" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark via-primary/80 to-primary/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent" />
          </div>

          {/* decorative floating shapes */}
          <LeafSprig className="pointer-events-none absolute right-[6%] top-[22%] hidden h-28 w-28 text-gold/30 animate-float md:block" />
          <Compass className="pointer-events-none absolute left-[4%] top-[18%] hidden h-40 w-40 text-white/10 animate-spin-slow lg:block" />

          {/* topo texture overlay */}
          <TopoPattern className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.04]" />

          <Container className="relative z-10 w-full pt-28 pb-32 sm:pb-40">
            {/* breadcrumb */}
            <nav className="mb-auto pt-2 text-xs font-semibold text-white/55" aria-label="Breadcrumb">
              <Link href="/" className="transition-colors hover:text-gold">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/destinations" className="transition-colors hover:text-gold">
                Destinations
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gold">{destination.name}</span>
            </nav>

            <div className="mt-16 max-w-3xl">
              <div className="mb-5 flex flex-wrap items-center gap-2 opacity-0 animate-fade-in-down" style={{ animationDelay: "0.1s" }}>
                {destination.tag && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    {isNature && <LeafSprig className="h-3.5 w-3.5" />}
                    {destination.tag}
                  </span>
                )}
                {destination.country && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                    <MapPin size={11} /> {destination.country}
                  </span>
                )}
              </div>

              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold opacity-0 animate-fade-in-down" style={{ animationDelay: "0.2s" }}>
                A Bandhan destination guide
              </p>

              <h1
                className="mt-4 font-heading text-4xl font-extrabold leading-[0.96] text-white opacity-0 animate-fade-in-up min-[380px]:text-5xl sm:text-7xl sm:leading-[0.92] lg:text-8xl"
                style={{ animationDelay: "0.3s" }}
              >
                {destination.name}
              </h1>

              <InkUnderline className="mt-6 h-3 w-44 text-gold opacity-0 animate-fade-in" style={{ animationDelay: "0.55s" }} />

              <p
                className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-xl opacity-0 animate-fade-in-up"
                style={{ animationDelay: "0.45s" }}
              >
                {destination.tagline || destination.description}
              </p>

              <div
                className="mt-9 flex flex-col items-start gap-x-7 gap-y-4 opacity-0 animate-fade-in-up sm:flex-row sm:flex-wrap sm:items-center"
                style={{ animationDelay: "0.6s" }}
              >
                <Link
                  href={bookingHref}
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-gold px-7 py-3.5 text-sm font-bold text-primary shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-gold-light hover:shadow-gold/30 sm:w-auto"
                >
                  Build my trip
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <span className="text-sm text-white/70">
                  Indicative trips from <strong className="text-gold">{destination.price}</strong>
                </span>
              </div>
            </div>
          </Container>

          {/* bottom wave */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-16 text-[#f7f5f1] sm:h-20">
            <WaveDivider className="h-full w-full" />
          </div>
        </section>

        {/* ======================= QUICK STATS BAR ======================= */}
        <section className="relative z-20 -mt-2 pb-6">
          <Container>
            <div className="grid divide-y divide-slate-100 overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-[0_24px_70px_-40px_rgba(7,32,60,0.4)] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4">
              <StatPill icon={Clock3} label="Ideal trip length" value={guide.duration} />
              <StatPill icon={Sun} label="Best time to travel" value={guide.bestTime} />
              <StatPill icon={Plane} label="Recommended gateway" value={guide.startingPoint} />
              <StatPill icon={Users} label="Best for" value={destination.groupSize || "Couples, families & friends"} />
            </div>
          </Container>
        </section>

        {/* ========================= OVERVIEW ========================= */}
        <section className="relative py-16 sm:py-24">
          <Compass className="pointer-events-none absolute -right-10 top-10 h-72 w-72 text-primary/[0.04]" />
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
              <article>
                <Reveal>
                  <SectionLabel>The character of the place</SectionLabel>
                  <h2 className="mt-4 max-w-3xl font-heading text-3xl font-extrabold leading-[1.05] text-primary sm:text-5xl">
                    {guide.characterTitle || `Travel ${destination.name} with room to feel it.`}
                  </h2>
                </Reveal>

                <Reveal delay={120}>
                  <div className="mt-8 max-w-3xl space-y-5 text-base leading-relaxed text-foreground-muted sm:text-lg">
                    {guide.overview.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </Reveal>

                {guide.themes.length > 0 && (
                  <Reveal delay={200}>
                    <div className="mt-8 flex flex-wrap gap-2.5">
                      {guide.themes.map((theme) => (
                        <span
                          key={theme}
                          className="rounded-full border border-primary/10 bg-white px-4 py-2 text-xs font-bold text-primary shadow-soft transition-transform duration-300 hover:-translate-y-0.5"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </Reveal>
                )}
              </article>

              {/* sticky plan card */}
              <Reveal delay={150}>
                <aside className="relative overflow-hidden rounded-[1.75rem] bg-primary p-7 text-white shadow-premium lg:sticky lg:top-28">
                  <TopoPattern className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]" />
                  <CornerFlourish className="absolute right-3 top-3 h-12 w-12 text-gold/40" />
                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Plan with clarity</p>
                    <h3 className="mt-3 font-heading text-2xl font-bold">{guide.planningTitle || "Make the guide yours."}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {guide.planningDescription || "We shape a day-by-day plan around your dates, budget, hotel style and who is travelling."}
                    </p>
                    <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                      {(guide.planningPoints?.length ? guide.planningPoints : ["Private transfers and handpicked stays", "Flexible pacing and optional experiences", "Support from first enquiry to departure"]).map((item) => (
                        <p key={item} className="flex gap-2.5 text-slate-200">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                          {item}
                        </p>
                      ))}
                    </div>
                    <Link
                      href={bookingHref}
                      className="group mt-7 inline-flex items-center gap-2 text-sm font-bold text-gold transition-colors hover:text-gold-light"
                    >
                      Start planning
                      <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                </aside>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ===================== SIGNATURE EXPERIENCES ===================== */}
        <section className="relative py-16 sm:py-20">
          <Container>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <Reveal>
                <div>
                  <SectionLabel>Signature experiences</SectionLabel>
                  <h2 className="mt-4 max-w-xl font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
                    What a well-planned trip feels like
                  </h2>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <p className="max-w-md text-sm leading-relaxed text-foreground-muted">
                  Not a checklist. These are the moments we use to give your route its own rhythm.
                </p>
              </Reveal>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {guide.experiences.map((experience, index) => (
                <Reveal key={experience.title} delay={index * 90}>
                  <article className="group relative flex min-h-[20rem] flex-col overflow-hidden rounded-[1.5rem] bg-primary p-6 text-white shadow-soft">
                    <Image
                      src={guide.gallery[index % guide.gallery.length]}
                      alt={experience.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover opacity-50 transition-all duration-[900ms] ease-out group-hover:scale-110 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary/70 to-primary/15" />
                    <div className="relative flex h-full flex-col justify-end">
                      <span className="mb-auto inline-flex h-9 w-fit items-center rounded-full bg-white/10 px-3 text-xs font-extrabold text-gold ring-1 ring-inset ring-white/15 backdrop-blur-sm">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-heading text-xl font-bold leading-snug">{experience.title}</h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-200">{experience.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold opacity-100 transition-all duration-300 sm:opacity-0 sm:group-hover:opacity-100">
                        Explore <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ======================= SUGGESTED FLOW ======================= */}
        <section className="relative overflow-hidden py-16 sm:py-24">
          <MountainSilhouette className="pointer-events-none absolute bottom-0 left-0 h-40 w-full text-primary/[0.04]" />
          <Container>
            <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-premium">
              <div className="grid lg:grid-cols-[0.85fr_1.15fr]">
                {/* left intro panel */}
                <div className="relative flex flex-col justify-between gap-8 overflow-hidden bg-primary p-8 text-white lg:p-10">
                  <TopoPattern className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.05]" />
                  <PaperPlane className="relative h-9 w-9 text-gold" />
                  <div className="relative">
                    <SectionLabel>
                      <span className="text-gold">Suggested flow</span>
                    </SectionLabel>
                    <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight">
                      A route with the right amount of breathing room.
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-slate-300">
                      This is a starting shape, not a fixed package. Add a beach stay, slow down in the hills, or shorten the route around your dates.
                    </p>
                    <Link
                      href={bookingHref}
                      className="group mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-primary transition-all duration-300 hover:bg-gold-light"
                    >
                      Talk through this route
                      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </div>
                  <DottedRoute className="relative h-8 w-full text-gold/50" />
                </div>

                {/* right timeline */}
                <ol className="relative p-8 lg:p-10">
                  {/* vertical line */}
                  <span className="absolute left-[3.4rem] top-12 bottom-12 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />
                  {guide.route.map((stop, index) => (
                    <li key={stop.title} className="relative grid grid-cols-[2.5rem_1fr] gap-5 pb-8 last:pb-0">
                      <div className="relative">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-accent to-accent-dark text-xs font-extrabold text-white shadow-lg shadow-accent/25">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-accent">{stop.label}</p>
                        <h3 className="mt-1.5 text-lg font-bold text-primary">{stop.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{stop.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Container>
        </section>

        {/* ========================= WHEN TO GO ========================= */}
        <section className="relative py-16 sm:py-20">
          <Container>
            <Reveal>
              <SectionLabel>When to go</SectionLabel>
              <h2 className="mt-4 max-w-2xl font-heading text-3xl font-extrabold leading-tight text-primary sm:text-4xl">
                Choose the version of {destination.name} you want to experience.
              </h2>
            </Reveal>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {guide.seasons.map((season, index) => (
                <Reveal key={season.title} delay={index * 110}>
                  <article className="group relative h-full overflow-hidden rounded-[1.5rem] border border-primary/5 bg-white px-7 py-8 shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-premium">
                    <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-gold to-accent transition-transform duration-500 group-hover:scale-x-100" />
                    <SunMark className="h-9 w-9 text-gold transition-transform duration-500 group-hover:rotate-90" />
                    <span className="mt-5 block text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
                      Season {index + 1}
                    </span>
                    <h3 className="mt-2.5 font-heading text-xl font-bold text-primary">{season.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{season.detail}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ===================== GALLERY + DESIGNER NOTES ===================== */}
        <section className="relative py-16 sm:py-20">
          <Container>
            <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
              <Reveal>
                <div>
                  {guide.gallery.length > 1 && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group relative col-span-2 min-h-[300px] overflow-hidden rounded-[1.5rem] bg-primary sm:min-h-[440px]">
                        <Image
                          src={guide.gallery[0]}
                          alt={`${destination.name} landscape`}
                          fill
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                        />
                        <div className="absolute left-4 top-4 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur-sm">
                          {destination.name}
                        </div>
                      </div>
                      {guide.gallery.slice(1, 3).map((image, index) => (
                        <div
                          key={image}
                          className="group relative min-h-44 overflow-hidden rounded-[1.25rem] bg-primary"
                        >
                          <Image
                            src={image}
                            alt={`${destination.name} travel moment ${index + 2}`}
                            fill
                            sizes="(max-width: 640px) 50vw, 30vw"
                            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal delay={140}>
                <aside className="relative h-full overflow-hidden rounded-[1.75rem] border border-primary/10 bg-gradient-to-br from-sand-dark to-sand p-8">
                  <CornerFlourish className="absolute right-3 top-3 h-12 w-12 text-accent/30" />
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/25 text-primary ring-1 ring-inset ring-gold/30">
                    <Sparkles size={18} />
                  </span>
                  <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Travel designer&apos;s notes</p>
                  <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight text-primary">
                    Small details, better journeys.
                  </h2>
                  <ul className="mt-6 space-y-4">
                    {guide.notes.map((note) => (
                      <li key={note} className="flex gap-3 text-sm leading-relaxed text-foreground-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </aside>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ============================= FAQ ============================= */}
        {destination.faqs?.length ? (
          <section className="relative py-16 sm:py-20">
            <Container>
              <Reveal className="max-w-4xl">
                <SectionLabel>Before you book</SectionLabel>
                <h2 className="mt-4 font-heading text-3xl font-extrabold text-primary sm:text-4xl">
                  Frequently asked questions
                </h2>
                <div className="mt-7 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-100 bg-white px-6 shadow-soft">
                  {destination.faqs.map((faq) => (
                    <details key={faq.question} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 pr-2 text-sm font-bold text-primary">
                        {faq.question}
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/15 text-accent transition-transform duration-300 group-open:rotate-45">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </Container>
          </section>
        ) : null}

        {/* ============================= CTA ============================= */}
        <section className="relative px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="relative isolate overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center text-white shadow-premium sm:px-12 sm:py-20">
              <Image
                src={destination.image}
                alt=""
                fill
                sizes="100vw"
                className="-z-10 object-cover opacity-20"
              />
              <div className="-z-10 absolute inset-0 bg-gradient-to-t from-primary-dark via-primary/90 to-primary/70" />
              <LeafSprig className="pointer-events-none absolute left-6 top-6 h-12 w-12 text-gold/40 animate-float" />
              <LeafSprig className="pointer-events-none absolute bottom-6 right-6 h-12 w-12 rotate-180 text-gold/40 animate-float-slow" />

              <Reveal>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-gold">Ready when you are</p>
                <h2 className="mx-auto mt-3 max-w-3xl font-heading text-3xl font-extrabold leading-tight sm:text-5xl">
                  Let&apos;s make {destination.name} feel like your trip.
                </h2>
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                  Share your dates and travel style. We will turn the ideas in this guide into a considered, bookable itinerary.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                  <Link
                    href={bookingHref}
                    className="group inline-flex items-center gap-2 rounded-full bg-gold px-8 py-4 text-sm font-bold text-primary shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-gold-light hover:shadow-gold/30"
                  >
                    Start planning this trip
                    <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    <Calendar size={15} /> Talk to a designer
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
