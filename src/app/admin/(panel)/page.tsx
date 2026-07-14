"use client";

import React from "react";
import Link from "next/link";
import { useCollection } from "@/lib/admin/store";
import type { Enquiry, GroupDeparture } from "@/lib/admin/types";
import PageHeader from "@/components/admin/PageHeader";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const statusStyles: Record<Enquiry["status"], string> = {
  new: "bg-accent/10 text-accent-dark border-accent/20",
  contacted: "bg-gold/20 text-gold-dark border-gold/30",
  closed: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function AdminDashboard() {
  const { items: enquiries } = useCollection<Enquiry>("enquiries");
  const { items: packages } = useCollection("packages");
  const { items: destinations } = useCollection("destinations");
  const { items: departures } = useCollection<GroupDeparture>("departures");
  const { items: testimonials } = useCollection("testimonials");
  const { items: gallery } = useCollection("gallery");

  const newEnquiries = enquiries.filter((e) => e.status === "new").length;
  const seatsLeft = departures.reduce((sum, d) => sum + (d.seatsLeft || 0), 0);

  const stats = [
    { label: "New Enquiries", value: newEnquiries, href: "/admin/enquiries", accent: true },
    { label: "Tour Packages", value: packages.length, href: "/admin/packages" },
    { label: "Destinations", value: destinations.length, href: "/admin/destinations" },
    { label: "Group Departures", value: departures.length, href: "/admin/departures" },
    { label: "Testimonials", value: testimonials.length, href: "/admin/testimonials" },
    { label: "Gallery Images", value: gallery.length, href: "/admin/gallery" },
  ];

  const recent = [...enquiries]
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your enquiries and site content."
        action={
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white text-sm font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
          >
            View live site
          </Link>
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className={`group rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-premium ${
              s.accent ? "bg-primary border-primary text-white" : "bg-white border-slate-100"
            }`}
          >
            <p className={`text-xs font-semibold uppercase tracking-wider ${s.accent ? "text-gold" : "text-foreground-muted"}`}>
              {s.label}
            </p>
            <p className={`text-3xl font-extrabold font-heading mt-2 ${s.accent ? "text-white" : "text-primary"}`}>
              {s.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent enquiries */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-primary">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm font-semibold text-accent hover:text-accent-dark">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-foreground-muted py-8 text-center">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((e) => (
                <li key={e.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-primary truncate">{e.name}</p>
                    <p className="text-xs text-foreground-muted truncate">
                      {e.destination || "—"} · {e.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusStyles[e.status]}`}>
                      {e.status}
                    </span>
                    <span className="text-xs text-foreground-light">{timeAgo(e.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h2 className="font-heading font-bold text-primary mb-4">At a Glance</h2>
          <dl className="space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-foreground-muted">Total enquiries</dt>
              <dd className="font-bold text-primary">{enquiries.length}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-foreground-muted">Awaiting response</dt>
              <dd className="font-bold text-accent">{newEnquiries}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-foreground-muted">Open departure seats</dt>
              <dd className="font-bold text-primary">{seatsLeft}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-foreground-muted">Content items</dt>
              <dd className="font-bold text-primary">
                {packages.length + destinations.length + gallery.length + testimonials.length}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
