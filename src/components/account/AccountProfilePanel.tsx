"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { AuthUser } from "@/lib/auth/useAuth";
import type { Announcement, Enquiry } from "@/lib/admin/types";
import { useCollection } from "@/lib/admin/store";

interface Traveller {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-primary outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10";

async function readJson(response: Response) {
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) throw new Error(String(data.error || "Something went wrong."));
  return data;
}

export function AccountProfilePanel({ user, onProfileSaved }: { user: AuthUser; onProfileSaved: () => Promise<void> }) {
  const [profile, setProfile] = useState({ name: user.name, email: user.email, phone: user.phone || "" });
  const [travellers, setTravellers] = useState<Traveller[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [traveller, setTraveller] = useState({ name: "", relationship: "", email: "", phone: "" });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const { items: announcements } = useCollection<Announcement>("announcements");

  useEffect(() => {
    Promise.all([
      fetch("/api/account/travellers", { cache: "no-store" }).then(readJson),
      fetch("/api/account/enquiries", { cache: "no-store" }).then(readJson),
    ])
      .then(([travellerData, enquiryData]) => {
        setTravellers((travellerData.travellers as Traveller[]) || []);
        setEnquiries((enquiryData.enquiries as Enquiry[]) || []);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load account details."));
  }, []);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await readJson(
        await fetch("/api/account/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        })
      );
      await onProfileSaved();
      setMessage("Profile updated.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not update profile.");
    } finally {
      setBusy(false);
    }
  }

  async function addTraveller(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const data = await readJson(
        await fetch("/api/account/travellers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(traveller),
        })
      );
      setTravellers((current) => [data.traveller as Traveller, ...current]);
      setTraveller({ name: "", relationship: "", email: "", phone: "" });
      setMessage("Traveller saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save traveller.");
    } finally {
      setBusy(false);
    }
  }

  async function removeTraveller(id: string) {
    setBusy(true);
    setMessage("");
    try {
      await readJson(await fetch(`/api/account/travellers/${id}`, { method: "DELETE" }));
      setTravellers((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not remove traveller.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-10 space-y-6">
      {announcements.length > 0 ? (
        <section className="space-y-3">
          {announcements.map((item) => (
            <a key={item.id} href={item.link || undefined} className="block rounded-2xl border border-accent/20 bg-accent/5 p-4">
              <p className="font-heading font-bold text-primary">{item.title}</p>
              <p className="mt-1 text-sm text-foreground-muted">{item.message}</p>
            </a>
          ))}
        </section>
      ) : null}

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-7">
        <h2 className="font-heading text-xl font-bold text-primary">Profile</h2>
        <form onSubmit={saveProfile} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className={inputClass} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Full name" required />
          <input className={inputClass} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="Email" required />
          <input className={inputClass} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Phone" />
          <button disabled={busy} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">Save profile</button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-7">
        <h2 className="font-heading text-xl font-bold text-primary">Saved travellers</h2>
        <p className="mt-1 text-sm text-foreground-muted">Keep details for family and friends you regularly book for.</p>
        {travellers.length > 0 ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {travellers.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-sand/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-primary">{item.name}</p>
                    <p className="text-xs text-foreground-muted">{[item.relationship, item.email, item.phone].filter(Boolean).join(" · ")}</p>
                  </div>
                  <button type="button" disabled={busy} onClick={() => void removeTraveller(item.id)} className="text-xs font-bold text-red-600">Remove</button>
                </div>
              </div>
            ))}
          </div>
        ) : null}
        <form onSubmit={addTraveller} className="mt-4 grid gap-3 sm:grid-cols-2">
          <input className={inputClass} value={traveller.name} onChange={(e) => setTraveller({ ...traveller, name: e.target.value })} placeholder="Traveller name" required />
          <input className={inputClass} value={traveller.relationship} onChange={(e) => setTraveller({ ...traveller, relationship: e.target.value })} placeholder="Relationship" />
          <input className={inputClass} type="email" value={traveller.email} onChange={(e) => setTraveller({ ...traveller, email: e.target.value })} placeholder="Email (optional)" />
          <input className={inputClass} value={traveller.phone} onChange={(e) => setTraveller({ ...traveller, phone: e.target.value })} placeholder="Phone (optional)" />
          <button disabled={busy} className="rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2">Add traveller</button>
        </form>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft sm:p-7">
        <h2 className="font-heading text-xl font-bold text-primary">My enquiries</h2>
        {enquiries.length === 0 ? <p className="mt-3 text-sm text-foreground-muted">No enquiries linked to this account yet.</p> : (
          <div className="mt-4 space-y-2">
            {enquiries.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 rounded-2xl border border-slate-100 p-4">
                <div><p className="font-bold text-primary">{item.destination || item.subject || "Travel enquiry"}</p><p className="text-xs text-foreground-muted">{new Date(item.createdAt).toLocaleDateString("en-IN")}</p></div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase text-slate-600">{item.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>
      {message ? <p role="status" className="text-center text-sm font-semibold text-primary">{message}</p> : null}
    </div>
  );
}
