"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import type { AdminReport } from "@/lib/admin/reports";
import { BOOKING_STATUS_LABELS, type BookingStatus } from "@/lib/bookings/types";

export default function ReportsPage() {
  const [report, setReport] = useState<AdminReport | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/admin/reports", { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load reports.");
        setReport(data.report);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Could not load reports."));
  }, []);

  return (
    <div>
      <PageHeader title="Reports" description="Bookings, leads, customers and manually recorded payments." action={<a href="/api/admin/reports?format=csv" className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-white">Export CSV</a>} />
      {error ? <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : !report ? <p className="text-sm text-foreground-muted">Loading…</p> : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Customers", report.totals.customers],
              ["Bookings", report.totals.bookings],
              ["Enquiries", report.totals.enquiries],
              ["Payments recorded", report.totals.paymentsRecorded],
            ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-100 bg-white p-5"><p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">{label}</p><p className="mt-2 font-heading text-3xl font-extrabold text-primary">{value}</p></div>)}
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-2xl border border-slate-100 bg-white p-5"><h2 className="font-heading font-bold text-primary">Booking pipeline</h2><div className="mt-4 space-y-3">{report.bookingStatuses.map((item) => <div key={item.status} className="flex justify-between border-b border-slate-100 pb-2 text-sm"><span>{BOOKING_STATUS_LABELS[item.status as BookingStatus] || item.status}</span><strong>{item.count}</strong></div>)}</div></section>
            <section className="rounded-2xl border border-slate-100 bg-white p-5"><h2 className="font-heading font-bold text-primary">Monthly bookings</h2><div className="mt-4 space-y-3">{report.monthlyBookings.map((item) => <div key={item.month} className="flex justify-between border-b border-slate-100 pb-2 text-sm"><span>{item.month}</span><strong>{item.count}</strong></div>)}</div></section>
          </div>
        </div>
      )}
    </div>
  );
}
