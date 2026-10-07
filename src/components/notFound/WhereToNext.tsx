"use client";

import Link from "next/link";
import Image from "@/components/ui/SiteImage";
import { useCollection } from "@/lib/admin/store";
import type { Destination } from "@/data/mockData";

/** Live destinations (falls back to the bundled catalogue) as onward suggestions. */
export default function WhereToNext() {
  const { items } = useCollection<Destination>("destinations");
  const destinations = items.filter((item) => item.status !== "draft" && item.image).slice(0, 4);

  if (destinations.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
      {destinations.map((destination) => (
        <Link
          key={destination.id}
          href={`/destinations/${destination.id}`}
          className="group relative isolate aspect-[4/5] overflow-hidden rounded-3xl bg-primary shadow-soft"
        >
          <Image
            src={destination.image}
            alt={destination.name}
            fill
            sizes="(max-width: 1024px) 50vw, 25vw"
            className="-z-10 object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-deep/90 via-ink-deep/20 to-transparent" aria-hidden="true" />
          <div className="flex h-full flex-col justify-end p-4 sm:p-5">
            <p className="font-heading text-lg font-bold text-white sm:text-xl">{destination.name}</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-gold">
              Explore
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
