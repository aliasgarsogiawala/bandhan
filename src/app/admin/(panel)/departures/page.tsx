"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { GroupDeparture, DepartureStatus } from "@/lib/departures/types";

const emptyForm = {
  destination: "",
  date: "",
  duration: "",
  price: "",
  totalSeats: "20",
  seatsLeft: "20",
  status: "guaranteed" as DepartureStatus,
};

const STATUS_OPTIONS: { value: DepartureStatus; label: string }[] = [
  { value: "filling-fast", label: "Filling Fast" },
  { value: "limited-seats", label: "Limited Seats" },
  { value: "guaranteed", label: "Guaranteed" },
  { value: "sold-out", label: "Sold Out" },
];

export default function AdminDeparturesPage() {
  const [departures, setDepartures] = useState<GroupDeparture[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    fetch("/api/admin/departures", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setDepartures(data.departures || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/departures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not create the departure.");
        return;
      }
      setForm(emptyForm);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const patch = async (id: string, body: Record<string, unknown>) => {
    await fetch(`/api/admin/departures/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    refresh();
  };

  const toggleActive = (departure: GroupDeparture) =>
    patch(departure.id, { isActive: !departure.is_active });

  const remove = async (id: string) => {
    if (!confirm("Delete this departure? This cannot be undone.")) return;
    await fetch(`/api/admin/departures/${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departures"
        description="Manage upcoming group departure dates and seat availability. Seats decrement automatically as bookings are confirmed."
      />

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">New Departure</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="destination"
            required
            value={form.destination}
            onChange={handleChange}
            placeholder="Destination / title"
            className="sm:col-span-2 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <input
            name="date"
            required
            value={form.date}
            onChange={handleChange}
            placeholder="Departure date, e.g. Aug 15, 2026"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <input
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="Duration, e.g. 7 Nights / 8 Days"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price, e.g. ₹42,500"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            name="totalSeats"
            type="number"
            min={1}
            required
            value={form.totalSeats}
            onChange={handleChange}
            placeholder="Total seats"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <input
            name="seatsLeft"
            type="number"
            min={0}
            value={form.seatsLeft}
            onChange={handleChange}
            placeholder="Seats left"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <PrimaryButton type="submit" variant="navy" size="md" isLoading={busy}>
              Create Departure
            </PrimaryButton>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden overflow-x-auto">
        {loading ? (
          <p className="p-6 text-sm text-foreground-muted">Loading…</p>
        ) : departures.length === 0 ? (
          <p className="p-6 text-sm text-foreground-muted">No departures yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Seats</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Visible</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {departures.map((d) => (
                <tr key={d.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-primary">{d.destination}</td>
                  <td className="px-4 py-3">{d.date}</td>
                  <td className="px-4 py-3">
                    {d.seats_left}/{d.total_seats}
                  </td>
                  <td className="px-4 py-3 capitalize">{d.status.replace("-", " ")}</td>
                  <td className="px-4 py-3">
                    <SecondaryButton size="sm" variant="ghost" onClick={() => toggleActive(d)}>
                      {d.is_active ? "Visible" : "Hidden"}
                    </SecondaryButton>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <SecondaryButton size="sm" variant="outline-coral" onClick={() => remove(d.id)}>
                      Delete
                    </SecondaryButton>
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
