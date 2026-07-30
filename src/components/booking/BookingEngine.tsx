"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  Download,
  FileText,
  Mail,
  MapPin,
  Minus,
  Plus,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Destination, PackageAddon, TourPackage } from "@/data/mockData";
import { getFullPackageForPackage } from "@/data/packageDetails";
import { useCollection } from "@/lib/admin/store";
import { useAuth } from "@/lib/auth/useAuth";
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
import { saveRecentSearch, useRecentSearches } from "@/lib/recentSearches";

const steps = ["Choose trip", "Travel plan", "Travellers", "Your details", "Review"];
const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10";

interface BookingResult {
  id: string;
  code: string;
  quotationNumber: string;
  token: string;
  brochureUrl: string;
}

function Counter({
  label,
  hint,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
      <div>
        <p className="text-sm font-bold text-primary">{label}</p>
        <p className="mt-0.5 text-xs text-foreground-muted">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-primary hover:border-primary"
          aria-label={`Remove ${label}`}
        >
          <Minus size={15} />
        </button>
        <span className="w-5 text-center text-sm font-extrabold text-primary">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white hover:bg-accent"
          aria-label={`Add ${label}`}
        >
          <Plus size={15} />
        </button>
      </div>
    </div>
  );
}

function SummaryCard({
  snapshot,
  image,
  duration,
}: {
  snapshot: BookingPackageSnapshot;
  image?: string;
  duration?: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
      <div className="relative h-44 bg-primary">
        {image ? (
          <Image src={image} alt={snapshot.title} fill className="object-cover" sizes="420px" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/25 to-transparent" />
        <div className="absolute bottom-0 p-5 text-white">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            {snapshot.source === "package"
              ? "Tour package"
              : snapshot.source === "destination"
                ? "Destination holiday"
                : "Custom journey"}
          </span>
          <h2 className="mt-1 font-heading text-xl font-bold">{snapshot.title}</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-5 text-xs">
        <div>
          <span className="block uppercase tracking-wider text-foreground-light">Destination</span>
          <strong className="mt-1 block text-primary">{snapshot.destination}</strong>
        </div>
        <div>
          <span className="block uppercase tracking-wider text-foreground-light">Duration</span>
          <strong className="mt-1 block text-primary">{duration || snapshot.duration || "Custom"}</strong>
        </div>
      </div>
    </div>
  );
}

export default function BookingEngine() {
  const searchParams = useSearchParams();
  const initialCustomDestination = searchParams.get("destination") || "";
  const { items: packages } = useCollection<TourPackage>("packages");
  const { items: destinations } = useCollection<Destination>("destinations");
  const { user, loading: authLoading } = useAuth();

  const initialSource = (searchParams.get("type") || "package") as BookingSource;
  const [source, setSource] = useState<BookingSource>(
    ["package", "destination", "custom"].includes(initialSource) ? initialSource : "package"
  );
  const [selectedId, setSelectedId] = useState(searchParams.get("id") || "");
  const [step, setStep] = useState(0);
  const [customDestination, setCustomDestination] = useState(initialCustomDestination);
  const [travelDate, setTravelDate] = useState("");
  const [departureCity, setDepartureCity] = useState("");
  const [durationLabel, setDurationLabel] = useState("");
  const [budgetPerAdult, setBudgetPerAdult] = useState(45000);
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
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    travellerNames: "",
    requirements: "",
  });
  const [bookingFor, setBookingFor] = useState<"self" | "other">("self");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [sending, setSending] = useState<"email" | "whatsapp" | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const { items: recentSearches, clearRecentSearches } = useRecentSearches();

  const activePackages = packages.filter((item) => item.status !== "draft");
  const activeDestinations = destinations.filter((item) => item.status !== "draft");

  const effectiveSelectedId =
    selectedId ||
    (source === "package"
      ? activePackages[0]?.id || ""
      : source === "destination"
        ? activeDestinations[0]?.id || ""
        : "");
  const selectedPackage = activePackages.find((item) => item.id === effectiveSelectedId);
  const selectedDestination = activeDestinations.find((item) => item.id === effectiveSelectedId);
  const fullPackage = selectedPackage ? getFullPackageForPackage(selectedPackage) : null;
  const effectiveDuration =
    durationLabel ||
    (source === "package"
      ? selectedPackage?.duration
      : source === "destination"
        ? selectedDestination?.duration
        : "") ||
    "6 Nights / 7 Days";
  const bookingForSelf = Boolean(user) && bookingFor === "self";
  const contactName = bookingForSelf ? user!.name : contact.name;
  const contactEmail = bookingForSelf ? user!.email : contact.email;

  const snapshot: BookingPackageSnapshot = (() => {
    if (source === "package" && fullPackage) return packageSnapshot(fullPackage);
    if (source === "destination" && selectedDestination) {
      return destinationSnapshot(selectedDestination);
    }
    return {
      source: "custom",
      title: customDestination
        ? `${customDestination} Personalised Holiday`
        : "Your Personalised Holiday",
      destination: customDestination || "Destination to be planned",
      duration: effectiveDuration,
      tagline: "Designed around your dates, pace, interests and preferred budget.",
      overview:
        "Our travel designer will use this brief to verify hotels, transport and experiences, then refine the itinerary with you before confirmation.",
      highlights: [],
      itinerary: [],
      inclusions: [
        "Personalised itinerary planning",
        "Hotel and transport recommendations",
        "Dedicated travel consultant",
      ],
      exclusions: [
        "Services not included in the final confirmed quotation",
        "Personal expenses and optional activities",
      ],
    };
  })();

  const startingPrice =
    source === "package"
      ? selectedPackage?.price
      : source === "destination"
        ? selectedDestination?.price
        : budgetPerAdult;
  const pricing = pricingForStartingPrice(
    startingPrice,
    source === "package" ? selectedPackage?.pricing : undefined
  );
  const selectedAddons: SelectedAddon[] = pricing.addons
    .filter((addon) => addonIds.includes(addon.id))
    .map((addon) => ({
      id: addon.id,
      title: addon.title,
      unitPrice: addon.price,
      pricing: addon.pricing,
      quantity:
        addon.pricing === "per-person"
          ? Math.max(
              1,
              travellers.adults + travellers.childrenWithBed + travellers.childrenWithoutBed
            )
          : 1,
    }));
  const quote = calculateQuote({
    travellers,
    rooms,
    pricing,
    addons: selectedAddons,
    indicative: true,
  });
  const travellerCount = totalTravellers(travellers);
  const selectedImage = snapshot.heroImage;

  const selectSource = (next: BookingSource) => {
    setSource(next);
    const nextItem =
      next === "package"
        ? activePackages[0]
        : next === "destination"
          ? activeDestinations[0]
          : null;
    setSelectedId(nextItem?.id || "");
    setDurationLabel(nextItem?.duration || (next === "custom" ? "6 Nights / 7 Days" : ""));
    setAddonIds([]);
  };

  useEffect(() => {
    if (source === "custom" && initialCustomDestination.trim()) {
      saveRecentSearch({
        label: initialCustomDestination.trim(),
        destination: initialCustomDestination.trim(),
      });
    }
  }, [initialCustomDestination, source]);

  const validateStep = () => {
    if (step === 0) {
      if (source === "package" && !selectedPackage) return "Please select a tour package.";
      if (source === "destination" && !selectedDestination) return "Please select a destination.";
      if (source === "custom" && customDestination.trim().length < 2) {
        return "Please enter your preferred destination.";
      }
    }
    if (step === 1) {
      if (!travelDate) return "Please select a travel date.";
      if (departureCity.trim().length < 2) return "Please enter your departure city.";
      if (!effectiveDuration.trim()) return "Please enter your trip duration.";
    }
    if (step === 2) {
      if (travellerCount < 1 || travellers.adults < 1) {
        return "At least one adult traveller is required.";
      }
      if (rooms.singleRooms + rooms.doubleRooms + rooms.tripleRooms < 1) {
        return "Please select at least one room.";
      }
    }
    if (step === 3) {
      if (contactName.trim().length < 2) return "Please enter the lead traveller's name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
        return "Please enter a valid email address.";
      }
      if (contact.phone.replace(/\D/g, "").length < 8) {
        return "Please enter a valid phone number.";
      }
      if (source === "custom" && !user) {
        return "Please sign in before submitting a custom trip request.";
      }
    }
    if (step === 4 && !termsAccepted) {
      return "Please accept the quotation and cancellation terms.";
    }
    return "";
  };

  const next = () => {
    const validation = validateStep();
    if (validation) {
      setError(validation);
      return;
    }
    setError("");
    setStep((value) => Math.min(4, value + 1));
  };

  const submit = async () => {
    const validation = validateStep();
    if (validation) {
      setError(validation);
      return;
    }
    setSubmitting(true);
    setError("");
    if (source === "custom" && customDestination.trim()) {
      saveRecentSearch({
        label: customDestination.trim(),
        destination: customDestination.trim(),
      });
    }
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: source === "package" ? "standard" : "customized",
          bookingSource: source,
          packageId: snapshot.id,
          packageTitle: snapshot.title,
          destination: snapshot.destination,
          travelDate,
          departureCity,
          durationLabel: effectiveDuration,
          travellersCount: travellerCount,
          travellers,
          rooms,
          selectedAddons,
          pricingSnapshot: quote,
          packageSnapshot: { ...snapshot, duration: effectiveDuration },
          travellerNames: contact.travellerNames,
          budget: source === "custom" ? formatMoney(budgetPerAdult) : undefined,
          specialRequirements: contact.requirements,
          contactName,
          contactEmail,
          contactPhone: contact.phone,
          termsAccepted,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not create your booking.");
      setResult({
        id: data.booking.id,
        code: data.booking.booking_code,
        quotationNumber: data.booking.quotation_number,
        token: data.accessToken,
        brochureUrl: data.brochureUrl,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create your booking.");
    } finally {
      setSubmitting(false);
    }
  };

  const sendBrochure = async (channel: "email" | "whatsapp") => {
    if (!result) return;
    setSending(channel);
    setDeliveryMessage("");
    try {
      const response = await fetch(`/api/bookings/${result.id}/send-brochure`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: result.token,
          channel,
          recipientEmail: contactEmail,
          recipientPhone: contact.phone,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not prepare the brochure.");
      if (data.shareUrl) {
        window.open(data.shareUrl, "_blank", "noopener,noreferrer");
        setDeliveryMessage("WhatsApp opened with your brochure message ready to send.");
      } else if (data.delivered) {
        setDeliveryMessage(`Brochure sent successfully to ${contactEmail}.`);
      } else if (data.mailtoUrl) {
        window.location.assign(data.mailtoUrl);
        setDeliveryMessage(
          "Your email draft is ready. Add the downloaded PDF as an attachment before sending."
        );
      }
    } catch (sendError) {
      setDeliveryMessage(
        sendError instanceof Error ? sendError.message : "Could not send the brochure."
      );
    } finally {
      setSending(null);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-2xl">
          <div className="bg-primary px-6 py-10 text-center text-white sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              <Check size={34} strokeWidth={3} />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Proposal created
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
              Your trip brochure is ready
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              We saved your request as <strong className="text-white">{result.code}</strong> and
              generated quotation <strong className="text-white">{result.quotationNumber}</strong>.
              Our team will verify live availability before final confirmation.
            </p>
          </div>
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_340px]">
            <div>
              <h2 className="font-heading text-xl font-bold text-primary">Share your proposal</h2>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                Preview the complete itinerary, pricing, inclusions and next steps. You can also
                send it to the traveller by email or WhatsApp.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <a
                  href={result.brochureUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-accent"
                >
                  <FileText size={17} /> Preview brochure
                </a>
                <a
                  href={`${result.brochureUrl}&download=1`}
                  className="flex items-center justify-center gap-2 rounded-full border border-primary/15 px-5 py-3 text-sm font-bold text-primary hover:bg-sand"
                >
                  <Download size={17} /> Download PDF
                </a>
                <button
                  type="button"
                  onClick={() => sendBrochure("email")}
                  disabled={Boolean(sending)}
                  className="flex items-center justify-center gap-2 rounded-full border border-primary/15 px-5 py-3 text-sm font-bold text-primary hover:bg-sand disabled:opacity-50"
                >
                  <Mail size={17} /> {sending === "email" ? "Sending..." : "Send by email"}
                </button>
                <button
                  type="button"
                  onClick={() => sendBrochure("whatsapp")}
                  disabled={Boolean(sending)}
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Send size={17} /> {sending === "whatsapp" ? "Opening..." : "Share on WhatsApp"}
                </button>
              </div>
              {deliveryMessage ? (
                <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  {deliveryMessage}
                </div>
              ) : null}
              <div className="mt-8 flex flex-wrap gap-4">
                {user ? (
                  <Link href={`/account/bookings/${result.id}`} className="text-sm font-bold text-accent">
                    Track this booking in My Account →
                  </Link>
                ) : (
                  <Link href="/signup" className="text-sm font-bold text-accent">
                    Create an account to manage future trips →
                  </Link>
                )}
                <Link href="/packages" className="text-sm font-bold text-primary">
                  Browse more packages
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-sand p-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                Indicative trip total
              </span>
              <p className="mt-1 text-3xl font-extrabold text-primary">{formatMoney(quote.total)}</p>
              <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Booking advance</span>
                  <strong className="text-primary">{formatMoney(quote.depositAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Balance</span>
                  <strong className="text-primary">{formatMoney(quote.balanceAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-foreground-muted">Travellers</span>
                  <strong className="text-primary">{travellerCount}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Digital booking engine
        </p>
        <h1 className="mt-2 font-heading text-3xl font-extrabold text-primary sm:text-5xl">
          Build your holiday proposal
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted sm:text-base">
          Configure your trip, see an instant indicative price and leave with a complete
          shareable brochure.
        </p>
      </div>

      <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-soft">
        <div className="flex min-w-[680px]">
          {steps.map((label, index) => (
            <button
              type="button"
              key={label}
              onClick={() => index < step && setStep(index)}
              className={`flex flex-1 items-center gap-2 rounded-xl px-4 py-3 text-left text-xs font-bold ${
                index === step
                  ? "bg-primary text-white"
                  : index < step
                    ? "text-emerald-700"
                    : "text-foreground-light"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  index < step ? "bg-emerald-100" : "bg-white/10"
                }`}
              >
                {index < step ? <Check size={13} /> : index + 1}
              </span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-[2rem] border border-slate-100 bg-white p-5 shadow-premium sm:p-8">
          {error ? (
            <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : null}

          {step === 0 ? (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">What are you planning?</h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Start from a published package, choose a destination, or create something entirely
                custom.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {(
                  [
                    ["package", "Tour package", "Book a structured itinerary"],
                    ["destination", "Destination", "Design around a location"],
                    ["custom", "Custom trip", "Start from your own idea"],
                  ] as const
                ).map(([value, label, hint]) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => selectSource(value)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      source === value
                        ? "border-primary bg-primary text-white shadow-lg"
                        : "border-slate-200 hover:border-primary/30"
                    }`}
                  >
                    <Sparkles size={20} className={source === value ? "text-gold" : "text-accent"} />
                    <strong className="mt-3 block text-sm">{label}</strong>
                    <span className={`mt-1 block text-xs ${source === value ? "text-slate-300" : "text-foreground-muted"}`}>
                      {hint}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-7">
                {source === "package" ? (
                  <label className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Select a published package
                    </span>
                    <select value={effectiveSelectedId} onChange={(event) => { const id = event.target.value; setSelectedId(id); setDurationLabel(activePackages.find((item) => item.id === id)?.duration || ""); }} className={inputClass}>
                      {activePackages.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title} - {item.duration} - {item.price}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : source === "destination" ? (
                  <label className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Select a published destination
                    </span>
                    <select value={effectiveSelectedId} onChange={(event) => { const id = event.target.value; setSelectedId(id); setDurationLabel(activeDestinations.find((item) => item.id === id)?.duration || ""); }} className={inputClass}>
                      {activeDestinations.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} - starting {item.price}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Preferred destination
                        </span>
                        <input
                          value={customDestination}
                          onChange={(event) => setCustomDestination(event.target.value)}
                          className={inputClass}
                          placeholder="e.g. Japan, Ladakh, Europe"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">
                          Budget per adult
                        </span>
                        <input
                          type="number"
                          min={5000}
                          step={1000}
                          value={budgetPerAdult}
                          onChange={(event) => setBudgetPerAdult(Number(event.target.value) || 0)}
                          className={inputClass}
                        />
                      </label>
                    </div>

                    {recentSearches.length > 0 ? (
                      <div className="rounded-3xl border border-slate-200 bg-sand/70 p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
                              Recent searches
                            </p>
                            <p className="mt-1 text-sm text-foreground-muted">
                              Reuse a destination you looked up recently.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={clearRecentSearches}
                            className="text-xs font-semibold uppercase tracking-wider text-foreground-muted transition hover:text-primary"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {recentSearches.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setCustomDestination(item.destination)}
                              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-primary transition hover:border-accent hover:text-accent"
                            >
                              {item.destination}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">Dates and departure</h2>
              <p className="mt-2 text-sm text-foreground-muted">
                These details are shown in your quotation and help our team verify availability.
              </p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                    <CalendarDays size={15} /> Travel date
                  </span>
                  <input type="date" value={travelDate} onChange={(event) => setTravelDate(event.target.value)} className={inputClass} />
                </label>
                <label className="space-y-2">
                  <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                    <MapPin size={15} /> Departure city
                  </span>
                  <input value={departureCity} onChange={(event) => setDepartureCity(event.target.value)} className={inputClass} placeholder="e.g. Mumbai" />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Trip duration</span>
                  <input value={effectiveDuration} onChange={(event) => setDurationLabel(event.target.value)} className={inputClass} placeholder="6 Nights / 7 Days" />
                </label>
              </div>
              <div className="mt-8">
                <h3 className="text-sm font-bold text-primary">Optional enhancements</h3>
                <div className="mt-3 grid gap-3">
                  {pricing.addons.map((addon: PackageAddon) => {
                    const checked = addonIds.includes(addon.id);
                    return (
                      <label key={addon.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${checked ? "border-accent bg-accent/5" : "border-slate-200"}`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            setAddonIds((current) =>
                              checked ? current.filter((id) => id !== addon.id) : [...current, addon.id]
                            )
                          }
                          className="mt-1 h-4 w-4 accent-accent"
                        />
                        <span className="flex-1">
                          <strong className="block text-sm text-primary">{addon.title}</strong>
                          <span className="mt-1 block text-xs text-foreground-muted">{addon.description}</span>
                        </span>
                        <strong className="text-sm text-primary">
                          {formatMoney(addon.price)}
                          <span className="block text-right text-[10px] font-medium text-foreground-light">
                            {addon.pricing === "per-person" ? "per traveller" : "per booking"}
                          </span>
                        </strong>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">Travellers and rooms</h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Child pricing is separated by bed requirement, matching the quotation workflow.
              </p>
              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                <Counter label="Adults" hint="12 years and above" value={travellers.adults} min={1} onChange={(value) => setTravellers((current) => ({ ...current, adults: value }))} />
                <Counter label="Children with bed" hint="2-11 years" value={travellers.childrenWithBed} onChange={(value) => setTravellers((current) => ({ ...current, childrenWithBed: value }))} />
                <Counter label="Children without bed" hint="2-11 years" value={travellers.childrenWithoutBed} onChange={(value) => setTravellers((current) => ({ ...current, childrenWithoutBed: value }))} />
                <Counter label="Infants" hint="Under 2 years" value={travellers.infants} onChange={(value) => setTravellers((current) => ({ ...current, infants: value }))} />
              </div>
              <div className="mt-8 border-t border-slate-100 pt-7">
                <div className="flex items-center gap-2">
                  <BedDouble size={18} className="text-accent" />
                  <h3 className="text-sm font-bold text-primary">Room configuration</h3>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <Counter label="Single rooms" hint="1 guest" value={rooms.singleRooms} onChange={(value) => setRooms((current) => ({ ...current, singleRooms: value }))} />
                  <Counter label="Double/Twin" hint="2 guests" value={rooms.doubleRooms} onChange={(value) => setRooms((current) => ({ ...current, doubleRooms: value }))} />
                  <Counter label="Triple rooms" hint="3 guests" value={rooms.tripleRooms} onChange={(value) => setRooms((current) => ({ ...current, tripleRooms: value }))} />
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">Lead traveller details</h2>
              <p className="mt-2 text-sm text-foreground-muted">
                Your brochure will be personalised with this name and delivered to these details.
              </p>
              {source === "custom" && !authLoading && !user ? (
                <div className="mt-5 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-primary">
                  Custom trips are saved to your customer account.{" "}
                  <Link href="/signin?from=/book?type=custom" className="font-bold text-accent">
                    Sign in to continue
                  </Link>
                  .
                </div>
              ) : null}
              {user ? (
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["self", "Booking for myself", user.name],
                      ["other", "Booking for someone else", "A family member, friend or colleague"],
                    ] as const
                  ).map(([value, label, hint]) => (
                    <button
                      type="button"
                      key={value}
                      onClick={() => setBookingFor(value)}
                      className={`rounded-2xl border p-4 text-left transition ${
                        bookingFor === value
                          ? "border-primary bg-primary text-white shadow-lg"
                          : "border-slate-200 hover:border-primary/30"
                      }`}
                    >
                      <strong className="block text-sm">{label}</strong>
                      <span className={`mt-1 block text-xs ${bookingFor === value ? "text-slate-300" : "text-foreground-muted"}`}>
                        {hint}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Full name</span>
                  <input
                    value={contactName}
                    disabled={bookingForSelf}
                    onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))}
                    className={`${inputClass} ${bookingForSelf ? "cursor-not-allowed bg-slate-50 text-foreground-muted" : ""}`}
                    placeholder="Lead traveller"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Phone</span>
                  <input type="tel" value={contact.phone} onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))} className={inputClass} placeholder="+91 98765 43210" />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Email address</span>
                  <input
                    type="email"
                    value={contactEmail}
                    disabled={bookingForSelf}
                    onChange={(event) => setContact((current) => ({ ...current, email: event.target.value }))}
                    className={`${inputClass} ${bookingForSelf ? "cursor-not-allowed bg-slate-50 text-foreground-muted" : ""}`}
                    placeholder="name@example.com"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Traveller names</span>
                  <textarea rows={3} value={contact.travellerNames} onChange={(event) => setContact((current) => ({ ...current, travellerNames: event.target.value }))} className={inputClass} placeholder="One traveller per line; names can also be added later." />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Preferences and special requests</span>
                  <textarea rows={4} value={contact.requirements} onChange={(event) => setContact((current) => ({ ...current, requirements: event.target.value }))} className={inputClass} placeholder="Hotel category, meals, accessibility, celebrations, preferred pace..." />
                </label>
              </div>
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary">Review your proposal</h2>
              <p className="mt-2 text-sm text-foreground-muted">
                The amount below is an instant estimate. Your agent verifies live inventory before
                any payment is requested.
              </p>
              <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-sand px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-foreground-muted">
                  <span>Item</span><span>Qty</span><span>Amount</span>
                </div>
                {quote.lineItems.map((item) => (
                  <div key={item.key} className="grid grid-cols-[1fr_auto_auto] gap-4 border-t border-slate-100 px-4 py-3 text-sm">
                    <span className="font-semibold text-primary">{item.label}</span>
                    <span className="text-foreground-muted">{item.quantity}</span>
                    <strong className="min-w-24 text-right text-primary">{formatMoney(item.amount)}</strong>
                  </div>
                ))}
                <div className="flex items-end justify-between border-t border-primary/10 bg-primary p-5 text-white">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold">Indicative total</span>
                    <p className="mt-1 text-xs text-slate-300">{travellerCount} travellers · {effectiveDuration}</p>
                  </div>
                  <strong className="text-2xl">{formatMoney(quote.total)}</strong>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-sand p-4">
                  <span className="text-xs text-foreground-muted">Booking advance ({quote.depositPercent}%)</span>
                  <strong className="mt-1 block text-lg text-primary">{formatMoney(quote.depositAmount)}</strong>
                </div>
                <div className="rounded-2xl bg-sand p-4">
                  <span className="text-xs text-foreground-muted">Balance after advance</span>
                  <strong className="mt-1 block text-lg text-primary">{formatMoney(quote.balanceAmount)}</strong>
                </div>
              </div>
              <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4">
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-1 h-4 w-4 accent-accent" />
                <span className="text-xs leading-relaxed text-foreground-muted">
                  I confirm the traveller information is correct. I understand this is an indicative
                  quotation subject to live availability, and I accept the booking, amendment and
                  cancellation terms that will be confirmed before payment.
                </span>
              </label>
              <div className="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-medium text-emerald-800">
                <ShieldCheck size={18} />
                No payment is collected at this stage. The agent validates inventory first.
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((value) => Math.max(0, value - 1));
              }}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold text-primary disabled:invisible"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < 4 ? (
              <button type="button" onClick={next} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-accent">
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button type="button" onClick={submit} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-white hover:bg-accent-dark disabled:opacity-50">
                {submitting ? "Creating proposal..." : "Create booking & brochure"} <FileText size={16} />
              </button>
            )}
          </div>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <SummaryCard snapshot={snapshot} image={selectedImage} duration={effectiveDuration} />
          <div className="rounded-3xl bg-primary p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Live estimate</span>
              <Users size={17} className="text-gold" />
            </div>
            <p className="mt-2 text-3xl font-extrabold">{formatMoney(quote.total)}</p>
            <p className="mt-1 text-xs text-slate-300">
              for {travellerCount} traveller{travellerCount === 1 ? "" : "s"}
            </p>
            <div className="mt-5 border-t border-white/10 pt-5 text-xs text-slate-300">
              <div className="flex justify-between"><span>Advance estimate</span><strong className="text-gold">{formatMoney(quote.depositAmount)}</strong></div>
              <p className="mt-4 leading-relaxed">Final availability and supplier rates are verified by your travel consultant.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
