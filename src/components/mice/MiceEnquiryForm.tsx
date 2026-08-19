"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { store } from "@/lib/admin/store";

const EVENT_TYPES = [
  "Meeting / leadership offsite",
  "Incentive / reward trip",
  "Conference / convention",
  "Exhibition / trade fair",
  "Dealer or channel-partner meet",
  "Other corporate travel",
] as const;

const SERVICES = [
  "Venue & hotel sourcing",
  "Air travel & group fares",
  "Ground transport",
  "Visas & documentation",
  "Banquets & F&B",
  "AV, stage & production",
  "Team building & activities",
  "Delegate registration",
  "Gifting & branding",
  "On-ground event managers",
] as const;

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm font-medium text-primary transition-colors focus:border-accent focus:outline-none";
const labelClass = "text-xs font-semibold uppercase tracking-wide text-primary";

const emptyForm = {
  company: "",
  name: "",
  designation: "",
  email: "",
  phone: "",
  eventType: EVENT_TYPES[0] as string,
  delegates: "",
  destination: "",
  travelWindow: "",
  nights: "",
  budgetPerDelegate: "",
  message: "",
};

/**
 * Corporate brief capture for the MICE page. Leads land in the same admin
 * "Enquiries" collection as the site's other forms; the MICE-only fields are
 * folded into the subject and message so they show up there without any
 * changes to that screen.
 */
export default function MiceEnquiryForm() {
  const [form, setForm] = useState(emptyForm);
  const [services, setServices] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const toggleService = (service: string) => {
    setServices((current) =>
      current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const brief = [
      `Company: ${form.company}`,
      form.designation ? `Designation: ${form.designation}` : null,
      `Event type: ${form.eventType}`,
      `Delegates: ${form.delegates}`,
      form.nights ? `Duration: ${form.nights} nights` : null,
      form.travelWindow ? `Preferred dates: ${form.travelWindow}` : null,
      form.budgetPerDelegate
        ? `Indicative budget per delegate: ${form.budgetPerDelegate}`
        : null,
      services.length ? `Services needed: ${services.join(", ")}` : null,
      form.message ? `\nBrief:\n${form.message}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    store.add("enquiries", {
      name: form.name,
      email: form.email,
      phone: form.phone,
      destination: form.destination,
      travelMonth: form.travelWindow,
      guests: form.delegates,
      subject: `MICE — ${form.eventType} · ${form.company}`,
      message: brief,
      source: "mice-page",
      status: "new",
      createdAt: new Date().toISOString(),
    });

    setReference(form.company);
    setSubmitted(true);
    setForm(emptyForm);
    setServices([]);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-premium sm:p-10">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Check size={30} strokeWidth={3} />
        </div>
        <h3 className="mt-6 font-heading text-2xl font-bold text-primary">
          Brief received{reference ? `, ${reference}` : ""}.
        </h3>
        <p className="mt-3 text-sm leading-7 text-foreground-muted">
          Our corporate desk will study your requirement and come back with
          destination options, indicative per-delegate costing and an outline
          programme. Expect a first response within one working day.
        </p>
        <ul className="mt-7 space-y-3 border-t border-slate-100 pt-6 text-sm text-foreground-muted">
          <li>
            Need to move faster? Call{" "}
            <a href="tel:+919830012345" className="font-bold text-primary">
              +91 98300 12345
            </a>
          </li>
          <li>
            Have an RFP document?{" "}
            <a href="mailto:info@bandhantours.com" className="font-bold text-primary">
              info@bandhantours.com
            </a>
          </li>
        </ul>
        <div className="mt-8">
          <PrimaryButton variant="navy" size="md" onClick={() => setSubmitted(false)}>
            Submit another brief
          </PrimaryButton>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-premium sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className={labelClass}>Company name</span>
          <input
            type="text"
            name="company"
            required
            value={form.company}
            onChange={handleChange}
            placeholder="Registered company or brand name"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Contact person</span>
          <input
            type="text"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Designation</span>
          <input
            type="text"
            name="designation"
            value={form.designation}
            onChange={handleChange}
            placeholder="E.g. HR Manager"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Work email</span>
          <input
            type="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="name@company.com"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Phone</span>
          <input
            type="tel"
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Type of event</span>
          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
            className={inputClass}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Number of delegates</span>
          <input
            type="number"
            name="delegates"
            required
            min={1}
            value={form.delegates}
            onChange={handleChange}
            placeholder="E.g. 45"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Preferred destination</span>
          <input
            type="text"
            name="destination"
            required
            value={form.destination}
            onChange={handleChange}
            placeholder="E.g. Goa, Dubai, or open to suggestions"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Travel window</span>
          <input
            type="text"
            name="travelWindow"
            value={form.travelWindow}
            onChange={handleChange}
            placeholder="E.g. second week of November 2026"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Nights</span>
          <input
            type="number"
            name="nights"
            min={0}
            value={form.nights}
            onChange={handleChange}
            placeholder="E.g. 3"
            className={inputClass}
          />
        </label>

        <label className="space-y-1.5">
          <span className={labelClass}>Budget per delegate</span>
          <input
            type="text"
            name="budgetPerDelegate"
            value={form.budgetPerDelegate}
            onChange={handleChange}
            placeholder="Optional — helps us shortlist faster"
            className={inputClass}
          />
        </label>
      </div>

      <fieldset className="mt-7 border-t border-slate-100 pt-6">
        <legend className={labelClass}>What should we handle?</legend>
        <div className="mt-4 flex flex-wrap gap-2">
          {SERVICES.map((service) => {
            const checked = services.includes(service);
            return (
              <label key={service} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleService(service)}
                  className="peer sr-only"
                />
                <span
                  className={`block rounded-full border px-3.5 py-2 text-xs font-semibold transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 ${
                    checked
                      ? "border-accent bg-accent text-white"
                      : "border-slate-200 text-foreground-muted hover:border-accent/40"
                  }`}
                >
                  {service}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-7 block space-y-1.5">
        <span className={labelClass}>Your brief</span>
        <textarea
          name="message"
          rows={4}
          value={form.message}
          onChange={handleChange}
          placeholder="Agenda outline, hotel category, meeting-room needs, sessions and meals, awards night, accompanying spouses, anything else that shapes the plan..."
          className={inputClass}
        />
      </label>

      <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-foreground-light">
          We use these details only to prepare your proposal.
        </p>
        <PrimaryButton type="submit" variant="coral" size="md">
          Send the brief
        </PrimaryButton>
      </div>
    </form>
  );
}
