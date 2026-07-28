"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useAuth } from "@/lib/auth/useAuth";
import { contactEnquiryHref } from "@/lib/enquiryLink";

const initialForm = {
  contactPhone: "",
  destination: "",
  travelDate: "",
  travellersCount: "2",
  budget: "",
  specialRequirements: "",
};

export default function PlanTripPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  const enquire = () => router.push(contactEnquiryHref());

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setBookingCode(data.booking.booking_code);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden">
      <Navbar onEnquiryClick={enquire} />

      <main className="flex-1 py-28 sm:py-32">
        <Container className="max-w-2xl">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Custom Holiday Planner
              </span>
              <h1 className="mt-2 text-3xl sm:text-4xl font-heading font-extrabold text-primary">
                Plan Your Own Trip
              </h1>
              <p className="mt-3 text-foreground-muted font-sans text-sm sm:text-base">
                Tell us where you want to go, and our travel designers will build a custom
                itinerary and quote — just for you.
              </p>
            </div>
          </ScrollReveal>

          <div className="bg-white rounded-3xl shadow-premium border border-slate-100/80 p-6 sm:p-8">
            {loading ? (
              <p className="text-center text-sm text-foreground-muted py-10">Loading…</p>
            ) : !user ? (
              <div className="text-center py-10 space-y-4">
                <p className="text-foreground-muted font-sans text-sm">
                  Please sign in to submit a customized trip request.
                </p>
                <Link href="/signin?from=/plan-trip">
                  <PrimaryButton variant="coral" size="md">
                    Sign In to Continue
                  </PrimaryButton>
                </Link>
              </div>
            ) : bookingCode ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-primary font-heading">
                  Request Received!
                </h2>
                <p className="text-2xl font-extrabold text-primary font-heading tracking-wide">
                  {bookingCode}
                </p>
                <p className="text-foreground-muted font-sans text-sm max-w-sm mx-auto">
                  Track this request anytime from your account.
                </p>
                <Link href="/account">
                  <PrimaryButton variant="navy" size="md">
                    Go to My Account
                  </PrimaryButton>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    {error}
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    required
                    value={form.contactPhone}
                    onChange={handleChange}
                    placeholder="E.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">
                    Preferred Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={form.destination}
                    onChange={handleChange}
                    placeholder="Where do you want to go?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-primary uppercase">
                      Travel Dates
                    </label>
                    <input
                      type="text"
                      name="travelDate"
                      required
                      value={form.travelDate}
                      onChange={handleChange}
                      placeholder="E.g. Late October 2026"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-primary uppercase">
                      Number of Travellers
                    </label>
                    <input
                      type="number"
                      name="travellersCount"
                      min={1}
                      required
                      value={form.travellersCount}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">
                    Budget Preference
                  </label>
                  <input
                    type="text"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="E.g. ₹40,000 - ₹60,000 per person"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">
                    Special Requirements
                  </label>
                  <textarea
                    name="specialRequirements"
                    rows={3}
                    value={form.specialRequirements}
                    onChange={handleChange}
                    placeholder="Hotel category, food preferences, accessibility needs…"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>

                <div className="pt-2">
                  <PrimaryButton type="submit" variant="coral" isLoading={isSubmitting} fullWidth size="md">
                    Submit Custom Trip Request
                  </PrimaryButton>
                </div>
              </form>
            )}
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
