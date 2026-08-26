"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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

const fieldClass =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50";

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
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [wasOpen, setWasOpen] = useState(false);

  // Reset the form the moment the modal opens — same pattern as EnquiryModal.
  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setForm({ ...initialForm, travelDate: initialTravelDate || "" });
    setTermsAccepted(false);
    setError("");
    setBookingCode(null);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
          travelDate: form.travelDate,
          travellersCount: form.travellersCount,
          travellerNames: form.travellerNames,
          specialRequirements: form.specialRequirements,
          contact: {
            name: form.contactName,
            email: form.contactEmail,
            phone: form.contactPhone,
          },
          termsAccepted,
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

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/45 p-0 backdrop-blur-md sm:p-4">
      <div className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden border border-slate-100 bg-white shadow-2xl sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
        <div className="relative shrink-0 bg-primary px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-6 sm:py-6">
          <button
            onClick={onClose}
            className="absolute right-2 top-[max(0.5rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
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
          <h3 id="booking-modal-title" className="pr-10 font-heading text-xl font-bold sm:text-2xl">{packageTitle}</h3>
          <p className="text-sm text-slate-300 font-sans mt-1">
            Share your travel details — our team confirms pricing and availability within 24 hours.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 sm:max-h-[75vh] sm:p-6 md:p-8">
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
              <div className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/40 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
                  Your details
                </p>
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
                      className={fieldClass}
                    />
                  </div>
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
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    required
                    value={form.contactEmail}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={fieldClass}
                  />
                </div>
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

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-accent"
                />
                <span className="text-xs leading-relaxed text-foreground-muted">
                  I confirm my details are correct and accept the booking and cancellation
                  terms.
                </span>
              </label>

              <div className="pt-2">
                <PrimaryButton type="submit" variant="coral" isLoading={isSubmitting} fullWidth size="md">
                  Submit Booking Request
                </PrimaryButton>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BookingModal;
