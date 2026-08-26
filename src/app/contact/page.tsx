"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import PageShell from "@/components/ui/PageShell";
import PageHero from "@/components/ui/PageHero";
import { submitEnquiry } from "@/lib/admin/store";

const bentoIcon = (
  path: React.ReactNode,
  className = "w-6 h-6 stroke-[2]"
) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {path}
  </svg>
);

function ContactContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [preferredContact, setPreferredContact] = useState<"WhatsApp" | "Phone call" | "Email">("WhatsApp");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [prefillDestination, setPrefillDestination] = useState("");
  const [highlight, setHighlight] = useState(false);
  const formCardRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Arriving from an "Enquire / Book / Plan" CTA: pre-fill the form for the
  // chosen destination, sweep it into view, and give it a celebratory glow.
  useEffect(() => {
    const destination = searchParams.get("destination")?.trim() || "";
    const isEnquiry = destination || searchParams.get("enquiry");
    if (!isEnquiry) return;

    const hydrateTimer = setTimeout(() => {
      if (destination) {
        setPrefillDestination(destination);
        setFormData((prev) => ({
          ...prev,
          subject: prev.subject || "New Booking",
          message:
            prev.message ||
            `Hi Bandhan Tours, I'd love to enquire about ${destination}. Please share available dates, the itinerary, and pricing. Thank you!`,
        }));
      } else {
        setFormData((prev) => ({ ...prev, subject: prev.subject || "Custom Itinerary" }));
      }
    }, 0);

    const scrollTimer = setTimeout(() => {
      formCardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlight(true);
    }, 350);
    const glowTimer = setTimeout(() => setHighlight(false), 3200);
    return () => {
      clearTimeout(hydrateTimer);
      clearTimeout(scrollTimer);
      clearTimeout(glowTimer);
    };
    // Runs once per navigation; the query string is stable within a visit.
  }, [searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitEnquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        destination: prefillDestination,
        subject: formData.subject,
        message: `${formData.message}\n\nPreferred contact: ${preferredContact}`,
        source: "contact-page",
      });
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError(error instanceof Error ? error.message : "Could not send your message.");
    }
  };

  return (
    <PageShell tone="sand" className="selection:bg-accent/20 selection:text-accent-dark" onEnquiryClick={scrollToForm}>
      <PageHero
        size="lg"
        align="center"
        priority
        eyebrow="We'd love to hear from you"
        title="Let's plan your next adventure"
        description="Have a question about a package, group booking, or a custom itinerary? Our travel designers are just a message away."
        image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=90&w=3200"
        imageAlt=""
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        actions={
          <>
            <PrimaryButton variant="coral" size="lg" onClick={scrollToForm} className="w-full sm:w-auto">
              Start an Enquiry
            </PrimaryButton>
            <a
              href="https://wa.me/919422332610"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto"
            >
              WhatsApp Us
            </a>
          </>
        }
        stats={[
          { value: "24 hours", label: "Typical response time" },
          { value: "No pressure", label: "Free trip planning" },
          { value: "One team", label: "From first idea to return" },
        ]}
      />

      <section className="relative overflow-hidden border-y border-slate-200 bg-white py-20 text-primary sm:py-28">
        <div className="absolute inset-y-0 left-0 w-1 bg-gold" aria-hidden="true" />
        <Container className="relative">
          <ScrollReveal>
            <div className="grid gap-10 border-b border-slate-200 pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Begin here</span>
                <h2 className="mt-5 max-w-3xl font-heading text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">A beautiful trip can start with one conversation.</h2>
              </div>
              <p className="max-w-lg text-base leading-relaxed text-foreground-muted lg:justify-self-end">Tell us where you want to go—or simply how you want the journey to feel. A Bandhan travel designer will help shape the rest.</p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <ScrollReveal>
              <div className="flex h-full flex-col justify-between border border-slate-200 bg-sand/40 p-6 sm:p-8">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700"><span className="h-2 w-2 bg-emerald-500" /> Travel desk open today</div>
                  <h3 className="mt-8 font-heading text-2xl font-bold sm:text-3xl">Choose how we talk.</h3>
                  <div className="mt-7 divide-y divide-slate-200 border-y border-slate-200">
                    <a href="https://wa.me/919422332610" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 py-5"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Fastest</span><p className="mt-1 text-lg font-bold">WhatsApp our team</p></div><span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span></a>
                    <a href="tel:+919422332610" className="group flex items-center justify-between gap-4 py-5"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-light">Speak directly</span><p className="mt-1 text-lg font-bold">+91 94223 32610</p></div><span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span></a>
                    <a href="mailto:info@bandhantours.com" className="group flex items-center justify-between gap-4 py-5"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-light">Write to us</span><p className="mt-1 text-lg font-bold">info@bandhantours.com</p></div><span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span></a>
                  </div>
                </div>
                <p className="mt-8 text-sm text-foreground-muted">Monday–Saturday · 10:00 am–7:00 pm IST</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="relative min-h-[420px] overflow-hidden border border-slate-200 bg-sand sm:min-h-[520px]">
                <iframe title="Bandhan Tours Office Location" src="https://www.google.com/maps?q=226%2C%20Lodha%20Supremus%20Tower%202%2C%20Road%20No.%2022%2C%20Wagle%20Industrial%20Estate%2C%20Thane%20West%2C%20Maharashtra%20400604&output=embed" className="absolute inset-0 h-full w-full border-0 grayscale-[0.15]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                <div className="absolute bottom-0 right-0 w-[calc(100%-2rem)] border-l-4 border-gold bg-primary p-5 shadow-2xl sm:w-[72%] sm:p-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Bandhan Tours · Thane</span>
                  <p className="mt-2 max-w-xl font-heading text-lg font-bold leading-snug text-white sm:text-xl">226, Lodha Supremus Tower 2, Road No. 22<br />Wagle Industrial Estate, Thane West – 400604</p>
                  <a href="https://www.google.com/maps/search/?api=1&query=Lodha+Supremus+Tower+2+Wagle+Industrial+Estate+Thane+West+400604" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold text-gold hover:text-white">Open directions →</a>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="mt-12">
            <div className="grid border-y border-slate-200 sm:grid-cols-3">
              {[["01", "Share the idea", "Destination, dates, budget—or just the mood."], ["02", "Meet your planner", "One specialist understands and refines the brief."], ["03", "Receive the journey", "A thoughtful itinerary, clearly priced and ready to shape."]].map(([number, title, copy]) => <div key={number} className="border-b border-slate-200 p-6 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 sm:p-7"><span className="font-heading text-sm font-bold text-accent">{number}</span><h3 className="mt-5 font-heading text-lg font-bold text-primary">{title}</h3><p className="mt-2 text-sm leading-relaxed text-foreground-muted">{copy}</p></div>)}
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="relative z-10 scroll-mt-20 overflow-hidden bg-sand py-20 sm:py-28">
        <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-gold/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
        <Container>
          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 lg:items-start">
            {/* Left copy */}
            <ScrollReveal className="lg:col-span-5 lg:sticky lg:top-28">
              <span className="mb-4 block font-heading text-xs font-bold uppercase tracking-[0.24em] text-accent">
                Plan with us
              </span>
              <h2 className="mb-5 max-w-lg font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-primary sm:text-5xl">
                Your next journey starts here.
              </h2>
              <p className="mb-8 max-w-md text-base leading-relaxed text-foreground-muted sm:text-lg">
                Share the essentials and a dedicated travel designer will turn them into a clear, personal plan—usually within one working day.
              </p>
              <ul className="space-y-4 border-y border-primary/10 py-6">
                <li className="flex items-center gap-3 text-sm font-medium text-primary">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm">
                    {bentoIcon(<polyline points="20 6 9 17 4 12" />, "w-4 h-4 stroke-[3]")}
                  </span>
                  Free, no-obligation trip planning
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-primary">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm">
                    {bentoIcon(<polyline points="20 6 9 17 4 12" />, "w-4 h-4 stroke-[3]")}
                  </span>
                  Response within 24 hours
                </li>
                <li className="flex items-center gap-3 text-sm font-medium text-primary">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm">
                    {bentoIcon(<polyline points="20 6 9 17 4 12" />, "w-4 h-4 stroke-[3]")}
                  </span>
                  15+ years of curated travel expertise
                </li>
              </ul>
            </ScrollReveal>

            {/* Form card */}
            <ScrollReveal delay={120} className="lg:col-span-7">
              <div
                ref={formCardRef}
                className={`rounded-[2rem] border bg-white p-5 shadow-premium transition-colors duration-500 sm:p-8 lg:p-10 ${
                  highlight ? "border-accent ring-4 ring-accent/10" : "border-slate-100"
                }`}
              >
                {prefillDestination && !submitted && (
                  <div className="mb-6 flex items-center gap-3 rounded-2xl bg-accent/10 border border-accent/20 px-4 py-3">
                    <span className="text-lg" aria-hidden="true">✨</span>
                    <p className="text-sm text-primary font-sans">
                      Great pick! We&apos;ve started your enquiry for{" "}
                      <span className="font-bold text-accent-dark">{prefillDestination}</span>. Just add your details below.
                    </p>
                  </div>
                )}
                {submitted ? (
                  <div className="space-y-4 py-12 text-center" role="status" aria-live="polite">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-primary font-heading">Message Sent!</h4>
                    <p className="text-foreground-muted text-sm max-w-sm mx-auto">
                      Thanks for reaching out. Our team will get back to you within 24 hours.
                    </p>
                    <div className="pt-2">
                      <PrimaryButton variant="navy" onClick={() => setSubmitted(false)} size="md" className="mx-auto">
                        Send Another Message
                      </PrimaryButton>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-5">
                      <div>
                        <h3 className="font-heading text-xl font-bold text-primary sm:text-2xl">Tell us about your trip</h3>
                        <p className="mt-1 text-sm text-foreground-muted">It only takes about a minute.</p>
                      </div>
                      <span className="hidden rounded-full bg-sand px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent sm:inline-flex">No commitment</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wide text-primary">Full name</label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          autoComplete="name"
                          className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-base font-medium text-primary outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                        />
                      </div>
                      <div className="space-y-1">
                        <label htmlFor="contact-phone" className="text-xs font-bold uppercase tracking-wide text-primary">Phone number</label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="E.g. +91 98765 43210"
                          autoComplete="tel"
                          inputMode="tel"
                          className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-base font-medium text-primary outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wide text-primary">Email address</label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-base font-medium text-primary outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                      />
                    </div>

                    <fieldset className="space-y-2">
                      <legend className="text-xs font-bold uppercase tracking-wide text-primary">Best way to reach you</legend>
                      <div className="grid grid-cols-3 gap-2">
                        {(["WhatsApp", "Phone call", "Email"] as const).map((option) => (
                          <label key={option} className={`relative flex min-h-11 cursor-pointer items-center justify-center rounded-xl border px-2 text-center text-xs font-bold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-accent/20 ${preferredContact === option ? "border-primary bg-primary text-white shadow-sm" : "border-slate-200 bg-slate-50/70 text-foreground-muted hover:border-primary/30"}`}>
                            <input className="sr-only" type="radio" name="preferredContact" value={option} checked={preferredContact === option} onChange={() => setPreferredContact(option)} />
                            {option}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <div className="space-y-1">
                      <label htmlFor="contact-subject" className="text-xs font-bold uppercase tracking-wide text-primary">What can we help with?</label>
                      <select
                        id="contact-subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 text-base font-medium text-primary outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                      >
                        <option value="">Select a topic</option>
                        <option value="New Booking">New Booking Enquiry</option>
                        <option value="Group Tour">Group Tour</option>
                        <option value="Custom Itinerary">Custom Itinerary</option>
                        <option value="Existing Booking">Existing Booking Support</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wide text-primary">Tell us a little more</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about the trip you have in mind..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-base font-medium text-primary outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10"
                      />
                    </div>

                    <div className="pt-2">
                      {submitError && <p className="mb-3 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700" role="alert">{submitError}</p>}
                      <PrimaryButton type="submit" variant="coral" isLoading={isSubmitting} fullWidth size="lg">
                        Send my enquiry
                      </PrimaryButton>
                      <p className="mt-3 text-center text-xs text-foreground-light">By sending, you&apos;re asking Bandhan Tours to contact you about this enquiry.</p>
                    </div>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>
    </PageShell>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactContent />
    </Suspense>
  );
}
