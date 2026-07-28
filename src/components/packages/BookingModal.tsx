"use client";

import React, { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageId?: string;
  packageTitle: string;
  departureId?: string;
  initialTravelDate?: string;
  seatsLeft?: number;
}

const initialForm = {
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  travelDate: "",
  travellersCount: "2",
  travellerNames: "",
  specialRequirements: "",
};

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  packageId,
  packageTitle,
  departureId,
  initialTravelDate,
  seatsLeft,
}) => {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [wasOpen, setWasOpen] = useState(false);

  // Reset the form the moment the modal opens — same pattern as EnquiryModal.
  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setForm({ ...initialForm, travelDate: initialTravelDate || "" });
    setError("");
    setBookingCode(null);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "standard",
          packageId,
          packageTitle,
          departureId,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-scale-up">
        <div className="bg-primary px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/75 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <span className="text-xs uppercase tracking-widest text-gold font-bold mb-1 block">
            Book This Tour
          </span>
          <h3 className="text-2xl font-bold font-heading">{packageTitle}</h3>
          <p className="text-sm text-slate-300 font-sans mt-1">
            Share your travel details — our team confirms pricing and availability within 24 hours.
          </p>
        </div>

        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto">
          {typeof seatsLeft === "number" && seatsLeft <= 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-lg font-bold text-primary">This departure is sold out.</p>
              <p className="text-sm text-foreground-muted max-w-sm mx-auto">
                All seats for this batch have been booked. Get in touch and we&apos;ll let you
                know as soon as another departure opens up.
              </p>
              <div className="pt-2">
                <PrimaryButton variant="navy" onClick={onClose} size="md" className="mx-auto">
                  Close Window
                </PrimaryButton>
              </div>
            </div>
          ) : bookingCode ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-scale-up">
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
              <h4 className="text-xl font-bold text-primary font-heading">
                Booking Request Received!
              </h4>
              <p className="text-foreground-muted font-sans text-sm max-w-sm mx-auto">
                Your reference number is
              </p>
              <p className="text-2xl font-extrabold text-primary font-heading tracking-wide">
                {bookingCode}
              </p>
              <p className="text-foreground-muted font-sans text-sm max-w-sm mx-auto">
                Our travel team will verify pricing and availability, then reach out to confirm.
                Track this booking anytime from your account.
              </p>
              <div className="pt-4">
                <PrimaryButton variant="navy" onClick={onClose} size="md" className="mx-auto">
                  Close Window
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Full Name</label>
                  <input
                    type="text"
                    name="contactName"
                    required
                    value={form.contactName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Phone Number</label>
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
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary uppercase">Email Address</label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  value={form.contactEmail}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Travel Date</label>
                  <input
                    type="text"
                    name="travelDate"
                    required
                    value={form.travelDate}
                    onChange={handleChange}
                    placeholder="E.g. 12 October 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Number of Travellers</label>
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
                <label className="text-xs font-semibold text-primary uppercase">Traveller Names</label>
                <textarea
                  name="travellerNames"
                  rows={2}
                  value={form.travellerNames}
                  onChange={handleChange}
                  placeholder="One per line, e.g. Rohan Shah, Priya Shah"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary uppercase">Special Requests</label>
                <textarea
                  name="specialRequirements"
                  rows={3}
                  value={form.specialRequirements}
                  onChange={handleChange}
                  placeholder="Food preferences, hotel category, accessibility needs…"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                />
              </div>

              <div className="pt-2">
                <PrimaryButton type="submit" variant="coral" isLoading={isSubmitting} fullWidth size="md">
                  Submit Booking Request
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
