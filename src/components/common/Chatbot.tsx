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

/** Filler words stripped out when extracting the "meaningful" part of a full
 * sentence query (e.g. "what is the price of the europe package" -> "europe"). */
const STOPWORDS = new Set([
  "what", "whats", "is", "are", "the", "a", "an", "of", "for", "to", "in", "on",
  "and", "or", "how", "much", "does", "do", "did", "can", "could", "will", "would",
  "about", "with", "from", "that", "this", "it", "its", "tell", "me", "give",
  "show", "have", "has", "need", "needs", "want", "wants", "you", "your", "there",
]);

/** Pulls out the specific, non-generic words from a query — e.g. "what is
 * the price of the europe package" -> ["europe"] — so a whole-sentence
 * question can still be matched against a single destination/package name
 * embedded in it, instead of only matching queries that ARE just that name. */
function significantTokens(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w) && !GENERIC_QUERY_WORDS.has(w));
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

/** All items whose fields contain the given token as a substring — used for
 * full-sentence queries where the whole-query substring check in
 * findBySubstringOrFuzzy can never hit (the field is shorter than the
 * sentence around it). Returns every match, not just the first, since a
 * broad word like "europe" legitimately matches several packages. */
function findAllByToken<T>(items: T[], token: string, fields: (item: T) => string[]): T[] {
  return items.filter((item) => fields(item).some((f) => f.toLowerCase().includes(token)));
}

function multiPackageAnswer(pkgs: TourPackage[]): BotResponse {
  return {
    text: `We have a few packages matching that:\n${listPackages(pkgs, 5)}\n\nPrices run roughly ${priceRange(pkgs)} per person. Want the full itinerary for one of these?`,
    chips: ["packages", "booking", "custom"],
  };
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

    // Full-sentence questions ("what is the price of the europe package")
    // never hit the whole-query substring check above, since a title is
    // shorter than the sentence around it — so pull out the specific word(s)
    // and match those instead. A single hit gets the full package/destination
    // answer (price included); several hits get a filtered list rather than
    // an arbitrary pick.
    for (const token of significantTokens(raw)) {
      const pkgMatches = findAllByToken(ctx.packages, token, (p) => [p.title, ...p.highlights]);
      if (pkgMatches.length === 1) return packageSummary(pkgMatches[0]);
      if (pkgMatches.length > 1) return multiPackageAnswer(pkgMatches);

      const destMatches = findAllByToken(ctx.destinations, token, (d) => [d.name]);
      if (destMatches.length === 1) return destinationSummary(destMatches[0]);
    }
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

/** Miles' compact travel mark, designed to stay clear at chat-avatar size. */
const MilesAvatar = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" fill="#ffffff" />
    <circle cx="32" cy="32" r="27" fill="#07203c" />
    <path
      d="M13 38c6.5 6.8 17.2 10.3 28 7.3"
      fill="none"
      stroke="#FED14F"
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="1 6"
    />
    <path
      d="M15.5 29.3 49 15.8 38.7 49 30 36.4l-14.5-7.1Z"
      fill="#ffffff"
      stroke="#ffffff"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M30 36.4 49 15.8 25.5 32.1"
      fill="none"
      stroke="#07203c"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="13" cy="38" r="3.5" fill="#fe4f4f" stroke="#ffffff" strokeWidth="2" />
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

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
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

  const resetConversation = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setTyping(false);
    setInput("");
    setMessages([
      { id: nextId(), from: "bot", text: GREETING, chips: GREETING_CHIPS },
    ]);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Keep the assistant off the admin console.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      {/* Teaser bubble */}
      {showTeaser && !open && (
        <div className="fixed bottom-24 right-4 z-40 max-w-[280px] animate-fade-in-up sm:right-6">
          <div className="relative border border-primary/10 bg-white px-4 py-3.5 pr-10 shadow-[0_18px_60px_rgba(7,32,60,0.16)]">
            <button
              onClick={() => {
                setShowTeaser(false);
                setTeaserDismissed(true);
              }}
              className="absolute right-2 top-2 p-1 text-foreground-light transition hover:text-primary"
              aria-label="Dismiss"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <div className="flex items-start gap-3">
              <MilesAvatar className="h-9 w-9 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                  Bandhan trip desk
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-primary">
                  Need help finding the right tour?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-modal="false"
          aria-label={`${BOT_NAME}, travel assistant`}
          className="fixed bottom-20 left-3 right-3 z-40 flex h-[min(720px,calc(100dvh-6rem))] flex-col overflow-hidden border border-primary/10 bg-[#f7f5ef] shadow-[0_30px_90px_rgba(7,32,60,0.26)] animate-scale-up sm:bottom-24 sm:left-auto sm:right-6 sm:w-[420px]"
        >
          {/* Header */}
          <div className="relative shrink-0 bg-primary px-5 pb-4 pt-5 text-white">
            <div className="absolute inset-x-0 top-0 h-1 bg-gold" />
            <div className="flex items-center gap-3">
              <span
                key={hop}
                className={`relative flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 bg-white/10 ${
                  hop > 0 ? "miles-hop" : ""
                }`}
              >
                <MilesAvatar className="h-9 w-9" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 border-2 border-primary bg-emerald-400" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-2">
                  <p className="font-heading text-base font-bold">{BOT_NAME}</p>
                  <span className="border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                    Online
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-300">
                  Bandhan Tours · Trip assistant
                </p>
              </div>
              <button
                onClick={resetConversation}
                className="p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Start a new conversation"
                title="New conversation"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v6h6" />
                </svg>
              </button>
              <button
                onClick={() => setOpen(false)}
                className="p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 border-b border-primary/10 bg-white">
            <Link
              href="/packages"
              onClick={() => setOpen(false)}
              className="border-r border-primary/10 px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-primary transition hover:bg-gold/20"
            >
              Browse tours
            </Link>
            <Link
              href="/plan-trip"
              onClick={() => setOpen(false)}
              className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-[0.14em] text-primary transition hover:bg-gold/20"
            >
              Plan a custom trip
            </Link>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                <div className={m.from === "user" ? "flex max-w-[84%] justify-end" : "flex max-w-[91%] items-start gap-2.5"}>
                  {m.from === "bot" && (
                    <MilesAvatar className="mt-0.5 h-7 w-7 shrink-0" />
                  )}
                  <div
                    className={`whitespace-pre-line px-4 py-3 font-sans text-[13px] leading-6 ${
                      m.from === "user"
                        ? "bg-primary text-white shadow-[0_8px_24px_rgba(7,32,60,0.14)]"
                        : "border border-primary/10 bg-white text-foreground shadow-[0_8px_24px_rgba(7,32,60,0.07)]"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>

                {/* Deep link to the real package/article page */}
                {m.from === "bot" && m.link && (
                  <Link
                    href={m.link.href}
                    onClick={() => setOpen(false)}
                    className="ml-9 mt-2.5 inline-flex items-center gap-2 border border-primary bg-white px-3.5 py-2 text-[11px] font-bold text-primary transition duration-200 hover:bg-primary hover:text-white"
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
                  <div className="mt-2.5 flex flex-wrap gap-2 pl-9">
                    {m.chips.map((cid) => {
                      const faq = FAQS[cid];
                      if (!faq) return null;
                      return (
                        <button
                          key={cid}
                          onClick={() => sendChip(cid)}
                          disabled={typing}
                          className="border border-primary/15 bg-white px-3 py-2 text-[11px] font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-50"
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
              <div className="flex items-start gap-2.5">
                <MilesAvatar className="h-7 w-7 shrink-0" />
                <div className="flex items-center gap-1 border border-primary/10 bg-white px-4 py-3 shadow-[0_8px_24px_rgba(7,32,60,0.07)]">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-primary/45 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="shrink-0 border-t border-primary/10 bg-white p-3.5">
            <div className="flex items-center gap-2 border border-primary/15 bg-slate-50 p-1.5 transition focus-within:border-primary">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a destination, price or booking…"
                className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-sm text-primary placeholder:text-foreground-light focus:outline-none"
                aria-label="Type your message"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-10 w-10 shrink-0 items-center justify-center bg-accent text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-35"
                aria-label="Send message"
              >
                <PlaneIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[9px] uppercase tracking-[0.13em] text-foreground-light">
              Instant answers · Human help available
            </p>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        onClick={() => (open ? setOpen(false) : openPanel())}
        className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-gold shadow-[0_14px_40px_rgba(7,32,60,0.28)] transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-primary-light active:translate-y-0 active:scale-95 sm:bottom-6 sm:right-6"
        aria-label={open ? "Close chat" : `Chat with ${BOT_NAME}`}
        aria-expanded={open}
      >
        {open ? (
          <svg className="relative h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        ) : (
          <MilesAvatar className="relative h-10 w-10" />
        )}
        {!open && (
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-primary bg-emerald-400" />
        )}
      </button>
    </>
  );
};

export default Chatbot;
