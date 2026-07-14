"use client";

import React, { useState } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { store } from "@/lib/admin/store";

const bentoIcon = (
  path: React.ReactNode,
  className = "w-6 h-6 stroke-[2]"
) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {path}
  </svg>
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const scrollToForm = () => {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Persist the lead to the admin store (localStorage-backed).
    store.add("enquiries", {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      destination: "",
      subject: formData.subject,
      message: formData.message,
      source: "contact-page",
      status: "new",
      createdAt: new Date().toISOString(),
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden selection:bg-accent/20 selection:text-accent-dark">
      <Navbar onEnquiryClick={scrollToForm} />

      {/* Hero */}
      <section className="relative w-full pt-40 pb-24 sm:pt-48 sm:pb-28 overflow-hidden bg-gradient-to-b from-primary via-primary to-primary-dark">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(254,209,79,0.25),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(254,209,79,0.2),transparent_40%)]" />
        <Container className="relative z-10 flex flex-col items-center text-center text-white">
          <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-gold text-xs font-semibold uppercase tracking-widest mb-6 inline-block animate-fade-in">
            We&apos;d Love To Hear From You
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight max-w-3xl tracking-tight text-gold drop-shadow-md font-heading animate-fade-in-up">
            Let&apos;s Plan Your Next Adventure
          </h1>
          <p className="text-base sm:text-lg text-slate-200 max-w-2xl font-light leading-relaxed mb-10 animate-fade-in-up">
            Have a question about a package, group booking, or a custom itinerary? Our travel designers are just a message away.
          </p>
          <div className="animate-fade-in-up">
            <PrimaryButton variant="coral" size="lg" onClick={scrollToForm}>
              Send Us a Message
            </PrimaryButton>
          </div>
        </Container>
      </section>

      {/* Bento Grid - Contact Info */}
      <section className="py-20 sm:py-24 bg-white relative z-10">
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
                Fill in the form and one of our travel designers will get back to you within 24 hours with a custom plan tailored to your budget and taste.
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
              <div className="bg-white rounded-3xl shadow-premium border border-slate-100 p-6 sm:p-10">
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner animate-scale-up">
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
                      <PrimaryButton type="submit" variant="coral" isLoading={isSubmitting} fullWidth size="md">
                        Send Message
                      </PrimaryButton>
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
