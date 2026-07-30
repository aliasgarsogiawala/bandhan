"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCollection } from "@/lib/admin/store";
import type { TourPackage, Destination } from "@/data/mockData";
import type { BlogPost } from "@/lib/admin/types";
import { fuzzySearchScored } from "@/lib/fuzzySearch";
import { formatMoney, parseMoney } from "@/lib/bookings/pricing";

/**
 * Miles — Bandhan Tours' corner FAQ assistant.
 *
 * A lightweight, rule-based chatbot (no backend / LLM): user messages are
 * keyword-matched against the knowledge base below and answered instantly.
 * Quick-reply chips make it tappable-first for mobile users. Package,
 * category and pricing answers are generated live from the same package
 * and blog data the rest of the site uses, so the bot never quotes a trip
 * that isn't actually published.
 */

const BOT_NAME = "Miles";

interface KnowledgeContext {
  packages: TourPackage[];
  posts: BlogPost[];
  destinations: Destination[];
}

interface Faq {
  id: string;
  chipLabel: string; // short label shown on suggestion chips
  keywords: string[];
  answer: string | ((ctx: KnowledgeContext) => string);
  followups?: string[]; // ids of Faqs to suggest as next chips
}

interface BotResponse {
  text: string;
  chips?: string[];
  link?: { label: string; href: string };
}

function resolveAnswer(faq: Faq, ctx: KnowledgeContext): string {
  return typeof faq.answer === "function" ? faq.answer(ctx) : faq.answer;
}

function priceRange(pkgs: TourPackage[]): string {
  const prices = pkgs.map((p) => parseMoney(p.price)).filter((n) => n > 0);
  if (!prices.length) return "a custom quote";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `around ${formatMoney(min)}` : `${formatMoney(min)} – ${formatMoney(max)}`;
}

function listPackages(pkgs: TourPackage[], limit = 4): string {
  return pkgs.slice(0, limit).map((p) => `• ${p.title} (${p.duration}) — ${p.price}`).join("\n");
}

function categoryAnswer(label: string, pkgs: TourPackage[]): string {
  if (!pkgs.length) {
    return `We don't have a published ${label} package live right now, but our designers can build one from scratch around your dates and budget. Want to start a custom trip?`;
  }
  return `Here are a few of our current ${label} packages:\n${listPackages(pkgs)}\n\nPrices run roughly ${priceRange(pkgs)} per person, depending on season and hotel category. Want the full itinerary for one of these, or something more specific?`;
}

function packageSummary(pkg: TourPackage): BotResponse {
  const topHighlights = pkg.highlights.slice(0, 3).join(", ");
  const tagline = pkg.tagline ? `${pkg.tagline}\n` : "";
  const extras: string[] = [];
  if (pkg.bestTime) extras.push(`Best time to go: ${pkg.bestTime}.`);
  if (pkg.inclusions?.length) extras.push(`Includes: ${pkg.inclusions.slice(0, 4).join(", ")}${pkg.inclusions.length > 4 ? "…" : ""}.`);
  return {
    text: `${pkg.title} — ${pkg.duration}, from ${pkg.price} per person.\n${tagline}${
      topHighlights ? `Highlights: ${topHighlights}.` : ""
    }${extras.length ? `\n${extras.join(" ")}` : ""}`,
    link: { label: `View full ${pkg.title} itinerary`, href: `/packages/${pkg.id}` },
    chips: ["packages", "booking", "custom"],
  };
}

function destinationSummary(dest: Destination): BotResponse {
  const extras: string[] = [];
  if (dest.bestTime) extras.push(`Best time to go: ${dest.bestTime}.`);
  if (dest.duration) extras.push(`Typical trip length: ${dest.duration}.`);
  return {
    text: `${dest.name} — ${dest.description}\nStarting from ${dest.price} per person.${extras.length ? ` ${extras.join(" ")}` : ""}`,
    link: { label: `Explore ${dest.name}`, href: `/destinations/${dest.id}` },
    chips: ["packages", "booking", "custom"],
  };
}

function postSummary(post: BlogPost): BotResponse {
  return {
    text: `We've actually written about that: "${post.title}". ${post.excerpt}`,
    link: { label: "Read the full article", href: `/blog/${post.slug || post.id}` },
    chips: ["packages", "contact"],
  };
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
    // Singular forms only ("tour" substring-matches "tours" already) —
    // keeping both would double-count a single occurrence and let this
    // catch-all FAQ out-score a more specific one like "domestic".
    keywords: ["package", "tour", "trip", "holiday", "vacation", "itinerary", "destination", "where"],
    answer: (ctx) => {
      const total = ctx.packages.length;
      const domestic = ctx.packages.filter((p) => p.category === "Domestic").length;
      const intl = ctx.packages.filter((p) => p.category === "International").length;
      const ne = ctx.packages.filter((p) => p.category === "North East").length;
      return `We currently have ${total} tour packages live — ${domestic} domestic, ${ne} North East, and ${intl} international. Every itinerary lives on our Packages page with day-by-day plans, inclusions, and pricing. Want me to narrow it down, or ask about a specific destination?`;
    },
    followups: ["domestic", "northeast", "international", "group"],
  },
  domestic: {
    id: "domestic",
    chipLabel: "Domestic tours",
    keywords: ["domestic", "india", "indian", "rajasthan", "kerala", "andaman", "karnataka", "ayodhya", "varanasi", "temple", "kanyakumari", "kashmir", "goa", "himachal"],
    answer: (ctx) => categoryAnswer("domestic", ctx.packages.filter((p) => p.category === "Domestic")),
    followups: ["northeast", "booking", "price", "contact"],
  },
  northeast: {
    id: "northeast",
    chipLabel: "North East tours",
    keywords: ["northeast", "north east", "sikkim", "gangtok", "darjeeling", "meghalaya", "shillong", "assam", "arunachal", "nagaland", "manipur", "tripura", "mizoram", "seven sisters", "kaziranga", "tawang"],
    answer: (ctx) => categoryAnswer("North East", ctx.packages.filter((p) => p.category === "North East")),
    followups: ["booking", "price", "contact"],
  },
  international: {
    id: "international",
    chipLabel: "International tours",
    keywords: ["international", "abroad", "overseas", "foreign", "thailand", "bali", "singapore", "malaysia", "bhutan", "vietnam", "europe", "austria", "italy", "germany", "switzerland", "london", "edinburgh", "paris", "dubai", "maldives", "visa"],
    answer: (ctx) => categoryAnswer("international", ctx.packages.filter((p) => p.category === "International")),
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
    answer: (ctx) => {
      const domestic = priceRange(ctx.packages.filter((p) => p.category === "Domestic"));
      const ne = priceRange(ctx.packages.filter((p) => p.category === "North East"));
      const intl = priceRange(ctx.packages.filter((p) => p.category === "International"));
      return `Prices vary by destination, season, and hotel category. Right now, domestic tours run about ${domestic} per person, North East trips about ${ne}, and international getaways about ${intl}. Every quote is customised — tell us your budget and we'll match a trip to it.`;
    },
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
  visa: {
    id: "visa",
    chipLabel: "Visa help",
    keywords: ["visa", "passport", "immigration", "documents", "document"],
    answer: (ctx) => {
      const withVisa = ctx.packages.filter((p) => p.category === "International" && p.inclusions?.some((i) => /visa/i.test(i)));
      const note = withVisa.length
        ? `Most of our international packages (like ${withVisa[0].title}) include visa assistance or a full visa-inclusive fare — it's listed right in that package's inclusions.`
        : "Visa requirements depend on your destination and nationality.";
      return `${note} Our team handles the paperwork end-to-end for international trips — just make sure your passport has 6+ months' validity. Which country are you travelling to?`;
    },
    followups: ["international", "flights", "contact"],
  },
  flights: {
    id: "flights",
    chipLabel: "Flights included?",
    keywords: ["flight", "flights", "airfare", "air ticket", "airline"],
    answer:
      "Some packages are flight-inclusive and some are land-only (flights booked separately) — it's always listed in that package's inclusions/exclusions tab. Tell me the destination and I'll check whether flights are bundled in.",
    followups: ["packages", "visa", "price"],
  },
  hotels: {
    id: "hotels",
    chipLabel: "Hotels & meals",
    keywords: ["hotel", "hotels", "stay", "accommodation", "resort", "meal", "meals", "breakfast", "food", "cuisine"],
    answer:
      "Stays are handpicked 3★–5★ hotels or resorts depending on the package category, and most itineraries include daily breakfast (many include all meals). Exact hotel names and meal plans are listed on each package's inclusion tab — want me to check a specific trip?",
    followups: ["packages", "price", "custom"],
  },
  honeymoon: {
    id: "honeymoon",
    chipLabel: "Honeymoon trips",
    keywords: ["honeymoon", "couple", "romantic", "romance", "anniversary", "wedding trip"],
    answer: (ctx) => {
      const romantic = ctx.packages.filter((p) => p.themes?.some((t) => /beach|island|scenic|romantic/i.test(t)));
      return romantic.length
        ? `Popular with couples:\n${listPackages(romantic, 4)}\n\nWe can also add private candlelight dinners, room upgrades, or a scenic add-on for a honeymoon package. Want a custom romantic itinerary?`
        : "We design honeymoon itineraries around beaches, hills, or scenic getaways with private touches like candlelight dinners. Want to tell me your dream destination?";
    },
    followups: ["custom", "international", "booking"],
  },
  family: {
    id: "family",
    chipLabel: "Family trips",
    keywords: ["family", "kids", "children", "senior", "elderly", "parents", "child"],
    answer: (ctx) => {
      const familyFriendly = ctx.packages.filter((p) => p.themes?.some((t) => /family/i.test(t)));
      return familyFriendly.length
        ? `Great family-friendly picks:\n${listPackages(familyFriendly, 4)}\n\nWe pace these trips comfortably for kids and senior citizens alike, with flexible sightseeing. Want details on any of these?`
        : "We tailor pacing, hotel choices, and sightseeing for families with kids or senior citizens on any of our packages. Tell me who's travelling and I'll suggest a good fit.";
    },
    followups: ["packages", "custom", "booking"],
  },
  safety: {
    id: "safety",
    chipLabel: "Is it safe?",
    keywords: ["safe", "safety", "secure", "insurance", "emergency", "risk"],
    answer:
      "Every tour includes 24×7 on-trip support from our team, and we can add travel insurance covering medical emergencies, trip delays, and baggage loss for a small fee. For North East India and high-altitude routes we also handle permits so nothing catches you off guard.",
    followups: ["about", "contact", "booking"],
  },
  permits: {
    id: "permits",
    chipLabel: "Permits (NE/Andaman)",
    keywords: ["permit", "permits", "ilp", "inner line permit", "restricted area"],
    answer:
      "Some North East India destinations (like Arunachal Pradesh, parts of Sikkim, Nagaland and Mizoram) and Andaman need an Inner Line Permit or restricted-area permit — we arrange all of that for you as part of the package, you just need to share ID proof in advance.",
    followups: ["northeast", "domestic", "contact"],
  },
  reviews: {
    id: "reviews",
    chipLabel: "Reviews & reputation",
    keywords: ["review", "reviews", "rating", "ratings", "testimonial", "testimonials", "feedback"],
    answer:
      "We're rated highly by 5,000+ travellers — you'll find real trip stories and ratings on our Testimonials page. Happy to share a couple of highlights if you tell me which destination you're considering.",
    followups: ["about", "packages", "contact"],
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
    // >= (not >) so that on a tie, the later, more specific FAQ wins over an
    // earlier, broader one — e.g. "domestic tours" ties "packages" (catch-all,
    // defined first) with "domestic" (defined later) at one keyword hit each;
    // the specific answer is the more useful one to show.
    if (score > 0 && score >= bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  return best;
}

/** Generic intent words ("tour", "trip", "package"...) are deliberately kept
 * out of the specific-match path below — several of them are literal
 * substrings of real titles (e.g. "3 Sisters Tour"), and a bare "tour"
 * should get the overview answer, not whichever title happens to contain
 * the word "tour". */
const GENERIC_QUERY_WORDS = new Set([
  "tour", "tours", "trip", "trips", "package", "packages", "holiday", "holidays",
  "vacation", "itinerary", "destination", "where", "book", "booking", "price",
  "pricing", "cost", "budget", "contact", "hi", "hello", "hey", "help", "custom",
  "group", "domestic", "international", "northeast",
]);

function isGenericQuery(raw: string): boolean {
  return GENERIC_QUERY_WORDS.has(raw.trim().toLowerCase());
}

/** Fuse's normalized score penalises short queries against long titles more
 * than you'd expect (e.g. "bali" vs. "Bali – The Island of Dreams" scores
 * worse than a plain substring check would), so a direct, case-insensitive
 * substring hit is tried first and only falls back to fuzzy matching (for
 * typos) when nothing contains the query outright. */
function findBySubstringOrFuzzy<T>(
  items: T[],
  raw: string,
  fields: (item: T) => string[],
  fuzzyKeys: (keyof T | string)[]
): T | null {
  const q = raw.trim().toLowerCase();
  if (q.length < 3) return null;
  const substringHit = items.find((item) => fields(item).some((f) => f.toLowerCase().includes(q)));
  if (substringHit) return substringHit;
  const scored = fuzzySearchScored(items, raw, fuzzyKeys, 1);
  return scored.length && scored[0].score <= 0.3 ? scored[0].item : null;
}

/** A confident, specific match (a real package, destination, or article
 * title) wins over the generic keyword FAQs below it, so "bali" answers with
 * the actual Bali package instead of the generic "international tours"
 * blurb, and "goa" or "kashmir" (which have no full package yet) still
 * answer from the featured-destinations data instead of falling through. */
function resolveResponse(raw: string, ctx: KnowledgeContext): BotResponse {
  const generic = isGenericQuery(raw);

  if (!generic) {
    const pkg = findBySubstringOrFuzzy(
      ctx.packages,
      raw,
      (p) => [p.title, ...p.highlights],
      ["title", "highlights"]
    );
    if (pkg) return packageSummary(pkg);

    const dest = findBySubstringOrFuzzy(
      ctx.destinations,
      raw,
      (d) => [d.name, d.description],
      ["name", "description"]
    );
    if (dest) return destinationSummary(dest);
  }

  const faq = findFaq(raw);
  if (faq) {
    return { text: resolveAnswer(faq, ctx), chips: faq.followups };
  }

  if (!generic) {
    const post = findBySubstringOrFuzzy(ctx.posts, raw, (p) => [p.title, p.excerpt], ["title", "excerpt"]);
    if (post) return postSummary(post);
  }

  return { text: FALLBACK_ANSWER, chips: FALLBACK_CHIPS };
}

interface Message {
  id: number;
  from: "bot" | "user";
  text: string;
  chips?: string[]; // faq ids
  link?: { label: string; href: string };
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
  const { items: allPackages } = useCollection<TourPackage>("packages");
  const { items: allPosts } = useCollection<BlogPost>("blog");
  const { items: allDestinations } = useCollection<Destination>("destinations");
  const knowledge: KnowledgeContext = useMemo(
    () => ({
      packages: allPackages.filter((p) => p.status !== "draft"),
      posts: allPosts.filter((p) => p.isPublished),
      destinations: allDestinations.filter((d) => d.status !== "draft"),
    }),
    [allPackages, allPosts, allDestinations]
  );
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

  const pushBotReply = (response: BotResponse) => {
    setTyping(true);
    replyTimer.current = setTimeout(() => {
      setTyping(false);
      setHop((h) => h + 1);
      appendMessage({ from: "bot", text: response.text, chips: response.chips, link: response.link });
    }, 650);
  };

  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    appendMessage({ from: "user", text });
    setInput("");
    pushBotReply(resolveResponse(text, knowledge));
  };

  const sendChip = (faqId: string) => {
    const faq = FAQS[faqId];
    if (!faq || typing) return;
    appendMessage({ from: "user", text: faq.chipLabel });
    pushBotReply({ text: resolveAnswer(faq, knowledge), chips: faq.followups });
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

                {/* Deep link to the real package/article page */}
                {m.from === "bot" && m.link && (
                  <Link
                    href={m.link.href}
                    className="mt-2.5 ml-9 inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-accent transition-colors duration-200"
                  >
                    {m.link.label}
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                )}

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
