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
      <PageHeader title="Agents" description="Create and manage agent portal accounts." />

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary mb-4">New Agent</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (optional)"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            placeholder="Temporary password"
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm"
          />
          {error && <p className="sm:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="sm:col-span-2">
            <PrimaryButton type="submit" variant="navy" size="md" isLoading={busy}>
              Create Agent
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
