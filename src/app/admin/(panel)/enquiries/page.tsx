"use client";

import React, { useMemo, useState } from "react";
import { store, useCollection } from "@/lib/admin/store";
import type { Enquiry } from "@/lib/admin/types";
import PageHeader from "@/components/admin/PageHeader";

const statusStyles: Record<Enquiry["status"], string> = {
  new: "bg-accent/10 text-accent-dark border-accent/20",
  contacted: "bg-gold/20 text-gold-dark border-gold/30",
  closed: "bg-slate-100 text-slate-500 border-slate-200",
};

const statusOrder: Enquiry["status"][] = ["new", "contacted", "closed"];

const sourceLabels: Record<Enquiry["source"], string> = {
  "contact-page": "Contact page",
  "enquiry-modal": "Enquiry form",
  "mice-page": "Corporate / MICE",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function EnquiriesPage() {
  const { items, ready } = useCollection<Enquiry>("enquiries");
  const [filter, setFilter] = useState<"all" | Enquiry["status"]>("all");
  const [open, setOpen] = useState<Enquiry | null>(null);

  const sorted = useMemo(
    () => [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [items]
  );

  const filtered = filter === "all" ? sorted : sorted.filter((e) => e.status === filter);
  const counts = {
    all: items.length,
    new: items.filter((e) => e.status === "new").length,
    contacted: items.filter((e) => e.status === "contacted").length,
    closed: items.filter((e) => e.status === "closed").length,
  };

  const setStatus = (id: string, status: Enquiry["status"]) => {
    store.update<Enquiry>("enquiries", id, { status });
    setOpen((o) => (o && o.id === id ? { ...o, status } : o));
  };

  const remove = (id: string) => {
    if (window.confirm("Delete this enquiry?")) {
      store.remove("enquiries", id);
      setOpen((o) => (o && o.id === id ? null : o));
    }
  };

  return (
    <div>
      <PageHeader title="Enquiries" description="Leads submitted from the website forms." />

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(["all", ...statusOrder] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              filter === key
                ? "bg-primary text-white border-primary"
                : "bg-white text-foreground-muted border-slate-200 hover:border-primary/40"
            }`}
          >
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <span className="ml-1.5 opacity-70">{counts[key]}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand/60 border-b border-slate-100 text-left">
                {["Name", "Destination", "Source", "Received", "Status", "Actions"].map((h) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-semibold text-xs uppercase tracking-wider text-foreground-muted whitespace-nowrap ${
                      h === "Actions" ? "text-right" : ""
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!ready ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-foreground-muted">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-foreground-muted">
                    No enquiries here.
                  </td>
                </tr>
              ) : (
                filtered.map((e) => (
                  <tr
                    key={e.id}
                    className="hover:bg-sand/40 transition-colors cursor-pointer"
                    onClick={() => setOpen(e)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary">{e.name}</p>
                      <p className="text-xs text-foreground-muted">{e.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{e.destination || "—"}</td>
                    <td className="px-4 py-3 text-foreground-muted text-xs">
                      {sourceLabels[e.source] || e.source}
                    </td>
                    <td className="px-4 py-3 text-foreground-muted whitespace-nowrap text-xs">
                      {formatDate(e.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusStyles[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(ev) => ev.stopPropagation()}>
                      <button
                        onClick={() => setOpen(e)}
                        className="text-xs font-semibold text-primary hover:text-accent px-2 py-1"
                      >
                        View
                      </button>
                      <button
                        onClick={() => remove(e.id)}
                        className="text-xs font-semibold text-accent hover:text-accent-dark px-2 py-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary/40 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(null)}>
          <div
            className="w-full max-w-md bg-white h-full overflow-y-auto shadow-2xl animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary text-white px-6 py-5 flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Enquiry Details</span>
                <h3 className="text-xl font-bold font-heading mt-1">{open.name}</h3>
              </div>
              <button onClick={() => setOpen(null)} className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                {statusOrder.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(open.id, s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-colors ${
                      open.status === s ? statusStyles[s] : "bg-white text-foreground-muted border-slate-200 hover:border-primary/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <dl className="space-y-3 text-sm">
                {[
                  ["Email", open.email],
                  ["Phone", open.phone],
                  ["Destination", open.destination],
                  ["Travel Month", open.travelMonth],
                  ["Guests", open.guests],
                  ["Subject", open.subject],
                  ["Source", sourceLabels[open.source] || open.source],
                  ["Received", formatDate(open.createdAt)],
                ]
                  .filter(([, v]) => v)
                  .map(([label, value]) => (
                    <div key={label} className="flex gap-3">
                      <dt className="w-28 flex-shrink-0 text-foreground-muted">{label}</dt>
                      <dd className="font-medium text-primary break-words min-w-0">{value}</dd>
                    </div>
                  ))}
              </dl>

              {open.message && (
                <div>
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-1.5">Message</p>
                  <p className="text-sm text-foreground bg-sand/60 rounded-xl p-4 leading-relaxed whitespace-pre-line">{open.message}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <a
                  href={`mailto:${open.email}`}
                  className="flex-1 text-center px-4 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
                >
                  Reply by Email
                </a>
                <button
                  onClick={() => remove(open.id)}
                  className="px-4 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-primary hover:bg-slate-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
