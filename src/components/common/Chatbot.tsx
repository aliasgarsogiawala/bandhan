"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCollection } from "@/lib/admin/store";
import type { TourPackage, Destination } from "@/data/mockData";
import type { BlogPost } from "@/lib/admin/types";
import { fuzzySearchScored } from "@/lib/fuzzySearch";
import { formatMoney, parseMoney } from "@/lib/bookings/pricing";
import { contactEnquiryHref } from "@/lib/enquiryLink";

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
  actions?: { label: string; href: string }[];
  packageId?: string;
}

function resolveAnswer(faq: Faq, ctx: KnowledgeContext): string {
  return typeof faq.answer === "function" ? faq.answer(ctx) : faq.answer;
}

function faqResponse(faq: Faq, ctx: KnowledgeContext): BotResponse {
  const response: BotResponse = { text: resolveAnswer(faq, ctx), chips: faq.followups };
  if (faq.id === "contact") {
    response.actions = [
      { label: "WhatsApp", href: "https://wa.me/919830012345" },
      { label: "Call now", href: "tel:+919830012345" },
      { label: "Send an enquiry", href: contactEnquiryHref() },
    ];
  } else if (faq.id === "booking") {
    response.actions = [
      { label: "Start booking", href: "/book" },
      { label: "Send an enquiry", href: contactEnquiryHref() },
    ];
  } else if (faq.id === "custom") {
    response.actions = [{ label: "Plan a custom trip", href: "/plan-trip" }];
  } else if (faq.id === "reviews") {
    response.actions = [{ label: "Read guest reviews", href: "/testimonials" }];
  }
  return response;
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

function listDetails(items: string[], emptyMessage: string, limit = 6): string {
  if (!items.length) return emptyMessage;
  const visible = items.slice(0, limit).map((item) => `• ${item}`).join("\n");
  return `${visible}${items.length > limit ? `\n• …and ${items.length - limit} more on the package page` : ""}`;
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
    actions: [
      { label: "View full itinerary", href: `/packages/${pkg.id}` },
      { label: "Enquire about this tour", href: contactEnquiryHref(pkg.title) },
    ],
    chips: ["packages", "booking", "custom"],
    packageId: pkg.id,
  };
}

function destinationSummary(dest: Destination): BotResponse {
  const extras: string[] = [];
  if (dest.bestTime) extras.push(`Best time to go: ${dest.bestTime}.`);
  if (dest.duration) extras.push(`Typical trip length: ${dest.duration}.`);
  return {
    text: `${dest.name} — ${dest.description}\nStarting from ${dest.price} per person.${extras.length ? ` ${extras.join(" ")}` : ""}`,
    actions: [
      { label: `Explore ${dest.name}`, href: `/destinations/${dest.id}` },
      { label: "Plan this trip", href: contactEnquiryHref(dest.name) },
    ],
    chips: ["packages", "booking", "custom"],
  };
}

function postSummary(post: BlogPost): BotResponse {
  return {
    text: `We've actually written about that: "${post.title}". ${post.excerpt}`,
    actions: [{ label: "Read the full article", href: `/blog/${post.slug || post.id}` }],
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
      "Booking is simple: choose a package or build a custom trip, add traveller details, and submit the request. No payment is collected at that stage. A Bandhan agent first verifies live pricing and availability, then sends the confirmed quotation and booking terms for your approval.",
    followups: ["payment", "cancellation", "contact"],
  },
  payment: {
    id: "payment",
    chipLabel: "Payment & advance",
    keywords: ["payment", "pay", "advance", "deposit", "installment", "emi", "upi", "card", "money"],
    answer:
      "There is no payment just to submit a request. After an agent verifies availability, your quotation shows the exact booking advance and remaining balance. Payment instructions and accepted methods are shared with the confirmed quotation, so please do not send money against an unverified price.",
    followups: ["booking", "cancellation", "contact"],
  },
  cancellation: {
    id: "cancellation",
    chipLabel: "Cancellation policy",
    keywords: ["cancel", "cancellation", "refund", "reschedule", "postpone"],
    answer:
      "Cancellation, amendment, refund and date-change charges vary by package, supplier and departure date. Your exact terms are provided with the confirmed quotation before payment. If you already have a booking, contact the team with your booking reference so they can check the terms that apply to it.",
    followups: ["contact", "booking"],
  },
  inclusions: {
    id: "inclusions",
    chipLabel: "What's included?",
    keywords: ["include", "included", "inclusion", "inclusions", "covered", "come with"],
    answer:
      "Inclusions are package-specific. They can cover hotels, meals, transfers, sightseeing, guides, permits, insurance, visas or flights, but you should never assume every item is bundled. Name a package or destination and I'll read its published inclusions for you.",
    followups: ["flights", "hotels", "visa", "packages"],
  },
  exclusions: {
    id: "exclusions",
    chipLabel: "What's not included?",
    keywords: ["exclude", "excluded", "exclusion", "exclusions", "not included", "extra cost", "pay extra", "additional charge"],
    answer:
      "Exclusions vary by tour and often include items such as airfare, taxes, visa fees, insurance, tips or personal expenses. Name the package and I'll show its actual published exclusions; the final quotation remains the source of truth before payment.",
    followups: ["packages", "price", "payment"],
  },
  policies: {
    id: "policies",
    chipLabel: "Travel policies",
    keywords: ["policy", "policies", "terms", "condition", "conditions", "rules", "amendment"],
    answer:
      "Key policy points: prices and inventory are subject to live agent verification; no payment is taken when you submit a request; package inclusions and exclusions vary; and booking, amendment and cancellation terms are confirmed before payment. Visa, passport, permit and insurance requirements depend on the itinerary and traveller. For a binding answer, use the terms on your confirmed quotation.",
    followups: ["cancellation", "visa", "payment", "contact"],
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
      "You can reach our Kolkata travel desk directly:\n📞 +91 98300 12345 / +91 33 2464 1234\n✉️ info@bandhantours.com\n💬 WhatsApp: +91 98300 12345\nTypical enquiry response time is within 24 hours.",
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
      "Bandhan Tours is a Kolkata-based travel company offering domestic, North East, international, group and custom journeys. You can explore the published itineraries, read guest testimonials, or speak with the travel desk before making a booking decision.",
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
        ? `Some published packages, including ${withVisa[0].title}, list visa support or visa charges in their inclusions.`
        : "Visa requirements depend on your destination and nationality.";
      return `${note} Other packages list visa fees as an exclusion, so name the exact tour and I'll check. Passport validity, documents, processing time and approval are governed by the destination's authorities; Bandhan can assist but cannot guarantee a visa.`;
    },
    followups: ["international", "flights", "contact"],
  },
  flights: {
    id: "flights",
    chipLabel: "Flights included?",
    keywords: ["flight", "flights", "airfare", "air ticket", "airline"],
    answer:
      "Some packages include flights and others are land-only. Name the exact package or destination and I'll check the published inclusions and exclusions instead of guessing.",
    followups: ["packages", "visa", "price"],
  },
  hotels: {
    id: "hotels",
    chipLabel: "Hotels & meals",
    keywords: ["hotel", "hotels", "stay", "accommodation", "resort", "meal", "meals", "breakfast", "food", "cuisine"],
    answer:
      "Hotel category, room basis and meal plan differ by package. The package page and day-by-day itinerary show what is currently published; final hotel names remain subject to the confirmed quotation and availability. Name a tour and I'll check its details.",
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
      "Support, insurance and permit coverage differ by package. Check the exact inclusions before booking, follow current government and local guidance, and disclose medical or mobility needs during enquiry. For an emergency on an active trip, use the contact details in your confirmed travel documents.",
    followups: ["about", "contact", "booking"],
  },
  permits: {
    id: "permits",
    chipLabel: "Permits (NE/Andaman)",
    keywords: ["permit", "permits", "ilp", "inner line permit", "restricted area"],
    answer:
      "Some North East and restricted-area itineraries require permits, and the rules can differ for Indian and foreign nationals. Several published Bandhan packages list permits as included, but this is package-specific. Share nationality and the exact route with the team early so current requirements can be verified.",
    followups: ["northeast", "domestic", "contact"],
  },
  reviews: {
    id: "reviews",
    chipLabel: "Reviews & reputation",
    keywords: ["review", "reviews", "rating", "ratings", "testimonial", "testimonials", "feedback"],
    answer:
      "You can read guest stories and ratings on our Testimonials page. For the clearest picture, compare recent reviews for the kind of trip and destination you're considering.",
    followups: ["about", "packages", "contact"],
  },
  insurance: {
    id: "insurance",
    chipLabel: "Travel insurance",
    keywords: ["insurance", "insured", "medical cover", "travel cover"],
    answer:
      "Travel insurance is included in some tours and excluded from others. Coverage limits, age eligibility and medical conditions depend on the policy. Name a package and I'll check whether insurance appears in its published inclusions or exclusions; always review the actual policy wording before travel.",
    followups: ["safety", "packages", "contact"],
  },
  baggage: {
    id: "baggage",
    chipLabel: "Baggage allowance",
    keywords: ["baggage", "luggage", "suitcase", "check-in", "cabin bag", "weight allowance"],
    answer:
      "Baggage allowance depends on the airline, fare and any internal transfers in your itinerary. If a published package states an allowance, I can show it; otherwise the confirmed airline ticket and quotation are the source of truth.",
    followups: ["flights", "packages", "contact"],
  },
};

const FAQ_LIST = Object.values(FAQS);

const FALLBACK_ANSWER =
  "I couldn't match that confidently, and I don't want to guess. I can check destinations, itineraries, prices, visas, inclusions, exclusions, cancellations and travel policies from the published information — or connect you with a travel designer.";
const FALLBACK_CHIPS = ["packages", "policies", "contact"];

const GREETING =
  "Hi! I'm Miles ✈️, Bandhan Tours' travel assistant. Ask me about destinations, visas, package inclusions or exclusions, cancellations, travel policies, pricing, or booking.";
const GREETING_CHIPS = ["packages", "inclusions", "visa", "cancellation"];

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
    actions: [{ label: "Compare all packages", href: "/packages" }],
  };
}

type PackageQuestion =
  | "inclusions"
  | "exclusions"
  | "flights"
  | "visa"
  | "hotel"
  | "meals"
  | "insurance"
  | "baggage"
  | "cancellation"
  | "price"
  | "itinerary";

function detectPackageQuestions(raw: string): PackageQuestion[] {
  const text = raw.toLowerCase();
  if (/cancel|refund|reschedul|postpone|amend/.test(text)) return ["cancellation"];

  const serviceQuestions: PackageQuestion[] = [];
  if (/\bflight|airfare|air ticket|airline/.test(text)) serviceQuestions.push("flights");
  if (/\bvisa|passport|immigration/.test(text)) serviceQuestions.push("visa");
  if (/\bhotel|accommodation|resort|room|stay\b/.test(text)) serviceQuestions.push("hotel");
  if (/\bmeal|breakfast|lunch|dinner|food\b/.test(text)) serviceQuestions.push("meals");
  if (/insurance|medical cover|travel cover/.test(text)) serviceQuestions.push("insurance");
  if (/baggage|luggage|suitcase|check-in|cabin bag/.test(text)) serviceQuestions.push("baggage");
  if (serviceQuestions.length) return serviceQuestions;

  if (/not included|exclude|exclusion|extra cost|pay extra|additional charge/.test(text)) return ["exclusions"];
  if (/include|inclusion|covered|come with/.test(text)) return ["inclusions"];
  if (/\bprice|pricing|cost|budget|how much|rate\b/.test(text)) return ["price"];
  if (/itinerary|day by day|route|places|sightseeing/.test(text)) return ["itinerary"];
  return [];
}

const PACKAGE_DETAIL_PATTERNS: Record<Exclude<PackageQuestion, "inclusions" | "exclusions" | "cancellation" | "price" | "itinerary">, RegExp> = {
  flights: /flight|airfare|air ticket|airport|airline/i,
  visa: /visa|passport|immigration|permit/i,
  hotel: /hotel|accommodation|resort|room|stay/i,
  meals: /meal|breakfast|lunch|dinner|food|restaurant/i,
  insurance: /insurance|medical cover|travel cover/i,
  baggage: /baggage|luggage|suitcase|check-in|cabin bag|\bkg\b/i,
};

function packageActions(pkg: TourPackage): BotResponse["actions"] {
  return [
    { label: "View package details", href: `/packages/${pkg.id}` },
    { label: "Enquire about this tour", href: contactEnquiryHref(pkg.title) },
  ];
}

function packageServiceDetail(pkg: TourPackage, question: Exclude<PackageQuestion, "inclusions" | "exclusions" | "cancellation" | "price" | "itinerary">): string {
  const inclusions = pkg.inclusions ?? [];
  const exclusions = pkg.exclusions ?? [];
  const pattern = PACKAGE_DETAIL_PATTERNS[question];
  const included = inclusions.filter((item) => pattern.test(item));
  const excluded = exclusions.filter((item) => pattern.test(item));
  const label = question === "hotel" ? "hotel/accommodation" : question;
  if (!included.length && !excluded.length) {
    return `${label}: I couldn't find a published entry. Please verify it in the confirmed quotation.`;
  }
  const sections: string[] = [];
  if (included.length) sections.push(`Listed as included:\n${listDetails(included, "")}`);
  if (excluded.length) sections.push(`Listed as excluded:\n${listDetails(excluded, "")}`);
  return `${label}:\n${sections.join("\n\n")}`;
}

function packageQuestionAnswer(pkg: TourPackage, question: PackageQuestion): BotResponse {
  const inclusions = pkg.inclusions ?? [];
  const exclusions = pkg.exclusions ?? [];
  const common: Pick<BotResponse, "actions" | "packageId"> = {
    actions: packageActions(pkg),
    packageId: pkg.id,
  };

  if (question === "inclusions") {
    return {
      ...common,
      text: `${pkg.title} currently lists these inclusions:\n${listDetails(inclusions, "No detailed inclusions are published yet. Please request the confirmed quotation.")}\n\nPlease check the final quotation before payment, as availability can change.`,
      chips: ["exclusions", "booking", "policies"],
    };
  }
  if (question === "exclusions") {
    return {
      ...common,
      text: `${pkg.title} currently lists these exclusions:\n${listDetails(exclusions, "No detailed exclusions are published yet. Please request the confirmed quotation.")}\n\nAnything not explicitly included should be verified with the travel desk.`,
      chips: ["inclusions", "price", "policies"],
    };
  }
  if (question === "price") {
    return {
      ...common,
      text: `${pkg.title} is published from ${pkg.price} per person for ${pkg.duration}. The final total depends on dates, traveller mix, room occupancy, add-ons, taxes and live availability; an agent confirms it before payment.`,
      chips: ["inclusions", "exclusions", "booking"],
    };
  }
  if (question === "itinerary") {
    const days = (pkg.itinerary ?? []).slice(0, 5).map((day) => `• Day ${day.day}: ${day.title}`);
    return {
      ...common,
      text: days.length
        ? `${pkg.title} is a ${pkg.duration} journey. Here's the opening route:\n${days.join("\n")}${(pkg.itinerary?.length ?? 0) > 5 ? "\n• …open the package for the complete day-by-day plan" : ""}`
        : `${pkg.title} runs for ${pkg.duration}. Its detailed day-by-day itinerary is available on the package page.`,
      chips: ["inclusions", "exclusions", "booking"],
    };
  }
  if (question === "cancellation") {
    return {
      ...common,
      text: `Cancellation and amendment charges for ${pkg.title} depend on the confirmed departure, suppliers and timing. They are not stated in the public package data, so I won't invent a percentage. The exact terms will be included with your confirmed quotation before payment.`,
      chips: ["policies", "contact", "booking"],
    };
  }

  return {
    ...common,
    text: `${pkg.title} — ${packageServiceDetail(pkg, question)}\n\nThe final confirmed quotation takes priority if supplier terms change.`,
    chips: ["inclusions", "exclusions", "contact"],
  };
}

function packageQuestionsAnswer(pkg: TourPackage, questions: PackageQuestion[]): BotResponse {
  if (questions.length <= 1) return packageQuestionAnswer(pkg, questions[0] ?? "itinerary");
  const serviceQuestions = questions.filter(
    (question): question is Exclude<PackageQuestion, "inclusions" | "exclusions" | "cancellation" | "price" | "itinerary"> =>
      question in PACKAGE_DETAIL_PATTERNS
  );
  if (serviceQuestions.length !== questions.length) return packageQuestionAnswer(pkg, questions[0]);
  return {
    text: `${pkg.title} — published package details:\n\n${serviceQuestions
      .map((question) => packageServiceDetail(pkg, question))
      .join("\n\n")}\n\nThe final confirmed quotation takes priority if supplier terms change.`,
    actions: packageActions(pkg),
    packageId: pkg.id,
    chips: ["inclusions", "exclusions", "contact"],
  };
}

function answerPublishedPackageFaq(pkg: TourPackage, raw: string): BotResponse | null {
  const faqs = pkg.faqs ?? [];
  if (!faqs.length) return null;
  const matched = findBySubstringOrFuzzy(faqs, raw, (faq) => [faq.question], ["question"]);
  if (!matched) return null;
  return {
    text: `${pkg.title}: ${matched.answer}`,
    actions: packageActions(pkg),
    packageId: pkg.id,
    chips: ["inclusions", "exclusions", "contact"],
  };
}

/** A confident, specific match (a real package, destination, or article
 * title) wins over the generic keyword FAQs below it, so "bali" answers with
 * the actual Bali package instead of the generic "international tours"
 * blurb, and "goa" or "kashmir" (which have no full package yet) still
 * answer from the featured-destinations data instead of falling through. */
export function resolveResponse(raw: string, ctx: KnowledgeContext, activePackage?: TourPackage | null): BotResponse {
  const generic = isGenericQuery(raw);
  const packageQuestions = detectPackageQuestions(raw);

  if (!generic) {
    const pkg = findBySubstringOrFuzzy(
      ctx.packages,
      raw,
      (p) => [p.title, ...p.highlights],
      ["title", "highlights"]
    );
    if (pkg) {
      const publishedFaq = answerPublishedPackageFaq(pkg, raw);
      if (publishedFaq) return publishedFaq;
      return packageQuestions.length ? packageQuestionsAnswer(pkg, packageQuestions) : packageSummary(pkg);
    }

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
      if (pkgMatches.length === 1) {
        const matchedPackage = pkgMatches[0];
        const publishedFaq = answerPublishedPackageFaq(matchedPackage, raw);
        if (publishedFaq) return publishedFaq;
        return packageQuestions.length ? packageQuestionsAnswer(matchedPackage, packageQuestions) : packageSummary(matchedPackage);
      }
      if (pkgMatches.length > 1) return multiPackageAnswer(pkgMatches);

      const destMatches = findAllByToken(ctx.destinations, token, (d) => [d.name]);
      if (destMatches.length === 1) return destinationSummary(destMatches[0]);
    }
  }

  // Follow-up questions such as “Are flights included?” inherit the last
  // package the customer discussed, which makes the assistant conversational
  // without sending any personal data to a third-party AI service.
  if (activePackage && packageQuestions.length) {
    return packageQuestionsAnswer(activePackage, packageQuestions);
  }

  const faq = findFaq(raw);
  if (faq) {
    return faqResponse(faq, ctx);
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
  actions?: BotResponse["actions"];
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
    { id: 1, from: "bot", text: GREETING, chips: GREETING_CHIPS },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);
  const [teaserDismissed, setTeaserDismissed] = useState(false);
  const [hop, setHop] = useState(0); // bumps to replay Miles' happy hop on each reply

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageSeq = useRef(1);
  const activePackageId = useRef<string | null>(null);

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
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => launcherRef.current?.focus());
      }
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

  const closePanel = () => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  };

  // Generate the id up front so the state updater stays pure (React may invoke
  // updaters more than once; allocating from a ref keeps ids deterministic.
  const appendMessage = (msg: Omit<Message, "id">) => {
    const id = ++messageSeq.current;
    setMessages((prev) => [...prev, { id, ...msg }]);
  };

  const pushBotReply = (response: BotResponse) => {
    setTyping(true);
    replyTimer.current = setTimeout(() => {
      replyTimer.current = null;
      setTyping(false);
      setHop((h) => h + 1);
      if (response.packageId) activePackageId.current = response.packageId;
      appendMessage({ from: "bot", text: response.text, chips: response.chips, actions: response.actions });
    }, 650);
  };

  const sendText = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    appendMessage({ from: "user", text });
    setInput("");
    const activePackage = knowledge.packages.find((pkg) => pkg.id === activePackageId.current);
    pushBotReply(resolveResponse(text, knowledge, activePackage));
  };

  const sendChip = (faqId: string) => {
    const faq = FAQS[faqId];
    if (!faq || typing) return;
    appendMessage({ from: "user", text: faq.chipLabel });
    pushBotReply(faqResponse(faq, knowledge));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendText(input);
  };

  const resetConversation = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setTyping(false);
    setInput("");
    activePackageId.current = null;
    messageSeq.current += 1;
    setMessages([
      { id: messageSeq.current, from: "bot", text: GREETING, chips: GREETING_CHIPS },
    ]);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  // Keep the assistant off the admin console.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/agent")) return null;

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
              aria-label="Dismiss chat suggestion"
              type="button"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <button type="button" onClick={openPanel} className="flex items-start gap-3 text-left">
              <MilesAvatar className="h-9 w-9 shrink-0" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
                  Bandhan trip desk
                </p>
                <p className="mt-1 text-sm font-semibold leading-snug text-primary">
                  Need help finding the right tour?
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div
          id="bandhan-chat-panel"
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
                type="button"
              >
                <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v6h6" />
                </svg>
              </button>
              <button
                onClick={closePanel}
                className="p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
                type="button"
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
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
            aria-label="Conversation with Miles"
            className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-5"
          >
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

                {/* Useful next actions: real details, enquiry, phone or WhatsApp. */}
                {m.from === "bot" && m.actions && m.actions.length > 0 && (
                  <div className="ml-9 mt-2.5 flex flex-wrap gap-2">
                    {m.actions.map((action) => (
                      <Link
                        key={`${m.id}-${action.href}`}
                        href={action.href}
                        onClick={() => setOpen(false)}
                        target={action.href.startsWith("http") ? "_blank" : undefined}
                        rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                        className="inline-flex items-center gap-2 border border-primary bg-white px-3.5 py-2 text-[11px] font-bold text-primary transition duration-200 hover:bg-primary hover:text-white"
                      >
                        {action.label}
                        <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    ))}
                  </div>
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
                          type="button"
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
              <div className="flex items-start gap-2.5" role="status" aria-label="Miles is typing">
                <span className="sr-only">Miles is typing</span>
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
                autoComplete="off"
                maxLength={500}
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
              Published information · Human help available
            </p>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        ref={launcherRef}
        onClick={() => (open ? setOpen(false) : openPanel())}
        className="fixed bottom-5 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-gold shadow-[0_14px_40px_rgba(7,32,60,0.28)] transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-primary-light active:translate-y-0 active:scale-95 sm:bottom-6 sm:right-6"
        aria-label={open ? "Close chat" : `Chat with ${BOT_NAME}`}
        aria-expanded={open}
        aria-controls="bandhan-chat-panel"
        type="button"
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
