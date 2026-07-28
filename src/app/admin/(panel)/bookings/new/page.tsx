"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/admin/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useCollection } from "@/lib/admin/store";
import type { TourPackage } from "@/lib/admin/types";
import type { GroupDeparture } from "@/lib/departures/types";

type BasisType = "package" | "departure" | "custom";

const emptyForm = {
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  travelDate: "",
  travellersCount: "2",
  travellerNames: "",
  destination: "",
  budget: "",
  specialRequirements: "",
};

export default function AdminNewBookingPage() {
  const router = useRouter();
  const { items: packages } = useCollection<TourPackage>("packages");
  const [departures, setDepartures] = useState<GroupDeparture[]>([]);
  const [basis, setBasis] = useState<BasisType>("package");
  const [packageId, setPackageId] = useState("");
  const [departureId, setDepartureId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/departures", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setDepartures(data.departures || []));
  }, []);

  const selectedPackage = packages.find((p) => p.id === packageId);
  const selectedDeparture = departures.find((d) => d.id === departureId);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          type: basis === "custom" ? "customized" : "standard",
          packageId: basis === "package" ? packageId : undefined,
          packageTitle: basis === "package" ? selectedPackage?.title : undefined,
          departureId: basis === "departure" ? departureId : undefined,
          destination:
            basis === "departure" ? selectedDeparture?.destination : form.destination,
          travelDate:
            basis === "departure" ? form.travelDate || selectedDeparture?.date : form.travelDate,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not create the booking.");
        return;
      }
      router.push(`/admin/bookings/${data.booking.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <PageHeader
          title="New Booking"
          description="Log a phone or walk-in booking on a customer's behalf."
        />
        <Link href="/admin/bookings" className="text-sm font-semibold text-accent hover:text-accent-dark">
          &larr; Back to Bookings
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-primary uppercase block mb-2">Booking basis</label>
          <div className="flex flex-wrap gap-2">
            {(
              [
                { key: "package", label: "Tour Package" },
                { key: "departure", label: "Group Departure" },
                { key: "custom", label: "Custom Request" },
              ] as { key: BasisType; label: string }[]
            ).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setBasis(opt.key)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                  basis === opt.key
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-primary border-slate-200 hover:border-primary"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {basis === "package" && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Package</label>
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            >
              <option value="">Select a package…</option>
              {packages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} — {p.price}
                </option>
              ))}
            </select>
          </div>
        )}

        {basis === "departure" && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Departure</label>
            <select
              value={departureId}
              onChange={(e) => setDepartureId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            >
              <option value="">Select a departure…</option>
              {departures.map((d) => (
                <option key={d.id} value={d.id} disabled={d.seats_left <= 0}>
                  {d.destination} — {d.date} ({d.seats_left <= 0 ? "Sold Out" : `${d.seats_left} seats left`})
                </option>
              ))}
            </select>
          </div>
        )}

        {basis === "custom" && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Destination</label>
            <input
              name="destination"
              required
              value={form.destination}
              onChange={handleChange}
              placeholder="e.g. Bali, 6 nights"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Customer Name</label>
            <input
              name="contactName"
              required
              value={form.contactName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Phone</label>
            <input
              name="contactPhone"
              required
              value={form.contactPhone}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-primary uppercase">Email</label>
          <input
            name="contactEmail"
            type="email"
            required
            value={form.contactEmail}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Travel Date</label>
            <input
              name="travelDate"
              value={form.travelDate}
              onChange={handleChange}
              placeholder={basis === "departure" ? selectedDeparture?.date : "e.g. 12 October 2026"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Travellers</label>
            <input
              name="travellersCount"
              type="number"
              min={1}
              value={form.travellersCount}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-primary uppercase">Traveller Names</label>
          <textarea
            name="travellerNames"
            rows={2}
            value={form.travellerNames}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        {basis === "custom" && (
          <div className="space-y-1">
            <label className="text-xs font-semibold text-primary uppercase">Budget</label>
            <input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. ₹50,000 per person"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
            />
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-semibold text-primary uppercase">Special Requirements</label>
          <textarea
            name="specialRequirements"
            rows={2}
            value={form.specialRequirements}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <PrimaryButton type="submit" variant="navy" size="md" isLoading={busy}>
          Create Booking
        </PrimaryButton>
      </form>
    </div>
  );
}
