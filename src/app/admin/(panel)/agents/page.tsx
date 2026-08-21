"use client";

import React, { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import type { PublicAgent } from "@/lib/auth/agents";

const emptyForm = { name: "", email: "", phone: "", password: "" };

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    fetch("/api/admin/agents", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setAgents(data.agents || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Could not create the agent.");
        return;
      }
      setNotice(`Agent account created for ${form.email}. Share the login details securely.`);
      setForm(emptyForm);
      refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = async (agent: PublicAgent) => {
    const status = agent.status === "active" ? "inactive" : "active";
    await fetch(`/api/admin/agents/${agent.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agents"
        description="Create agent accounts and issue their portal login credentials. Agents cannot register themselves."
      />

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Issue Agent Credentials</h2>
        <p className="mb-5 mt-1 text-sm text-foreground-muted">
          Set the agent&apos;s email and password, then share both with them securely.
        </p>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="space-y-1.5 text-sm font-semibold text-primary">
            Full name
            <input
              name="name"
              required
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Agent's full name"
              className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-normal sm:text-sm"
            />
          </label>
          <label className="space-y-1.5 text-sm font-semibold text-primary">
            Login email
            <input
              name="email"
              type="email"
              required
              autoComplete="off"
              value={form.email}
              onChange={handleChange}
              placeholder="agent@example.com"
              className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-normal sm:text-sm"
            />
          </label>
          <label className="space-y-1.5 text-sm font-semibold text-primary">
            Phone <span className="font-normal text-foreground-muted">(optional)</span>
            <input
              name="phone"
              type="tel"
              autoComplete="off"
              value={form.phone}
              onChange={handleChange}
              placeholder="Agent's phone number"
              className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-normal sm:text-sm"
            />
          </label>
          <label className="space-y-1.5 text-sm font-semibold text-primary">
            Login password
            <input
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              aria-describedby="agent-password-help"
              className="block w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-base font-normal sm:text-sm"
            />
            <span id="agent-password-help" className="block text-xs font-normal text-foreground-muted">
              The agent will use this password on the private agent sign-in page.
            </span>
          </label>
          {error && <p role="alert" className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          {notice && (
            <p role="status" className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {notice}
            </p>
          )}
          <div className="sm:col-span-2">
            <PrimaryButton type="submit" variant="navy" size="md" isLoading={busy}>
              Create Agent Account
            </PrimaryButton>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <p className="p-6 text-sm text-foreground-muted">Loading…</p>
        ) : agents.length === 0 ? (
          <p className="p-6 text-sm text-foreground-muted">No agents yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-foreground-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold text-primary">{agent.name}</td>
                  <td className="px-4 py-3">{agent.email}</td>
                  <td className="px-4 py-3">{agent.phone || "—"}</td>
                  <td className="px-4 py-3 capitalize">{agent.status}</td>
                  <td className="px-4 py-3 text-right">
                    <SecondaryButton size="sm" variant="ghost" onClick={() => toggleStatus(agent)}>
                      {agent.status === "active" ? "Deactivate" : "Activate"}
                    </SecondaryButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
