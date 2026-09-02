"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, Briefcase, CalendarDays, Check, CircleDollarSign, MapPinned, Sparkles, Users } from "lucide-react";
import Counter from "@/components/booking/Counter";
import { CheckRow, Field, Select, fieldClass } from "@/components/booking/fields";
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
  const roomCount = rooms.singleRooms + rooms.doubleRooms + rooms.tripleRooms;
  const tripSelected = Boolean(
    travelDate &&
      ((basis === "package" && selectedPackage) ||
        (basis === "destination" && selectedDestination) ||
        (basis === "departure" && selectedDeparture) ||
        (basis === "custom" && customDestination.trim().length > 1))
  );
  const customerComplete = Boolean(
    client.name.trim().length > 1 &&
      (!isAdmin || (client.email.includes("@") && client.phone.replace(/\D/g, "").length >= 8))
  );
  const formSteps = [
    { label: "Customer", complete: customerComplete, href: "#booking-customer" },
    { label: "Journey", complete: tripSelected, href: "#booking-journey" },
    { label: "Travellers", complete: travellerCount > 0, href: "#booking-travellers" },
    { label: "Review", complete: customerComplete && tripSelected && travellerCount > 0, href: "#booking-review" },
  ];

  const selectBasis = (next: Basis) => {
    setBasis(next);
    setSelectedId("");
    setDepartureId("");
    setDurationLabel("");
    setAddonIds([]);
  };

  const showError = (message: string) => {
    setError(message);
    window.requestAnimationFrame(() => {
      document.getElementById("booking-form-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (client.name.trim().length < 2) {
      showError(isAdmin ? "Please enter the customer's name." : "Please enter your client's name.");
      return;
    }
    if (isAdmin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim())) {
      showError("Please enter a valid customer email address.");
      return;
    }
    if (isAdmin && client.phone.replace(/\D/g, "").length < 8) {
      showError("Please enter a valid customer phone number.");
      return;
    }
    if (basis === "package" && !selectedPackage) {
      showError("Select the package your client is booking.");
      return;
    }
    if (basis === "destination" && !selectedDestination) {
      showError("Select a destination.");
      return;
    }
    if (basis === "departure" && !selectedDeparture) {
      showError("Select a group departure.");
      return;
    }
    if (basis === "custom" && customDestination.trim().length < 2) {
      showError("Enter the destination your client wants.");
      return;
    }
    if (!travelDate.trim()) {
      showError("Enter the travel date.");
      return;
    }
    if (selectedDeparture && travellerCount > selectedDeparture.seats_left) {
      showError(
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
        showError(data.error || "Could not create the booking.");
        return;
      }
      router.push(`/${mode}/bookings/${data.booking.id}`);
    } catch {
      showError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6 pb-10">
      {error ? (
        <p
          id="booking-form-error"
          role="alert"
          aria-live="assertive"
          className="scroll-mt-24 border-l-2 border-accent bg-accent/[0.07] px-4 py-3 text-sm font-medium leading-6 text-accent-dark"
        >
          {error}
        </p>
      ) : null}

      <section className="border border-primary/12 bg-primary text-white shadow-premium">
        <div className="flex flex-col gap-6 p-5 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              <Sparkles size={13} aria-hidden="true" /> Guided booking setup
            </span>
            <h2 className="mt-2.5 font-heading text-2xl font-bold tracking-[-0.02em]">
              Build a complete booking file
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
              Capture the lead traveller, journey and party details. Pricing updates live as you
              work.
            </p>
          </div>

          <ol className="grid shrink-0 grid-cols-4 gap-px border border-white/15 bg-white/15 lg:min-w-[400px]">
            {formSteps.map((step, index) => (
              <li key={step.label} className="bg-primary">
                <a
                  href={step.href}
                  className="flex flex-col items-center gap-1.5 px-2 py-3 transition-colors duration-200 hover:bg-white/[0.06]"
                >
                  <span
                    className={`tabular flex h-7 w-7 items-center justify-center rounded-[4px] text-[11px] font-bold ${
                      step.complete
                        ? "bg-emerald-400/20 text-emerald-200"
                        : "border border-white/20 text-white/50"
                    }`}
                  >
                    {step.complete ? <Check size={13} strokeWidth={3} /> : index + 1}
                  </span>
                  <span
                    className={`block text-center text-[9px] font-bold uppercase tracking-[0.12em] ${
                      step.complete ? "text-white/80" : "text-white/40"
                    }`}
                  >
                    {step.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-6">
          <Panel
            id="booking-customer"
            icon={Briefcase}
            title={isAdmin ? "Customer and lead traveller" : "Your client"}
            description={
              isAdmin
                ? "Enter the lead traveller's contact details. If the email already has an account, this trip is linked automatically."
                : "The booking is raised in your name — quotations, documents and updates stay with you. Add your client's own contact details only if they should receive them directly."
            }
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <Field label={isAdmin ? "Customer name" : "Client name"}>
                <input
                  value={client.name}
                  onChange={(event) => setClient((c) => ({ ...c, name: event.target.value }))}
                  className={fieldClass}
                  placeholder="Lead traveller"
                  required
                />
              </Field>
              <Field
                label={isAdmin ? "Customer email" : "Client email"}
                hint={isAdmin ? undefined : "Optional — defaults to yours"}
              >
                <input
                  type="email"
                  value={client.email}
                  onChange={(event) => setClient((c) => ({ ...c, email: event.target.value }))}
                  className={fieldClass}
                  placeholder="name@example.com"
                  required={isAdmin}
                />
              </Field>
              <Field
                label={isAdmin ? "Customer phone" : "Client phone"}
                hint={isAdmin ? undefined : "Optional — defaults to yours"}
              >
                <input
                  type="tel"
                  value={client.phone}
                  onChange={(event) => setClient((c) => ({ ...c, phone: event.target.value }))}
                  className={fieldClass}
                  placeholder="+91 98765 43210"
                  required={isAdmin}
                />
              </Field>
            </div>
            {!isAdmin ? (
              <p className="mt-5 border-t border-primary/10 pt-4 text-xs leading-5 text-foreground-muted">
                If this email already has a customer account, the booking is linked to it and shows
                up in their My Trips automatically.
              </p>
            ) : null}
          </Panel>

          <Panel id="booking-journey" icon={MapPinned} title="What are they booking?">
            <div className="grid grid-cols-2 gap-px border border-primary/12 bg-primary/12 sm:grid-cols-4">
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
                  className={`min-h-11 px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors duration-200 ${
                    basis === value
                      ? "bg-primary text-white"
                      : "bg-white text-foreground-muted hover:bg-sand-light hover:text-primary"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {basis === "package" ? (
                <Field label="Package" className="sm:col-span-2">
                  <Select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                    <option value="">Select a package…</option>
                    {activePackages.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title} — {item.duration} — {item.price}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : basis === "destination" ? (
                <Field label="Destination" className="sm:col-span-2">
                  <Select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
                    <option value="">Select a destination…</option>
                    {activeDestinations.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} — starting {item.price}
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : basis === "departure" ? (
                <Field
                  label="Group departure"
                  className="sm:col-span-2"
                  hint={
                    selectedDeparture
                      ? `${selectedDeparture.seats_left} seat${selectedDeparture.seats_left === 1 ? "" : "s"} left on this departure.`
                      : undefined
                  }
                >
                  <Select
                    value={departureId}
                    onChange={(event) => {
                      setDepartureId(event.target.value);
                      const departure = departures.find((d) => d.id === event.target.value);
                      if (departure && !travelDate) setTravelDate(departure.date);
                    }}
                  >
                    <option value="">Select a departure…</option>
                    {activeDepartures.map((item) => (
                      <option key={item.id} value={item.id} disabled={item.seats_left <= 0}>
                        {item.destination} — {item.date} — {item.seats_left} seats left
                      </option>
                    ))}
                  </Select>
                </Field>
              ) : (
                <Field label="Preferred destination" className="sm:col-span-2">
                  <input
                    value={customDestination}
                    onChange={(event) => setCustomDestination(event.target.value)}
                    className={fieldClass}
                    placeholder="e.g. Japan, Ladakh, Europe"
                  />
                </Field>
              )}

              <Field label="Travel date" icon={<CalendarDays size={14} />}>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(event) => setTravelDate(event.target.value)}
                  className={`${fieldClass} tabular cursor-pointer`}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </Field>
              <Field label="Departure city">
                <input
                  value={departureCity}
                  onChange={(event) => setDepartureCity(event.target.value)}
                  className={fieldClass}
                  placeholder="e.g. Mumbai"
                />
              </Field>
              <Field label="Duration" className="sm:col-span-2">
                <input
                  value={effectiveDuration}
                  onChange={(event) => setDurationLabel(event.target.value)}
                  className={fieldClass}
                  placeholder="6 Nights / 7 Days"
                />
              </Field>
              {basis === "custom" ? (
                <Field label="Budget preference" className="sm:col-span-2">
                  <input
                    value={budget}
                    onChange={(event) => setBudget(event.target.value)}
                    className={fieldClass}
                    placeholder="e.g. ₹75,000 per person"
                  />
                </Field>
              ) : null}
            </div>

            {pricing.addons.length > 0 ? (
              <div className="mt-7 border-t border-primary/10 pt-6">
                <h3 className="font-heading text-sm font-bold text-primary">Add-ons</h3>
                <div className="mt-3 border border-primary/12">
                  {pricing.addons.map((addon, index) => {
                    const checked = addonIds.includes(addon.id);
                    return (
                      <CheckRow
                        key={addon.id}
                        checked={checked}
                        onChange={() =>
                          setAddonIds((current) =>
                            checked
                              ? current.filter((id) => id !== addon.id)
                              : [...current, addon.id]
                          )
                        }
                        className={index ? "border-t border-primary/10" : ""}
                      >
                        <span className="min-w-0 flex-1">
                          <strong className="block text-sm font-bold text-primary">
                            {addon.title}
                          </strong>
                          {addon.description ? (
                            <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                              {addon.description}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-right">
                          <strong className="tabular block text-sm font-bold text-primary">
                            {formatMoney(addon.price)}
                          </strong>
                          <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-[0.1em] text-foreground-light">
                            {addon.pricing === "per-person" ? "per traveller" : "per booking"}
                          </span>
                        </span>
                      </CheckRow>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </Panel>

          <Panel id="booking-travellers" icon={Users} title="Travellers and rooms">
            <div className="grid gap-3 sm:grid-cols-2">
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

            <div className="mt-7 border-t border-primary/10 pt-6">
              <div className="flex items-center gap-2.5">
                <BedDouble size={17} className="text-accent" aria-hidden="true" />
                <h3 className="font-heading text-sm font-bold text-primary">Room configuration</h3>
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

            <div className="mt-6">
              <Field label="Traveller names" hint="One traveller per line.">
                <textarea
                  rows={3}
                  value={travellerNames}
                  onChange={(event) => setTravellerNames(event.target.value)}
                  className={`${fieldClass} resize-y`}
                  placeholder="Aditi Sharma&#10;Rohan Sharma"
                />
              </Field>
            </div>
          </Panel>

          <Panel id="booking-review" title="Notes and reference">
            <div className="grid gap-5 sm:grid-cols-2">
              {!isAdmin ? (
                <Field label="Your reference">
                  <input
                    value={agentReference}
                    onChange={(event) => setAgentReference(event.target.value)}
                    className={fieldClass}
                    placeholder="Your own booking reference"
                  />
                </Field>
              ) : null}
              <Field
                label={isAdmin ? "Customer requests" : "Client requests"}
                className={isAdmin ? "sm:col-span-2" : ""}
              >
                <input
                  value={specialRequirements}
                  onChange={(event) => setSpecialRequirements(event.target.value)}
                  className={fieldClass}
                  placeholder="Meals, room category, celebrations…"
                />
              </Field>
              <Field
                label="Internal remarks"
                className="sm:col-span-2"
                hint={
                  isAdmin
                    ? "Only visible to admins and assigned agents."
                    : "Only visible to you, other agents and admin."
                }
              >
                <textarea
                  rows={3}
                  value={internalRemarks}
                  onChange={(event) => setInternalRemarks(event.target.value)}
                  className={`${fieldClass} resize-y`}
                />
              </Field>
            </div>
            {!isAdmin ? (
              <div className="mt-5 border border-primary/12">
                <CheckRow checked={notifyBooker} onChange={setNotifyBooker}>
                  <span className="text-xs leading-6 text-foreground-muted">
                    Copy me on everything sent to the client.
                  </span>
                </CheckRow>
              </div>
            ) : null}
          </Panel>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6">
          <div className="border border-primary/12 bg-white shadow-premium">
            <div className="bg-primary p-5 text-white">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
                Live booking summary
              </span>
              <p className="mt-2.5 font-heading text-xl font-bold leading-snug tracking-[-0.01em]">
                {tripSelected ? snapshot.title : "Choose a journey"}
              </p>
              <p className="mt-1.5 text-xs text-white/55">
                Indicative until an admin confirms pricing
              </p>
            </div>

            <div className="space-y-4 p-5">
              <SummaryRow icon={MapPinned} label="Destination" value={snapshot.destination} />
              <SummaryRow
                icon={CalendarDays}
                label="Travel"
                value={travelDate ? formatFormDate(travelDate) : "Date to confirm"}
              />
              <SummaryRow
                icon={Users}
                label="Party"
                value={`${travellerCount} traveller${travellerCount === 1 ? "" : "s"} · ${roomCount} room${roomCount === 1 ? "" : "s"}`}
              />

              <div className="border-t border-primary/10 pt-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                    Indicative total
                  </span>
                  <strong className="tabular font-heading text-2xl font-extrabold leading-none tracking-[-0.02em] text-primary">
                    {formatMoney(quote.total)}
                  </strong>
                </div>
                <div className="mt-2.5 flex justify-between gap-4 text-xs">
                  <span className="text-foreground-muted">Advance payable</span>
                  <span className="tabular font-bold text-primary">
                    {formatMoney(quote.depositAmount)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-accent px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-55"
              >
                {busy ? "Creating booking…" : "Create booking"} <Check size={15} />
              </button>
              <p className="text-center text-[11px] leading-5 text-foreground-muted">
                Creates the file and opens it in the operations workspace.
              </p>
            </div>
          </div>

          <div className="border-l-2 border-gold bg-gold/[0.08] px-4 py-3.5">
            <strong className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-dark">
              <CircleDollarSign size={13} aria-hidden="true" /> Price control
            </strong>
            <span className="mt-1.5 block text-xs leading-5 text-foreground-muted">
              You can revise pricing, add documents and send the quotation from the booking
              workspace.
            </span>
          </div>
        </aside>
      </div>
    </form>
  );
}

/** One titled block of the form; every section shares this chrome. */
function Panel({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border border-primary/12 bg-white shadow-premium">
      <header className="border-b border-primary/10 px-5 py-5 sm:px-7">
        <div className="flex items-center gap-2.5">
          {Icon ? <Icon size={17} className="text-accent" /> : null}
          <h2 className="font-heading text-base font-bold tracking-[-0.01em] text-primary">
            {title}
          </h2>
        </div>
        {description ? (
          <p className="mt-1.5 text-xs leading-5 text-foreground-muted">{description}</p>
        ) : null}
      </header>
      <div className="px-5 py-6 sm:px-7">{children}</div>
    </section>
  );
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-sand text-accent">
        <Icon size={16} />
      </span>
      <span className="min-w-0">
        <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-light">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm font-bold text-primary">{value}</span>
      </span>
    </div>
  );
}

function formatFormDate(value: string) {
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
