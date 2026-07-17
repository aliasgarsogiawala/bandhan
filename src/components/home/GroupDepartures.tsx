"use client";

import React from "react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { RecentlyBooked } from "@/components/ui/Urgency";
import { groupDepartures } from "@/data/mockData";

interface GroupDeparturesProps {
  onBookNowSelect: (destName: string) => void;
}

export const GroupDepartures: React.FC<GroupDeparturesProps> = ({ onBookNowSelect }) => {
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
            const seatsPercent = (departure.seatsLeft / departure.totalSeats) * 100;
            
            // Status tag colors
            const statusClasses = {
              "filling-fast": "bg-red-50 text-red-600 border-red-200/50",
              "limited-seats": "bg-amber-50 text-amber-600 border-amber-200/50",
              guaranteed: "bg-emerald-50 text-emerald-600 border-emerald-200/50",
            };

            const statusText = {
              "filling-fast": "Filling Fast",
              "limited-seats": "Limited Seats Left",
              guaranteed: "Departure Guaranteed",
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
                        Seats Left: <strong className="text-primary">{departure.seatsLeft}</strong> / {departure.totalSeats}
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
                    variant="coral"
                    size="md"
                    onClick={() => onBookNowSelect(departure.destination)}
                    className="hover:scale-105 transition-transform duration-300"
                  >
                    Book Now
                  </PrimaryButton>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default GroupDepartures;
