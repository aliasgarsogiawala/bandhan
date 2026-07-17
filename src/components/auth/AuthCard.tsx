"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type Mode = "signin" | "signup";

const COPY: Record<Mode, { title: string; subtitle: string; cta: string; endpoint: string; altText: string; altLabel: string; altHref: string }> = {
  signin: {
    title: "Welcome back",
    subtitle: "Sign in to manage your enquiries and bookings.",
    cta: "Sign In",
    endpoint: "/api/auth/login",
    altText: "New to Bandhan Tours?",
    altLabel: "Create an account",
    altHref: "/signup",
  },
  signup: {
    title: "Create your account",
    subtitle: "Save your trips and enquire in a couple of clicks.",
    cta: "Sign Up",
    endpoint: "/api/auth/signup",
    altText: "Already have an account?",
    altLabel: "Sign in",
    altHref: "/signin",
  },
};

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50";

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";
  const copy = COPY[mode];

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload =
        mode === "signup" ? form : { email: form.email, password: form.password };
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
      router.replace(from.startsWith("/") ? from : "/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden selection:bg-accent/20">
      {/* Scenic travel backdrop */}
      <Image
        src="https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=2000"
        alt="A traveler taking in the view"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Brand gradient overlay for contrast + a soft gold glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary-dark/90" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(254,209,79,0.18),transparent_45%)]" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="Bandhan Tours" width={150} height={55} className="h-11 w-auto object-contain" priority />
        </Link>

        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading text-primary">{copy.title}</h1>
            <p className="text-sm text-foreground-muted mt-1">{copy.subtitle}</p>
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

          <p className="text-center text-sm text-foreground-muted mt-6">
            {copy.altText}{" "}
            <Link href={copy.altHref} className="font-semibold text-accent hover:text-accent-dark">
              {copy.altLabel}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-foreground-light mt-6">
          <Link href="/" className="hover:text-primary transition-colors">← Back to site</Link>
        </p>
      </div>
    </main>
  );
}

export default AuthCard;
