"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";
import type { Booking } from "@/lib/bookings/types";
import type { PublicAgent } from "@/lib/auth/agents";

const STATUS_BADGE: Record<string, string> = {
  new: "bg-slate-100 text-slate-600 border-slate-200",
  reviewing: "bg-amber-50 text-amber-700 border-amber-200",
  quoted: "bg-blue-50 text-blue-700 border-blue-200",
  approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  payment_pending: "bg-orange-50 text-orange-700 border-orange-200",
  confirmed: "bg-emerald-100 text-emerald-800 border-emerald-300",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-primary/10 text-primary border-primary/20",
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [assigningId, setAssigningId] = useState("");

  const refresh = () => {
    Promise.all([
      fetch("/api/admin/bookings", { cache: "no-store" }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load bookings.");
        return data;
      }),
      fetch("/api/admin/agents", { cache: "no-store" }).then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load agents.");
        return data;
      }),
    ])
      .then(([bookingsData, agentsData]) => {
        setBookings(bookingsData.bookings || []);
        setAgents(agentsData.agents || []);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : "Could not load bookings.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const assign = async (bookingId: string, agentId: string) => {
    setAssigningId(bookingId);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentId ? { action: "assignTo", agentId } : { action: "unassign" }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not update the assignment.");
      refresh();
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : "Could not update the assignment.");
    } finally {
      setAssigningId("");
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("en-IN");
    return bookings.filter((booking) => {
      if (status !== "all" && booking.status !== status) return false;
      if (type !== "all" && booking.type !== type) return false;
      if (!query) return true;
      return [
        booking.booking_code,
        booking.package_title,
        booking.destination,
        booking.contact_name,
        booking.contact_email,
        agents.find((agent) => agent.id === booking.agent_id)?.name,
      ].some((value) => value?.toLocaleLowerCase("en-IN").includes(query));
    });
  }, [agents, bookings, search, status, type]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Search, assign, price, confirm, and support every standard or customized booking."
        action={
          <Link
            href="/admin/bookings/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            New Booking
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="All bookings" value={bookings.length} />
        <Summary label="Needs assignment" value={bookings.filter((booking) => !booking.agent_id).length} />
        <Summary label="Awaiting payment" value={bookings.filter((booking) => ["approved", "payment_pending"].includes(booking.status)).length} />
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 sm:grid-cols-[1fr_190px_190px]">
        <label className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-primary">Search bookings</span>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Code, customer, trip, or agent" className="min-h-11 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-4 focus:ring-accent/10" />
        </label>
        <label className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-primary">Status</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="all">All statuses</option>
            {Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="block text-xs font-bold uppercase tracking-wider text-primary">Booking type</span>
          <select value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <option value="all">All types</option>
            <option value="standard">Standard</option>
            <option value="customized">Customized</option>
          </select>
        </label>
      </div>

      {error ? <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-foreground-muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-foreground-muted">No bookings match these filters.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Trip</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Travel date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Agent</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-100 hover:bg-sand/30">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${booking.id}`} className="font-semibold text-accent hover:underline">
                      {booking.booking_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{booking.type}</td>
                  <td className="px-4 py-3">{booking.package_title || booking.destination || "—"}</td>
                  <td className="px-4 py-3"><span className="block font-semibold text-primary">{booking.contact_name}</span><span className="block text-xs text-foreground-muted">{booking.contact_email}</span></td>
                  <td className="whitespace-nowrap px-4 py-3">{booking.travel_date || "TBC"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        STATUS_BADGE[booking.status] || STATUS_BADGE.new
                      }`}
                    >
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      aria-label={`Assigned agent for ${booking.booking_code}`}
                      value={booking.agent_id || ""}
                      disabled={assigningId === booking.id}
                      onChange={(e) => void assign(booking.id, e.target.value)}
                      className="min-h-11 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs disabled:opacity-50"
                    >
                      <option value="">Unassigned</option>
                      {agents
                        .filter((a) => a.status === "active" || a.id === booking.agent_id)
                        .map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-4"><span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">{label}</span><strong className="mt-1 block font-heading text-2xl text-primary">{value}</strong></div>;
}
