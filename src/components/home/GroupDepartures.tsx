"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RecentlyBooked } from "@/components/ui/Urgency";
import BookingModal from "@/components/packages/BookingModal";
import type { GroupDeparture } from "@/lib/departures/types";

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
    <section id="group-departures" className="py-16 sm:py-24 bg-sand-bg/40 relative z-10">
      <Container>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <SectionTitle
            align="left"
            badge="Join Our Next Trips"
            title="Upcoming Group Departures"
            description="Explore the world together. Shared experiences, expert tour captains, and guaranteed departures."
            className="max-w-2xl"
          />
        </div>

        {/* Departure Cards List */}
        <div className="space-y-6">
          {groupDepartures.map((departure) => {
            const seatsPercent = (departure.seats_left / departure.total_seats) * 100;
            const soldOut = departure.seats_left <= 0;

            // Status tag colors
            const statusClasses = {
              "filling-fast": "bg-red-50 text-red-600 border-red-200/50",
              "limited-seats": "bg-amber-50 text-amber-600 border-amber-200/50",
              guaranteed: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
              "sold-out": "bg-slate-100 text-slate-500 border-slate-200",
            };

            const statusText = {
              "filling-fast": "Filling Fast",
              "limited-seats": "Limited Seats Left",
              guaranteed: "Departure Guaranteed",
              "sold-out": "Sold Out",
            };

            return (
              <div
                key={departure.id}
                className="bg-white p-6 sm:p-8 rounded-3xl shadow-soft hover:shadow-lg transition-all duration-300 border border-slate-100/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Info Column */}
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs uppercase font-bold text-accent tracking-wider font-sans">
                      {departure.duration}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                    <span className="text-xs text-foreground-muted font-sans font-medium">
                      Starts on <strong className="text-primary">{departure.date}</strong>
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-primary">
                    {departure.destination}
                  </h3>

                  {/* Seats progress indicator */}
                  <div className="w-full max-w-sm pt-2">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-foreground-muted font-sans">
                        Seats Left: <strong className="text-primary">{departure.seats_left}</strong> / {departure.total_seats}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusClasses[departure.status]}`}>
                        {statusText[departure.status]}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          departure.status === "filling-fast"
                            ? "bg-red-500"
                            : departure.status === "limited-seats"
                            ? "bg-amber-500"
                            : departure.status === "sold-out"
                            ? "bg-slate-400"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${100 - seatsPercent}%` }}
                      />
                    </div>
                    <div className="mt-2">
                      <RecentlyBooked seed={departure.id} />
                    </div>
                  </div>
                </div>

                {/* Price and Action Column */}
                <div className="flex items-center justify-between lg:justify-end gap-8 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 lg:w-auto">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-foreground-muted uppercase tracking-wider font-bold block">
                      Tour Package price
                    </span>
                    <div className="text-2xl font-extrabold text-primary">{departure.price}</div>
                    <span className="text-[10px] text-foreground-muted font-sans">per person</span>
                  </div>

                  <PrimaryButton
                    variant={soldOut ? "navy" : "coral"}
                    size="md"
                    onClick={() => setSelected(departure)}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    {soldOut ? "Sold Out" : "Book Now"}
                  </PrimaryButton>
                </div>
              </div>
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
