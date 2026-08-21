import Link from "next/link";
import AgentBookingForm from "@/components/agent/AgentBookingForm";
import PageHeader from "@/components/admin/PageHeader";

export default function AdminNewBookingPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader
          title="New Booking"
          description="Create a complete booking for a phone, email, or walk-in customer."
        />
        <Link
          href="/admin/bookings"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-accent hover:text-accent-dark"
        >
          &larr; Back to Bookings
        </Link>
      </div>
      <AgentBookingForm mode="admin" />
    </div>
  );
}
