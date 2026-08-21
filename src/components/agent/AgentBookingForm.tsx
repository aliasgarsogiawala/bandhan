"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Briefcase, Check, Users } from "lucide-react";
import Counter from "@/components/booking/Counter";
import { useCollection } from "@/lib/admin/store";
import type { Destination, TourPackage } from "@/data/mockData";
import { getFullPackageForPackage } from "@/data/packageDetails";
import {
  calculateQuote,
  destinationSnapshot,
  formatMoney,
  packageSnapshot,
  pricingForStartingPrice,
  totalTravellers,
  type BookingPackageSnapshot,
  type BookingSource,
  type RoomConfiguration,
  type SelectedAddon,
  type TravellerBreakdown,
} from "@/lib/bookings/pricing";
import type { GroupDeparture } from "@/lib/departures/types";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10";
const labelClass = "text-xs font-bold uppercase tracking-wider text-primary";

type Basis = BookingSource | "departure";

/**
 * The agent-side booking journey.
 *
 * Deliberately not the customer wizard: an agent already knows the trip, so
 * everything is on one screen, the client's contact details are optional
 * (the agent is the contact of record), and the form captures the things only
 * an agent needs — their own reference and internal remarks. The booking is
 * assigned to them and opens as "Under Review" rather than joining the queue.
 */
export default function AgentBookingForm({ mode = "agent" }: { mode?: "agent" | "admin" }) {
  const router = useRouter();
  const isAdmin = mode === "admin";
  const { items: packages } = useCollection<TourPackage>("packages");
  const { items: destinations } = useCollection<Destination>("destinations");
  const [departures, setDepartures] = useState<GroupDeparture[]>([]);

  const [basis, setBasis] = useState<Basis>("package");
  const [selectedId, setSelectedId] = useState("");
  const [departureId, setDepartureId] = useState("");
  const [customDestination, setCustomDestination] = useState("");

  const [client, setClient] = useState({ name: "", email: "", phone: "" });
  const [travelDate, setTravelDate] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [travellers, setTravellers] = useState<TravellerBreakdown>({
    adults: 2,
    childrenWithBed: 0,
    childrenWithoutBed: 0,
    infants: 0,
  });
  const [rooms, setRooms] = useState<RoomConfiguration>({
    singleRooms: 0,
    doubleRooms: 1,
    tripleRooms: 0,
  });
  const [addonIds, setAddonIds] = useState<string[]>([]);
  const [travellerNames, setTravellerNames] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [budget, setBudget] = useState("");
  const [agentReference, setAgentReference] = useState("");
  const [internalRemarks, setInternalRemarks] = useState("");
  const [notifyBooker, setNotifyBooker] = useState(true);

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(isAdmin ? "/api/admin/departures" : "/api/departures", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setDepartures(data.departures || []))
      .catch(() => setDepartures([]));
  }, [isAdmin]);

  const activePackages = packages.filter((item) => item.status !== "draft");
  const activeDestinations = destinations.filter((item) => item.status !== "draft");
  const selectedPackage = activePackages.find((item) => item.id === selectedId);
  const selectedDestination = activeDestinations.find((item) => item.id === selectedId);
  const activeDepartures = departures.filter((item) => item.is_active !== false);
  const selectedDeparture = activeDepartures.find((item) => item.id === departureId);
  const fullPackage = selectedPackage ? getFullPackageForPackage(selectedPackage) : null;

  const effectiveDuration =
    durationLabel ||
    (basis === "package"
      ? selectedPackage?.duration
      : basis === "destination"
        ? selectedDestination?.duration
        : basis === "departure"
          ? selectedDeparture?.duration
          : "") ||
    "";

  const snapshot: BookingPackageSnapshot =
    basis === "package" && fullPackage
      ? packageSnapshot(fullPackage)
      : basis === "destination" && selectedDestination
        ? destinationSnapshot(selectedDestination)
        : {
            source: basis === "departure" ? "package" : "custom",
            title:
              basis === "departure" && selectedDeparture
                ? selectedDeparture.destination
                : customDestination
                  ? `${customDestination} Personalised Holiday`
                  : "Client Holiday",
            destination:
              basis === "departure" && selectedDeparture
                ? selectedDeparture.destination
                : customDestination || "Destination to be planned",
            duration: effectiveDuration,
          };

  const startingPrice =
    basis === "package"
      ? selectedPackage?.price
      : basis === "destination"
        ? selectedDestination?.price
        : basis === "departure"
          ? selectedDeparture?.price || undefined
          : undefined;
  const pricing = pricingForStartingPrice(
    startingPrice,
    basis === "package" ? selectedPackage?.pricing : undefined
  );
  const payingTravellers =
    travellers.adults + travellers.childrenWithBed + travellers.childrenWithoutBed;
  const selectedAddons: SelectedAddon[] = pricing.addons
    .filter((addon) => addonIds.includes(addon.id))
    .map((addon) => ({
      id: addon.id,
      title: addon.title,
      unitPrice: addon.price,
      pricing: addon.pricing,
      quantity: addon.pricing === "per-person" ? Math.max(1, payingTravellers) : 1,
    }));
  const quote = calculateQuote({
    travellers,
    rooms,
    pricing,
    addons: selectedAddons,
    indicative: true,
  });
  const travellerCount = totalTravellers(travellers);

  const selectBasis = (next: Basis) => {
    setBasis(next);
    setSelectedId("");
    setDepartureId("");
    setDurationLabel("");
    setAddonIds([]);
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (client.name.trim().length < 2) {
      setError(isAdmin ? "Please enter the customer's name." : "Please enter your client's name.");
      return;
    }
    if (isAdmin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim())) {
      setError("Please enter a valid customer email address.");
      return;
    }
    if (isAdmin && client.phone.replace(/\D/g, "").length < 8) {
      setError("Please enter a valid customer phone number.");
      return;
    }
    if (basis === "package" && !selectedPackage) {
      setError("Select the package your client is booking.");
      return;
    }
    if (basis === "destination" && !selectedDestination) {
      setError("Select a destination.");
      return;
    }
    if (basis === "departure" && !selectedDeparture) {
      setError("Select a group departure.");
      return;
    }
    if (basis === "custom" && customDestination.trim().length < 2) {
      setError("Enter the destination your client wants.");
      return;
    }
    if (!travelDate.trim()) {
      setError("Enter the travel date.");
      return;
    }
    if (selectedDeparture && travellerCount > selectedDeparture.seats_left) {
      setError(
        `Only ${selectedDeparture.seats_left} seat${selectedDeparture.seats_left === 1 ? " is" : "s are"} currently available for this departure.`
      );
      return;
    }

    setBusy(true);
    try {
      const response = await fetch(isAdmin ? "/api/admin/bookings" : "/api/agent/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: basis === "package" || basis === "departure" ? "standard" : "customized",
          bookingSource: basis === "departure" ? "package" : basis,
          packageId: basis === "package" ? selectedPackage?.id : undefined,
          packageTitle: basis === "departure" ? selectedDeparture?.destination : snapshot.title,
          departureId: basis === "departure" ? departureId : undefined,
          destination: snapshot.destination,
          travelDate,
          departureCity,
          durationLabel: effectiveDuration,
          travellers,
          travellersCount: travellerCount,
          rooms,
          selectedAddons,
          pricingSnapshot: quote,
          packageSnapshot: { ...snapshot, duration: effectiveDuration },
          travellerNames,
          budget,
          specialRequirements,
          contact: client,
          agentReference,
          internalRemarks,
          notifyBooker,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        setError(data.error || "Could not create the booking.");
        return;
      }
      router.push(`/${mode}/bookings/${data.booking.id}`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-accent" />
          <h2 className="font-heading text-base font-bold text-primary">
            {isAdmin ? "Customer and lead traveller" : "Your client"}
          </h2>
        </div>
        <p className="mt-1 text-xs text-foreground-muted">
          {isAdmin
            ? "Enter the lead traveller's contact details. If the email already has an account, this trip is linked automatically."
            : "The booking is raised in your name — quotations, documents and updates stay with you. Add your client's own contact details only if they should receive them directly."}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="space-y-2">
              <span className={labelClass}>{isAdmin ? "Customer name" : "Client name"}</span>
            <input
              value={client.name}
              onChange={(event) => setClient((c) => ({ ...c, name: event.target.value }))}
              className={inputClass}
              placeholder="Lead traveller"
              required
            />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>
              {isAdmin ? "Customer email" : "Client email"}{" "}
              {!isAdmin ? <span className="font-medium normal-case text-foreground-light">optional</span> : null}
            </span>
            <input
              type="email"
              value={client.email}
              onChange={(event) => setClient((c) => ({ ...c, email: event.target.value }))}
              className={inputClass}
              placeholder="Defaults to yours"
              required={isAdmin}
            />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>
              {isAdmin ? "Customer phone" : "Client phone"}{" "}
              {!isAdmin ? <span className="font-medium normal-case text-foreground-light">optional</span> : null}
            </span>
            <input
              type="tel"
              value={client.phone}
              onChange={(event) => setClient((c) => ({ ...c, phone: event.target.value }))}
              className={inputClass}
              placeholder="Defaults to yours"
              required={isAdmin}
            />
          </label>
        </div>
        {!isAdmin ? (
          <p className="mt-3 text-xs text-foreground-muted">
            If this email already has a customer account, the booking is linked to it and shows up
            in their My Trips automatically.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary">What are they booking?</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["package", "Tour package"],
              ["departure", "Group departure"],
              ["destination", "Destination"],
              ["custom", "Custom trip"],
            ] as [Basis, string][]
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              aria-pressed={basis === value}
              onClick={() => selectBasis(value)}
              className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                basis === value
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-primary hover:border-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {basis === "package" ? (
            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Package</span>
              <select
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
                className={inputClass}
              >
                <option value="">Select a package…</option>
                {activePackages.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} — {item.duration} — {item.price}
                  </option>
                ))}
              </select>
            </label>
          ) : basis === "destination" ? (
            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Destination</span>
              <select
                value={selectedId}
                onChange={(event) => setSelectedId(event.target.value)}
                className={inputClass}
              >
                <option value="">Select a destination…</option>
                {activeDestinations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — starting {item.price}
                  </option>
                ))}
              </select>
            </label>
          ) : basis === "departure" ? (
            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Group departure</span>
              <select
                value={departureId}
                onChange={(event) => {
                  setDepartureId(event.target.value);
                  const departure = departures.find((d) => d.id === event.target.value);
                  if (departure && !travelDate) setTravelDate(departure.date);
                }}
                className={inputClass}
              >
                <option value="">Select a departure…</option>
                {activeDepartures.map((item) => (
                  <option key={item.id} value={item.id} disabled={item.seats_left <= 0}>
                    {item.destination} — {item.date} — {item.seats_left} seats left
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Preferred destination</span>
              <input
                value={customDestination}
                onChange={(event) => setCustomDestination(event.target.value)}
                className={inputClass}
                placeholder="e.g. Japan, Ladakh, Europe"
              />
            </label>
          )}

          <label className="space-y-2">
            <span className={labelClass}>Travel date</span>
            <input
              value={travelDate}
              onChange={(event) => setTravelDate(event.target.value)}
              className={inputClass}
              placeholder="e.g. 12 October 2026"
            />
          </label>
          <label className="space-y-2">
            <span className={labelClass}>Departure city</span>
            <input
              value={departureCity}
              onChange={(event) => setDepartureCity(event.target.value)}
              className={inputClass}
              placeholder="e.g. Mumbai"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className={labelClass}>Duration</span>
            <input
              value={effectiveDuration}
              onChange={(event) => setDurationLabel(event.target.value)}
              className={inputClass}
              placeholder="6 Nights / 7 Days"
            />
          </label>
          {basis === "custom" ? (
            <label className="space-y-2 sm:col-span-2">
              <span className={labelClass}>Budget preference</span>
              <input
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className={inputClass}
                placeholder="e.g. ₹75,000 per person"
              />
            </label>
          ) : null}
        </div>

        {pricing.addons.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-sm font-bold text-primary">Add-ons</h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {pricing.addons.map((addon) => {
                const checked = addonIds.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm ${
                      checked ? "border-accent bg-accent/5" : "border-slate-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setAddonIds((current) =>
                          checked
                            ? current.filter((id) => id !== addon.id)
                            : [...current, addon.id]
                        )
                      }
                      className="mt-1 h-4 w-4 accent-accent"
                    />
                    <span className="flex-1">
                      <strong className="block text-primary">{addon.title}</strong>
                      <span className="text-xs text-foreground-muted">
                        {formatMoney(addon.price)}{" "}
                        {addon.pricing === "per-person" ? "per traveller" : "per booking"}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <div className="flex items-center gap-2">
          <Users size={18} className="text-accent" />
          <h2 className="font-heading text-base font-bold text-primary">Travellers and rooms</h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Counter
            label="Adults"
            hint="12 years and above"
            value={travellers.adults}
            min={1}
            onChange={(value) => setTravellers((current) => ({ ...current, adults: value }))}
          />
          <Counter
            label="Children with bed"
            hint="2-11 years"
            value={travellers.childrenWithBed}
            onChange={(value) =>
              setTravellers((current) => ({ ...current, childrenWithBed: value }))
            }
          />
          <Counter
            label="Children without bed"
            hint="2-11 years"
            value={travellers.childrenWithoutBed}
            onChange={(value) =>
              setTravellers((current) => ({ ...current, childrenWithoutBed: value }))
            }
          />
          <Counter
            label="Infants"
            hint="Under 2 years"
            value={travellers.infants}
            onChange={(value) => setTravellers((current) => ({ ...current, infants: value }))}
          />
        </div>
        <div className="mt-6 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-2">
            <BedDouble size={18} className="text-accent" />
            <h3 className="text-sm font-bold text-primary">Room configuration</h3>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Counter
              label="Single rooms"
              hint="1 guest"
              value={rooms.singleRooms}
              onChange={(value) => setRooms((current) => ({ ...current, singleRooms: value }))}
            />
            <Counter
              label="Double/Twin"
              hint="2 guests"
              value={rooms.doubleRooms}
              onChange={(value) => setRooms((current) => ({ ...current, doubleRooms: value }))}
            />
            <Counter
              label="Triple rooms"
              hint="3 guests"
              value={rooms.tripleRooms}
              onChange={(value) => setRooms((current) => ({ ...current, tripleRooms: value }))}
            />
          </div>
        </div>
        <label className="mt-5 block space-y-2">
          <span className={labelClass}>Traveller names</span>
          <textarea
            rows={3}
            value={travellerNames}
            onChange={(event) => setTravellerNames(event.target.value)}
            className={inputClass}
            placeholder="One traveller per line"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white p-6">
        <h2 className="font-heading text-base font-bold text-primary">Notes and reference</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {!isAdmin ? (
            <label className="space-y-2">
              <span className={labelClass}>Your reference</span>
              <input
                value={agentReference}
                onChange={(event) => setAgentReference(event.target.value)}
                className={inputClass}
                placeholder="Your own booking reference"
              />
            </label>
          ) : null}
          <label className={`space-y-2 ${isAdmin ? "sm:col-span-2" : ""}`}>
            <span className={labelClass}>{isAdmin ? "Customer requests" : "Client requests"}</span>
            <input
              value={specialRequirements}
              onChange={(event) => setSpecialRequirements(event.target.value)}
              className={inputClass}
              placeholder="Meals, room category, celebrations…"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className={labelClass}>Internal remarks</span>
            <textarea
              rows={3}
              value={internalRemarks}
              onChange={(event) => setInternalRemarks(event.target.value)}
              className={inputClass}
              placeholder={isAdmin ? "Only visible to admins and assigned agents." : "Only visible to you, other agents and admin."}
            />
          </label>
        </div>
        {!isAdmin ? (
          <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={notifyBooker}
              onChange={(event) => setNotifyBooker(event.target.checked)}
              className="mt-0.5 h-4 w-4 accent-accent"
            />
            <span className="text-xs leading-relaxed text-foreground-muted">
              Copy me on everything sent to the client.
            </span>
          </label>
        ) : null}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-primary p-6 text-white">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gold">
            Indicative total
          </span>
          <p className="mt-1 text-2xl font-extrabold">{formatMoney(quote.total)}</p>
          <p className="mt-1 text-xs text-slate-300">
            {travellerCount} traveller{travellerCount === 1 ? "" : "s"} · advance{" "}
            {formatMoney(quote.depositAmount)}
          </p>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create booking"} <Check size={16} />
        </button>
      </div>
    </form>
  );
}
