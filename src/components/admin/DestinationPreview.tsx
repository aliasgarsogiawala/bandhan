"use client";

import React from "react";
import type { Destination, ItineraryDay, PackageFaq } from "@/data/mockData";

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function stringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
}

function destinationFromDraft(draft: Record<string, unknown>): Destination {
  return {
    id: stringValue(draft.id, "preview"),
    name: stringValue(draft.name, "Untitled destination"),
    image: stringValue(draft.image),
    price: stringValue(draft.price, "Enquire"),
    description: stringValue(draft.description, "Add a destination description to see it here."),
    tag: stringValue(draft.tag),
    country: stringValue(draft.country, "India"),
    region: stringValue(draft.region),
    duration: stringValue(draft.duration, "Custom trip"),
    bestTime: stringValue(draft.bestTime, "Year-round"),
    highlights: stringArray(draft.highlights),
    gallery: stringArray(draft.gallery),
    tagline: stringValue(draft.tagline, stringValue(draft.description)),
    overview: stringValue(draft.overview, stringValue(draft.description)),
    startingPoint: stringValue(draft.startingPoint, "To be confirmed"),
    groupSize: stringValue(draft.groupSize, "2+ guests"),
    themes: stringArray(draft.themes),
    characterTitle: stringValue(draft.characterTitle),
    planningTitle: stringValue(draft.planningTitle),
    planningDescription: stringValue(draft.planningDescription),
    planningPoints: stringArray(draft.planningPoints),
    experiences: Array.isArray(draft.experiences) ? draft.experiences as Destination["experiences"] : [],
    route: Array.isArray(draft.route) ? draft.route as Destination["route"] : [],
    seasons: Array.isArray(draft.seasons) ? draft.seasons as Destination["seasons"] : [],
    designerNotes: stringArray(draft.designerNotes),
    itinerary: Array.isArray(draft.itinerary) ? draft.itinerary as ItineraryDay[] : [],
    inclusions: stringArray(draft.inclusions),
    exclusions: stringArray(draft.exclusions),
    faqs: Array.isArray(draft.faqs) ? draft.faqs as PackageFaq[] : [],
    status: draft.status === "draft" ? "draft" : "active",
    isFeatured: draft.isFeatured !== false,
  };
}

export default function DestinationPreview({ draft, onClose }: { draft: Record<string, unknown>; onClose: () => void }) {
  const destination = destinationFromDraft(draft);
  const image = destination.image || "/logo.svg";
  const days = (destination.itinerary || []).filter((day) => day.title || day.description);
  const themes = [...(destination.themes || []), ...(destination.tag ? [destination.tag] : [])].slice(0, 6);

  return (
    <div className="fixed inset-0 z-[60] bg-primary/60 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto">
      <div className="mx-auto max-w-6xl bg-sand rounded-3xl shadow-2xl overflow-hidden">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-5 sm:px-8 py-4 bg-white/95 backdrop-blur border-b border-slate-100">
          <div><span className="text-[10px] font-bold uppercase tracking-widest text-accent">Unsaved preview</span><p className="text-sm font-semibold text-primary mt-1">This is how the destination will appear before publishing.</p></div>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-full border border-primary/15 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-colors">Back to editor</button>
        </div>

        <section className="relative min-h-[360px] sm:min-h-[440px] flex items-end overflow-hidden bg-primary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt={destination.name} className="absolute inset-0 w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-ink-deep/55" />
          <div className="relative p-6 sm:p-10 w-full text-white"><div className="flex flex-wrap gap-2 mb-4"><span className="px-3 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wider">{destination.status === "draft" ? "Draft" : "Active"}</span>{destination.country && <span className="px-3 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-wider">{destination.country}</span>}{destination.tag && <span className="px-3 py-1 rounded-full bg-white/15 text-white text-[10px] font-bold uppercase tracking-wider">{destination.tag}</span>}</div><h1 className="text-4xl sm:text-6xl font-heading font-extrabold leading-tight">{destination.name}</h1><p className="mt-4 max-w-2xl text-base sm:text-lg text-slate-200">{destination.tagline || destination.description}</p><div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-200"><span><strong className="block text-[10px] uppercase tracking-widest text-gold">Starting from</strong>{destination.price}</span><span><strong className="block text-[10px] uppercase tracking-widest text-gold">Duration</strong>{destination.duration}</span><span><strong className="block text-[10px] uppercase tracking-widest text-gold">Best time</strong>{destination.bestTime}</span></div></div>
        </section>

        <main className="p-6 sm:p-10 space-y-10">
          <section><span className="text-xs font-bold uppercase tracking-widest text-accent">Overview</span><h2 className="mt-2 text-2xl sm:text-3xl font-heading font-extrabold text-primary">The journey at a glance</h2><p className="mt-4 max-w-3xl text-sm sm:text-base text-foreground-muted leading-relaxed">{destination.overview || destination.description}</p>{themes.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{themes.map((theme) => <span key={theme} className="px-3 py-1.5 rounded-full bg-sand-dark text-primary text-xs font-bold">{theme}</span>)}</div>}</section>

          {(destination.planningTitle || destination.planningDescription || destination.planningPoints?.length) && <section className="rounded-2xl bg-primary p-6 text-white"><span className="text-xs font-bold uppercase tracking-widest text-gold">Plan with clarity</span><h2 className="mt-2 text-2xl font-heading font-extrabold">{destination.planningTitle || "Make the guide yours."}</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">{destination.planningDescription}</p>{destination.planningPoints?.length ? <ul className="mt-5 grid gap-2 sm:grid-cols-3">{destination.planningPoints.map((item) => <li key={item} className="text-sm text-slate-200">✓ {item}</li>)}</ul> : null}</section>}

          {Array.isArray(destination.experiences) && destination.experiences.length > 0 && <section><span className="text-xs font-bold uppercase tracking-widest text-accent">Signature experiences</span><h2 className="mt-2 text-2xl sm:text-3xl font-heading font-extrabold text-primary">What a well-planned trip feels like</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{destination.experiences.map((item, index) => <article key={`${item.title}-${index}`} className="rounded-2xl bg-primary p-5 text-white"><span className="text-xs font-bold text-gold">{String(index + 1).padStart(2, "0")}</span><h3 className="mt-4 font-heading text-lg font-bold">{item.title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-300">{item.description}</p></article>)}</div></section>}

          {Array.isArray(destination.route) && destination.route.length > 0 && <section><span className="text-xs font-bold uppercase tracking-widest text-accent">Suggested flow</span><h2 className="mt-2 text-2xl sm:text-3xl font-heading font-extrabold text-primary">A route with breathing room</h2><div className="mt-5 space-y-3">{destination.route.map((stop, index) => <article key={`${stop.title}-${index}`} className="rounded-2xl bg-white border border-slate-100 p-5"><p className="text-[10px] font-bold uppercase tracking-widest text-accent">{stop.label}</p><h3 className="mt-1 font-heading text-lg font-bold text-primary">{stop.title}</h3><p className="mt-2 text-sm leading-relaxed text-foreground-muted">{stop.description}</p></article>)}</div></section>}

          {Array.isArray(destination.seasons) && destination.seasons.length > 0 && <section><span className="text-xs font-bold uppercase tracking-widest text-accent">When to go</span><div className="mt-5 grid gap-3 sm:grid-cols-3">{destination.seasons.map((season, index) => <article key={`${season.title}-${index}`} className="rounded-2xl bg-white border border-slate-100 p-5"><span className="text-[10px] font-bold uppercase tracking-widest text-accent">Season {index + 1}</span><h3 className="mt-2 font-heading text-lg font-bold text-primary">{season.title}</h3><p className="mt-2 text-sm leading-relaxed text-foreground-muted">{season.detail}</p></article>)}</div></section>}

          <section><span className="text-xs font-bold uppercase tracking-widest text-accent">Day by day</span><h2 className="mt-2 text-2xl sm:text-3xl font-heading font-extrabold text-primary">Detailed itinerary</h2>{days.length > 0 ? <div className="mt-6 space-y-3">{days.map((day, index) => <article key={`${day.day}-${index}`} className="rounded-2xl bg-white border border-slate-100 p-5"><div className="flex gap-4"><span className="flex-shrink-0 w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-xs font-extrabold">{String(index + 1).padStart(2, "0")}</span><div><p className="text-[10px] font-bold uppercase tracking-widest text-accent">Day {index + 1}</p><h3 className="mt-1 text-base font-heading font-bold text-primary">{day.title || "Untitled day"}</h3>{day.description && <p className="mt-2 text-sm text-foreground-muted leading-relaxed">{day.description}</p>}<div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-primary/70">{day.meals && <span className="px-2.5 py-1 rounded-full bg-sand-dark">Meals: {day.meals}</span>}{day.stay && <span className="px-2.5 py-1 rounded-full bg-sand-dark">Overnight: {day.stay}</span>}</div></div></div></article>)}</div> : <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-foreground-muted">No itinerary days added yet. Add at least one day in the editor to complete this section.</div>}</section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><section className="rounded-2xl bg-white border border-slate-100 p-6"><h3 className="text-base font-heading font-bold text-primary">What&apos;s included</h3>{(destination.inclusions || []).length > 0 ? <ul className="mt-4 space-y-2 text-sm text-foreground-muted">{destination.inclusions?.map((item) => <li key={item} className="flex gap-2"><span className="text-emerald-500">✓</span>{item}</li>)}</ul> : <p className="mt-3 text-sm text-foreground-light">No inclusions added yet.</p>}</section><section className="rounded-2xl bg-white border border-slate-100 p-6"><h3 className="text-base font-heading font-bold text-primary">Good to know</h3>{(destination.faqs || []).length > 0 ? <div className="mt-4 space-y-4">{destination.faqs?.map((faq) => <div key={faq.question}><p className="text-sm font-semibold text-primary">{faq.question}</p><p className="mt-1 text-sm text-foreground-muted">{faq.answer}</p></div>)}</div> : <p className="mt-3 text-sm text-foreground-light">No FAQs added yet.</p>}</section></div>
        </main>
      </div>
    </div>
  );
}
