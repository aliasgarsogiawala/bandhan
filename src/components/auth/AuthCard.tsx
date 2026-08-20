"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { BriefcaseBusiness, UserRound } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

type Mode = "signin" | "signup";
type SignInRole = "customer" | "agent";

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

export function AuthCard({
  mode,
  defaultRole = "customer",
}: {
  mode: Mode;
  defaultRole?: SignInRole;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";
  const copy = COPY[mode];
  const [role, setRole] = useState<SignInRole>(() =>
    mode === "signin" && (params.get("role") === "agent" || defaultRole === "agent")
      ? "agent"
      : "customer"
  );

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const selectRole = (nextRole: SignInRole) => {
    setRole(nextRole);
    setError("");
    setForm((current) => ({ ...current, password: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const isAgentSignIn = mode === "signin" && role === "agent";
      const payload = mode === "signup" ? form : { email: form.email, password: form.password };
      const res = await fetch(isAgentSignIn ? "/api/agent/login" : copy.endpoint, {
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
      const destination = isAgentSignIn
        ? from.startsWith("/agent")
          ? from
          : "/agent"
        : from.startsWith("/") && !from.startsWith("/agent") && !from.startsWith("/admin")
          ? from
          : "/";
      router.replace(destination);
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
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=90&w=3200"
        alt="A traveler taking in the view"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Brand gradient overlay for contrast + a soft gold glow */}
      <div className="absolute inset-0 bg-ink-deep/70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(254,209,79,0.18),transparent_45%)]" />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="flex justify-center mb-6">
          <Image src="/logo.svg" alt="Bandhan Tours" width={150} height={55} className="h-11 w-auto object-contain" priority />
        </Link>

        <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold font-heading text-primary">
              {mode === "signin" ? "Sign in to Bandhan" : copy.title}
            </h1>
            <p className="text-sm text-foreground-muted mt-1">
              {mode === "signin"
                ? role === "agent"
                  ? "Access assigned enquiries, quotations, and bookings."
                  : "Manage your enquiries, travellers, and bookings."
                : copy.subtitle}
            </p>
          </div>

          {mode === "signin" && (
            <div
              role="tablist"
              aria-label="Choose account type"
              className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5"
            >
              <button
                type="button"
                role="tab"
                aria-selected={role === "customer"}
                onClick={() => selectRole("customer")}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  role === "customer"
                    ? "bg-white text-primary shadow-sm"
                    : "text-foreground-muted hover:text-primary"
                }`}
              >
                <UserRound size={17} aria-hidden="true" />
                Customer
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={role === "agent"}
                onClick={() => selectRole("agent")}
                className={`flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  role === "agent"
                    ? "bg-primary text-white shadow-sm"
                    : "text-foreground-muted hover:text-primary"
                }`}
              >
                <BriefcaseBusiness size={17} aria-hidden="true" />
                Agent
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary uppercase tracking-wide">Full Name</label>
                <input type="text" required autoComplete="name" value={form.name} onChange={update("name")} placeholder="Your name" className={inputClass} />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-primary uppercase tracking-wide">
                {mode === "signin" && role === "agent" ? "Agent Email" : "Email"}
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                placeholder={mode === "signin" && role === "agent" ? "you@bandhantours.com" : "name@example.com"}
                className={inputClass}
              />
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
              {mode === "signin" && role === "agent" ? "Sign In as Agent" : copy.cta}
            </PrimaryButton>
          </form>

          {(mode === "signup" || role === "customer") && (
            <p className="text-center text-sm text-foreground-muted mt-6">
              {copy.altText}{" "}
              <Link href={copy.altHref} className="font-semibold text-accent hover:text-accent-dark">
                {copy.altLabel}
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-foreground-light mt-6">
          <Link href="/" className="hover:text-primary transition-colors">← Back to site</Link>
        </p>
      </div>
    </main>
  );
}

export default AuthCard;
