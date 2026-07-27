"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  IndianRupee,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useAuth } from "@/lib/auth/useAuth";
import { contactEnquiryHref } from "@/lib/enquiryLink";

const tripStyles = [
  "Family holiday",
  "Honeymoon",
  "Friends getaway",
  "Senior-friendly",
  "Corporate / group",
  "Pilgrimage",
];

const experienceOptions = [
  "Scenic stays",
  "Local food",
  "Private vehicle",
  "Slow travel",
  "Adventure",
  "Shopping time",
];

const plannerSteps = [
  {
    title: "Share the mood",
    text: "Tell us the destination, pace, stay style and tiny details that matter.",
  },
  {
    title: "Designer review",
    text: "A Bandhan travel designer studies routes, hotels, timing and budget fit.",
  },
  {
    title: "Tracked proposal",
    text: "Your custom request appears in My Account with status updates and documents.",
  },
];

const initialForm = {
  contactPhone: "",
  destination: "",
  travelDate: "",
  travellersCount: "2",
  travellerNames: "",
  budget: "",
  tripStyle: "Family holiday",
  pace: "Balanced",
  stayPreference: "Comfort 3-4 star",
  experiences: [] as string[],
  specialRequirements: "",
};

interface CreatedBooking {
  id: string;
  booking_code: string;
}

type FormState = typeof initialForm;

export default function PlanTripPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState<FormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdBooking, setCreatedBooking] = useState<CreatedBooking | null>(null);

  const enquire = () => router.push(contactEnquiryHref());

  const summary = useMemo(
    () => [
      form.destination || "Destination",
      form.travelDate || "Dates flexible",
      `${form.travellersCount || "0"} travellers`,
      form.budget || "Budget to discuss",
    ],
    [form.budget, form.destination, form.travelDate, form.travellersCount]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleExperience = (experience: string) => {
    setForm((prev) => ({
      ...prev,
      experiences: prev.experiences.includes(experience)
        ? prev.experiences.filter((item) => item !== experience)
        : [...prev.experiences, experience],
    }));
  };

  const buildPlannerNotes = () => {
    const lines = [
      `Trip style: ${form.tripStyle}`,
      `Preferred pace: ${form.pace}`,
      `Stay preference: ${form.stayPreference}`,
      form.experiences.length ? `Experiences: ${form.experiences.join(", ")}` : "",
      form.specialRequirements ? `Notes: ${form.specialRequirements}` : "",
    ].filter(Boolean);

    return lines.join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "customized",
          contactName: user.name,
          contactEmail: user.email,
          contactPhone: form.contactPhone,
          destination: form.destination,
          travelDate: form.travelDate,
          travellersCount: form.travellersCount,
          travellerNames: form.travellerNames,
          budget: form.budget,
          packageTitle: `Custom ${form.destination || "Holiday"} Plan`,
          specialRequirements: buildPlannerNotes(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setCreatedBooking({
        id: data.booking.id,
        booking_code: data.booking.booking_code,
      });
      setForm(initialForm);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-sand">
      <Navbar onEnquiryClick={enquire} />

      <main className="flex-1 py-24 sm:py-28">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.84fr_1.16fr] lg:items-start">
            <ScrollReveal className="lg:sticky lg:top-28">
              <div className="space-y-7">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                    Custom Holiday Planner
                  </span>
                  <h1 className="mt-3 font-heading text-4xl font-extrabold leading-tight text-primary sm:text-5xl">
                    Plan a trip around your people, pace, and budget.
                  </h1>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-foreground-muted sm:text-base">
                    Share the essentials once. Our team turns it into a tracked custom
                    request, then prepares the itinerary, quotation, documents and updates
                    inside your Bandhan account.
                  </p>
                </div>

                <div className="grid gap-3">
                  {plannerSteps.map((step, index) => (
                    <div
                      key={step.title}
                      className="flex gap-4 rounded-2xl border border-white bg-white/70 p-4 shadow-sm"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h2 className="font-heading text-base font-bold text-primary">
                          {step.title}
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-foreground-muted">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-gold/25 bg-primary p-5 text-white shadow-premium">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">
                    What you get
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <span className="inline-flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-gold" aria-hidden="true" />
                      Account tracking
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gold" aria-hidden="true" />
                      Designer follow-up
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-gold" aria-hidden="true" />
                      Flexible dates
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-gold" aria-hidden="true" />
                      Clear quotation
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="overflow-hidden rounded-3xl border border-slate-100/80 bg-white shadow-premium">
                <div className="border-b border-slate-100 bg-primary px-6 py-5 text-white sm:px-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gold">
                        Request scope
                      </p>
                      <h2 className="mt-1 font-heading text-2xl font-bold">
                        Custom trip brief
                      </h2>
                    </div>
                    <div className="hidden text-right text-xs text-white/60 sm:block">
                      {summary.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {loading ? (
                  <p className="py-16 text-center text-sm text-foreground-muted">Loading...</p>
                ) : !user ? (
                  <div className="px-6 py-12 text-center sm:px-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
                      <Users className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <h2 className="mt-5 font-heading text-2xl font-bold text-primary">
                      Sign in to create a tracked custom request.
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground-muted">
                      Custom plans need your account so documents, quotations, and booking
                      updates stay attached to you.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      <Link href="/signin?from=/plan-trip">
                        <PrimaryButton variant="coral" size="md">
                          Sign In to Continue
                        </PrimaryButton>
                      </Link>
                      <Link
                        href="/signup?from=/plan-trip"
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
                      >
                        Create Account
                      </Link>
                    </div>
                  </div>
                ) : createdBooking ? (
                  <div className="px-6 py-12 text-center sm:px-8">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-inner">
                      <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-widest text-accent">
                      Request received
                    </p>
                    <h2 className="mt-2 font-heading text-3xl font-extrabold text-primary">
                      {createdBooking.booking_code}
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-foreground-muted">
                      Your custom trip is now in the Bandhan workflow. You can track
                      status, view documents, and download the request summary anytime.
                    </p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <Link href={`/account/bookings/${createdBooking.id}`}>
                        <PrimaryButton variant="navy" size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                          Track Request
                        </PrimaryButton>
                      </Link>
                      <Link
                        href={`/account/bookings/${createdBooking.id}/quotation`}
                        target="_blank"
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-accent hover:text-accent"
                      >
                        Download Summary
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCreatedBooking(null)}
                      className="mt-6 text-sm font-semibold text-accent hover:text-accent-dark"
                    >
                      Plan another custom trip
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6 p-6 sm:p-8">
                    {error && (
                      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Phone Number" icon={<MessageCircle className="h-4 w-4" />}>
                        <input
                          type="tel"
                          name="contactPhone"
                          required
                          value={form.contactPhone}
                          onChange={handleChange}
                          placeholder="E.g. +91 98765 43210"
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Preferred Destination" icon={<MapPin className="h-4 w-4" />}>
                        <input
                          type="text"
                          name="destination"
                          required
                          value={form.destination}
                          onChange={handleChange}
                          placeholder="Kashmir, Kerala, Bali..."
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Travel Dates" icon={<CalendarDays className="h-4 w-4" />}>
                        <input
                          type="text"
                          name="travelDate"
                          required
                          value={form.travelDate}
                          onChange={handleChange}
                          placeholder="E.g. Late October 2026"
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Number of Travellers" icon={<Users className="h-4 w-4" />}>
                        <input
                          type="number"
                          name="travellersCount"
                          min={1}
                          required
                          value={form.travellersCount}
                          onChange={handleChange}
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <Field label="Traveller Names">
                      <input
                        type="text"
                        name="travellerNames"
                        value={form.travellerNames}
                        onChange={handleChange}
                        placeholder="Optional: names separated by commas"
                        className={inputClass}
                      />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <Field label="Trip Style">
                        <select
                          name="tripStyle"
                          value={form.tripStyle}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          {tripStyles.map((style) => (
                            <option key={style}>{style}</option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Pace">
                        <select
                          name="pace"
                          value={form.pace}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option>Relaxed</option>
                          <option>Balanced</option>
                          <option>Fast-paced</option>
                        </select>
                      </Field>

                      <Field label="Stay Preference">
                        <select
                          name="stayPreference"
                          value={form.stayPreference}
                          onChange={handleChange}
                          className={inputClass}
                        >
                          <option>Comfort 3-4 star</option>
                          <option>Premium 4 star</option>
                          <option>Luxury 5 star</option>
                          <option>Homestay / boutique</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Budget Preference" icon={<IndianRupee className="h-4 w-4" />}>
                      <input
                        type="text"
                        name="budget"
                        value={form.budget}
                        onChange={handleChange}
                        placeholder="E.g. ₹40,000 - ₹60,000 per person"
                        className={inputClass}
                      />
                    </Field>

                    <div>
                      <p className="text-xs font-semibold uppercase text-primary">
                        Experiences to include
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {experienceOptions.map((experience) => {
                          const selected = form.experiences.includes(experience);
                          return (
                            <button
                              key={experience}
                              type="button"
                              onClick={() => toggleExperience(experience)}
                              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                                selected
                                  ? "border-primary bg-primary text-white"
                                  : "border-slate-200 bg-slate-50 text-primary hover:border-accent hover:text-accent"
                              }`}
                              aria-pressed={selected}
                            >
                              {experience}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Field label="Special Requirements">
                      <textarea
                        name="specialRequirements"
                        rows={4}
                        value={form.specialRequirements}
                        onChange={handleChange}
                        placeholder="Hotel category, food preferences, senior citizen needs, anniversary surprise, wheelchair support..."
                        className={inputClass}
                      />
                    </Field>

                    <div className="border-t border-slate-100 pt-2">
                      <PrimaryButton
                        type="submit"
                        variant="coral"
                        isLoading={isSubmitting}
                        fullWidth
                        size="md"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        Submit Custom Trip Request
                      </PrimaryButton>
                      <p className="mt-3 text-center text-xs leading-5 text-foreground-muted">
                        No payment is collected here. This creates a tracked planning request
                        for the Bandhan team.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm font-medium text-primary transition-colors focus:border-accent focus:bg-white focus:outline-none";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
        {icon ? <span className="text-accent">{icon}</span> : null}
        {label}
      </span>
      {children}
    </label>
  );
}
