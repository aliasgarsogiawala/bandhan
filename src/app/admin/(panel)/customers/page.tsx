"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/admin/PageHeader";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";
import type { CustomerSummary, CustomerDetail } from "@/lib/admin/customers";

function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CHANNEL_STYLES: Record<string, string> = {
  email: "bg-blue-50 text-blue-600 border-blue-200",
  whatsapp: "bg-emerald-50 text-emerald-600 border-emerald-200",
  "in-app": "bg-slate-100 text-slate-500 border-slate-200",
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<CustomerDetail | null>(null);

  useEffect(() => {
    fetch("/api/admin/customers", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!openId) return;
    let cancelled = false;
    fetch(`/api/admin/customers/${openId}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setDetail(data.customer || null);
      });
    return () => {
      cancelled = true;
    };
  }, [openId]);

  // The fetched detail lags a click behind openId; only treat it as ready
  // when it matches the currently open customer (otherwise show a loader).
  const activeDetail = detail && detail.id === openId ? detail : null;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Registered customers, their bookings, and communication records."
      />

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full sm:max-w-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm text-primary bg-white"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand/60 border-b border-slate-100 text-left">
                {["Customer", "Bookings", "Last Booking", "Joined", "Actions"].map((h) => (
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-foreground-muted">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-foreground-muted">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-sand/40 transition-colors cursor-pointer"
                    onClick={() => setOpenId(c.id)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-primary">{c.name}</p>
                      <p className="text-xs text-foreground-muted">{c.email}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{c.bookings_count}</td>
                    <td className="px-4 py-3 text-foreground-muted whitespace-nowrap text-xs">
                      {formatDate(c.last_booking_at)}
                    </td>
                    <td className="px-4 py-3 text-foreground-muted whitespace-nowrap text-xs">
                      {formatDate(c.created_at)}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(ev) => ev.stopPropagation()}>
                      <button
                        onClick={() => setOpenId(c.id)}
                        className="text-xs font-semibold text-primary hover:text-accent px-2 py-1"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-foreground-light mt-3">
        Showing {filtered.length} of {customers.length} customers.
      </p>

      {/* Detail drawer */}
      {openId && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-primary/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setOpenId(null)}
        >
          <div
            className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-primary text-white px-6 py-5 flex items-start justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-gold font-bold">Customer Profile</span>
                <h3 className="text-xl font-bold font-heading mt-1">{activeDetail?.name ?? "Loading…"}</h3>
              </div>
              <button
                onClick={() => setOpenId(null)}
                className="p-2 text-white/70 hover:text-white rounded-full hover:bg-white/10"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {!activeDetail ? (
              <p className="p-6 text-sm text-foreground-muted">Loading customer…</p>
            ) : (
              <div className="p-6 space-y-6">
                {/* Profile */}
                <dl className="space-y-3 text-sm">
                  {[
                    ["Email", activeDetail.email],
                    ["Phone", activeDetail.phone || "—"],
                    ["Joined", formatDate(activeDetail.created_at)],
                    ["Total Bookings", String(activeDetail.bookings_count)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-3">
                      <dt className="w-32 flex-shrink-0 text-foreground-muted">{label}</dt>
                      <dd className="font-medium text-primary break-words min-w-0">{value}</dd>
                    </div>
                  ))}
                </dl>

                {/* Bookings */}
                <div>
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-2">
                    Bookings & Requests
                  </p>
                  {activeDetail.bookings.length === 0 ? (
                    <p className="text-sm text-foreground-muted">No bookings yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeDetail.bookings.map((b) => (
                        <Link
                          key={b.id}
                          href={`/admin/bookings/${b.id}`}
                          className="block rounded-xl border border-slate-100 bg-sand/40 p-3 hover:border-accent/40 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-accent text-sm">{b.booking_code}</span>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border bg-white text-primary border-slate-200">
                              {BOOKING_STATUS_LABELS[b.status]}
                            </span>
                          </div>
                          <p className="text-sm text-primary mt-1">
                            {b.package_title || b.destination || "Custom request"}
                          </p>
                          <p className="text-xs text-foreground-muted mt-0.5 capitalize">
                            {b.type} · {formatDate(b.created_at)}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Communication records */}
                <div>
                  <p className="text-xs font-semibold text-foreground-muted uppercase tracking-wide mb-2">
                    Communication Records
                  </p>
                  {activeDetail.communications.length === 0 ? (
                    <p className="text-sm text-foreground-muted">No messages logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {activeDetail.communications.map((m) => (
                        <div key={m.id} className="rounded-xl border border-slate-100 p-3">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                                CHANNEL_STYLES[m.channel] || CHANNEL_STYLES["in-app"]
                              }`}
                            >
                              {m.channel}
                            </span>
                            <span className="text-[11px] text-foreground-muted">{formatDateTime(m.created_at)}</span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">{m.message}</p>
                          <p className="text-[11px] text-foreground-light mt-1">Re: {m.booking_code}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <a
                  href={`mailto:${activeDetail.email}`}
                  className="block text-center px-4 py-2.5 rounded-full bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
                >
                  Email {activeDetail.name.split(" ")[0]}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
