"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/agent";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/agent/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed.");
        setLoading(false);
        return;
      }
      router.replace(from.startsWith("/agent") ? from : "/agent");
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
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold font-heading text-primary">Agent Portal</h1>
          <p className="text-sm text-foreground-muted mt-1">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">Email</label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@bandhantours.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-primary uppercase tracking-wide">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

export default function AgentLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-sand px-4 py-12">
      <Suspense fallback={<div className="text-foreground-muted text-sm">Loading…</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
