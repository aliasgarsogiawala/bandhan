"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.replace(from.startsWith("/admin") ? from : "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-8 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary text-gold flex items-center justify-center mb-4 shadow-inner">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-heading text-primary">Admin Panel</h1>
          <p className="text-sm text-foreground-muted mt-1">Sign in to manage Bandhan Tours</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">
              Password
            </label>
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
            />
          </div>

          {error && (
            <p className="text-sm text-accent-dark bg-accent/10 border border-accent/20 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <PrimaryButton type="submit" variant="navy" fullWidth size="md" isLoading={loading}>
            Sign In
          </PrimaryButton>
        </form>
      </div>

      <p className="text-center text-xs text-foreground-light mt-6">
        Protected area. Unauthorized access is prohibited.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-primary">
      <Image
        src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=85&w=2200"
        alt="The Taj Mahal at sunrise"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/70 to-primary/35" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-6xl items-center gap-12 px-5 py-12 lg:grid-cols-[1fr_430px] lg:px-8">
        <div className="hidden max-w-xl text-white lg:block">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Bandhan Tours · Back office</span>
          <h2 className="mt-5 font-heading text-5xl font-extrabold leading-tight">Manage every journey from one place.</h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-200">Packages, enquiries, customers, departures, and website content—securely managed by the Bandhan team.</p>
          <div className="mt-10 h-px w-24 bg-gold" />
        </div>
        <div className="flex justify-center lg:justify-end">
          <Suspense fallback={<div className="text-sm text-white/70">Loading…</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
