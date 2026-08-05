"use client";

import Link from "next/link";
import AgentBookingForm from "@/components/agent/AgentBookingForm";

export default function AgentNewBookingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-primary">
            Book for a client
          </h1>
          <p className="mt-1 font-sans text-sm text-foreground-muted">
            Raised in your name and assigned to you, so it never sits in the unassigned queue.
          </p>
        </div>
        <Link href="/agent" className="text-sm font-semibold text-accent hover:text-accent-dark">
          &larr; Back to Bookings
        </Link>
      </div>

      <AgentBookingForm />
    </div>
  );
}
