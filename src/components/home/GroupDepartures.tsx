"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RecentlyBooked } from "@/components/ui/Urgency";
import BookingModal from "@/components/packages/BookingModal";
import type { DepartureStatus, GroupDeparture } from "@/lib/departures/types";

const departureVisuals = [
  {
    keywords: ["ladakh", "leh"],
    image:
      "https://images.unsplash.com/photo-1536295243470-d7cba4efab7b?auto=format&fit=crop&q=85&w=1200",
    label: "High-altitude adventure",
  },
  {
    keywords: ["kashmir", "srinagar", "gulmarg"],
    image:
      "https://images.unsplash.com/photo-1566837430541-11d2798e27c1?auto=format&fit=crop&q=85&w=1200",
    label: "Valleys & mountain views",
  },
  {
    keywords: ["sikkim", "northeast", "darjeeling"],
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=85&w=1200",
    label: "Himalayan discovery",
  },
  {
    keywords: ["europe", "paris", "switzerland", "italy"],
    image:
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=85&w=1200",
    label: "Iconic cities & culture",
  },
  {
    keywords: ["kerala", "munnar", "alleppey"],
    image:
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&q=85&w=1200",
    label: "Backwaters & slow travel",
  },
  {
    keywords: ["goa"],
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=85&w=1200",
    label: "A sunny coastal escape",
  },
];

const fallbackVisual = {
  image:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1200",
  label: "Curated group experience",
};

const statusStyles: Record<
  DepartureStatus,
  { label: string; badge: string; bar: string }
> = {
  "filling-fast": {
    label: "Filling fast",
    badge: "bg-red-50 text-red-700 ring-red-200",
    bar: "bg-red-500",
  },
  "limited-seats": {
    label: "Limited seats",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    bar: "bg-amber-500",
  },
  guaranteed: {
    label: "Guaranteed",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    bar: "bg-emerald-500",
  },
  "sold-out": {
    label: "Sold out",
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
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
      className="relative z-10 overflow-hidden bg-sand-bg py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute -left-32 top-14 h-80 w-80 rounded-full bg-accent/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-gold/15 blur-3xl" />

      <Container>
        <div className="mb-12 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
          <SectionTitle
            align="left"
            badge="Travel Together"
            title="Upcoming Group Departures"
            description="Pick your next story. Fixed dates, thoughtfully planned itineraries, and a wonderful group to share the journey with."
            className="max-w-3xl"
          />
          <div className="hidden items-center gap-3 rounded-2xl border border-primary/[0.08] bg-white px-5 py-4 text-primary shadow-soft lg:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/30 text-primary">
              <CheckCircle2 size={20} strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-sm font-bold">Expert-led group tours</p>
              <p className="text-xs text-foreground-muted">Everything planned, just show up</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
              <article
                key={departure.id}
                className="group overflow-hidden rounded-[1.75rem] border border-primary/[0.07] bg-white shadow-premium transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_55px_-25px_rgba(7,32,60,0.35)]"
              >
                <div className="relative h-56 overflow-hidden sm:h-64">
                  <Image
                    src={visual.image}
                    alt={`Scenic view from ${departure.destination}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/10 to-transparent" />

                  <span
                    className={`absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] ring-1 ring-inset ${status.badge}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {status.label}
                  </span>

                  <div className="absolute inset-x-5 bottom-5 text-white">
                    <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-white/75">
                      <MapPin size={14} />
                      {visual.label}
                    </div>
                    <h3 className="max-w-lg font-heading text-2xl font-bold leading-tight sm:text-[1.7rem]">
                      {departure.destination}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-sand-bg px-3.5 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                        <CalendarDays size={17} strokeWidth={2.25} />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-foreground-light">
                          Departure
                        </span>
                        <span className="block truncate text-xs font-bold text-primary sm:text-sm">
                          {departure.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-sand-bg px-3.5 py-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-accent shadow-sm">
                        <Clock3 size={17} strokeWidth={2.25} />
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[9px] font-bold uppercase tracking-[0.12em] text-foreground-light">
                          Duration
                        </span>
                        <span className="block truncate text-xs font-bold text-primary sm:text-sm">
                          {departure.duration || "To be announced"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="mb-2.5 flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs font-semibold text-foreground-muted">
                        <Users size={15} className="text-accent" />
                        <strong className="text-primary">{seatsLeft}</strong> of {totalSeats} seats left
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-light">
                        {Math.round(bookedPercent)}% booked
                      </span>
                    </div>
                    <div
                      className="h-2 overflow-hidden rounded-full bg-slate-100"
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
                    <div className="mt-2.5">
                      <RecentlyBooked seed={departure.id} />
                    </div>
                  </div>

                  <div className="mt-6 flex items-end justify-between gap-4 border-t border-slate-100 pt-5">
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-foreground-light">
                        Price per person
                      </span>
                      <div className="mt-0.5 text-2xl font-extrabold text-primary">
                        {departure.price || "On request"}
                      </div>
                    </div>

                    <PrimaryButton
                      variant={soldOut ? "navy" : "coral"}
                      size="md"
                      disabled={soldOut}
                      onClick={() => setSelected(departure)}
                      rightIcon={!soldOut ? <ArrowRight size={16} /> : undefined}
                      className="shrink-0"
                    >
                      {soldOut ? "Sold Out" : "Book Now"}
                    </PrimaryButton>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
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
