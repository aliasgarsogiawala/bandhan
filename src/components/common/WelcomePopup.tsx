"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { submitEnquiry } from "@/lib/admin/store";

// Shown once per browser: the first time someone lands on the site. Closing or
// submitting it sets this flag so it never comes back.
const SEEN_KEY = "bandhan-welcome-popup-seen";
const OPEN_DELAY_MS = 600;
const CLOSE_BUTTON_DELAY_MS = 2000;

const INTERESTS = [
  "Domestic tours",
  "International tours",
  "Honeymoon packages",
  "Group departures",
  "Corporate / MICE",
];

function hasSeenPopup(): boolean {
  try {
    return window.localStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markPopupSeen() {
  try {
    window.localStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage blocked (e.g. private mode) — the popup may show again next visit.
  }
}

type Status = "form" | "submitting" | "done";

export default function WelcomePopup() {
  const pathname = usePathname();
  // Not on staff consoles or the auth pages, where it would cover the form.
  const enabled =
    !pathname?.startsWith("/admin") &&
    !pathname?.startsWith("/agent") &&
    pathname !== "/signin" &&
    pathname !== "/signup";

  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [status, setStatus] = useState<Status>("form");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "" });

  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => {
      if (!hasSeenPopup()) setIsOpen(true);
    }, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  // The close button only appears a couple of seconds after the popup opens.
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => setCanClose(true), CLOSE_BUTTON_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !canClose) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        markPopupSeen();
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, canClose]);

  if (!enabled || !isOpen) return null;

  const close = () => {
    markPopupSeen();
    setIsOpen(false);
  };

  const updateField =
    (field: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        destination: "",
        subject: "Welcome popup sign-up",
        message: form.interest
          ? `Signed up from the welcome popup. Interested in: ${form.interest}.`
          : "Signed up from the welcome popup.",
        source: "welcome-popup",
      });
      markPopupSeen();
      setStatus("done");
      setCanClose(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong. Please try again."
      );
      setStatus("form");
    }
  };

  const inputClass =
    "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-primary transition-colors focus:border-accent focus:outline-none";

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-primary/45 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
      onClick={(event) => {
        if (canClose && event.target === event.currentTarget) close();
      }}
    >
      <div className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl">
        <div className="relative shrink-0 bg-primary px-6 py-6 text-white">
          <button
            type="button"
            onClick={close}
            disabled={!canClose}
            aria-hidden={!canClose}
            tabIndex={canClose ? 0 : -1}
            className={`absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-white/75 transition-opacity duration-300 hover:bg-white/10 hover:text-white ${
              canClose ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-label="Close"
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
          <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-gold">
            Welcome to Bandhan Tours
          </span>
          <h2 id="welcome-popup-title" className="pr-10 font-heading text-2xl font-bold text-white">
            Get Exclusive Travel Deals
          </h2>
          <p className="mt-1 text-sm text-slate-300">
            Share your details and be the first to hear about new departures and special offers.
          </p>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {status === "done" ? (
            <div className="space-y-4 p-6 text-center">
              <p className="text-base font-semibold text-primary">Thank you, {form.name}!</p>
              <p className="text-sm text-foreground-muted">
                Our travel team will be in touch on {form.email} with handpicked offers.
              </p>
              <PrimaryButton variant="coral" size="md" onClick={close} className="mx-auto">
                Start Exploring
              </PrimaryButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              <label className="block text-xs font-semibold uppercase text-primary">
                Full name
                <input
                  required
                  minLength={2}
                  value={form.name}
                  onChange={updateField("name")}
                  autoComplete="name"
                  placeholder="Enter your name"
                  className={inputClass}
                />
              </label>
              <label className="block text-xs font-semibold uppercase text-primary">
                Email address
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={updateField("email")}
                  autoComplete="email"
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </label>
              <label className="block text-xs font-semibold uppercase text-primary">
                Phone number
                <input
                  required
                  type="tel"
                  minLength={6}
                  value={form.phone}
                  onChange={updateField("phone")}
                  autoComplete="tel"
                  placeholder="E.g. +91 98765 43210"
                  className={inputClass}
                />
              </label>
              <label className="block text-xs font-semibold uppercase text-primary">
                I&apos;m interested in
                <select value={form.interest} onChange={updateField("interest")} className={inputClass}>
                  <option value="">Select an option</option>
                  {INTERESTS.map((interest) => (
                    <option key={interest} value={interest}>
                      {interest}
                    </option>
                  ))}
                </select>
              </label>
              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700" role="alert">
                  {error}
                </p>
              )}
              <PrimaryButton
                type="submit"
                variant="coral"
                size="md"
                fullWidth
                isLoading={status === "submitting"}
              >
                Get Travel Deals
              </PrimaryButton>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
