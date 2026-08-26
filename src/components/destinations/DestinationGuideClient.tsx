"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Expand,
  Plane,
  Sparkles,
  Sun,
  Users,
} from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import { Container } from "@/components/ui/Container";
import type { Destination, DestinationExperience, DestinationRouteStop, DestinationSeason } from "@/data/mockData";
import { useCollection } from "@/lib/admin/store";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Lightbox } from "@/components/ui/Lightbox";

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

const sectionLinks = [
  { id: "overview", label: "Overview" },
  { id: "experiences", label: "Experiences" },
  { id: "route", label: "Suggested route" },
  { id: "seasons", label: "When to go" },
  { id: "gallery", label: "Gallery" },
];

export default function DestinationGuideClient({ id }: { id: string }) {
  const { items } = useCollection<Destination>("destinations");
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const destination = useMemo(() => items.find((item) => item.id === id && item.status !== "draft"), [id, items]);

  if (!destination) {
    return (
      <PageShell tone="sand" offsetTop mainClassName="flex items-center justify-center px-6 py-24 text-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-accent">Destination unavailable</p>
          <h1 className="mt-3 font-heading text-3xl font-extrabold text-primary">This guide is off the map.</h1>
          <Link href="/destinations" className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-bold text-white">Explore destinations</Link>
        </div>
      </PageShell>
    );
  }

  const guide = prepareGuide(destination);
  const bookingHref = `/book?type=destination&id=${encodeURIComponent(destination.id)}`;
  const guideSections = destination.faqs?.length ? [...sectionLinks, { id: "faqs", label: "FAQs" }] : sectionLinks;
  const heroLabels = [...new Set([destination.country || destination.region || "India", destination.tag, ...guide.themes].filter(Boolean))];
  const facts = [
    { label: "Ideal duration", value: guide.duration, icon: Clock3 },
    { label: "Best time", value: guide.bestTime, icon: CalendarDays },
    { label: "Start from", value: guide.startingPoint, icon: Plane },
    { label: "Best for", value: destination.groupSize || "Couples, families & friends", icon: Users },
  ];
  const gallerySlides = guide.gallery.map((image, index) => ({ image, title: destination.name, caption: guide.experiences[index]?.title || `${destination.name} travel moment` }));

  return (
    <PageShell tone="custom" className="destination-detail bg-sand-light">
      <header className="relative flex min-h-[86svh] items-end overflow-hidden pt-28 sm:min-h-[720px] sm:pt-0 lg:min-h-[780px]">
        <Image src={destination.image} alt={destination.name} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="pointer-events-none absolute inset-0 bg-ink-deep/55" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-deep via-ink-deep/25 to-ink-deep/20" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/25" />

        <Container className="relative pb-12 sm:pb-16 lg:pb-20">
          <nav className="mb-5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60" aria-label="Breadcrumb">
            <Link href="/destinations" className="transition-colors hover:text-gold">← Destinations</Link>
          </nav>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            {heroLabels.join(" · ")}
          </p>
          <h1 className="max-w-6xl break-words font-heading text-[2.4rem] font-extrabold leading-[1.04] tracking-[-0.035em] text-white min-[420px]:text-5xl sm:text-6xl lg:text-[4.5rem]">
            {destination.name}
          </h1>
          <p className="mt-6 max-w-4xl text-sm leading-7 text-white/80 sm:text-lg sm:leading-8">{destination.tagline || destination.description}</p>

          <div className="mt-10 grid w-full grid-cols-2 border-y border-white/20 sm:grid-cols-4">
            {facts.map((fact) => {
              const Icon = fact.icon;
              return (
                <div key={fact.label} className="min-w-0 border-b border-r border-white/15 px-0 py-4 pr-4 last:border-r-0 even:pl-4 sm:border-b-0 sm:px-5 sm:first:pl-0">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-gold"><Icon size={12} strokeWidth={1.7} />{fact.label}</span>
                  <span className="mt-1.5 block text-xs font-medium leading-5 text-white sm:text-sm">{fact.value}</span>
                </div>
              );
            })}
          </div>
        </Container>
      </header>

      <div className="sticky top-16 z-30 border-b border-primary/10 bg-[#fbfaf7]/95 backdrop-blur-xl sm:top-[76px]">
        <Container className="flex items-center gap-2 py-3">
          <nav className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label="Destination sections">
            {guideSections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="whitespace-nowrap border-b border-transparent px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground-muted transition-colors hover:border-gold-dark hover:text-primary sm:px-4">{section.label}</a>
            ))}
          </nav>
          <Link href={bookingHref} className="ml-auto inline-flex shrink-0 items-center gap-2 whitespace-nowrap bg-primary px-4 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-gold hover:text-primary sm:px-6">
            Plan my trip <ArrowRight size={14} />
          </Link>
        </Container>
      </div>

      <section className="bg-[#fbfaf7] py-16 sm:py-24">
        <Container className="grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div className="min-w-0 space-y-20 sm:space-y-28">
            <ScrollReveal>
              <section id="overview" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">The destination</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold leading-tight tracking-[-0.03em] text-primary sm:text-5xl">{guide.characterTitle || `Travel ${destination.name} with room to feel it.`}</h2>
                <div className="mt-6 space-y-5 text-sm leading-7 text-foreground-muted sm:text-base sm:leading-8">
                  {guide.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
                <figure className="relative mt-10 h-[280px] w-full overflow-hidden bg-sand-dark sm:h-[420px]">
                  <Image src={guide.gallery[0]} alt={`${destination.name} landscape`} fill sizes="(max-width: 1023px) 100vw, 70vw" className="object-cover" />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-deep/85 to-transparent px-5 pb-5 pt-16 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/80">{destination.name}</figcaption>
                </figure>
                {guide.themes.length > 0 ? (
                  <div className="mt-10 border-y border-primary/15 sm:grid sm:grid-cols-2">
                    {guide.themes.map((theme, index) => (
                      <div key={theme} className="flex items-start gap-4 border-b border-primary/10 py-5 last:border-b-0 sm:px-5 sm:first:pl-0 sm:[&:nth-child(odd)]:border-r">
                        <span className="font-heading text-xl font-extrabold text-gold-dark">{String(index + 1).padStart(2, "0")}</span>
                        <span className="pt-1 text-sm font-semibold leading-6 text-primary">{theme}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="experiences" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Signature moments</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Experiences worth travelling for</h2>
                <div className="mt-8 grid border-t border-primary/15 sm:grid-cols-2">
                  {guide.experiences.map((experience, index) => (
                    <article key={experience.title} className="border-b border-primary/15 py-7 sm:px-6 sm:[&:nth-child(odd)]:border-r sm:[&:nth-child(odd)]:pl-0">
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">Experience {String(index + 1).padStart(2, "0")}</span>
                      <h3 className="mt-3 font-heading text-2xl font-extrabold text-primary">{experience.title}</h3>
                      <p className="mt-3 text-sm leading-7 text-foreground-muted">{experience.description}</p>
                    </article>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="route" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Suggested flow</span>
                <div className="mt-3 flex flex-wrap items-end justify-between gap-4 border-b border-primary/15 pb-7">
                  <h2 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">A route with room to breathe</h2>
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-foreground-muted">Fully customisable</span>
                </div>
                <ol>
                  {guide.route.map((stop, index) => (
                    <li key={`${stop.label}-${stop.title}`} className="grid gap-4 border-b border-primary/10 py-7 sm:grid-cols-[90px_minmax(0,1fr)] sm:gap-7">
                      <div><span className="font-heading text-3xl font-extrabold text-gold-dark">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.15em] text-foreground-muted">{stop.label}</span></div>
                      <div><h3 className="font-heading text-2xl font-extrabold text-primary">{stop.title}</h3><p className="mt-2 text-sm leading-7 text-foreground-muted">{stop.description}</p></div>
                    </li>
                  ))}
                </ol>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="seasons" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">When to go</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Choose your season</h2>
                <div className="mt-8 divide-y divide-primary/10 border-y border-primary/15">
                  {guide.seasons.map((season) => (
                    <article key={season.title} className="grid gap-3 py-6 sm:grid-cols-[60px_190px_minmax(0,1fr)] sm:items-start sm:gap-6">
                      <Sun size={22} className="text-gold-dark" />
                      <h3 className="font-heading text-xl font-extrabold text-primary">{season.title}</h3>
                      <p className="text-sm leading-7 text-foreground-muted">{season.detail}</p>
                    </article>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            <ScrollReveal>
              <section id="gallery" className="scroll-mt-28">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">A sense of place</span>
                <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">See {destination.name}</h2>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {guide.gallery.slice(0, 6).map((image, index) => (
                    <button key={`${image}-${index}`} type="button" onClick={() => setGalleryIndex(index)} className={`group relative overflow-hidden bg-sand-dark text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${index === 0 ? "col-span-2 min-h-[300px] sm:min-h-[440px]" : "min-h-44 sm:min-h-[220px]"}`} aria-label={`View ${destination.name} image ${index + 1}, enlarged`}>
                      <Image src={image} alt={`${destination.name} travel moment ${index + 1}`} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center bg-white/90 text-primary"><Expand size={15} /></span>
                    </button>
                  ))}
                </div>
              </section>
            </ScrollReveal>

            {destination.faqs?.length ? (
              <ScrollReveal>
                <section id="faqs" className="scroll-mt-28">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Before you travel</span>
                  <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-[-0.03em] text-primary sm:text-5xl">Frequently asked questions</h2>
                  <div className="mt-8 divide-y divide-primary/10 border-y border-primary/15">
                    {destination.faqs.map((faq) => (
                      <details key={faq.question} className="group py-5">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-bold text-primary">{faq.question}<span className="text-xl font-light text-gold-dark transition-transform group-open:rotate-45">+</span></summary>
                        <p className="max-w-3xl pt-4 text-sm leading-7 text-foreground-muted">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </ScrollReveal>
            ) : null}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-36">
            <div className="border border-primary/15 bg-white p-7 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">Plan this destination</p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-foreground-muted">Indicative trips from</p>
              <p className="mt-1 font-heading text-4xl font-extrabold text-primary">{destination.price}</p>
              <p className="mt-4 text-sm leading-7 text-foreground-muted">{guide.planningDescription || "We shape a day-by-day plan around your dates, budget, hotel style and travel party."}</p>
              <div className="mt-6 space-y-3 border-t border-primary/10 pt-5">
                {(guide.planningPoints?.length ? guide.planningPoints : ["Private transfers and handpicked stays", "Flexible pacing and optional experiences", "Support from enquiry to departure"]).map((item) => (
                  <p key={item} className="flex gap-2.5 text-sm leading-6 text-primary"><Check className="mt-1 h-4 w-4 shrink-0 text-gold-dark" />{item}</p>
                ))}
              </div>
              <Link href={bookingHref} className="mt-7 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-primary px-5 text-xs font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-gold hover:text-primary">Plan my trip <ArrowRight size={15} /></Link>
              <Link href="/contact" className="mt-3 inline-flex min-h-12 w-full items-center justify-center border border-primary/20 px-5 text-xs font-bold uppercase tracking-[0.15em] text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white">Talk to a designer</Link>
            </div>

            <div className="border border-primary/10 bg-sand-dark p-7">
              <Sparkles size={20} className="text-gold-dark" />
              <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold-dark">Designer notes</p>
              <ul className="mt-4 space-y-4">
                {guide.notes.map((note) => <li key={note} className="border-b border-primary/10 pb-4 text-sm leading-6 text-foreground-muted last:border-0 last:pb-0">{note}</li>)}
              </ul>
            </div>
          </aside>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-primary py-20 text-white sm:py-28">
        <Image src={destination.image} alt="" fill sizes="100vw" className="object-cover opacity-20" />
        <div className="pointer-events-none absolute inset-0 bg-ink-deep/70" />
        <Container className="relative text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Ready when you are</p>
          <h2 className="mx-auto mt-4 max-w-4xl font-heading text-4xl font-extrabold tracking-[-0.03em] sm:text-6xl">Make {destination.name} your journey.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">Share your dates and travel style. We will turn this guide into a considered, bookable itinerary.</p>
          <Link href={bookingHref} className="mt-8 inline-flex min-h-12 items-center gap-2 bg-gold px-8 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:bg-white">Start planning <ArrowRight size={15} /></Link>
        </Container>
      </section>

      <Lightbox slides={gallerySlides} index={galleryIndex} onClose={() => setGalleryIndex(null)} onNavigate={setGalleryIndex} />
    </PageShell>
  );
}
