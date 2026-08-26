import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AgentBookingForm from "@/components/agent/AgentBookingForm";

export default function AdminNewBookingPage() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">Booking operations</span>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight text-primary">Create a new booking</h1>
          <p className="mt-2 text-sm text-foreground-muted">For phone, email, partner, or walk-in enquiries.</p>
        </div>
        <Link
          href="/admin/bookings"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-primary transition hover:border-primary"
        >
          <ArrowLeft size={15} /> Booking queue
        </Link>
      </div>
      <AgentBookingForm mode="admin" />
    </div>
  );
}
