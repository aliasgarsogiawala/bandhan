"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { submitEnquiry } from "@/lib/admin/store";

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
  "w-full min-w-0 rounded-lg border border-primary/15 bg-white px-4 py-3 text-base font-medium text-primary outline-none transition placeholder:text-slate-400 hover:border-primary/30 focus:border-accent focus:ring-3 focus:ring-accent/10";
const labelClass = "text-[0.68rem] font-bold uppercase tracking-[0.14em] text-primary/65";

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
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");

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

    try {
      await submitEnquiry({
        name: form.name,
        email: form.email,
        phone: form.phone,
        destination: form.destination,
        travelMonth: form.travelWindow,
        guests: form.delegates,
        subject: `MICE — ${form.eventType} · ${form.company}`,
        message: brief,
        source: "mice-page",
      });
      setReference(form.company);
      setSubmitted(true);
      setForm(emptyForm);
      setServices([]);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit your brief.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-primary/15 bg-white p-7 text-primary shadow-soft sm:p-9">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
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
            <a href="tel:+919175685400" className="font-bold text-primary">
              +91 91756 85400
            </a>
          </li>
          <li>
            Have an RFP document?{" "}
            <a href="mailto:nikita@bandhantours.com" className="font-bold text-primary">
              nikita@bandhantours.com
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
      className="rounded-xl border border-primary/15 bg-white p-5 text-primary shadow-soft sm:p-8 lg:p-9"
    >
      <div className="mb-8 border-b border-primary/10 pb-6">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-accent">
            MICE proposal request
          </span>
          <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-primary">
            Corporate programme brief
          </h3>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            Required fields help us assess feasibility before the first call.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-1.5 sm:col-span-2">
          <span className={labelClass}>Company name</span>
          <input
            type="text"
            name="company"
            required
            value={form.company}
            onChange={handleChange}
            placeholder="Registered company or brand name"
            autoComplete="organization"
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
            autoComplete="name"
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
            autoComplete="email"
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
            autoComplete="tel"
            inputMode="tel"
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

      <fieldset className="mt-8 border-t border-primary/10 pt-6">
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
                  className={`block rounded-md border px-3 py-2 text-xs font-semibold transition peer-focus-visible:ring-2 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2 ${
                    checked
                      ? "border-accent bg-accent text-white"
                      : "border-primary/15 bg-white text-foreground-muted hover:border-accent/40"
                  }`}
                >
                  {service}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <label className="mt-8 block space-y-1.5">
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

      <div className="mt-8 flex flex-col gap-4 border-t border-primary/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs leading-relaxed text-foreground-muted">
          Your details stay with the corporate desk and are used only to prepare this proposal.
        </p>
        <div className="sm:text-right">
          {submitError && <p className="mb-2 max-w-sm text-sm font-semibold text-red-600">{submitError}</p>}
          <PrimaryButton type="submit" variant="coral" size="md" isLoading={submitting} className="w-full sm:w-auto">
            Submit programme brief
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}
