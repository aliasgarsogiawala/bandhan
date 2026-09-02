"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Check, X } from "lucide-react";
import { CheckRow, Field, fieldClass } from "@/components/booking/fields";

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

const ctaClass =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[4px] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-55";

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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-deep/60 p-0 backdrop-blur-md sm:p-4">
      <div
        className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden border-primary/12 bg-white shadow-premium sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-[6px] sm:border"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        <header className="relative shrink-0 bg-primary px-5 pb-6 pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-7 sm:py-7">
          <button
            onClick={onClose}
            className="absolute right-2 top-[max(0.5rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-[4px] text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-4 sm:top-4"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            Book this tour
          </span>
          <h3
            id="booking-modal-title"
            className="mt-2 pr-10 font-heading text-xl font-bold leading-tight tracking-[-0.02em] sm:text-2xl"
          >
            {packageTitle}
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Share your travel details — our team confirms pricing and availability within 24 hours.
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6 sm:max-h-[75vh] sm:p-7">
          {typeof seatsLeft === "number" && seatsLeft <= 0 ? (
            <div className="space-y-4 py-8 text-center">
              <p className="font-heading text-lg font-bold text-primary">
                This departure is sold out.
              </p>
              <p className="mx-auto max-w-sm text-sm leading-6 text-foreground-muted">
                All seats for this batch have been booked. Get in touch and we&apos;ll let you know
                as soon as another departure opens up.
              </p>
              <button
                type="button"
                onClick={onClose}
                className={`${ctaClass} bg-primary text-white hover:bg-gold hover:text-primary`}
              >
                Close window
              </button>
            </div>
          ) : bookingCode ? (
            <div className="space-y-4 py-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[6px] bg-emerald-500/12 text-emerald-600">
                <Check size={30} strokeWidth={3} />
              </div>
              <h4 className="font-heading text-xl font-bold tracking-[-0.02em] text-primary">
                Booking request received
              </h4>
              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-muted">
                  Your reference
                </span>
                <p className="tabular mt-1.5 font-heading text-2xl font-extrabold tracking-[-0.01em] text-primary">
                  {bookingCode}
                </p>
              </div>
              <p className="mx-auto max-w-sm text-sm leading-6 text-foreground-muted">
                Our travel team will verify pricing and availability, then reach out to confirm.
                Track this booking anytime from your account.
              </p>
              <button
                type="button"
                onClick={onClose}
                className={`${ctaClass} bg-primary text-white hover:bg-gold hover:text-primary`}
              >
                Close window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p
                  role="alert"
                  className="border-l-2 border-accent bg-accent/[0.07] px-4 py-3 text-sm leading-6 text-accent-dark"
                >
                  {error}
                </p>
              )}

              <fieldset className="border border-primary/12 bg-sand-light/60 p-4 sm:p-5">
                <legend className="px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-foreground-muted">
                  Your details
                </legend>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name">
                    <input
                      type="text"
                      name="contactName"
                      required
                      autoComplete="name"
                      value={form.contactName}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Phone number">
                    <input
                      type="tel"
                      name="contactPhone"
                      required
                      autoComplete="tel"
                      value={form.contactPhone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className={fieldClass}
                    />
                  </Field>
                  <Field label="Email address" className="sm:col-span-2">
                    <input
                      type="email"
                      name="contactEmail"
                      required
                      autoComplete="email"
                      value={form.contactEmail}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className={fieldClass}
                    />
                  </Field>
                </div>
              </fieldset>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Travel date">
                  <input
                    type="text"
                    name="travelDate"
                    required
                    value={form.travelDate}
                    onChange={handleChange}
                    placeholder="e.g. 12 October 2026"
                    className={fieldClass}
                  />
                </Field>
                <Field label="Number of travellers">
                  <input
                    type="number"
                    name="travellersCount"
                    min={1}
                    required
                    value={form.travellersCount}
                    onChange={handleChange}
                    className={`${fieldClass} tabular`}
                  />
                </Field>
              </div>

              <Field label="Traveller names">
                <textarea
                  name="travellerNames"
                  rows={2}
                  value={form.travellerNames}
                  onChange={handleChange}
                  placeholder="One per line, e.g. Rohan Shah, Priya Shah"
                  className={`${fieldClass} resize-y`}
                />
              </Field>

              <Field label="Special requests">
                <textarea
                  name="specialRequirements"
                  rows={3}
                  value={form.specialRequirements}
                  onChange={handleChange}
                  placeholder="Food preferences, hotel category, accessibility needs…"
                  className={`${fieldClass} resize-y`}
                />
              </Field>

              <div className="border border-primary/12">
                <CheckRow checked={termsAccepted} onChange={setTermsAccepted}>
                  <span className="text-xs leading-6 text-foreground-muted">
                    I confirm my details are correct and accept the booking and cancellation terms.
                  </span>
                </CheckRow>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${ctaClass} w-full bg-accent text-white hover:bg-accent-dark`}
              >
                {isSubmitting ? "Submitting…" : "Submit booking request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default BookingModal;
