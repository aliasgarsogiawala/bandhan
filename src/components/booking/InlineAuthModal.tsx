"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Field, fieldClass } from "@/components/booking/fields";

type Mode = "signin" | "signup";

const COPY: Record<Mode, { title: string; cta: string; endpoint: string }> = {
  signin: { title: "Sign in", cta: "Sign in & continue", endpoint: "/api/auth/login" },
  signup: { title: "Create your account", cta: "Sign up & continue", endpoint: "/api/auth/signup" },
};

interface InlineAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void | Promise<void>;
}

export function InlineAuthModal({ open, onClose, onSuccess }: InlineAuthModalProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
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
  }, [open, onClose]);

  if (!open) return null;

  const copy = COPY[mode];
  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = mode === "signup" ? form : { email: form.email, password: form.password };
      const res = await fetch(copy.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }
      setLoading(false);
      await onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-deep/70 p-0 backdrop-blur-sm sm:p-4">
      <div
        className="relative h-[100dvh] max-h-[100dvh] w-full max-w-md overflow-y-auto border-primary/12 bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] shadow-premium sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:rounded-[6px] sm:border sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inline-auth-title"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-2 top-[max(0.5rem,env(safe-area-inset-top))] flex h-11 w-11 items-center justify-center rounded-[4px] text-foreground-muted transition-colors hover:bg-sand hover:text-primary sm:right-4 sm:top-4"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
            One last step
          </span>
          <h2
            id="inline-auth-title"
            className="mt-2 pr-10 font-heading text-xl font-bold tracking-[-0.02em] text-primary"
          >
            {copy.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            Sign in to submit your booking and keep it available in My Account.
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-px border border-primary/12 bg-primary/12">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              aria-pressed={mode === m}
              className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors duration-200 ${
                mode === m
                  ? "bg-primary text-white"
                  : "bg-white text-foreground-muted hover:bg-sand-light hover:text-primary"
              }`}
            >
              {m === "signin" ? "Sign in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === "signup" && (
            <Field label="Full name">
              <input
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
                placeholder="Your name"
                className={fieldClass}
              />
            </Field>
          )}
          <Field label="Email">
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={update("email")}
              placeholder="name@example.com"
              className={fieldClass}
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={form.password}
              onChange={update("password")}
              placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
              className={fieldClass}
            />
          </Field>

          {error && (
            <p
              role="alert"
              className="border-l-2 border-accent bg-accent/[0.07] px-4 py-3 text-sm leading-6 text-accent-dark"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-[4px] bg-primary px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 hover:bg-gold hover:text-primary disabled:cursor-not-allowed disabled:opacity-55"
          >
            {loading ? "Please wait…" : copy.cta}
          </button>
        </form>
      </div>
    </div>,
    document.body,
  );
}

export default InlineAuthModal;
