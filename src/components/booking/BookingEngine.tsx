"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  BookOpen,
  CalendarDays,
  Check,
  Download,
  FileText,
  Mail,
  MapPin,
  Package,
  ReceiptText,
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
import { EMAIL_RE } from "@/lib/bookings/party";
import { placeholderImage } from "@/lib/placeholderImages";
import { saveRecentSearch, useRecentSearches } from "@/lib/recentSearches";
import Counter from "@/components/booking/Counter";
import InlineAuthModal from "@/components/booking/InlineAuthModal";
import TravellerDetailsStep, {
  emptyPartyDraft,
  resolveParty,
  type PartyDraft,
} from "@/components/booking/TravellerDetailsStep";
import { CheckRow, Field, Select, fieldClass } from "@/components/booking/fields";
import PdfPreviewModal from "@/components/ui/PdfPreviewModal";

/**
 * Each step carries its own panel header, so the question being asked is
 * stated once instead of being re-typed inside every branch.
 */
const STEPS = [
  {
    label: "Choose trip",
    title: "What are you planning?",
    description:
      "Start from a published package, pick a destination, or build something entirely your own.",
  },
  {
    label: "Travel plan",
    title: "Dates and departure",
    description:
      "These details appear on your quotation and let our team verify live availability.",
  },
  {
    label: "Travellers",
    title: "Travellers and rooms",
    description:
      "Child pricing is split by bed requirement, matching how the quotation is calculated.",
  },
  {
    label: "Your details",
    title: "Your details",
    description:
      "This trip is booked in your name. Your brochure is personalised with these details and sent to the contact below.",
  },
  {
    label: "Review",
    title: "Review your proposal",
    description:
      "The amount below is an instant estimate. Your consultant verifies live inventory before any payment is requested.",
  },
] as const;

const LAST_STEP = STEPS.length - 1;

const TRUST = [
  [ShieldCheck, "No payment", "until verified"],
  [ReceiptText, "Instant quote", "clear pricing"],
  [BookOpen, "Trip brochure", "made for you"],
] as const;

const TRIP_TYPES = [
  ["package", "Tour package", "Book a structured itinerary", Package],
  ["destination", "Destination", "Design around a location", MapPin],
  ["custom", "Custom trip", "Start from your own idea", Sparkles],
] as const;

/** Squared, uppercase CTA — the same button shape the package pages use. */
const ctaClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-55";

const openNativeDatePicker = (event: React.MouseEvent<HTMLInputElement>) => {
  try {
    event.currentTarget.showPicker?.();
  } catch {
    // Browsers without programmatic picker support still use the native input.
  }
};

interface BookingResult {
  id: string;
  code: string;
  quotationNumber: string;
  token: string;
  brochureUrl: string;
  quotationUrl: string;
}

/** Small uppercase kicker used above headings throughout the flow. */
function Eyebrow({
  children,
  tone = "accent",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "accent" | "gold" | "muted";
  className?: string;
}) {
  const tones = {
    accent: "text-accent",
    gold: "text-gold",
    muted: "text-foreground-muted",
  };
  return (
    <span
      className={`block text-[10px] font-bold uppercase tracking-[0.2em] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
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
  const kind =
    snapshot.source === "package"
      ? "Tour package"
      : snapshot.source === "destination"
        ? "Destination holiday"
        : "Custom journey";

  return (
    <div className="overflow-hidden border border-primary/12 bg-white shadow-premium">
      <div className="relative h-40 bg-primary sm:h-44">
        <Image
          src={image || placeholderImage(snapshot.title || "custom-trip")}
          alt=""
          fill
          loading="eager"
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 420px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/90 via-ink-deep/45 to-ink-deep/10" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <Eyebrow tone="gold">{kind}</Eyebrow>
          <h2 className="mt-1.5 font-heading text-xl font-bold leading-tight tracking-[-0.01em]">
            {snapshot.title}
          </h2>
        </div>
      </div>
      <dl className="grid grid-cols-2">
        <div className="border-r border-primary/10 p-5">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-light">
            Destination
          </dt>
          <dd className="mt-1.5 text-sm font-bold text-primary">{snapshot.destination}</dd>
        </div>
        <div className="p-5">
          <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-light">
            Duration
          </dt>
          <dd className="mt-1.5 text-sm font-bold text-primary">
            {duration || snapshot.duration || "Custom"}
          </dd>
        </div>
      </dl>
    </div>
  );
}

/**
 * Progress through the five steps.
 *
 * Desktop gets the full labelled rail. On phones the same rail collapses into
 * a bar that sticks under the navbar and carries the running estimate, because
 * the price rail sits below the fold there and the number is the one thing a
 * traveller wants in view while they change the party.
 */
function StepRail({
  step,
  estimate,
  onSelect,
}: {
  step: number;
  estimate: string;
  onSelect: (index: number) => void;
}) {
  return (
    <>
      {/* `top-20` clears the floating navbar: 0.75rem offset + 0.75rem padding
          either side of a 2.75rem control row. */}
      <div className="sticky top-20 z-30 -mx-4 mb-7 border-y border-primary/10 bg-sand-light/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <Eyebrow>
              Step {step + 1} of {STEPS.length}
            </Eyebrow>
            <p className="mt-1 truncate text-sm font-bold text-primary">{STEPS[step].label}</p>
          </div>
          <div className="shrink-0 text-right">
            <Eyebrow tone="muted">Estimate</Eyebrow>
            <strong className="tabular mt-1 block text-sm font-extrabold text-primary">
              {estimate}
            </strong>
          </div>
        </div>
        <div className="mt-3 h-0.5 w-full bg-primary/10">
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-premium"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <ol className="mb-8 hidden items-center border-y border-primary/10 py-4 lg:flex">
        {STEPS.map((item, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li key={item.label} className="flex min-w-0 flex-1 items-center last:flex-none">
              <button
                type="button"
                onClick={() => done && onSelect(index)}
                disabled={!done}
                aria-current={current ? "step" : undefined}
                className="flex shrink-0 items-center gap-3 text-left disabled:cursor-default"
              >
                <span
                  className={`tabular flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-[11px] font-bold transition-colors duration-300 ${
                    current
                      ? "bg-primary text-white"
                      : done
                        ? "bg-emerald-600/10 text-emerald-700"
                        : "border border-primary/15 text-foreground-light"
                  }`}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-300 ${
                    current
                      ? "text-primary"
                      : done
                        ? "text-emerald-700 hover:text-emerald-800"
                        : "text-foreground-light"
                  }`}
                >
                  {item.label}
                </span>
              </button>
              {index < LAST_STEP ? (
                <span
                  aria-hidden="true"
                  className={`mx-3 h-px min-w-4 flex-1 transition-colors duration-300 ${
                    done ? "bg-emerald-600/30" : "bg-primary/12"
                  }`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}

export default function BookingEngine() {
  const searchParams = useSearchParams();
  const initialCustomDestination = searchParams.get("destination") || "";
  const initialTravelMonth = searchParams.get("month") || "";
  const initialDuration = searchParams.get("duration") || "";
  const initialBudget = Number(searchParams.get("budget")) || 45000;
  const { items: packages } = useCollection<TourPackage>("packages");
  const { items: destinations } = useCollection<Destination>("destinations");
  const { user, refresh: refreshAuth } = useAuth();

  const initialSource = (searchParams.get("type") || "package") as BookingSource;
  const [source, setSource] = useState<BookingSource>(
    ["package", "destination", "custom"].includes(initialSource) ? initialSource : "package"
  );
  const [selectedId, setSelectedId] = useState(searchParams.get("id") || "");
  const [step, setStep] = useState(0);
  const [customDestination, setCustomDestination] = useState(initialCustomDestination);
  const [travelDate, setTravelDate] = useState(initialTravelMonth ? `${initialTravelMonth}-01` : "");
  const [departureCity, setDepartureCity] = useState("");
  const [durationLabel, setDurationLabel] = useState(initialDuration);
  const [budgetPerAdult, setBudgetPerAdult] = useState(initialBudget);
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
  const [party, setParty] = useState<PartyDraft>(emptyPartyDraft);
  const [tripNotes, setTripNotes] = useState({ travellerNames: "", requirements: "" });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [sending, setSending] = useState<"email" | "whatsapp" | null>(null);
  const [result, setResult] = useState<BookingResult | null>(null);
  const [brochurePreviewOpen, setBrochurePreviewOpen] = useState(false);
  const [quotationPreviewOpen, setQuotationPreviewOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
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
  const resolved = resolveParty(party, user);
  const deliveryEmail = resolved.traveller.email;
  const deliveryPhone = resolved.traveller.phone;

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
  const roomCount = rooms.singleRooms + rooms.doubleRooms + rooms.tripleRooms;

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

  const hasPhone = (value: string) => value.replace(/\D/g, "").length >= 8;

  /** Mirrors the server-side rules in lib/bookings/party.ts. */
  const validateParty = () => {
    const { traveller } = resolved;
    if (traveller.name.trim().length < 2) return "Please enter your full name.";
    if (!EMAIL_RE.test(traveller.email)) return "Please enter a valid email address.";
    if (!hasPhone(traveller.phone)) return "Please enter a valid phone number.";
    return "";
  };

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
    if (step === 3) return validateParty();
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
    setStep((value) => Math.min(LAST_STEP, value + 1));
  };

  const submit = async (options?: { skipAuthGate?: boolean }) => {
    // The proxy already turned away anyone without a session, so this is the
    // recovery path for a cookie that lapsed while the form was open rather
    // than the normal way in — the API enforces the same rule regardless.
    if (!user && !options?.skipAuthGate) {
      setShowAuthModal(true);
      return;
    }
    const validation = validateStep();
    if (validation) {
      setError(validation);
      return;
    }
    // The auth modal's login/signup request already set the real session
    // cookie server-side; `user` here is just our own optimistic mirror of
    // that and only updates on this component's next render, so callers
    // that already know sign-in just succeeded pass skipAuthGate instead of
    // waiting on it.
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
          travellerNames: tripNotes.travellerNames,
          budget: source === "custom" ? formatMoney(budgetPerAdult) : undefined,
          specialRequirements: tripNotes.requirements,
          contact: resolved.traveller,
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
        quotationUrl: data.quotationUrl,
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
          recipientEmail: deliveryEmail,
          recipientPhone: deliveryPhone,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not prepare the brochure.");
      if (data.shareUrl) {
        window.open(data.shareUrl, "_blank", "noopener,noreferrer");
        setDeliveryMessage("WhatsApp opened with both document links ready to send.");
      } else if (data.delivered) {
        setDeliveryMessage(`Quotation and brochure sent successfully to ${deliveryEmail}.`);
      } else if (data.mailtoUrl) {
        window.location.assign(data.mailtoUrl);
        setDeliveryMessage(
          "Your email draft is ready. Both secure document links are included."
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
        <div className="overflow-hidden border border-primary/12 bg-white shadow-premium">
          <div className="relative overflow-hidden bg-primary px-6 py-12 text-center text-white sm:px-10 sm:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(254,209,79,0.16),transparent_60%)]"
            />
            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[6px] bg-emerald-400/15 text-emerald-300">
                <Check size={30} strokeWidth={3} />
              </div>
              <Eyebrow tone="gold" className="mt-6">
                Proposal created
              </Eyebrow>
              <h1 className="mt-3 font-heading text-3xl font-extrabold leading-[1.1] tracking-[-0.025em] sm:text-[2.5rem]">
                Your quotation and brochure are ready
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/65">
                We saved your request as{" "}
                <strong className="tabular font-bold text-white">{result.code}</strong> and
                generated quotation{" "}
                <strong className="tabular font-bold text-white">{result.quotationNumber}</strong>.
                Our team will verify live availability before final confirmation.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_340px]">
            <div className="p-6 sm:p-10">
              <Eyebrow>Ready to download</Eyebrow>
              <h2 className="mt-2 font-heading text-xl font-bold tracking-[-0.02em] text-primary">
                Your travel documents
              </h2>
              <p className="mt-2 text-sm leading-6 text-foreground-muted">
                Both files use the traveller mix, rooms, names, add-ons and prices you selected.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <article className="flex flex-col border border-primary/12 bg-primary p-5 text-white">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-gold text-primary">
                    <ReceiptText size={19} />
                  </div>
                  <Eyebrow tone="gold" className="mt-5">
                    Commercial summary
                  </Eyebrow>
                  <h3 className="mt-1.5 font-heading text-lg font-bold">Personalised quotation</h3>
                  <p className="mt-2 flex-1 text-xs leading-5 text-white/60">
                    Traveller-wise rates, room plan, advance, balance, validity and commercial notes.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setQuotationPreviewOpen(true)}
                      className="flex min-h-11 items-center justify-center gap-1.5 rounded-[4px] bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-primary transition-colors duration-300 hover:bg-gold"
                    >
                      <FileText size={14} /> Preview
                    </button>
                    <a
                      href={`${result.quotationUrl}&download=1`}
                      className="flex min-h-11 items-center justify-center gap-1.5 rounded-[4px] border border-white/25 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:border-gold hover:text-gold"
                    >
                      <Download size={14} /> Save
                    </a>
                  </div>
                </article>

                <article className="flex flex-col border border-gold/40 bg-sand-light p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-accent text-white">
                    <BookOpen size={19} />
                  </div>
                  <Eyebrow className="mt-5">Journey presentation</Eyebrow>
                  <h3 className="mt-1.5 font-heading text-lg font-bold text-primary">
                    Personalised trip brochure
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-5 text-foreground-muted">
                    Your party, itinerary, highlights, inclusions, pricing and next steps in one
                    keepsake.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBrochurePreviewOpen(true)}
                      className="flex min-h-11 items-center justify-center gap-1.5 rounded-[4px] bg-primary text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-accent"
                    >
                      <FileText size={14} /> Preview
                    </button>
                    <a
                      href={`${result.brochureUrl}&download=1`}
                      className="flex min-h-11 items-center justify-center gap-1.5 rounded-[4px] border border-primary/20 bg-white text-[11px] font-bold uppercase tracking-[0.1em] text-primary transition-colors duration-300 hover:border-accent hover:text-accent"
                    >
                      <Download size={14} /> Save
                    </a>
                  </div>
                </article>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => sendBrochure("email")}
                  disabled={Boolean(sending)}
                  className={`${ctaClass} border border-primary/20 text-primary hover:border-primary hover:bg-primary hover:text-white`}
                >
                  <Mail size={16} /> {sending === "email" ? "Sending…" : "Email both"}
                </button>
                <button
                  type="button"
                  onClick={() => sendBrochure("whatsapp")}
                  disabled={Boolean(sending)}
                  className={`${ctaClass} bg-emerald-600 text-white hover:bg-emerald-700`}
                >
                  <Send size={16} /> {sending === "whatsapp" ? "Opening…" : "Share both"}
                </button>
              </div>

              {deliveryMessage ? (
                <p
                  role="status"
                  className="mt-4 border-l-2 border-emerald-500 bg-emerald-500/[0.07] px-4 py-3 text-sm leading-6 text-emerald-800"
                >
                  {deliveryMessage}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-primary/10 pt-6">
                {user ? (
                  <Link
                    href={`/account/bookings/${result.id}`}
                    className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-dark"
                  >
                    Track this booking →
                  </Link>
                ) : (
                  <Link
                    href="/signup"
                    className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent transition-colors hover:text-accent-dark"
                  >
                    Create an account →
                  </Link>
                )}
                <Link
                  href="/packages"
                  className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary transition-colors hover:text-accent"
                >
                  Browse more packages →
                </Link>
              </div>
            </div>

            <aside className="border-t border-primary/10 bg-sand-light p-6 sm:p-8 lg:border-l lg:border-t-0">
              <Eyebrow tone="muted">Indicative trip total</Eyebrow>
              <p className="tabular mt-2 font-heading text-[2.25rem] font-extrabold leading-none tracking-[-0.03em] text-primary">
                {formatMoney(quote.total)}
              </p>

              <dl className="mt-6 space-y-3 border-t border-primary/10 pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground-muted">Booking advance</dt>
                  <dd className="tabular font-bold text-primary">
                    {formatMoney(quote.depositAmount)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground-muted">Balance</dt>
                  <dd className="tabular font-bold text-primary">
                    {formatMoney(quote.balanceAmount)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-foreground-muted">Travellers</dt>
                  <dd className="tabular font-bold text-primary">{travellerCount}</dd>
                </div>
              </dl>

              <div className="mt-6 grid grid-cols-2 gap-px border-t border-primary/10 bg-primary/10">
                <div className="bg-sand-light p-4 text-center">
                  <strong className="tabular block font-heading text-2xl font-extrabold leading-none text-primary">
                    {travellers.adults}
                  </strong>
                  <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                    Adults
                  </span>
                </div>
                <div className="bg-sand-light p-4 text-center">
                  <strong className="tabular block font-heading text-2xl font-extrabold leading-none text-primary">
                    {travellers.childrenWithBed + travellers.childrenWithoutBed + travellers.infants}
                  </strong>
                  <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted">
                    Children
                  </span>
                </div>
              </div>

              <div className="mt-5 border-t border-primary/10 pt-5">
                <Eyebrow tone="muted">Room plan</Eyebrow>
                <p className="mt-1.5 text-sm font-bold leading-6 text-primary">
                  {[
                    rooms.singleRooms ? `${rooms.singleRooms} single` : "",
                    rooms.doubleRooms ? `${rooms.doubleRooms} double/twin` : "",
                    rooms.tripleRooms ? `${rooms.tripleRooms} triple` : "",
                  ]
                    .filter(Boolean)
                    .join(" + ")}
                </p>
              </div>
            </aside>
          </div>
        </div>

        <PdfPreviewModal
          isOpen={quotationPreviewOpen}
          title={`${snapshot.title} quotation`}
          url={result.quotationUrl}
          downloadUrl={`${result.quotationUrl}&download=1`}
          onClose={() => setQuotationPreviewOpen(false)}
        />
        <PdfPreviewModal
          isOpen={brochurePreviewOpen}
          title={`${snapshot.title} brochure`}
          url={result.brochureUrl}
          downloadUrl={`${result.brochureUrl}&download=1`}
          onClose={() => setBrochurePreviewOpen(false)}
        />
      </div>
    );
  }

  const meta = STEPS[step];

  return (
    <div className="relative isolate mx-auto max-w-7xl">
      <header className="mb-7">
        <Eyebrow>
          {source === "custom" ? "Your trip · Your pace · Your story" : "Plan · Price · Personalise"}
        </Eyebrow>
        <h1 className="mt-3 max-w-2xl font-heading text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-primary sm:text-[2.75rem]">
          {source === "custom" ? "Let's design a journey around you" : "Build your holiday proposal"}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-foreground-muted sm:text-base">
          {source === "custom"
            ? "Tell us where you want to go, when you want to travel, and how you like to explore. Our travel designer will turn your idea into a considered itinerary."
            : "Shape the trip in five steps and get an instant estimate, quotation and personalised brochure — without paying anything today."}
        </p>

        <ul className="mt-7 grid border-y border-primary/10 sm:grid-cols-3">
          {TRUST.map(([Icon, title, detail], index) => (
            <li
              key={title}
              className={`flex items-center gap-3 py-3.5 sm:px-5 sm:first:pl-0 ${
                index ? "border-t border-primary/10 sm:border-l sm:border-t-0" : ""
              }`}
            >
              <Icon size={16} className="shrink-0 text-accent" aria-hidden="true" />
              <span className="text-[13px] leading-5">
                <strong className="block font-bold text-primary">{title}</strong>
                <span className="text-foreground-muted">{detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </header>

      {source === "custom" ? (
        <div className="mb-5 flex items-start gap-4 border-l-2 border-gold bg-gold/[0.07] px-4 py-4 sm:px-5">
          <span className="tabular mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] bg-primary text-[11px] font-bold text-gold">
            01
          </span>
          <div className="min-w-0">
            <Eyebrow>A real person takes it from here</Eyebrow>
            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-foreground-muted">
              Submit your brief and it goes to our admin desk first. We assign the right travel
              consultant, who will contact you to refine the route and confirm live availability.
            </p>
          </div>
        </div>
      ) : null}

      <StepRail
        step={step}
        estimate={formatMoney(quote.total)}
        onSelect={(index) => {
          setError("");
          setStep(index);
        }}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
        <section className="self-start border border-primary/12 bg-white shadow-premium">
          <header className="border-b border-primary/10 px-5 py-6 sm:px-9 sm:py-7">
            <Eyebrow tone="muted">
              Step {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </Eyebrow>
            <h2 className="mt-2 font-heading text-2xl font-bold tracking-[-0.02em] text-primary">
              {meta.title}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-foreground-muted">
              {meta.description}
            </p>
          </header>

          <div className="px-5 py-7 sm:px-9 sm:py-8">
            {error ? (
              <p
                role="alert"
                className="mb-7 border-l-2 border-accent bg-accent/[0.07] px-4 py-3 text-sm font-medium leading-6 text-accent-dark"
              >
                {error}
              </p>
            ) : null}

            {step === 0 ? (
              <div>
                <div className="grid gap-px border border-primary/12 bg-primary/12 sm:grid-cols-3">
                  {TRIP_TYPES.map(([value, label, hint, Icon]) => {
                    const selected = source === value;
                    return (
                      <button
                        type="button"
                        key={value}
                        onClick={() => selectSource(value)}
                        aria-pressed={selected}
                        className={`p-5 text-left transition-colors duration-200 ${
                          selected ? "bg-primary text-white" : "bg-white hover:bg-sand-light"
                        }`}
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-[4px] ${
                            selected ? "bg-white/10 text-gold" : "bg-sand text-accent"
                          }`}
                        >
                          <Icon size={17} aria-hidden="true" />
                        </span>
                        <strong className="mt-4 block text-sm font-bold">{label}</strong>
                        <span
                          className={`mt-1 block text-xs leading-5 ${
                            selected ? "text-white/60" : "text-foreground-muted"
                          }`}
                        >
                          {hint}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7">
                  {source === "package" ? (
                    <Field label="Select a published package">
                      <Select
                        value={effectiveSelectedId}
                        onChange={(event) => {
                          const id = event.target.value;
                          setSelectedId(id);
                          setDurationLabel(
                            activePackages.find((item) => item.id === id)?.duration || ""
                          );
                        }}
                      >
                        {activePackages.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.title} — {item.duration} — {item.price}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  ) : source === "destination" ? (
                    <Field label="Select a published destination">
                      <Select
                        value={effectiveSelectedId}
                        onChange={(event) => {
                          const id = event.target.value;
                          setSelectedId(id);
                          setDurationLabel(
                            activeDestinations.find((item) => item.id === id)?.duration || ""
                          );
                        }}
                      >
                        {activeDestinations.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} — starting {item.price}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="Preferred destination">
                          <input
                            value={customDestination}
                            onChange={(event) => setCustomDestination(event.target.value)}
                            className={fieldClass}
                            placeholder="e.g. Japan, Ladakh, Europe"
                          />
                        </Field>
                        <Field label="Budget per adult" hint="Indicative — we design around it.">
                          <input
                            type="number"
                            min={5000}
                            step={1000}
                            value={budgetPerAdult}
                            onChange={(event) =>
                              setBudgetPerAdult(Number(event.target.value) || 0)
                            }
                            className={`${fieldClass} tabular`}
                          />
                        </Field>
                      </div>

                      {recentSearches.length > 0 ? (
                        <div className="border border-primary/12 bg-sand-light p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <Eyebrow>Recent searches</Eyebrow>
                              <p className="mt-1.5 text-sm text-foreground-muted">
                                Reuse a destination you looked up recently.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={clearRecentSearches}
                              className="text-[11px] font-bold uppercase tracking-[0.14em] text-foreground-muted transition-colors hover:text-primary"
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
                                className="rounded-[4px] border border-primary/15 bg-white px-3 py-2 text-xs font-semibold text-primary transition-colors duration-200 hover:border-accent hover:text-accent"
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
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Travel date" icon={<CalendarDays size={14} />}>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(event) => setTravelDate(event.target.value)}
                      onClick={openNativeDatePicker}
                      className={`${fieldClass} tabular cursor-pointer`}
                    />
                  </Field>
                  <Field label="Departure city" icon={<MapPin size={14} />}>
                    <input
                      value={departureCity}
                      onChange={(event) => setDepartureCity(event.target.value)}
                      className={fieldClass}
                      placeholder="e.g. Mumbai"
                    />
                  </Field>
                  <Field label="Trip duration" className="sm:col-span-2">
                    <input
                      value={effectiveDuration}
                      onChange={(event) => setDurationLabel(event.target.value)}
                      className={fieldClass}
                      placeholder="6 Nights / 7 Days"
                    />
                  </Field>
                </div>

                {pricing.addons.length > 0 ? (
                  <div className="mt-9 border-t border-primary/10 pt-7">
                    <Eyebrow tone="muted">Optional</Eyebrow>
                    <h3 className="mt-1.5 font-heading text-base font-bold text-primary">
                      Enhancements
                    </h3>
                    <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
                      Added to your estimate as you select them.
                    </p>

                    <div className="mt-4 border border-primary/12">
                      {pricing.addons.map((addon: PackageAddon, index) => {
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
                              <span className="mt-1 block text-xs leading-5 text-foreground-muted">
                                {addon.description}
                              </span>
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
              </div>
            ) : null}

            {step === 2 ? (
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Counter
                    label="Adults"
                    hint="12 years and above"
                    value={travellers.adults}
                    min={1}
                    onChange={(value) =>
                      setTravellers((current) => ({ ...current, adults: value }))
                    }
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
                    onChange={(value) =>
                      setTravellers((current) => ({ ...current, infants: value }))
                    }
                  />
                </div>

                <div className="mt-9 border-t border-primary/10 pt-7">
                  <div className="flex items-center gap-2.5">
                    <BedDouble size={17} className="text-accent" aria-hidden="true" />
                    <h3 className="font-heading text-base font-bold text-primary">
                      Room configuration
                    </h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-foreground-muted">
                    {travellerCount} traveller{travellerCount === 1 ? "" : "s"} · {roomCount} room
                    {roomCount === 1 ? "" : "s"} selected.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Counter
                      label="Single rooms"
                      hint="1 guest"
                      value={rooms.singleRooms}
                      onChange={(value) =>
                        setRooms((current) => ({ ...current, singleRooms: value }))
                      }
                    />
                    <Counter
                      label="Double/Twin"
                      hint="2 guests"
                      value={rooms.doubleRooms}
                      onChange={(value) =>
                        setRooms((current) => ({ ...current, doubleRooms: value }))
                      }
                    />
                    <Counter
                      label="Triple rooms"
                      hint="3 guests"
                      value={rooms.tripleRooms}
                      onChange={(value) =>
                        setRooms((current) => ({ ...current, tripleRooms: value }))
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {step === 3 ? (
              <div>
                <TravellerDetailsStep draft={party} onChange={setParty} user={user} />
                <div className="mt-7 grid gap-5 border-t border-primary/10 pt-7">
                  <Field label="Co-traveller names">
                    <textarea
                      rows={3}
                      value={tripNotes.travellerNames}
                      onChange={(event) =>
                        setTripNotes((current) => ({
                          ...current,
                          travellerNames: event.target.value,
                        }))
                      }
                      className={`${fieldClass} resize-y`}
                      placeholder="One traveller per line; names can also be added later."
                    />
                  </Field>
                  <Field label="Preferences and special requests">
                    <textarea
                      rows={4}
                      value={tripNotes.requirements}
                      onChange={(event) =>
                        setTripNotes((current) => ({
                          ...current,
                          requirements: event.target.value,
                        }))
                      }
                      className={`${fieldClass} resize-y`}
                      placeholder="Hotel category, meals, accessibility, celebrations, preferred pace…"
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div>
                <dl className="grid gap-px border border-primary/12 bg-primary/12 sm:grid-cols-2">
                  <div className="bg-white p-4 sm:p-5">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-light">
                      Travelling
                    </dt>
                    <dd className="mt-1.5 text-sm font-bold text-primary">
                      {resolved.traveller.name}
                    </dd>
                    <dd className="mt-1 break-words text-xs leading-5 text-foreground-muted">
                      {deliveryEmail} · {deliveryPhone}
                    </dd>
                  </div>
                  <div className="bg-white p-4 sm:p-5">
                    <dt className="text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-light">
                      Party
                    </dt>
                    <dd className="mt-1.5 text-sm font-bold text-primary">
                      {travellerCount} traveller{travellerCount === 1 ? "" : "s"} · {roomCount} room
                      {roomCount === 1 ? "" : "s"}
                    </dd>
                    <dd className="mt-1 text-xs leading-5 text-foreground-muted">
                      Booked in your own name
                    </dd>
                  </div>
                </dl>

                <div className="mt-5 border border-primary/12">
                  <div className="grid grid-cols-[minmax(0,1fr)_3.5rem_6.5rem] items-center gap-3 border-b border-primary/10 bg-sand-light px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-foreground-muted sm:px-5 sm:grid-cols-[minmax(0,1fr)_4rem_7.5rem]">
                    <span>Item</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Amount</span>
                  </div>
                  {quote.lineItems.map((item) => (
                    <div
                      key={item.key}
                      className="grid grid-cols-[minmax(0,1fr)_3.5rem_6.5rem] items-center gap-3 border-b border-primary/10 px-4 py-3.5 text-sm sm:px-5 sm:grid-cols-[minmax(0,1fr)_4rem_7.5rem]"
                    >
                      <span className="font-semibold text-primary">{item.label}</span>
                      <span className="tabular text-center text-foreground-muted">
                        {item.quantity}
                      </span>
                      <strong className="tabular text-right font-bold text-primary">
                        {formatMoney(item.amount)}
                      </strong>
                    </div>
                  ))}
                  <div className="flex flex-wrap items-end justify-between gap-4 bg-primary px-4 py-5 text-white sm:px-5">
                    <div>
                      <Eyebrow tone="gold">Indicative total</Eyebrow>
                      <p className="mt-1.5 text-xs text-white/60">
                        {travellerCount} traveller{travellerCount === 1 ? "" : "s"} ·{" "}
                        {effectiveDuration}
                      </p>
                    </div>
                    <strong className="tabular font-heading text-2xl font-extrabold leading-none tracking-[-0.02em]">
                      {formatMoney(quote.total)}
                    </strong>
                  </div>
                </div>

                <div className="mt-4 grid gap-px border border-primary/12 bg-primary/12 sm:grid-cols-2">
                  <div className="bg-sand-light p-4 sm:p-5">
                    <span className="text-xs text-foreground-muted">
                      Booking advance ({quote.depositPercent}%)
                    </span>
                    <strong className="tabular mt-1.5 block font-heading text-lg font-extrabold text-primary">
                      {formatMoney(quote.depositAmount)}
                    </strong>
                  </div>
                  <div className="bg-sand-light p-4 sm:p-5">
                    <span className="text-xs text-foreground-muted">Balance after advance</span>
                    <strong className="tabular mt-1.5 block font-heading text-lg font-extrabold text-primary">
                      {formatMoney(quote.balanceAmount)}
                    </strong>
                  </div>
                </div>

                <div className="mt-6 border border-primary/12">
                  <CheckRow checked={termsAccepted} onChange={setTermsAccepted}>
                    <span className="text-xs leading-6 text-foreground-muted">
                      I confirm the traveller information is correct. I understand this is an
                      indicative quotation subject to live availability, and I accept the booking,
                      amendment and cancellation terms that will be confirmed before payment.
                    </span>
                  </CheckRow>
                </div>

                <p className="mt-4 flex items-start gap-2.5 border-l-2 border-emerald-500 bg-emerald-500/[0.07] px-4 py-3 text-xs leading-6 text-emerald-800">
                  <ShieldCheck size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                  No payment is collected at this stage. The agent validates inventory first.
                </p>
              </div>
            ) : null}
          </div>

          <footer className="flex items-center justify-between gap-3 border-t border-primary/10 bg-sand-light/60 px-5 py-5 sm:px-9">
            <button
              type="button"
              onClick={() => {
                setError("");
                setStep((value) => Math.max(0, value - 1));
              }}
              disabled={step === 0}
              className="inline-flex min-h-12 items-center gap-2 px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary transition-colors duration-300 hover:text-accent disabled:invisible"
            >
              <ArrowLeft size={15} /> Back
            </button>
            {step < LAST_STEP ? (
              <button
                type="button"
                onClick={next}
                className={`${ctaClass} bg-primary text-white hover:bg-gold hover:text-primary`}
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => submit()}
                disabled={submitting}
                className={`${ctaClass} bg-accent text-white hover:bg-accent-dark`}
              >
                {submitting
                  ? source === "custom"
                    ? "Creating proposal…"
                    : "Creating booking…"
                  : source === "custom"
                    ? "Create quotation"
                    : "Book now"}{" "}
                {source === "custom" ? <FileText size={15} /> : <Check size={15} />}
              </button>
            )}
          </footer>
        </section>

        <aside className="space-y-5 lg:sticky lg:top-32 lg:self-start">
          <SummaryCard snapshot={snapshot} image={selectedImage} duration={effectiveDuration} />

          <div className="border border-primary/12 bg-primary text-white shadow-premium">
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <Eyebrow tone="gold">Live estimate</Eyebrow>
                <Users size={16} className="text-gold" aria-hidden="true" />
              </div>
              <p className="tabular mt-3 font-heading text-[2.25rem] font-extrabold leading-none tracking-[-0.03em]">
                {formatMoney(quote.total)}
              </p>
              <p className="mt-2 text-xs text-white/55">
                for {travellerCount} traveller{travellerCount === 1 ? "" : "s"}
              </p>

              <dl className="mt-6 space-y-3 border-t border-white/10 pt-5 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Advance estimate</dt>
                  <dd className="tabular font-bold text-gold">
                    {formatMoney(quote.depositAmount)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/60">Room plan</dt>
                  <dd className="tabular font-bold text-white">
                    {roomCount} room{roomCount === 1 ? "" : "s"}
                  </dd>
                </div>
              </dl>
            </div>
            <p className="border-t border-white/10 bg-white/[0.04] px-6 py-4 text-[11px] leading-6 text-white/55">
              No payment now. Your travel consultant verifies live availability and supplier rates
              first.
            </p>
          </div>
        </aside>
      </div>

      <InlineAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={async () => {
          setShowAuthModal(false);
          await refreshAuth();
          await submit({ skipAuthGate: true });
        }}
      />
    </div>
  );
}
