"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { ContourPattern } from "./HomeDecor";
import BookingModal from "@/components/packages/BookingModal";
import type { DepartureStatus, GroupDeparture } from "@/lib/departures/types";

const departureVisuals = [
  {
    keywords: ["ladakh", "leh"],
    image:
      "https://images.unsplash.com/photo-1536295243470-d7cba4efab7b?auto=format&fit=crop&q=85&w=1800",
    label: "High-altitude adventure",
  },
  {
    keywords: ["kashmir", "srinagar", "gulmarg"],
    image:
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=85&w=1800",
    label: "Valleys & mountain views",
  },
  {
    keywords: ["sikkim", "northeast", "darjeeling"],
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1800",
    label: "Himalayan discovery",
  },
  {
    keywords: ["europe", "paris", "switzerland", "italy"],
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1800",
    label: "Iconic cities & culture",
  },
  {
    keywords: ["kerala", "munnar", "alleppey"],
    image:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1800",
    label: "Backwaters & slow travel",
  },
  {
    keywords: ["goa"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1800",
    label: "A sunny coastal escape",
  },
];

const fallbackVisual = {
  image:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1800",
  label: "Curated group experience",
};

// Refined, editorial status system — muted navy/gold instead of cartoon colors.
const statusStyles: Record<
  DepartureStatus,
  { label: string; badge: string; dot: string; bar: string }
> = {
  "filling-fast": {
    label: "Filling fast",
    badge: "border-accent/30 bg-accent/10 text-accent-dark",
    dot: "bg-accent",
    bar: "bg-accent",
  },
  "limited-seats": {
    label: "Limited seats",
    badge: "border-gold/40 bg-gold/15 text-gold-dark",
    dot: "bg-gold",
    bar: "bg-gold-dark",
  },
  guaranteed: {
    label: "Guaranteed",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  "sold-out": {
    label: "Sold out",
    badge: "border-slate-300 bg-slate-100 text-slate-500",
    dot: "bg-slate-400",
    bar: "bg-slate-400",
  },
};

function getDepartureVisual(destination: string) {
  const normalizedDestination = destination.toLowerCase();
  return (
    departureVisuals.find(({ keywords }) =>
      keywords.some((keyword) => normalizedDestination.includes(keyword))
    ) ?? fallbackVisual
  );
}

export const GroupDepartures: React.FC = () => {
  const [groupDepartures, setGroupDepartures] = useState<GroupDeparture[]>([]);
  const [selected, setSelected] = useState<GroupDeparture | null>(null);

  useEffect(() => {
    fetch("/api/departures", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setGroupDepartures(data.departures || []))
      .catch(() => setGroupDepartures([]));
  }, []);

  if (groupDepartures.length === 0) return null;

  return (
    <section
      id="group-departures"
      className="relative z-10 overflow-hidden bg-white py-20 sm:py-28"
    >
      <ContourPattern className="pointer-events-none absolute inset-0 h-full w-full text-primary/[0.025]" />

      <Container>
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            align="left"
            badge="Travel Together"
            title="Upcoming Group Departures"
            description="Pick your next story. Fixed dates, thoughtfully planned itineraries, and a wonderful group to share the journey with."
            className="max-w-3xl"
          />
          <div className="hidden items-center gap-3 rounded-2xl border border-primary/10 bg-sand-bg px-5 py-4 text-primary shadow-soft lg:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/25 text-primary">
              <CheckCircle2 size={20} strokeWidth={2.25} />
            </span>
            <div>
              <p className="text-sm font-bold">Expert-led group tours</p>
              <p className="text-xs text-foreground-muted">Everything planned, just show up</p>
            </div>
          </div>
        </div>

        <Stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" stagger={0.08}>
          {groupDepartures.map((departure) => {
            const soldOut = departure.seats_left <= 0;
            const totalSeats = Math.max(departure.total_seats, 1);
            const seatsLeft = Math.max(departure.seats_left, 0);
            const bookedPercent = Math.min(
              100,
              Math.max(0, ((totalSeats - seatsLeft) / totalSeats) * 100)
            );
            const visual = getDepartureVisual(departure.destination);
            const status = statusStyles[departure.status];

            return (
              <StaggerItem key={departure.id} as="article" y={28}>
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(7,32,60,0.35)]">
                  <div className="relative h-44 overflow-hidden sm:h-48">
                    <Image
                      src={visual.image}
                      alt={`Scenic view from ${departure.destination}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/15 to-transparent" />

                    <span
                      className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] ${status.badge}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {status.label}
                    </span>

                    <div className="absolute inset-x-4 bottom-4 text-white">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold text-white/75">
                        <MapPin size={14} />
                        {visual.label}
                      </div>
                      <h3 className="max-w-lg font-heading text-xl font-bold leading-tight sm:text-[1.35rem]">
                        {departure.destination}
                      </h3>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 rounded-xl bg-sand-bg px-2.5 py-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-accent shadow-sm">
                          <CalendarDays size={14} strokeWidth={2.25} />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-[8px] font-bold uppercase tracking-[0.1em] text-foreground-light">
                            Departure
                          </span>
                          <span className="block truncate text-[11px] font-bold text-primary">
                            {departure.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-sand-bg px-2.5 py-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-accent shadow-sm">
                          <Clock3 size={14} strokeWidth={2.25} />
                        </span>
                        <div className="min-w-0">
                          <span className="block text-[8px] font-bold uppercase tracking-[0.1em] text-foreground-light">
                            Duration
                          </span>
                          <span className="block truncate text-[11px] font-bold text-primary">
                            {departure.duration || "TBA"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Genuine seat availability — no fake scarcity widgets */}
                    <div className="mt-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-[11px] font-semibold text-foreground-muted">
                          <strong className="text-primary">{seatsLeft}</strong> of {totalSeats} seats left
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-foreground-light">
                          {Math.round(bookedPercent)}% booked
                        </span>
                      </div>
                      <div
                        className="h-1.5 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-label={`${departure.destination} seats booked`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={Math.round(bookedPercent)}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${status.bar}`}
                          style={{ width: `${bookedPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
                      <div>
                        <span className="block text-[8px] font-bold uppercase tracking-[0.12em] text-foreground-light">
                          Price per person
                        </span>
                        <div className="mt-0.5 text-xl font-extrabold text-primary">
                          {departure.price || "On request"}
                        </div>
                      </div>

                      <PrimaryButton
                        variant={soldOut ? "navy" : "coral"}
                        size="sm"
                        disabled={soldOut}
                        onClick={() => setSelected(departure)}
                        rightIcon={!soldOut ? <ArrowRight size={16} /> : undefined}
                        className="shrink-0"
                      >
                        {soldOut ? "Sold Out" : "Book Now"}
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>

      <BookingModal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        packageTitle={selected?.destination || ""}
        departureId={selected?.id}
        initialTravelDate={selected?.date}
        seatsLeft={selected?.seats_left}
      />
    </section>
  );
};

export default GroupDepartures;
