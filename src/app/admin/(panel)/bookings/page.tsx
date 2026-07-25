"use client";

import React, { useEffect, useState } from "react";
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

  const refresh = () => {
    Promise.all([
      fetch("/api/admin/bookings", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/agents", { cache: "no-store" }).then((r) => r.json()),
    ])
      .then(([bookingsData, agentsData]) => {
        setBookings(bookingsData.bookings || []);
        setAgents(agentsData.agents || []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const assign = async (bookingId: string, agentId: string) => {
    if (!agentId) return;
    await fetch(`/api/agent/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assignTo", agentId }),
    });
    refresh();
  };

  const agentName = (id: string | null) => agents.find((a) => a.id === id)?.name;

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" description="All standard and customized bookings across agents." />

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-foreground-muted">Loading…</p>
        ) : bookings.length === 0 ? (
          <p className="p-6 text-sm text-foreground-muted">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Trip</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Agent</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings/${booking.id}`} className="font-semibold text-accent hover:underline">
                      {booking.booking_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{booking.type}</td>
                  <td className="px-4 py-3">{booking.package_title || booking.destination || "—"}</td>
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
                      defaultValue={booking.agent_id || ""}
                      onChange={(e) => assign(booking.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                    >
                      <option value="">{agentName(booking.agent_id) || "Unassigned"}</option>
                      {agents
                        .filter((a) => a.id !== booking.agent_id)
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
