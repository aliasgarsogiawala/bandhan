import Link from "next/link";
import type { PackageDepartureDate } from "@/data/mockData";
import { formatPackageDate, packageDateBookingHref } from "@/lib/packageDates";

export default function PackageDepartureDates({ packageId, dates }: { packageId: string; dates: PackageDepartureDate[] }) {
  if (!dates.length) return null;
  return (
    <section id="departure-dates" className="scroll-mt-28">
      <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold-dark">Plan your journey</span>
      <h2 className="mt-3 font-heading text-3xl font-extrabold text-primary sm:text-4xl">Departure dates</h2>
      <p className="mt-3 text-sm text-foreground-muted">Choose a departure to start your booking request.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {dates.map((date) => (
          <Link key={date.startDate} href={packageDateBookingHref(packageId, date.startDate)} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/15 bg-white p-4 transition-colors hover:border-accent">
            <span className="text-sm font-bold text-primary">{formatPackageDate(date)}</span>
            <span className="text-xs font-bold text-accent">Book this date →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
