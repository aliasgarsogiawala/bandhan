"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { store } from "@/lib/admin/store";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultDestination = "",
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: defaultDestination,
    travelMonth: "",
    guests: "2",
    message: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wasOpen, setWasOpen] = useState(false);

  // Reset the form and seed the destination the moment the modal opens.
  // Adjusting state during render (not in an effect) is the React-recommended
  // pattern for reacting to a prop change without an extra render pass.
  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setFormData((prev) => ({ ...prev, destination: defaultDestination }));
    setSubmitted(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Persist the lead to the admin store (localStorage-backed).
    store.add("enquiries", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      destination: formData.destination,
      travelMonth: formData.travelMonth,
      guests: formData.guests,
      message: formData.message,
      source: "enquiry-modal",
      status: "new",
      createdAt: new Date().toISOString(),
    });

    // Simulate network latency before showing the success state.
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        destination: "",
        travelMonth: "",
        guests: "2",
        message: "",
      });
    }, 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/45 p-0 backdrop-blur-md animate-fade-in sm:p-4">
      <div className="relative flex h-[100dvh] max-h-[100dvh] w-full max-w-lg flex-col overflow-hidden border border-slate-100 bg-white shadow-2xl sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-3xl sm:animate-scale-up" role="dialog" aria-modal="true" aria-labelledby="enquiry-modal-title">
        
        {/* Header decoration */}
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
            Custom Holiday Planner
          </span>
          <h3 id="enquiry-modal-title" className="pr-10 font-heading text-xl font-bold sm:text-2xl">Enquire About Your Trip</h3>
          <p className="text-sm text-slate-300 font-sans mt-1">
            Let our destination specialists craft your dream itinerary.
          </p>
        </div>

        {/* Modal body */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-5 sm:max-h-[75vh] sm:p-6 md:p-8">
          {submitted ? (
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
                Thank You for Enquiring!
              </h4>
              <p className="text-foreground-muted font-sans text-sm max-w-sm mx-auto">
                We have received your request. One of our travel designers will call or email you within 24 hours.
              </p>
              <div className="pt-4">
                <PrimaryButton variant="navy" onClick={onClose} size="md" className="mx-auto">
                  Close Window
                </PrimaryButton>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
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
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Destination</label>
                  <input
                    type="text"
                    name="destination"
                    required
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Where do you want to go?"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primary uppercase">Travel Month / Date</label>
                  <input
                    type="text"
                    name="travelMonth"
                    required
                    value={formData.travelMonth}
                    onChange={handleChange}
                    placeholder="E.g. October 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary uppercase">Number of Guests</label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                >
                  <option value="1">1 Person</option>
                  <option value="2">2 Persons (Couple)</option>
                  <option value="3">3 - 5 Persons (Family)</option>
                  <option value="6">6+ Persons (Group)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primary uppercase">Special Requests / Message</label>
                <textarea
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Share details like food preferences, hotel categories, or budget limit..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                />
              </div>

              <div className="pt-2">
                <PrimaryButton
                  type="submit"
                  variant="coral"
                  isLoading={isSubmitting}
                  fullWidth
                  size="md"
                >
                  Submit Inquiry
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

export default EnquiryModal;
