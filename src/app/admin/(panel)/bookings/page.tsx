"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, CircleDollarSign, Clock3, Plus, RefreshCw, Search, UserRoundCheck, UsersRound, X } from "lucide-react";
import { BOOKING_STATUS_LABELS } from "@/lib/bookings/types";
import type { Booking } from "@/lib/bookings/types";
import type { PublicAgent } from "@/lib/auth/agents";
import { formatMoney, parseMoney } from "@/lib/bookings/pricing";

const STATUS_BADGE: Record<string, string> = {
  new: "bg-slate-100 text-slate-700 border-slate-200",
  reviewing: "bg-amber-50 text-amber-800 border-amber-200",
  quoted: "bg-blue-50 text-blue-800 border-blue-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
  payment_pending: "bg-orange-50 text-orange-800 border-orange-200",
  confirmed: "bg-emerald-100 text-emerald-900 border-emerald-300",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  completed: "bg-primary/10 text-primary border-primary/20",
};

type QueueFilter = "all" | "attention" | "unassigned" | "payment" | "confirmed" | "paid";

const QUEUES: Array<{ value: QueueFilter; label: string }> = [
  { value: "all", label: "All bookings" },
  { value: "attention", label: "Needs attention" },
  { value: "unassigned", label: "Unassigned" },
  { value: "payment", label: "Awaiting payment" },
  { value: "confirmed", label: "Confirmed" },
  { value: "paid", label: "Paid" },
];

async function fetchBookingWorkspace() {
  const [bookingsResponse, agentsResponse] = await Promise.all([
    fetch("/api/admin/bookings", { cache: "no-store" }),
    fetch("/api/admin/agents", { cache: "no-store" }),
  ]);
  const [bookingsData, agentsData] = await Promise.all([bookingsResponse.json(), agentsResponse.json()]);
  if (!bookingsResponse.ok) throw new Error(bookingsData.error || "Could not load bookings.");
  if (!agentsResponse.ok) throw new Error(agentsData.error || "Could not load agents.");
  return { bookings: (bookingsData.bookings || []) as Booking[], agents: (agentsData.agents || []) as PublicAgent[] };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [queue, setQueue] = useState<QueueFilter>("all");
  const [assigningId, setAssigningId] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchBookingWorkspace();
      setBookings(data.bookings);
      setAgents(data.agents);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load bookings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetchBookingWorkspace()
      .then((data) => {
        if (ignore) return;
        setBookings(data.bookings);
        setAgents(data.agents);
      })
      .catch((loadError) => {
        if (!ignore) setError(loadError instanceof Error ? loadError.message : "Could not load bookings.");
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => { ignore = true; };
  }, []);

  const agentMap = useMemo(() => new Map(agents.map((agent) => [agent.id, agent])), [agents]);
  const metrics = useMemo(() => {
    const active = bookings.filter((booking) => !["completed", "cancelled", "rejected"].includes(booking.status));
    const attention = bookings.filter((booking) => ["new", "reviewing", "quoted"].includes(booking.status));
    const unassigned = active.filter((booking) => !booking.agent_id);
    const awaitingPayment = bookings.filter((booking) => ["approved", "payment_pending"].includes(booking.status));
    const received = bookings.filter((booking) => booking.payment_status === "received").reduce((sum, booking) => sum + parseMoney(booking.price_amount || 0), 0);
    return { active: active.length, attention: attention.length, unassigned: unassigned.length, awaitingPayment: awaitingPayment.length, received };
  }, [bookings]);

  const assign = async (bookingId: string, agentId: string) => {
    setAssigningId(bookingId);
    setError("");
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agentId ? { action: "assignTo", agentId } : { action: "unassign" }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Could not update the assignment.");
      await refresh();
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : "Could not update the assignment.");
    } finally {
      setAssigningId("");
    }
  };

  const filtered = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("en-IN");
    return bookings.filter((booking) => {
      if (queue === "attention" && !["new", "reviewing", "quoted"].includes(booking.status)) return false;
      if (queue === "unassigned" && (booking.agent_id || ["completed", "cancelled", "rejected"].includes(booking.status))) return false;
      if (queue === "payment" && !["approved", "payment_pending"].includes(booking.status)) return false;
      if (queue === "confirmed" && booking.status !== "confirmed") return false;
      if (queue === "paid" && booking.payment_status !== "received") return false;
      if (status !== "all" && booking.status !== status) return false;
      if (type !== "all" && booking.type !== type) return false;
      if (!query) return true;
      return [booking.booking_code, booking.package_title, booking.destination, booking.contact_name, booking.contact_email, booking.contact_phone, booking.agent_id ? agentMap.get(booking.agent_id)?.name : undefined].some((value) => value?.toLocaleLowerCase("en-IN").includes(query));
    });
  }, [agentMap, bookings, queue, search, status, type]);

  const clearFilters = () => { setSearch(""); setStatus("all"); setType("all"); setQueue("all"); };
  const hasFilters = Boolean(search || status !== "all" || type !== "all" || queue !== "all");

  return (
    <div className="space-y-6 pb-10">
      <section className="relative overflow-hidden rounded-[28px] bg-primary px-5 py-7 text-white shadow-xl shadow-primary/10 sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-white/5 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/75"><Clock3 size={13} /> Booking operations</span>
            <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Every journey, under control.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">Triage new enquiries, assign owners, confirm pricing, collect payment, and issue travel documents from one workspace.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void refresh()} disabled={loading} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-60"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
            <Link href="/admin/bookings/new" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-accent/90"><Plus size={17} /> Create booking</Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <MetricCard icon={UsersRound} label="Live pipeline" value={String(metrics.active)} detail="Active bookings" active={queue === "all"} onClick={() => setQueue("all")} tone="navy" />
        <MetricCard icon={Clock3} label="Needs attention" value={String(metrics.attention)} detail="New, reviewing or quoted" active={queue === "attention"} onClick={() => setQueue("attention")} tone="amber" />
        <MetricCard icon={UserRoundCheck} label="Unassigned" value={String(metrics.unassigned)} detail="Needs an owner" active={queue === "unassigned"} onClick={() => setQueue("unassigned")} tone="rose" />
        <MetricCard icon={CalendarDays} label="Awaiting payment" value={String(metrics.awaitingPayment)} detail="Approved bookings" active={queue === "payment"} onClick={() => setQueue("payment")} tone="blue" />
        <MetricCard icon={CircleDollarSign} label="Revenue recorded" value={formatMoney(metrics.received)} detail="Payments received" active={queue === "paid"} onClick={() => setQueue("paid")} tone="green" />
      </div>

      <section className="overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div><h2 className="font-heading text-xl font-semibold text-primary">Booking queue</h2><p className="mt-1 text-sm text-foreground-muted">{loading ? "Updating your workspace…" : `${filtered.length} of ${bookings.length} bookings shown`}</p></div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:max-w-3xl xl:grid-cols-[1fr_170px_170px_auto]">
              <label className="relative sm:col-span-2 xl:col-span-1"><span className="sr-only">Search bookings</span><Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search code, guest, trip or agent" className="min-h-11 w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3 text-sm outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10" /></label>
              <label><span className="sr-only">Booking status</span><select value={status} onChange={(event) => setStatus(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-accent"><option value="all">All statuses</option>{Object.entries(BOOKING_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label><span className="sr-only">Booking type</span><select value={type} onChange={(event) => setType(event.target.value)} className="min-h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-accent"><option value="all">All booking types</option><option value="standard">Standard</option><option value="customized">Customized</option></select></label>
              {hasFilters ? <button type="button" onClick={clearFilters} className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-600 transition hover:bg-slate-50"><X size={14} /> Reset</button> : <span className="hidden w-[70px] xl:block" />}
            </div>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">{QUEUES.map((item) => <button key={item.value} type="button" onClick={() => setQueue(item.value)} className={`whitespace-nowrap rounded-full px-3.5 py-2 text-xs font-bold transition ${queue === item.value ? "bg-primary text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{item.label}</button>)}</div>
        </div>

        {error ? <p role="alert" className="m-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
        {loading ? <BookingSkeleton /> : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400"><Search size={21} /></div><h3 className="mt-4 font-heading text-lg font-semibold text-primary">No bookings found</h3><p className="mt-1 text-sm text-foreground-muted">Try a different search or clear the active filters.</p>{hasFilters ? <button type="button" onClick={clearFilters} className="mt-4 text-sm font-bold text-accent hover:underline">Clear all filters</button> : null}</div>
        ) : <BookingResults bookings={filtered} agents={agents} assigningId={assigningId} assign={assign} />}
      </section>
    </div>
  );
}

function BookingResults({ bookings, agents, assigningId, assign }: { bookings: Booking[]; agents: PublicAgent[]; assigningId: string; assign: (bookingId: string, agentId: string) => Promise<void> }) {
  const router = useRouter();
  const openBooking = (event: React.MouseEvent<HTMLElement>, bookingId: string) => {
    if ((event.target as HTMLElement).closest("a, button, select, input, textarea, label")) return;
    router.push(`/admin/bookings/${bookingId}`);
  };
  const openBookingWithKeyboard = (event: React.KeyboardEvent<HTMLElement>, bookingId: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    router.push(`/admin/bookings/${bookingId}`);
  };
  return <>
    <div className="divide-y divide-slate-100 lg:hidden">{bookings.map((booking) => <article key={booking.id} role="link" tabIndex={0} aria-label={`Open ${booking.booking_code}`} onClick={(event) => openBooking(event, booking.id)} onKeyDown={(event) => openBookingWithKeyboard(event, booking.id)} className="cursor-pointer p-4 transition hover:bg-sand/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:p-5">
      <div className="flex items-start justify-between gap-4"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-xs font-bold text-accent">{booking.booking_code}</span><StatusBadge status={booking.status} /></div><h3 className="mt-2 truncate font-heading text-lg font-semibold text-primary">{booking.package_title || booking.destination || "Custom journey"}</h3><p className="mt-1 text-sm text-slate-600">{booking.contact_name} · {booking.travellers_count || 1} traveller{booking.travellers_count === 1 ? "" : "s"}</p></div><Link aria-label={`Open ${booking.booking_code}`} href={`/admin/bookings/${booking.id}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white"><ArrowRight size={17} /></Link></div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-xs"><DataPoint label="Travel" value={formatTravelDate(booking.travel_date)} /><DataPoint label="Value" value={formatBookingValue(booking.price_amount, "Not priced")} /></div>
      <label className="mt-4 block"><span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking owner</span><AgentSelect booking={booking} agents={agents} assigningId={assigningId} assign={assign} /></label>
    </article>)}</div>
    <div className="hidden overflow-x-auto lg:block"><table className="w-full min-w-[980px] text-sm"><thead className="bg-slate-50/80 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500"><tr><th className="px-5 py-3.5">Booking</th><th className="px-5 py-3.5">Journey</th><th className="px-5 py-3.5">Guest</th><th className="px-5 py-3.5">Travel & value</th><th className="px-5 py-3.5">Stage</th><th className="px-5 py-3.5">Owner</th><th className="w-14 px-5 py-3.5"><span className="sr-only">Open</span></th></tr></thead>
      <tbody className="divide-y divide-slate-100">{bookings.map((booking) => <tr key={booking.id} tabIndex={0} aria-label={`Open ${booking.booking_code}`} onClick={(event) => openBooking(event, booking.id)} onKeyDown={(event) => openBookingWithKeyboard(event, booking.id)} className="group cursor-pointer transition hover:bg-sand/25 focus:bg-sand/25 focus:outline-none"><td className="min-w-28 px-5 py-4 align-top"><Link href={`/admin/bookings/${booking.id}`} className="font-mono text-xs font-bold text-accent hover:underline">{booking.booking_code}</Link><span className="mt-1 block text-[10px] font-bold uppercase tracking-wider text-slate-400">{booking.type}</span></td><td className="max-w-[260px] px-5 py-4 align-top"><span className="block truncate font-semibold text-primary">{booking.package_title || booking.destination || "Custom journey"}</span><span className="mt-1 block text-xs text-foreground-muted">{booking.destination || "Destination to confirm"}</span></td><td className="px-5 py-4 align-top"><span className="block font-semibold text-primary">{booking.contact_name}</span><span className="mt-1 block max-w-[190px] truncate text-xs text-foreground-muted">{booking.contact_email}</span></td><td className="px-5 py-4 align-top"><span className="block font-medium text-primary">{formatTravelDate(booking.travel_date)}</span><span className="mt-1 block text-xs text-foreground-muted">{formatBookingValue(booking.price_amount, "Pricing not set")}</span></td><td className="px-5 py-4 align-top"><StatusBadge status={booking.status} /></td><td className="px-5 py-4 align-top"><AgentSelect booking={booking} agents={agents} assigningId={assigningId} assign={assign} /></td><td className="px-5 py-4 align-top"><Link aria-label={`Open ${booking.booking_code}`} href={`/admin/bookings/${booking.id}`} className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition group-hover:border-primary group-hover:bg-primary group-hover:text-white"><ArrowRight size={16} /></Link></td></tr>)}</tbody>
    </table></div>
  </>;
}

function MetricCard({ icon: Icon, label, value, detail, tone, active, onClick }: { icon: React.ComponentType<{ size?: number }>; label: string; value: string; detail: string; tone: "navy" | "amber" | "rose" | "blue" | "green"; active?: boolean; onClick?: () => void }) {
  const tones = { navy: "bg-primary/8 text-primary", amber: "bg-amber-100 text-amber-700", rose: "bg-rose-100 text-rose-700", blue: "bg-blue-100 text-blue-700", green: "bg-emerald-100 text-emerald-700" };
  const content = <><div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon size={19} /></div><strong className="mt-4 block font-heading text-2xl font-semibold leading-none text-primary">{value}</strong><span className="mt-2 block text-xs font-bold text-slate-700">{label}</span><span className="mt-0.5 block text-[11px] text-foreground-muted">{detail}</span></>;
  return onClick ? <button type="button" onClick={onClick} className={`rounded-[20px] border bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${active ? "border-primary ring-2 ring-primary/5" : "border-slate-200/80"}`}>{content}</button> : <div className="rounded-[20px] border border-slate-200/80 bg-white p-4 shadow-sm">{content}</div>;
}

function StatusBadge({ status }: { status: Booking["status"] }) { return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${STATUS_BADGE[status] || STATUS_BADGE.new}`}>{BOOKING_STATUS_LABELS[status]}</span>; }

function AgentSelect({ booking, agents, assigningId, assign }: { booking: Booking; agents: PublicAgent[]; assigningId: string; assign: (bookingId: string, agentId: string) => Promise<void> }) {
  return <select aria-label={`Assigned agent for ${booking.booking_code}`} value={booking.agent_id || ""} disabled={assigningId === booking.id} onChange={(event) => void assign(booking.id, event.target.value)} className="min-h-10 w-full min-w-[150px] rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium outline-none transition focus:border-accent disabled:opacity-50"><option value="">Unassigned</option>{agents.filter((agent) => agent.status === "active" || agent.id === booking.agent_id).map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select>;
}

function DataPoint({ label, value }: { label: string; value: string }) { return <div className="rounded-xl bg-slate-50 px-3 py-2.5"><span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span><span className="mt-1 block font-semibold text-primary">{value}</span></div>; }

function BookingSkeleton() { return <div className="space-y-px bg-slate-100" aria-label="Loading bookings">{Array.from({ length: 5 }, (_, index) => <div key={index} className="grid animate-pulse grid-cols-6 gap-5 bg-white px-5 py-5"><span className="h-4 rounded bg-slate-100" /><span className="col-span-2 h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /><span className="h-4 rounded bg-slate-100" /></div>)}</div>; }

function formatTravelDate(value: string | null) { if (!value) return "Date to confirm"; const date = new Date(`${value.slice(0, 10)}T00:00:00`); if (Number.isNaN(date.getTime())) return value; return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }

function formatBookingValue(value: string | null, fallback: string) { const parsed = parseMoney(value || 0); return parsed > 0 ? formatMoney(parsed) : fallback; }
