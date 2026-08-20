"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
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
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden selection:bg-accent/20 selection:text-accent-dark">
      <Navbar onEnquiryClick={scrollToForm} />

      {/* Hero */}
      <section className="relative w-full pt-40 pb-24 sm:pt-48 sm:pb-28 overflow-hidden bg-primary">
        <Image
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=90&w=3200"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink-deep/75" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(254,209,79,0.25),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(254,209,79,0.2),transparent_40%)]" />
        <Container className="relative z-10 flex flex-col items-center text-center text-white">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold text-xs font-semibold uppercase tracking-widest mb-6 inline-block">
            We&apos;d Love To Hear From You
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 leading-[1.05] max-w-3xl tracking-[-0.015em] text-white [text-shadow:0_2px_24px_rgba(3,16,32,0.45)] font-heading">
            Let&apos;s Plan Your Next Adventure
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl font-light leading-relaxed mb-10">
            Have a question about a package, group booking, or a custom itinerary? Our travel designers are just a message away.
          </p>
          <div className="flex w-full max-w-xs flex-col justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:flex-wrap">
            <PrimaryButton variant="coral" size="lg" onClick={scrollToForm} className="w-full sm:w-auto">
              Start an Enquiry
            </PrimaryButton>
            <a href="https://wa.me/919830012345" target="_blank" rel="noreferrer" className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20 sm:w-auto">
              WhatsApp Us
            </a>
          </div>
          <div className="mt-12 grid w-full max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
            {[ ["24 hours", "Typical response time"], ["No pressure", "Free trip planning"], ["One team", "From first idea to return"] ].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm"><p className="font-heading text-base font-bold text-gold">{value}</p><p className="mt-0.5 text-xs text-slate-300">{label}</p></div>)}
          </div>
        </Container>
      </section>

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
                    <a href="https://wa.me/919830012345" target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-4 py-5"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">Fastest</span><p className="mt-1 text-lg font-bold">WhatsApp our team</p></div><span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span></a>
                    <a href="tel:+919830012345" className="group flex items-center justify-between gap-4 py-5"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-light">Speak directly</span><p className="mt-1 text-lg font-bold">+91 98300 12345</p></div><span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span></a>
                    <a href="mailto:info@bandhantours.com" className="group flex items-center justify-between gap-4 py-5"><div><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground-light">Write to us</span><p className="mt-1 text-lg font-bold">info@bandhantours.com</p></div><span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span></a>
                  </div>
                </div>
                <p className="mt-8 text-sm text-foreground-muted">Monday–Saturday · 10:00 am–7:00 pm IST</p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="relative min-h-[420px] overflow-hidden border border-slate-200 bg-sand sm:min-h-[520px]">
                <iframe title="Bandhan Tours Office Location" src="https://www.google.com/maps?q=122%20Rash%20Behari%20Avenue%2C%20Kolkata%2C%20West%20Bengal%2C%20India&output=embed" className="absolute inset-0 h-full w-full border-0 grayscale-[0.15]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                <div className="absolute bottom-0 right-0 w-[calc(100%-2rem)] border-l-4 border-gold bg-primary p-5 shadow-2xl sm:w-[72%] sm:p-6">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Bandhan Tours · Kolkata</span>
                  <p className="mt-2 max-w-xl font-heading text-lg font-bold leading-snug text-white sm:text-xl">122, Rash Behari Avenue, 2nd Floor<br />Kolkata – 700029, West Bengal</p>
                  <a href="https://www.google.com/maps/search/?api=1&query=122+Rash+Behari+Avenue+Kolkata" target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold text-gold hover:text-white">Open directions →</a>
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

      {/* Retained while the contact routes transition to the simplified layout. */}
      <section className="hidden" aria-hidden="true">
        <Container>
          <ScrollReveal className="mb-12">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <span className="text-accent font-heading font-semibold tracking-widest uppercase text-sm mb-2 block">
                Reach Us
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl md:text-5xl text-primary leading-tight tracking-tight">
                Every Way To Connect With Us
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[180px] gap-5">
            {/* Phone */}
            <ScrollReveal delay={0} className="sm:col-span-1 h-full">
              <a
                href="tel:+919830012345"
                className="group h-full flex flex-col justify-between p-7 rounded-3xl bg-sand/60 border border-slate-100 hover:bg-primary hover:text-white transition-all duration-500 shadow-soft hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 group-hover:bg-white/10 text-accent group-hover:text-gold flex items-center justify-center transition-colors duration-500 shadow-inner">
                  {bentoIcon(
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-heading text-primary group-hover:text-white mb-1 transition-colors duration-300">
                    Call Us
                  </h4>
                  <p className="text-sm text-foreground-muted group-hover:text-slate-300 transition-colors duration-300">
                    +91 98300 12345
                  </p>
                </div>
              </a>
            </ScrollReveal>

            {/* Email */}
            <ScrollReveal delay={80} className="sm:col-span-1 h-full">
              <a
                href="mailto:info@bandhantours.com"
                className="group h-full flex flex-col justify-between p-7 rounded-3xl bg-sand/60 border border-slate-100 hover:bg-primary hover:text-white transition-all duration-500 shadow-soft hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent/10 group-hover:bg-white/10 text-accent group-hover:text-gold flex items-center justify-center transition-colors duration-500 shadow-inner">
                  {bentoIcon(
                    <>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-heading text-primary group-hover:text-white mb-1 transition-colors duration-300">
                    Email Us
                  </h4>
                  <p className="text-sm text-foreground-muted group-hover:text-slate-300 transition-colors duration-300">
                    info@bandhantours.com
                  </p>
                </div>
              </a>
            </ScrollReveal>

            {/* WhatsApp - accent tile */}
            <ScrollReveal delay={160} className="sm:col-span-1 h-full">
              <a
                href="https://wa.me/919830012345"
                target="_blank"
                rel="noreferrer"
                className="group h-full flex flex-col justify-between p-7 rounded-3xl bg-accent text-white hover:bg-accent-dark transition-all duration-500 shadow-soft hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shadow-inner">
                  {bentoIcon(
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-heading mb-1">Quick Chat</h4>
                  <p className="text-sm text-white/85">Message us on WhatsApp</p>
                </div>
              </a>
            </ScrollReveal>

            {/* Hours */}
            <ScrollReveal delay={240} className="sm:col-span-1 h-full">
              <div className="h-full flex flex-col justify-between p-7 rounded-3xl bg-sand/60 border border-slate-100 shadow-soft">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shadow-inner">
                  {bentoIcon(
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-heading text-primary mb-1">Working Hours</h4>
                  <p className="text-sm text-foreground-muted">Mon - Sat: 10am - 7pm</p>
                </div>
              </div>
            </ScrollReveal>

            {/* Map - large tile */}
            <ScrollReveal delay={320} className="sm:col-span-2 lg:col-span-2 row-span-2 h-full">
              <div className="h-full rounded-3xl overflow-hidden border border-slate-100 shadow-soft relative min-h-[280px]">
                <iframe
                  title="Bandhan Tours Office Location"
                  src="https://www.google.com/maps?q=122%20Rash%20Behari%20Avenue%2C%20Kolkata%2C%20West%20Bengal%2C%20India&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </ScrollReveal>

            {/* Address */}
            <ScrollReveal delay={400} className="sm:col-span-1 h-full">
              <div className="group h-full flex flex-col justify-between p-7 rounded-3xl bg-primary text-white transition-all duration-500 shadow-soft hover:shadow-xl hover:-translate-y-1">
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-gold flex items-center justify-center shadow-inner">
                  {bentoIcon(
                    <>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-heading mb-1">Visit Us</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    122, Rash Behari Avenue, 2nd Floor, Kolkata - 700029, West Bengal, India
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Social */}
            <ScrollReveal delay={480} className="sm:col-span-1 h-full">
              <div className="h-full flex flex-col justify-between p-7 rounded-3xl bg-sand/60 border border-slate-100 shadow-soft">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shadow-inner">
                  {bentoIcon(
                    <>
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
                      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
                    </>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold font-heading text-primary mb-2">Follow Us</h4>
                  <div className="flex gap-2">
                    <a
                      href="https://www.facebook.com/bandhantours1222"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Facebook"
                      className="w-9 h-9 rounded-full bg-primary/5 hover:bg-accent hover:text-white text-primary flex items-center justify-center transition-colors duration-300"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    <a
                      href="https://www.instagram.com/bandhantours"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="w-9 h-9 rounded-full bg-primary/5 hover:bg-accent hover:text-white text-primary flex items-center justify-center transition-colors duration-300"
                    >
                      <svg className="w-4 h-4 stroke-[2] stroke-current fill-none" viewBox="0 0 24 24">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/82365776/admin"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="LinkedIn"
                      className="w-9 h-9 rounded-full bg-primary/5 hover:bg-accent hover:text-white text-primary flex items-center justify-center transition-colors duration-300"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect x="2" y="9" width="4" height="12" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="py-20 sm:py-24 bg-sand/40 relative z-10">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left copy */}
            <ScrollReveal className="lg:col-span-5">
              <span className="text-accent font-heading font-semibold tracking-widest uppercase text-sm mb-2 block">
                Get In Touch
              </span>
              <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary leading-tight tracking-tight mb-4">
                Tell Us About Your Dream Trip
              </h2>
              <p className="text-base text-foreground-muted leading-relaxed mb-8 max-w-md">
                A few details are enough. One of our travel designers will come back within 24 hours with the right next step for your trip.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-sm text-foreground-muted">
                  <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    {bentoIcon(<polyline points="20 6 9 17 4 12" />, "w-4 h-4 stroke-[3]")}
                  </span>
                  Free, no-obligation trip planning
                </li>
                <li className="flex items-center gap-3 text-sm text-foreground-muted">
                  <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
                    {bentoIcon(<polyline points="20 6 9 17 4 12" />, "w-4 h-4 stroke-[3]")}
                  </span>
                  Response within 24 hours
                </li>
                <li className="flex items-center gap-3 text-sm text-foreground-muted">
                  <span className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">
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
                className={`bg-white rounded-3xl shadow-premium border p-6 sm:p-10 transition-colors duration-500 ${
                  highlight ? "border-accent contact-glow" : "border-slate-100"
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
                  <div className="text-center py-10 space-y-4">
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
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex items-center justify-between gap-3 rounded-2xl bg-sand px-4 py-3">
                      <div>
                        <p className="text-sm font-bold text-primary">Tell us the essentials</p>
                        <p className="mt-0.5 text-xs text-foreground-muted">This takes about a minute.</p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent shadow-sm">No commitment</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-primary uppercase">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-primary uppercase">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="E.g. +91 98765 43210"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-primary uppercase">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                      />
                    </div>

                    <fieldset className="space-y-2">
                      <legend className="text-xs font-semibold text-primary uppercase">Best way to reach you</legend>
                      <div className="grid grid-cols-3 gap-2">
                        {(["WhatsApp", "Phone call", "Email"] as const).map((option) => <button key={option} type="button" onClick={() => setPreferredContact(option)} className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors ${preferredContact === option ? "border-primary bg-primary text-white" : "border-slate-200 bg-slate-50/50 text-foreground-muted hover:border-primary/30"}`}>{option}</button>)}
                      </div>
                    </fieldset>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-primary uppercase">Subject</label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
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
                      <label className="text-xs font-semibold text-primary uppercase">Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about the trip you have in mind..."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50"
                      />
                    </div>

                    <div className="pt-2">
                      {submitError && <p className="mb-3 text-center text-sm font-semibold text-red-600">{submitError}</p>}
                      <PrimaryButton type="submit" variant="coral" isLoading={isSubmitting} fullWidth size="md">
                        Send Message
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

      <Footer />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense>
      <ContactContent />
    </Suspense>
  );
}
