"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type Mode = "signin" | "signup";

const COPY: Record<Mode, { title: string; cta: string; endpoint: string }> = {
  signin: { title: "Sign in", cta: "Sign In & Continue", endpoint: "/api/auth/login" },
  signup: { title: "Create your account", cta: "Sign Up & Continue", endpoint: "/api/auth/signup" },
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50";

interface InlineAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function InlineAuthModal({ open, onClose, onSuccess }: InlineAuthModalProps) {
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      onSuccess();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-1.5 text-foreground-muted hover:bg-sand hover:text-primary"
        >
          <X size={18} />
        </button>

        <div className="mb-6">
          <h2 className="font-heading text-xl font-bold text-primary">{copy.title}</h2>
          <p className="mt-1.5 text-sm text-foreground-muted">
            Your custom trip details are saved — nothing you&apos;ve entered will be lost.
          </p>
        </div>

        <div className="mb-6 flex gap-1 rounded-full bg-sand p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setError("");
              }}
              className={`flex-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition ${
                mode === m ? "bg-primary text-white shadow" : "text-foreground-muted hover:text-primary"
              }`}
            >
              {m === "signin" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary uppercase tracking-wide">Full Name</label>
              <input type="text" required autoComplete="name" value={form.name} onChange={update("name")} placeholder="Your name" className={inputClass} />
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">Email</label>
            <input type="email" required autoComplete="email" value={form.email} onChange={update("email")} placeholder="name@example.com" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">Password</label>
            <input
              type="password"
              required
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={form.password}
              onChange={update("password")}
              placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
              className={inputClass}
            />
          </div>

          {error && (
            <p className="text-sm text-accent-dark bg-accent/10 border border-accent/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" variant="navy" fullWidth size="md" isLoading={loading}>
            {copy.cta}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
}

export default InlineAuthModal;
