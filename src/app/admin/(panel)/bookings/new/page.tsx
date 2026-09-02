import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AgentBookingForm from "@/components/agent/AgentBookingForm";

export default function AdminNewBookingPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-primary/10 pb-5">
        <div className="min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            Booking operations
          </span>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.025em] text-primary">
            Create a new booking
          </h1>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            For phone, email, partner, or walk-in enquiries.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-[4px] border border-primary/20 px-4 text-[11px] font-bold uppercase tracking-[0.14em] text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white"
        >
          <ArrowLeft size={14} /> Booking queue
        </Link>
      </div>
      <AgentBookingForm mode="admin" />
    </div>
  );
}
