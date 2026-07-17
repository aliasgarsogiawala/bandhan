"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Miles — Bandhan Tours' corner FAQ assistant.
 *
 * A lightweight, rule-based chatbot (no backend / LLM): user messages are
 * keyword-matched against the knowledge base below and answered instantly.
 * Quick-reply chips make it tappable-first for mobile users.
 */

const BOT_NAME = "Miles";

interface Faq {
  id: string;
  chipLabel: string; // short label shown on suggestion chips
  keywords: string[];
  answer: string;
  followups?: string[]; // ids of Faqs to suggest as next chips
}

const FAQS: Record<string, Faq> = {
  hello: {
    id: "hello",
    chipLabel: "Say hi",
    keywords: ["hi", "hey", "hello", "namaste", "yo", "hola"],
    answer: "Hey there! 👋 How can I help you plan your trip today?",
    followups: ["packages", "booking", "contact"],
  },
  packages: {
    id: "packages",
    chipLabel: "Tour packages",
    keywords: ["package", "packages", "tour", "tours", "trip", "holiday", "vacation", "itinerary", "destination", "where"],
    answer:
      "We run curated domestic and international tours — think Kashmir, Sikkim, Rajasthan, Kerala, and escapes abroad. Every itinerary lives on our Packages page with day-by-day plans, inclusions, and pricing. Want me to narrow it down?",
    followups: ["domestic", "international", "group", "booking"],
  },
  domestic: {
    id: "domestic",
    chipLabel: "Domestic tours",
    keywords: ["domestic", "india", "indian", "kashmir", "sikkim", "rajasthan", "kerala", "goa", "himachal", "himalaya"],
    answer:
      "Our domestic collection spans the Himalayas to the backwaters — favourites include Kashmir Paradise, Sikkim Special, and Royal Rajasthan. Prices usually start around ₹18,000–₹35,000 per person on twin sharing. Shall I show you how to book?",
    followups: ["booking", "price", "contact"],
  },
  international: {
    id: "international",
    chipLabel: "International tours",
    keywords: ["international", "abroad", "overseas", "foreign", "dubai", "thailand", "bali", "singapore", "europe", "maldives", "visa"],
    answer:
      "Absolutely — we craft international getaways across Southeast Asia, the Middle East, and Europe, with visa guidance, flights, and hand-picked stays. Tell us your dream destination and we'll build a custom plan. Want to talk to a trip designer?",
    followups: ["custom", "contact", "booking"],
  },
  booking: {
    id: "booking",
    chipLabel: "How to book",
    keywords: ["book", "booking", "reserve", "reservation", "enquire", "enquiry", "inquiry", "signup", "register"],
    answer:
      "Booking is simple: send an enquiry (the “Enquire Now” button, the Contact page, or right here) and a travel designer replies within 24 hours with a tailored itinerary and quote. When you're happy, a small advance confirms your seats — no payment needed just to enquire!",
    followups: ["payment", "cancellation", "contact"],
  },
  payment: {
    id: "payment",
    chipLabel: "Payment & advance",
    keywords: ["payment", "pay", "advance", "deposit", "installment", "emi", "upi", "card", "money"],
    answer:
      "You can get a full itinerary with zero advance. To confirm a booking, a partial advance secures your spot and the balance is due before departure. We accept UPI, bank transfer, and major cards. Have a specific trip in mind?",
    followups: ["booking", "cancellation", "contact"],
  },
  cancellation: {
    id: "cancellation",
    chipLabel: "Cancellation policy",
    keywords: ["cancel", "cancellation", "refund", "reschedule", "postpone"],
    answer:
      "Cancellation terms depend on the package and how close to departure you are — earlier cancellations earn higher refunds, and free date changes are often possible on custom trips. Share your booking and our team will walk you through the exact terms.",
    followups: ["contact", "booking"],
  },
  group: {
    id: "group",
    chipLabel: "Group departures",
    keywords: ["group", "departure", "departures", "join", "fixed", "batch", "solo", "together"],
    answer:
      "Our group departures are fixed-date tours you can join with a shared tour captain — perfect for solo travellers and families. You'll see live seat availability on the home page under “Upcoming Group Departures.” Want to reserve seats?",
    followups: ["booking", "packages", "contact"],
  },
  custom: {
    id: "custom",
    chipLabel: "Custom itinerary",
    keywords: ["custom", "customize", "customise", "tailor", "personalise", "personalize", "flexible", "bespoke"],
    answer:
      "Every package can be reshaped — different dates, hotels, pace, or an entirely new route. Just tell us what you have in mind and we design it around your budget and taste, free of charge. Ready to start planning?",
    followups: ["booking", "contact", "international"],
  },
  price: {
    id: "price",
    chipLabel: "Pricing",
    keywords: ["price", "pricing", "cost", "budget", "cheap", "expensive", "fee", "charge", "rate"],
    answer:
      "Prices vary by destination, season, and hotel category. Domestic tours often start around ₹18,000–₹35,000 per person; international from ₹60,000+. Every quote is customised — tell us your budget and we'll match a trip to it.",
    followups: ["packages", "custom", "contact"],
  },
  contact: {
    id: "contact",
    chipLabel: "Talk to a human",
    keywords: ["contact", "phone", "call", "email", "whatsapp", "reach", "talk", "human", "agent", "number", "speak", "support"],
    answer:
      "You can reach our team directly:\n📞  +91 98300 12345\n✉️  info@bandhantours.com\n💬  WhatsApp: wa.me/919830012345\nWe reply within 24 hours. Prefer we call you? Drop your details on the Contact page.",
    followups: ["hours", "location", "booking"],
  },
  location: {
    id: "location",
    chipLabel: "Office location",
    keywords: ["office", "location", "address", "visit", "branch", "kolkata"],
    answer:
      "We're based in Kolkata: 122, Rash Behari Avenue, 2nd Floor, Kolkata – 700029, West Bengal. Pop by during working hours, or reach us online anytime.",
    followups: ["hours", "contact"],
  },
  hours: {
    id: "hours",
    chipLabel: "Working hours",
    keywords: ["hours", "timing", "timings", "open", "when", "working"],
    answer:
      "Our office is open Monday to Saturday, 10:00 AM – 7:00 PM. Enquiries sent here or online are answered within 24 hours — even on Sundays.",
    followups: ["contact", "location"],
  },
  about: {
    id: "about",
    chipLabel: "About Bandhan",
    keywords: ["about", "who", "experience", "years", "trust", "company", "reliable", "safe", "legit"],
    answer:
      "Bandhan Tours has crafted group and custom journeys for 15+ years, with 5,000+ happy travellers and 24×7 on-tour support. Our mission: help you explore the true colours of every destination, stress-free.",
    followups: ["packages", "group", "contact"],
  },
  thanks: {
    id: "thanks",
    chipLabel: "Thanks!",
    keywords: ["thank", "thanks", "thx", "appreciate"],
    answer: "Anytime! 😊 Have a wonderful journey — I'm right here if anything else comes up.",
    followups: ["packages", "contact"],
  },
  bye: {
    id: "bye",
    chipLabel: "Goodbye",
    keywords: ["bye", "goodbye", "see ya", "later"],
    answer: "Safe travels! ✈️ Come back anytime you need a hand planning.",
    followups: ["packages", "contact"],
  },
};

const FAQ_LIST = Object.values(FAQS);

const FALLBACK_ANSWER =
  "I'm still learning, so I didn't quite catch that. I can help with packages, bookings, pricing, group tours, and contact details — or you can reach a real travel designer directly.";
const FALLBACK_CHIPS = ["packages", "booking", "contact"];

const GREETING =
  "Hi there! I'm Miles ✈️ your travel buddy at Bandhan Tours. Ask me about packages, bookings, pricing, or anything trip-related!";
const GREETING_CHIPS = ["packages", "booking", "price", "contact"];

/** Keyword match: short tokens need a whole-word hit, longer ones match as substrings. */
function findFaq(raw: string): Faq | null {
  const text = ` ${raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()} `;
  let best: Faq | null = null;
  let bestScore = 0;
  for (const faq of FAQ_LIST) {
    let score = 0;
    for (const kw of faq.keywords) {
      if (kw.length <= 3) {
        if (new RegExp(`\\b${kw}\\b`).test(text)) score += 1;
      } else if (text.includes(kw)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  return best;
}

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  chips?: string[]; // faq ids
}

/** A paper-plane glyph — used on the send button. */
const PlaneIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

/**
 * Miles himself — a cartoon airplane with a face: wings, tail fin, a spinner
 * nose, two eyes (that blink when `blink` is set), rosy cheeks and a smile.
 */
const MilesMascot = ({ className = "", blink = false }: { className?: string; blink?: boolean }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    {/* Wings (behind the body) */}
    <path d="M22 31 L4 40 C1.5 41.2 2.6 45 5.3 44.2 L23 40 Z" fill="#e03232" />
    <path d="M42 31 L60 40 C62.5 41.2 61.4 45 58.7 44.2 L41 40 Z" fill="#e03232" />
    {/* Tail fin */}
    <path d="M27 15 L32 4 L37 15 Z" fill="#FED14F" />
    {/* Fuselage */}
    <rect x="18" y="10" width="28" height="44" rx="14" fill="#fe4f4f" />
    {/* Spinner nose */}
    <circle cx="32" cy="53" r="5" fill="#FED14F" />
    {/* Cheeks */}
    <circle cx="22.5" cy="39" r="2.4" fill="#ff7575" />
    <circle cx="41.5" cy="39" r="2.4" fill="#ff7575" />
    {/* Eyes */}
    <g className={blink ? "miles-eyes" : undefined}>
      <circle cx="26" cy="30" r="5.4" fill="#ffffff" />
      <circle cx="38" cy="30" r="5.4" fill="#ffffff" />
      <circle cx="26.6" cy="31" r="2.6" fill="#07203c" />
      <circle cx="38.6" cy="31" r="2.6" fill="#07203c" />
      <circle cx="25.3" cy="29.4" r="0.9" fill="#ffffff" />
      <circle cx="37.3" cy="29.4" r="0.9" fill="#ffffff" />
    </g>
    {/* Smile */}
    <path d="M25.5 40 Q32 46 38.5 40" fill="none" stroke="#07203c" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

let messageSeq = 0;
const nextId = () => ++messageSeq;

export const Chatbot: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: nextId(), from: "bot", text: GREETING, chips: GREETING_CHIPS },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [hop, setHop] = useState(0); // bumps to replay Miles' happy hop on each reply

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Nudge the user with a teaser bubble a few seconds in, once, if unopened.
  useEffect(() => {
    if (open || teaserDismissed) return;
    const t = setTimeout(() => setShowTeaser(true), 4000);
    return () => clearTimeout(t);
  }, [open, teaserDismissed]);

  // Keep the newest message in view; focus the input when the panel opens.
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
  }, []);

  const openPanel = () => {
    setOpen(true);
    setShowTeaser(false);
    setTeaserDismissed(true);
  };

  // Generate the id up front so the state updater stays pure (React may invoke
  // updaters more than once; calling nextId() inside one would collide ids).
  const appendMessage = (msg: Omit<Message, "id">) => {
    const id = nextId();
    setMessages((prev) => [...prev, { id, ...msg }]);
  };

  const pushBotReply = (faq: Faq | null) => {
    setTyping(true);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      setHop((h) => h + 1);
      appendMessage(
        faq
          ? { from: "bot", text: faq.answer, chips: faq.followups }
          : { from: "bot", text: FALLBACK_ANSWER, chips: FALLBACK_CHIPS }
      );
    }, 650);
  };

  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    appendMessage({ from: "user", text });
    setInput("");
    pushBotReply(findFaq(text));
  };

  const sendChip = (faqId: string) => {
    const faq = FAQS[faqId];
    if (!faq || typing) return;
    appendMessage({ from: "user", text: faq.chipLabel });
    pushBotReply(faq);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendText(input);
  };

  // Keep the assistant off the admin console.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Teaser bubble */}
      {showTeaser && !open && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 max-w-[240px] animate-fade-in-up">
          <div className="relative bg-white rounded-2xl rounded-br-sm shadow-premium border border-slate-100 px-4 py-3 pr-8">
            <button
              onClick={() => {
                setShowTeaser(false);
                setTeaserDismissed(true);
              }}
              className="absolute top-1.5 right-1.5 p-1 text-foreground-light hover:text-primary rounded-full"
              aria-label="Dismiss"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex items-center gap-2.5">
              <MilesMascot className="w-9 h-9 shrink-0 miles-idle" blink />
              <p className="text-sm text-foreground font-sans leading-snug">
                Hi! I&apos;m <span className="font-bold text-primary">{BOT_NAME}</span> 👋 Need a hand planning a trip?
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label={`${BOT_NAME}, travel assistant`}
          className="fixed z-40 flex flex-col bg-sand-light rounded-3xl shadow-2xl border border-slate-200/70 overflow-hidden animate-scale-up
            bottom-24 right-4 left-4 h-[68vh] max-h-[560px]
            sm:left-auto sm:right-6 sm:w-[390px] sm:h-[600px]"
        >
          {/* Header */}
          <div className="relative bg-primary text-white px-4 py-3.5 flex items-center gap-3 shrink-0">
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-gold via-accent to-gold opacity-80" />
            <div className="relative miles-float">
              <span key={hop} className={hop > 0 ? "miles-hop block" : "block"}>
                <MilesMascot className="w-11 h-11 drop-shadow" blink />
              </span>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-primary" />
            </div>
            <div className="leading-tight flex-1 min-w-0">
              <p className="font-heading font-bold text-sm">{BOT_NAME}</p>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online · Travel Assistant
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-white/75 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                <div className={m.from === "user" ? "flex justify-end" : "flex items-end gap-2 max-w-[85%]"}>
                  {m.from === "bot" && <MilesMascot className="w-7 h-7 shrink-0 mb-0.5" />}
                  <div
                    className={`px-3.5 py-2.5 text-sm leading-relaxed font-sans whitespace-pre-line shadow-soft ${
                      m.from === "user"
                        ? "bg-primary text-white rounded-2xl rounded-tr-sm max-w-[80%]"
                        : "bg-white text-foreground border border-slate-100 rounded-2xl rounded-tl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {/* Suggestion chips */}
                {m.from === "bot" && m.chips && m.chips.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2.5 pl-9">
                    {m.chips.map((cid) => {
                      const faq = FAQS[cid];
                      if (!faq) return null;
                      return (
                        <button
                          key={cid}
                          onClick={() => sendChip(cid)}
                          disabled={typing}
                          className="px-3 py-1.5 rounded-full bg-white border border-primary/15 text-primary text-xs font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors duration-200 disabled:opacity-50"
                        >
                          {faq.chipLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-end gap-2">
                <MilesMascot className="w-7 h-7 shrink-0 miles-float" />
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-foreground-light animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="shrink-0 border-t border-slate-200/70 bg-white p-3 flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${BOT_NAME}…`}
              className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm text-primary placeholder:text-foreground-light focus:outline-none focus:border-accent transition-colors"
              aria-label="Type your message"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-10 h-10 shrink-0 rounded-full bg-accent hover:bg-accent-dark text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-accent"
              aria-label="Send message"
            >
              <PlaneIcon className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => (open ? setOpen(false) : openPanel())}
        className="fixed bottom-6 right-4 sm:right-6 z-40 w-15 h-15 min-w-14 min-h-14 rounded-full bg-primary text-gold shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform duration-300"
        aria-label={open ? "Close chat" : `Chat with ${BOT_NAME}`}
        aria-expanded={open}
      >
        {!open && <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" style={{ animationDuration: "2.5s" }} />}
        {open ? (
          <svg className="relative w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        ) : (
          <span className="relative miles-idle">
            <MilesMascot className="w-9 h-9 drop-shadow" blink />
          </span>
        )}
        {!open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-accent border-2 border-primary" />
        )}
      </button>
    </>
  );
};

export default Chatbot;
