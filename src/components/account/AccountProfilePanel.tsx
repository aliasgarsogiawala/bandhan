"use client";

import { useEffect, useState, type FormEvent } from "react";
import type { AuthUser } from "@/lib/auth/useAuth";
import type { Announcement, Enquiry } from "@/lib/admin/types";
import { useCollection } from "@/lib/admin/store";
import { Field, fieldClass } from "@/components/booking/fields";

interface Traveller {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  relationship: string | null;
}

const submitClass =
  "inline-flex min-h-12 items-center justify-center rounded-[4px] px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-55";

async function readJson(response: Response) {
  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) throw new Error(String(data.error || "Something went wrong."));
  return data;
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-primary/12 bg-white shadow-premium">
      <header className="border-b border-primary/10 px-5 py-5 sm:px-7">
        <h2 className="font-heading text-lg font-bold tracking-[-0.02em] text-primary">{title}</h2>
        {description ? (
          <p className="mt-1.5 text-sm leading-6 text-foreground-muted">{description}</p>
        ) : null}
      </header>
      <div className="px-5 py-6 sm:px-7">{children}</div>
    </section>
  );
}

export function AccountProfilePanel({
  user,
  onProfileSaved,
}: {
  user: AuthUser;
  onProfileSaved: () => Promise<void>;
}) {
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || "",
  });
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
      .catch((error) =>
        setMessage(error instanceof Error ? error.message : "Could not load account details.")
      );
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
            <a
              key={item.id}
              href={item.link || undefined}
              className="block border-l-2 border-accent bg-accent/[0.06] px-4 py-3.5 transition-colors duration-200 hover:bg-accent/10"
            >
              <p className="font-heading font-bold text-primary">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-foreground-muted">{item.message}</p>
            </a>
          ))}
        </section>
      ) : null}

      <Panel title="Profile">
        <form onSubmit={saveProfile} className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name">
            <input
              className={fieldClass}
              autoComplete="name"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="Your name"
              required
            />
          </Field>
          <Field label="Email">
            <input
              className={fieldClass}
              type="email"
              autoComplete="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              placeholder="name@example.com"
              required
            />
          </Field>
          <Field label="Phone" className="sm:col-span-2">
            <input
              className={fieldClass}
              type="tel"
              autoComplete="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </Field>
          <div className="sm:col-span-2">
            <button
              disabled={busy}
              className={`${submitClass} bg-primary hover:bg-gold hover:text-primary`}
            >
              Save profile
            </button>
          </div>
        </form>
      </Panel>

      <Panel
        title="Saved travellers"
        description="Keep details for family and friends you regularly book for."
      >
        {travellers.length > 0 ? (
          <ul className="mb-6 grid gap-px border border-primary/12 bg-primary/12 sm:grid-cols-2">
            {travellers.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 bg-white p-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-primary">{item.name}</p>
                  <p className="mt-1 break-words text-xs leading-5 text-foreground-muted">
                    {[item.relationship, item.email, item.phone].filter(Boolean).join(" · ") ||
                      "No contact details saved"}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void removeTraveller(item.id)}
                  className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-light transition-colors hover:text-accent disabled:opacity-50"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <form onSubmit={addTraveller} className="grid gap-5 sm:grid-cols-2">
          <Field label="Traveller name">
            <input
              className={fieldClass}
              value={traveller.name}
              onChange={(e) => setTraveller({ ...traveller, name: e.target.value })}
              placeholder="Full name"
              required
            />
          </Field>
          <Field label="Relationship">
            <input
              className={fieldClass}
              value={traveller.relationship}
              onChange={(e) => setTraveller({ ...traveller, relationship: e.target.value })}
              placeholder="e.g. Spouse, Parent"
            />
          </Field>
          <Field label="Email" hint="Optional">
            <input
              className={fieldClass}
              type="email"
              value={traveller.email}
              onChange={(e) => setTraveller({ ...traveller, email: e.target.value })}
              placeholder="name@example.com"
            />
          </Field>
          <Field label="Phone" hint="Optional">
            <input
              className={fieldClass}
              type="tel"
              value={traveller.phone}
              onChange={(e) => setTraveller({ ...traveller, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </Field>
          <div className="sm:col-span-2">
            <button disabled={busy} className={`${submitClass} bg-accent hover:bg-accent-dark`}>
              Add traveller
            </button>
          </div>
        </form>
      </Panel>

      <Panel title="My enquiries">
        {enquiries.length === 0 ? (
          <p className="text-sm text-foreground-muted">
            No enquiries linked to this account yet.
          </p>
        ) : (
          <ul className="border border-primary/12">
            {enquiries.map((item, index) => (
              <li
                key={item.id}
                className={`flex items-start justify-between gap-3 p-4 ${
                  index ? "border-t border-primary/10" : ""
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-primary">
                    {item.destination || item.subject || "Travel enquiry"}
                  </p>
                  <p className="tabular mt-1 text-xs text-foreground-muted">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <span className="shrink-0 border border-primary/15 bg-sand px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground-muted">
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {message ? (
        <p role="status" className="text-center text-sm font-semibold text-primary">
          {message}
        </p>
      ) : null}
    </div>
  );
}
