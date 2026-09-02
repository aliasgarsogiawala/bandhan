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

const MAX_INPUT_LENGTH = 500;
const MAX_RESPONSE_LENGTH = 4_000;
const MAX_CONVERSATION_MESSAGES = 60;
const RATE_LIMIT_WINDOW_MS = 30_000;
const RATE_LIMIT_MAX_MESSAGES = 8;

const SECURITY_CHIPS = ["packages", "policies", "contact"];

const SECURITY_RESPONSES = {
  sensitive: {
    text:
      "For your security, please don't share passwords, OTPs, card or bank details, government ID numbers, personal email addresses, or phone numbers in chat. Use the dedicated booking/enquiry form for traveller information, or contact Bandhan Tours directly.",
    chips: SECURITY_CHIPS,
    actions: [{ label: "Open enquiry form", href: contactEnquiryHref() }],
  },
  injection: {
    text:
      "I can only help with Bandhan Tours travel information. I can't reveal internal instructions, change my security rules, execute code, or follow requests to bypass safeguards.",
    chips: SECURITY_CHIPS,
  },
  nsfw: {
    text:
      "Miles is a family-safe travel assistant and can't accept or display sexually explicit, exploitative, hateful, or graphically violent content. Please keep the conversation respectful and travel-related.",
    chips: SECURITY_CHIPS,
  },
  rateLimit: {
    text: "You're sending messages very quickly. Please wait a moment, then try again or use the enquiry form for detailed requests.",
    chips: SECURITY_CHIPS,
  },
  tooLong: {
    text: `Please keep each message under ${MAX_INPUT_LENGTH} characters and avoid including personal or payment details. You can split a travel question into smaller messages.`,
    chips: SECURITY_CHIPS,
  },
} satisfies Record<string, BotResponse>;

interface ValidatedInput {
  text: string;
  displayText: string;
  blockedResponse?: BotResponse;
}

/** Remove invisible direction overrides and control characters that can make
 * malicious text look different from the value the application processes. */
function normalizeChatInput(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[\u202A-\u202E\u2066-\u2069]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function passesLuhn(value: string): boolean {
  let sum = 0;
  let doubleDigit = false;
  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index]);
    if (doubleDigit) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleDigit = !doubleDigit;
  }
  return sum > 0 && sum % 10 === 0;
}

function containsPaymentCard(raw: string): boolean {
  const candidates = raw.match(/(?:\d[ -]?){13,19}/g) ?? [];
  return candidates.some((candidate) => {
    const digits = candidate.replace(/\D/g, "");
    return digits.length >= 13 && digits.length <= 19 && passesLuhn(digits);
  });
}

function containsSensitiveData(raw: string): boolean {
  const labelledSecret =
    /\b(?:otp|one[- ]time password|cvv|cvc|atm pin|upi pin|password|passcode|bank account|account number|aadhaar|aadhar|passport number|pan number|upi id)\b\s*(?::|=|\bis\b)\s*[a-z0-9@._-]{3,}/i;
  const emailAddress = /\b[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+\b/i;
  const indianPhone = /(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/;
  const aadhaar = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;
  const pan = /\b[A-Z]{5}\d{4}[A-Z]\b/i;
  return (
    labelledSecret.test(raw) ||
    emailAddress.test(raw) ||
    indianPhone.test(raw) ||
    aadhaar.test(raw) ||
    pan.test(raw) ||
    containsPaymentCard(raw)
  );
}

function containsInjectionAttempt(raw: string): boolean {
  return [
    /\b(?:ignore|forget|override|disregard)\b.{0,45}\b(?:instructions?|rules?|prompt|safeguards?|system|developer)\b/i,
    /\b(?:reveal|show|print|repeat|leak|expose)\b.{0,45}\b(?:system prompt|developer message|hidden instructions?|secrets?|environment variables?)\b/i,
    /\b(?:jailbreak|developer mode|dan mode|bypass (?:security|safeguards?|rules?))\b/i,
    /<\s*script\b|javascript\s*:|\bon(?:error|load|click)\s*=/i,
    /\b(?:execute|eval|run)\b.{0,30}\b(?:javascript|shell|terminal|command|code)\b/i,
  ].some((pattern) => pattern.test(raw));
}

/** Conservative family-safe moderation. Romantic trips, honeymoons, couples,
 * and adult traveller pricing are intentionally not treated as NSFW. */
function containsNsfwContent(raw: string): boolean {
  const normalized = raw
    .toLowerCase()
    .replace(/0/g, "o")
    .replace(/@/g, "a")
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/[4^]/g, "a")
    .replace(/[5$]/g, "s")
    .replace(/7/g, "t")
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const compact = normalized.replace(/\s/g, "");
  const explicitPatterns = [
    /\b(?:porn(?:ography)?|nsfw|nudes?|nudity|naked|sexting|sexual|erotic|fetish|orgy|brothel|prostitut(?:e|ion)|onlyfans)\b/,
    /\b(?:sex tourism|looking for sex|pay for sex|sexual services?|explicit content)\b/,
    /\b(?:rape|molest(?:ation)?|sexual assault|child exploitation)\b/,
    /\b(?:graphic gore|gory|behead(?:ing)?|dismember(?:ment)?|snuff film|graphic torture)\b/,
  ];
  const obfuscatedExplicit = /(?:porn(?:ography)?|onlyfans|sexting|brothel|prostitution)/;
  return explicitPatterns.some((pattern) => pattern.test(normalized)) || obfuscatedExplicit.test(compact);
}

export function validateChatInput(raw: string): ValidatedInput {
  if (raw.length > MAX_INPUT_LENGTH) {
    return { text: "", displayText: "Message withheld: too long", blockedResponse: SECURITY_RESPONSES.tooLong };
  }
  const text = normalizeChatInput(raw);
  if (containsNsfwContent(text)) {
    return { text: "", displayText: "Inappropriate content withheld", blockedResponse: SECURITY_RESPONSES.nsfw };
  }
  if (containsSensitiveData(text)) {
    return { text: "", displayText: "Sensitive information withheld", blockedResponse: SECURITY_RESPONSES.sensitive };
  }
  if (containsInjectionAttempt(text)) {
    return { text: "", displayText: "Unsupported request blocked", blockedResponse: SECURITY_RESPONSES.injection };
  }
  return { text, displayText: text };
}

function isSafeActionHref(href: string): boolean {
  if (/^\/(?:packages|destinations|blog|book|plan-trip|contact|testimonials|about|mice)(?:[/?#]|$)/.test(href)) return true;
  if (/^\/#(?:departures|packages|testimonials|contact)/.test(href)) return true;
  if (href === "https://wa.me/919422332610") return true;
  if (href === "tel:+919422332610") return true;
  return false;
}

/** Catalogue content can be edited in the admin UI. React escapes message
 * text, and this final boundary also caps output and drops any unexpected link. */
function secureBotResponse(response: BotResponse): BotResponse {
  const cleanedText = response.text
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .slice(0, MAX_RESPONSE_LENGTH);
  if (containsNsfwContent(cleanedText)) return SECURITY_RESPONSES.nsfw;
  return {
    ...response,
    text: cleanedText,
    chips: response.chips?.filter((chip) => Object.hasOwn(FAQS, chip)).slice(0, 6),
    actions: response.actions?.filter((action) => isSafeActionHref(action.href)).slice(0, 3),
  };
}

function resolveAnswer(faq: Faq, ctx: KnowledgeContext): string {
  return typeof faq.answer === "function" ? faq.answer(ctx) : faq.answer;
}

function faqResponse(faq: Faq, ctx: KnowledgeContext): BotResponse {
  const response: BotResponse = { text: resolveAnswer(faq, ctx), chips: faq.followups };
  if (faq.id === "contact") {
    response.actions = [
      { label: "WhatsApp", href: "https://wa.me/919422332610" },
      { label: "Call now", href: "tel:+919422332610" },
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
  } else if (faq.id === "about") {
    response.actions = [
      { label: "About Bandhan Tours", href: "/about" },
      { label: "Contact travel desk", href: "/contact" },
    ];
  } else if (faq.id === "location") {
    response.actions = [{ label: "View contact page", href: "/contact" }];
  } else if (faq.id === "mice") {
    response.actions = [
      { label: "Explore MICE services", href: "/mice" },
      { label: "Request corporate proposal", href: contactEnquiryHref("MICE & Corporate Enquiry") },
    ];
  } else if (faq.id === "offers") {
    response.actions = [
      { label: "Browse packages", href: "/packages" },
      { label: "Enquire for best rate", href: contactEnquiryHref("Discount & Offer Enquiry") },
    ];
  } else if (faq.id === "packages") {
    response.actions = [{ label: "Browse all packages", href: "/packages" }];
  } else if (faq.id === "domestic") {
    response.actions = [{ label: "Explore Domestic tours", href: "/packages" }];
  } else if (faq.id === "northeast") {
    response.actions = [{ label: "Explore North East tours", href: "/packages" }];
  } else if (faq.id === "international") {
    response.actions = [{ label: "Explore International tours", href: "/packages" }];
  } else if (faq.id === "group") {
    response.actions = [{ label: "View group departures", href: "/#departures" }];
  } else if (faq.id === "identity") {
    response.actions = [
      { label: "Browse tour packages", href: "/packages" },
      { label: "Contact travel desk", href: "/contact" },
    ];
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
  identity: {
    id: "identity",
    chipLabel: "Who are you?",
    keywords: [
      "who are you",
      "who are u",
      "who r u",
      "who is this",
      "who it is",
      "who this",
      "who is miles",
      "what is miles",
      "who am i talking to",
      "who am i chatting with",
      "who speaks",
      "who are you talking to",
      "what is your name",
      "whats your name",
      "what s your name",
      "what is ur name",
      "whats ur name",
      "your name",
      "ur name",
      "what are you called",
      "what do i call you",
      "tell me about yourself",
      "introduce yourself",
      "about yourself",
      "who made you",
      "who created you",
      "who built you",
      "are you a bot",
      "are you a real person",
      "are you human",
      "are you an ai",
      "are you ai",
      "are you robot",
      "are you a robot",
      "what are you",
    ],
    answer:
      "I'm Miles ✈️, Bandhan Tours' digital travel assistant! I'm here 24/7 to help you discover holiday packages, check itineraries and live pricing, explain inclusions, visas and policies, or connect you directly with our travel specialists in Thane. How can I help you plan your journey?",
    followups: ["packages", "domestic", "international", "contact"],
  },
  hello: {
    id: "hello",
    chipLabel: "Say hi",
    keywords: [
      "hi",
      "hey",
      "hello",
      "namaste",
      "good morning",
      "good afternoon",
      "good evening",
      "good day",
      "greetings",
      "whats up",
      "what's up",
      "howdy",
      "sup",
      "yo",
      "hola",
      "salut",
    ],
    answer: "Hey there! 👋 I'm Miles, your travel planning assistant at Bandhan Tours. How can I help you plan your dream holiday today?",
    followups: ["packages", "domestic", "international", "custom"],
  },
  howareyou: {
    id: "howareyou",
    chipLabel: "How are you?",
    keywords: [
      "how are you",
      "how are u",
      "how r u",
      "how are you doing",
      "how do you do",
      "how is it going",
      "how's it going",
      "hows it going",
      "how are things",
      "how are you today",
    ],
    answer: "I'm doing great, thank you for asking! ✈️ Ready and excited to help you plan your next vacation. Where are you dreaming of going?",
    followups: ["packages", "domestic", "international", "custom"],
  },
  help: {
    id: "help",
    chipLabel: "How I can help",
    keywords: [
      "help",
      "help me",
      "what can you do",
      "how can you help",
      "what do you do",
      "features",
      "capabilities",
      "guide",
      "menu",
      "options",
      "commands",
      "how to use",
      "what can i ask",
      "i need help",
      "assistance",
    ],
    answer:
      "Here is what I can help you with:\n• 🏖️ Explore packages across Domestic, North East & International destinations\n• 💰 Check starting prices and package estimates\n• 📋 Look up inclusions, exclusions, hotels, meals & flight details\n• 🛂 Information on visas and travel permits\n• 📅 Group departure dates & custom trip planning\n• 📞 Connect directly with our Thane travel desk via WhatsApp or phone\n\nWhat would you like to explore?",
    followups: ["packages", "custom", "group", "contact"],
  },
  ok: {
    id: "ok",
    chipLabel: "Got it!",
    keywords: [
      "ok",
      "okay",
      "cool",
      "awesome",
      "perfect",
      "got it",
      "sure",
      "alright",
      "great",
      "nice",
      "sounds good",
      "understood",
      "good bot",
      "you are awesome",
      "super",
      "wonderful",
      "fine",
    ],
    answer: "Glad I could help! 😊 Let me know if you'd like to explore specific packages, customize an itinerary, or talk to our travel team.",
    followups: ["packages", "custom", "contact"],
  },
  thanks: {
    id: "thanks",
    chipLabel: "Thanks!",
    keywords: [
      "thank",
      "thanks",
      "thank you",
      "thank you so much",
      "thx",
      "ty",
      "cheers",
      "appreciate",
      "appreciate it",
      "great thanks",
      "thanks a lot",
      "many thanks",
    ],
    answer: "Anytime! 😊 Have a wonderful journey — I'm right here if anything else comes up.",
    followups: ["packages", "contact"],
  },
  bye: {
    id: "bye",
    chipLabel: "Goodbye",
    keywords: [
      "bye",
      "goodbye",
      "see you",
      "see ya",
      "cya",
      "have a nice day",
      "talk to you later",
      "ttyl",
      "farewell",
      "take care",
      "good night",
      "later",
    ],
    answer: "Safe travels! ✈️ Have a wonderful day, and come back anytime you need travel ideas or assistance.",
    followups: ["packages", "contact"],
  },
  about: {
    id: "about",
    chipLabel: "About Bandhan",
    keywords: [
      "about bandhan",
      "bandhan tours",
      "about company",
      "about your company",
      "about us",
      "who is bandhan",
      "what is bandhan",
      "why bandhan",
      "why choose bandhan",
      "company history",
      "tell me about bandhan",
      "are you legit",
      "is bandhan reliable",
      "reputation",
      "trustworthy",
      "trust",
      "travel agency",
      "agency",
      "company",
    ],
    answer:
      "Bandhan Tours is a trusted travel agency based in Thane West, Maharashtra. We specialize in handcrafted domestic tours, North East expeditions, international holidays, fixed group departures, and bespoke family/corporate vacations. With transparent pricing, verified hotels, and dedicated tour leaders, we make every trip seamless.",
    followups: ["packages", "location", "contact", "reviews"],
  },
  packages: {
    id: "packages",
    chipLabel: "Tour packages",
    keywords: [
      "package",
      "tour",
      "trip",
      "holiday",
      "vacation",
      "all packages",
      "itinerary",
      "browse",
      "show packages",
      "explore packages",
    ],
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
    keywords: [
      "domestic",
      "india",
      "indian",
      "rajasthan",
      "kerala",
      "andaman",
      "karnataka",
      "ayodhya",
      "varanasi",
      "temple",
      "kanyakumari",
      "kashmir",
      "goa",
      "himachal",
      "south india",
      "marwad",
      "mewad",
    ],
    answer: (ctx) => categoryAnswer("domestic", ctx.packages.filter((p) => p.category === "Domestic")),
    followups: ["northeast", "international", "booking", "contact"],
  },
  northeast: {
    id: "northeast",
    chipLabel: "North East tours",
    keywords: [
      "northeast",
      "north east",
      "sikkim",
      "gangtok",
      "darjeeling",
      "meghalaya",
      "shillong",
      "assam",
      "arunachal",
      "nagaland",
      "manipur",
      "tripura",
      "mizoram",
      "seven sisters",
      "kaziranga",
      "tawang",
      "smt",
      "3 sisters",
      "4 sisters",
    ],
    answer: (ctx) => categoryAnswer("North East", ctx.packages.filter((p) => p.category === "North East")),
    followups: ["permits", "booking", "price", "contact"],
  },
  international: {
    id: "international",
    chipLabel: "International tours",
    keywords: [
      "international",
      "abroad",
      "overseas",
      "foreign",
      "thailand",
      "bali",
      "singapore",
      "malaysia",
      "bhutan",
      "vietnam",
      "europe",
      "austria",
      "italy",
      "germany",
      "switzerland",
      "london",
      "edinburgh",
      "paris",
      "dubai",
      "maldives",
      "baku",
      "azerbaijan",
      "georgia",
      "almaty",
      "japan",
      "scandinavia",
      "south africa",
    ],
    answer: (ctx) => categoryAnswer("international", ctx.packages.filter((p) => p.category === "International")),
    followups: ["visa", "custom", "booking", "contact"],
  },
  booking: {
    id: "booking",
    chipLabel: "How to book",
    keywords: [
      "book",
      "booking",
      "reserve",
      "reservation",
      "enquire",
      "enquiry",
      "inquiry",
      "signup",
      "register",
      "how to book",
      "booking process",
      "how do i book",
    ],
    answer:
      "Booking is simple: choose a package or build a custom trip, add traveller details, and submit the request. No payment is collected at that stage. A Bandhan agent first verifies live pricing and availability, then sends the confirmed quotation and booking terms for your approval.",
    followups: ["payment", "cancellation", "contact"],
  },
  payment: {
    id: "payment",
    chipLabel: "Payment & advance",
    keywords: [
      "payment",
      "pay",
      "advance",
      "deposit",
      "installment",
      "emi",
      "upi",
      "card",
      "money",
      "net banking",
      "gpay",
      "phonepe",
      "bank transfer",
      "how to pay",
      "payment options",
    ],
    answer:
      "There is no payment required just to submit an enquiry or booking request. Once availability is confirmed, your quotation clearly outlines the advance deposit and payment schedule. Verified payment instructions (Bank Transfer, UPI, Cards) are provided directly by your dedicated Bandhan consultant.",
    followups: ["booking", "cancellation", "contact"],
  },
  cancellation: {
    id: "cancellation",
    chipLabel: "Cancellation policy",
    keywords: [
      "cancel",
      "cancellation",
      "refund",
      "reschedule",
      "postpone",
      "cancellation policy",
      "refund policy",
      "can i cancel",
    ],
    answer:
      "Cancellation, amendment, refund and date-change charges vary by package, supplier contracts (airlines, hotels) and departure dates. Detailed terms are provided in your confirmed quotation before any payment is made. If you already have an active booking, contact our team with your booking reference to review your specific terms.",
    followups: ["contact", "booking", "policies"],
  },
  inclusions: {
    id: "inclusions",
    chipLabel: "What's included?",
    keywords: [
      "include",
      "included",
      "inclusion",
      "inclusions",
      "covered",
      "come with",
      "what is included",
      "what's included",
    ],
    answer:
      "Inclusions vary by package — typical inclusions cover accommodation, daily breakfast (and meals as per itinerary), sightseeing tours, AC transfers, and guide services. Name a specific tour (e.g. Bali, Europe, Andaman) and I'll list its exact published inclusions!",
    followups: ["exclusions", "flights", "hotels", "visa"],
  },
  exclusions: {
    id: "exclusions",
    chipLabel: "What's not included?",
    keywords: [
      "exclude",
      "excluded",
      "exclusion",
      "exclusions",
      "not included",
      "extra cost",
      "pay extra",
      "additional charge",
      "what is excluded",
    ],
    answer:
      "Exclusions typically include personal expenses, optional activities, tips, porterage, meals not stated in the plan, and mandatory GST/TCS where applicable. Name a specific package and I'll show its exact published exclusions.",
    followups: ["inclusions", "price", "payment"],
  },
  policies: {
    id: "policies",
    chipLabel: "Travel policies",
    keywords: [
      "policy",
      "policies",
      "terms",
      "condition",
      "conditions",
      "rules",
      "amendment",
      "terms and conditions",
    ],
    answer:
      "Key policy points: prices and inventory are subject to live agent verification; no payment is taken when you submit a request; package inclusions and exclusions vary; and booking, amendment and cancellation terms are confirmed before payment. Visa, passport, permit and insurance requirements depend on the itinerary and traveller. For a binding answer, use the terms on your confirmed quotation.",
    followups: ["cancellation", "visa", "payment", "contact"],
  },
  group: {
    id: "group",
    chipLabel: "Group departures",
    keywords: [
      "group",
      "groups",
      "departure",
      "departures",
      "join",
      "fixed",
      "batch",
      "solo",
      "together",
      "fixed departure",
      "group tour",
      "group tours",
    ],
    answer:
      "Our group departures are fixed-date tours you can join with a shared tour captain — perfect for solo travellers, couples, and families. You'll see live seat availability on our home page under “Upcoming Group Departures.” Want to reserve seats?",
    followups: ["booking", "packages", "contact"],
  },
  custom: {
    id: "custom",
    chipLabel: "Custom itinerary",
    keywords: [
      "custom",
      "customize",
      "customise",
      "customized",
      "customised",
      "tailor",
      "tailormade",
      "tailor-made",
      "personalise",
      "personalize",
      "flexible",
      "bespoke",
      "private tour",
      "own itinerary",
    ],
    answer:
      "Every package can be reshaped — different dates, hotels, pace, or an entirely new route. Just tell us what you have in mind and we design it around your budget and taste, free of charge. Ready to start planning?",
    followups: ["booking", "contact", "international"],
  },
  mice: {
    id: "mice",
    chipLabel: "Corporate & MICE",
    keywords: [
      "mice",
      "corporate",
      "company trip",
      "business trip",
      "team outing",
      "incentive",
      "conference",
      "events",
      "team trip",
      "corporate retreat",
      "corporate tour",
      "offsite",
      "company offsite",
    ],
    answer:
      "We manage end-to-end Corporate Offsites, MICE (Meetings, Incentives, Conferences & Exhibitions), and Team Retreats across domestic and international destinations with luxury stays, conference halls, team-building activities, and event branding.",
    followups: ["contact", "custom", "packages"],
  },
  offers: {
    id: "offers",
    chipLabel: "Deals & Offers",
    keywords: [
      "offer",
      "offers",
      "discount",
      "discounts",
      "deal",
      "deals",
      "promo",
      "coupon",
      "special price",
      "early bird",
      "festive discount",
      "group discount",
      "any discount",
    ],
    answer:
      "We offer seasonal promotions, early-bird savings, and special group booking discounts! Special rates are also available for families and large groups. Contact our travel desk or submit an enquiry to get the best active quote for your dates.",
    followups: ["packages", "group", "contact"],
  },
  price: {
    id: "price",
    chipLabel: "Pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "budget",
      "cheap",
      "expensive",
      "fee",
      "charge",
      "rate",
      "how much",
      "estimates",
    ],
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
    keywords: [
      "contact",
      "phone",
      "call",
      "email",
      "whatsapp",
      "reach",
      "talk",
      "human",
      "agent",
      "number",
      "speak",
      "support",
      "talk to human",
      "speak with agent",
      "customer care",
      "customer support",
      "helpline",
      "talk to someone",
      "representative",
    ],
    answer:
      "You can reach our Thane travel desk directly:\n📞 Phone: +91 94223 32610\n✉️ Email: info@bandhantours.com\n💬 WhatsApp: +91 94223 32610\n\nTypical enquiry response time is within 24 hours, Mon-Sat 10 AM – 7 PM.",
    followups: ["hours", "location", "booking"],
  },
  location: {
    id: "location",
    chipLabel: "Office location",
    keywords: [
      "office",
      "location",
      "address",
      "visit",
      "branch",
      "where is your office",
      "where are you located",
      "thane office",
      "head office",
      "headquarters",
      "hq",
      "where to visit",
      "thane address",
    ],
    answer:
      "We're based in Thane:\n🏢 226, Lodha Supremus Tower 2, Road No. 22, Wagle Industrial Estate, Thane West, Maharashtra – 400604.\n\nFeel free to visit us during working hours, or connect with us online anytime!",
    followups: ["hours", "contact"],
  },
  hours: {
    id: "hours",
    chipLabel: "Working hours",
    keywords: [
      "hours",
      "timing",
      "timings",
      "working hours",
      "office hours",
      "office timings",
      "opening hours",
      "when are you open",
      "when do you open",
      "open hours",
      "schedule",
    ],
    answer:
      "Our office is open Monday to Saturday, 10:00 AM – 7:00 PM. Enquiries sent online or via WhatsApp are monitored 7 days a week and answered within 24 hours.",
    followups: ["contact", "location"],
  },
  visa: {
    id: "visa",
    chipLabel: "Visa help",
    keywords: [
      "visa",
      "visas",
      "passport",
      "immigration",
      "documents",
      "document",
      "visa assistance",
      "visa required",
      "is visa included",
    ],
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
    keywords: [
      "flight",
      "flights",
      "airfare",
      "air ticket",
      "air tickets",
      "airline",
      "airlines",
      "plane ticket",
      "are flights included",
      "ticket included",
    ],
    answer:
      "Some of our packages (such as fixed group departures) include return flights, while others are land-only to allow flexible flight bookings from your departure city. Name any package or destination and I'll check its exact flight inclusion details!",
    followups: ["packages", "visa", "price"],
  },
  hotels: {
    id: "hotels",
    chipLabel: "Hotels & meals",
    keywords: [
      "hotel",
      "hotels",
      "stay",
      "accommodation",
      "resort",
      "resorts",
      "meal",
      "meals",
      "breakfast",
      "lunch",
      "dinner",
      "food",
      "cuisine",
      "veg food",
      "jain food",
      "indian food",
    ],
    answer:
      "Hotel category, room basis and meal plans differ by package. We handpick quality 3-star, 4-star and 5-star properties with daily breakfast. For group and international tours, delicious Indian meals (including pure vegetarian & Jain options) are often arranged. Name a tour and I'll check its specific hotel and meal arrangements!",
    followups: ["packages", "price", "custom"],
  },
  honeymoon: {
    id: "honeymoon",
    chipLabel: "Honeymoon trips",
    keywords: [
      "honeymoon",
      "couple",
      "couples",
      "romantic",
      "romance",
      "anniversary",
      "wedding trip",
      "candlelight",
    ],
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
    keywords: [
      "family",
      "families",
      "kids",
      "children",
      "senior",
      "seniors",
      "elderly",
      "parents",
      "child",
      "senior citizen",
      "child friendly",
    ],
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
    keywords: [
      "safe",
      "safety",
      "secure",
      "security",
      "emergency",
      "risk",
      "safe for women",
      "safe for solo",
    ],
    answer:
      "Your safety is our top priority. We partner with verified suppliers, trusted drivers, and certified tour captains. Group departures feature dedicated tour leaders, and on-tour emergency support is available 24/7. Always disclose any medical or mobility needs during enquiry so we can tailor the pacing.",
    followups: ["about", "contact", "booking"],
  },
  permits: {
    id: "permits",
    chipLabel: "Permits (NE/Andaman)",
    keywords: [
      "permit",
      "permits",
      "ilp",
      "inner line permit",
      "restricted area",
      "rap",
      "protected area",
      "arunachal permit",
      "sikkim permit",
      "north east permit",
      "northeast permit",
      "permits for north east",
    ],
    answer:
      "Certain North East destinations (like Tawang/Arunachal, Nathula/Sikkim) and island territories require Inner Line Permits (ILP) or Protected Area Permits. Bandhan assists with and arranges permit processing whenever listed in the package inclusions. Just share valid photo IDs and documents during the booking process.",
    followups: ["northeast", "domestic", "contact"],
  },
  reviews: {
    id: "reviews",
    chipLabel: "Reviews & reputation",
    keywords: [
      "review",
      "reviews",
      "rating",
      "ratings",
      "testimonial",
      "testimonials",
      "feedback",
      "guest reviews",
      "customer feedback",
    ],
    answer:
      "Our guests consistently rate us highly for thoughtful planning, responsive support, and transparent pricing! You can browse authentic traveler stories and ratings on our Testimonials page.",
    followups: ["about", "packages", "contact"],
  },
  insurance: {
    id: "insurance",
    chipLabel: "Travel insurance",
    keywords: [
      "insurance",
      "insured",
      "medical cover",
      "travel cover",
      "travel insurance",
      "health insurance",
    ],
    answer:
      "Comprehensive travel insurance is included in many of our international tour packages (covering medical emergencies, baggage loss, etc. for eligible age groups) and can be added to any custom trip. Mention a specific package and I'll verify its published insurance details!",
    followups: ["safety", "packages", "contact"],
  },
  baggage: {
    id: "baggage",
    chipLabel: "Baggage allowance",
    keywords: [
      "baggage",
      "luggage",
      "suitcase",
      "check-in",
      "cabin bag",
      "weight allowance",
      "bag allowance",
      "cabin baggage",
      "check in baggage",
      "baggage rules",
      "baggage policy",
    ],
    answer:
      "Baggage allowance depends on the airline tickets included in your package (typically 15-20 kg check-in + 7 kg cabin for domestic/regional flights). For vehicle transfers, ample boot space is provided for standard suitcase sizes.",
    followups: ["flights", "packages", "contact"],
  },
};

const FAQ_LIST = Object.values(FAQS);

const FALLBACK_ANSWER =
  "I couldn't match that confidently, and I don't want to guess. I can check destinations, itineraries, prices, visas, inclusions, exclusions, cancellations and travel policies from the published information — or connect you with a travel designer.";
const FALLBACK_CHIPS = ["packages", "policies", "contact"];

const GREETING =
  "Hi! I'm Miles ✈️, Bandhan Tours' travel assistant. Ask me about destinations, visas, package inclusions or exclusions, cancellations, travel policies, pricing, or booking.";
const GREETING_CHIPS = ["packages", "domestic", "international", "custom"];

function isIdentityQuery(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const identityPatterns = [
    /\bwho are (?:you|u)\b/,
    /\bwho r u\b/,
    /\bwho is this\b/,
    /\bwho it is\b/,
    /\bwho this\b/,
    /\bwho is miles\b/,
    /\bwhat is miles\b/,
    /\bwho am i (?:talking|chatting) with\b/,
    /\bwho am i (?:talking|speaking) to\b/,
    /\bwho speaks\b/,
    /\bwhat is (?:your|ur) name\b/,
    /\bwhats (?:your|ur) name\b/,
    /\btell me (?:your|ur) name\b/,
    /\b(?:your|ur) name\b/,
    /\bwhat are you called\b/,
    /\bwhat do i call you\b/,
    /\btell me about yourself\b/,
    /\bintroduce yourself\b/,
    /\babout yourself\b/,
    /\bwho (?:made|created|built) you\b/,
    /\bare you (?:a )?(?:bot|robot|ai|human|real person)\b/,
    /\bwhat are you\b/,
  ];
  if (identityPatterns.some((pattern) => pattern.test(normalized))) {
    if (/\b(?:bandhan|company|agency)\b/.test(normalized)) {
      return false;
    }
    return true;
  }
  return /^(?:who are you|who are u|who is this|who it is|what is your name|who is miles|who|miles)$/i.test(normalized);
}

function isGreetingQuery(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const greetingPhrases = [
    "good morning",
    "good afternoon",
    "good evening",
    "good day",
    "whats up",
    "what's up",
    "howdy",
    "namaste",
    "greetings",
  ];
  if (greetingPhrases.some((phrase) => normalized.includes(phrase))) return true;
  return /^(?:hi|hey|hello|yo|hola|namaste|sup|salut)$/i.test(normalized);
}

function isHowAreYouQuery(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return /^(?:how are you|how are u|how r u|how are you doing|how do you do|how is it going|how s it going|hows it going|how are things|how are you today)$/i.test(normalized);
}

function isHelpQuery(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const helpPhrases = [
    "what can you do",
    "how can you help",
    "what do you do",
    "what can i ask",
    "how to use",
    "i need help",
    "guide me",
  ];
  if (helpPhrases.some((phrase) => normalized.includes(phrase))) return true;
  return /^(?:help|help me|menu|features|capabilities|options|commands|support|guide)$/i.test(normalized);
}

function isOkQuery(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return /^(?:ok|okay|cool|awesome|perfect|got it|sure|alright|great|nice|sounds good|understood|good bot|super|wonderful|fine)$/i.test(normalized);
}

function isThanksQuery(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const thanksPhrases = [
    "thank you",
    "thank you so much",
    "thanks a lot",
    "many thanks",
    "appreciate it",
    "great thanks",
  ];
  if (thanksPhrases.some((phrase) => normalized.includes(phrase))) return true;
  return /^(?:thanks|thank|thx|ty|cheers|appreciate)$/i.test(normalized);
}

function isByeQuery(raw: string): boolean {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const byePhrases = ["goodbye", "see you", "see ya", "cya", "have a nice day", "talk to you later", "ttyl", "farewell", "take care", "good night"];
  if (byePhrases.some((phrase) => normalized.includes(phrase))) return true;
  return /^(?:bye|goodbye|cya|later)$/i.test(normalized);
}

/** Keyword match: calculates match scores with phrase weighting and word boundaries. */
function findFaq(raw: string): Faq | null {
  const normalized = raw.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  const text = ` ${normalized} `;
  let best: Faq | null = null;
  let bestScore = 0;

  for (const faq of FAQ_LIST) {
    let score = 0;
    const matchedTokens = new Set<string>();

    for (const kw of faq.keywords) {
      const isMultiWord = kw.includes(" ");
      if (isMultiWord) {
        if (text.includes(` ${kw} `) || normalized === kw) {
          score += kw.split(/\s+/).length * 4;
        } else if (text.includes(kw)) {
          score += 3;
        }
      } else if (kw.length <= 3) {
        if (new RegExp(`\\b${kw}\\b`).test(text) && !matchedTokens.has(kw)) {
          matchedTokens.add(kw);
          score += 2;
        }
      } else if (new RegExp(`\\b${kw}\\b`).test(text) && !matchedTokens.has(kw)) {
        matchedTokens.add(kw);
        score += 3;
      } else if (text.includes(kw) && !matchedTokens.has(kw)) {
        matchedTokens.add(kw);
        score += 1;
      }
    }

    if (score > 0 && score >= bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  return bestScore >= 2 ? best : null;
}

/** Common travel and conversational words that should NOT be treated as
 * destination or package search tokens. */
const COMMON_TRAVEL_WORDS = new Set([
  "tour", "tours", "trip", "trips", "package", "packages", "holiday", "holidays",
  "vacation", "vacations", "itinerary", "itineraries", "destination", "destinations",
  "where", "when", "what", "which", "how", "who", "whom", "whose", "why",
  "book", "booking", "reserve", "reservation", "enquire", "enquiry", "inquiry",
  "register", "signup", "quote", "quotation", "price", "pricing", "cost", "budget",
  "cheap", "expensive", "rate", "rates", "fee", "fees", "charge", "charges",
  "offer", "offers", "discount", "discounts", "deal", "deals", "promo", "coupon",
  "special", "specials", "best", "top", "delight", "delights", "classic", "amazing", "grand", "highlight", "highlights",
  "custom", "customise", "customize", "customized", "customised", "tailor", "bespoke",
  "group", "groups", "departure", "departures", "solo", "batch",
  "flight", "flights", "airfare", "airline", "airlines", "ticket", "tickets", "airport",
  "hotel", "hotels", "stay", "stays", "accommodation", "resort", "resorts", "room", "rooms",
  "meal", "meals", "food", "breakfast", "lunch", "dinner", "restaurant", "cuisine",
  "include", "included", "inclusion", "inclusions", "exclude", "excluded", "exclusion", "exclusions",
  "visa", "visas", "passport", "permit", "permits", "ilp", "immigration",
  "insurance", "insured", "medical", "cover", "coverage", "safety", "safe", "risk",
  "baggage", "luggage", "suitcase", "checkin", "rules", "rule",
  "cancel", "cancellation", "refund", "reschedule", "policy", "policies", "terms", "condition", "conditions",
  "domestic", "international", "northeast", "honeymoon", "family", "corporate", "mice", "senior", "seniors",
  "north", "south", "east", "west", "central",
  "contact", "phone", "call", "email", "whatsapp", "human", "agent", "desk", "office", "address",
  "location", "hours", "timing", "timings", "open", "close", "closed", "about", "company", "review",
  "reviews", "rating", "ratings", "testimonial", "testimonials", "feedback",
  "pay", "paying", "payment", "payments", "advance", "deposit", "installment", "emi", "upi", "card", "cards", "bank",
  "time", "times", "season", "seasons", "month", "months", "day", "days", "night", "nights",
  "miles", "bot", "assistant", "ai", "robot", "name", "help", "guide", "info", "information",
  "details", "detail", "thanks", "thank", "hello", "hi", "hey", "goodbye", "bye", "okay", "good",
]);

function isGenericQuery(raw: string): boolean {
  return COMMON_TRAVEL_WORDS.has(raw.trim().toLowerCase());
}

/** Filler words stripped out when extracting the "meaningful" part of a full
 * sentence query (e.g. "what is the price of the europe package" -> "europe"). */
const STOPWORDS = new Set([
  "what", "whats", "is", "are", "the", "a", "an", "of", "for", "to", "in", "on",
  "and", "or", "how", "much", "does", "do", "did", "can", "could", "will", "would",
  "about", "with", "without", "from", "that", "this", "it", "its", "tell", "me", "give",
  "show", "have", "has", "need", "needs", "want", "wants", "you", "your", "there",
  "adult", "adults", "child", "children", "traveller", "travellers", "romantic",
  "some", "any", "like", "know", "please", "just", "also", "wanting", "via", "per",
  "through", "using", "mode", "modes", "way", "ways", "option", "options", "visit", "visiting",
  "go", "going", "travel", "travels", "travelling", "traveling", "see", "view",
]);

/** Pulls out the specific, non-generic words from a query — e.g. "what is
 * the price of the europe package" -> ["europe"] — so a whole-sentence
 * question can still be matched against a single destination/package name
 * embedded in it, instead of matching highlight words. */
function significantTokens(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !STOPWORDS.has(w) && !COMMON_TRAVEL_WORDS.has(w));
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
  const substringHit = items.find((item) => fields(item).some((f) => f && f.toLowerCase().includes(q)));
  if (substringHit) return substringHit;
  const scored = fuzzySearchScored(items, raw, fuzzyKeys, 1);
  return scored.length && scored[0].score <= 0.3 ? scored[0].item : null;
}

/** All items whose fields contain the given token as a substring. */
function findAllByToken<T>(items: T[], token: string, fields: (item: T) => string[]): T[] {
  return items.filter((item) => fields(item).some((f) => f && f.toLowerCase().includes(token)));
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
  const questions: PackageQuestion[] = [];

  if (/\b(?:cancel|cancellation|refund|reschedule|postpone|amend)\b/.test(text)) questions.push("cancellation");
  if (/\b(?:flight|flights|airfare|air ticket|airline|plane ticket)\b/.test(text)) questions.push("flights");
  if (/\b(?:visa|visas|passport|immigration)\b/.test(text)) questions.push("visa");
  if (/\b(?:hotel|hotels|accommodation|resort|resorts|room|stay)\b/.test(text)) questions.push("hotel");
  if (/\b(?:meal|meals|breakfast|lunch|dinner|food|cuisine|veg|jain)\b/.test(text)) questions.push("meals");
  if (/\b(?:insurance|medical cover|travel cover|insured)\b/.test(text)) questions.push("insurance");
  if (/\b(?:baggage|luggage|suitcase|check-in|cabin bag|weight)\b/.test(text)) questions.push("baggage");
  if (/\b(?:not included|exclude|exclusion|exclusions|extra cost|pay extra|additional charge)\b/.test(text)) questions.push("exclusions");
  if (/\b(?:include|included|inclusion|inclusions|covered|come with)\b/.test(text)) questions.push("inclusions");
  if (/\b(?:price|pricing|cost|budget|how much|rate|fee|charge)\b/.test(text)) questions.push("price");
  if (/\b(?:itinerary|day by day|route|places|sightseeing|schedule|plan)\b/.test(text)) questions.push("itinerary");

  return Array.from(new Set(questions));
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
  if (serviceQuestions.length === questions.length) {
    return {
      text: `${pkg.title} — published package details:\n\n${serviceQuestions
        .map((question) => packageServiceDetail(pkg, question))
        .join("\n\n")}\n\nThe final confirmed quotation takes priority if supplier terms change.`,
      actions: packageActions(pkg),
      packageId: pkg.id,
      chips: ["inclusions", "exclusions", "contact"],
    };
  }

  const sections: string[] = [];
  if (questions.includes("price")) {
    sections.push(`💰 Price: From ${pkg.price} per person for ${pkg.duration}.`);
  }
  if (questions.includes("itinerary")) {
    const days = (pkg.itinerary ?? []).slice(0, 4).map((day) => `• Day ${day.day}: ${day.title}`);
    if (days.length) {
      sections.push(`🗺️ Itinerary overview (${pkg.duration}):\n${days.join("\n")}${(pkg.itinerary?.length ?? 0) > 4 ? "\n• …and more on package page" : ""}`);
    }
  }
  if (questions.includes("inclusions")) {
    const inc = pkg.inclusions ?? [];
    sections.push(`📋 Inclusions:\n${listDetails(inc, "Published on package page.")}`);
  }
  if (questions.includes("exclusions")) {
    const exc = pkg.exclusions ?? [];
    sections.push(`❌ Exclusions:\n${listDetails(exc, "Published on package page.")}`);
  }
  for (const sq of serviceQuestions) {
    sections.push(packageServiceDetail(pkg, sq));
  }
  if (questions.includes("cancellation")) {
    sections.push(`Cancellation terms are subject to departure date and airline/hotel contracts, confirmed on your quotation.`);
  }

  return {
    text: `${pkg.title}:\n\n${sections.join("\n\n")}\n\nLive availability and confirmed pricing will be verified by our team before booking.`,
    actions: packageActions(pkg),
    packageId: pkg.id,
    chips: ["booking", "inclusions", "contact"],
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

/** Resolve user input against knowledge base, packages, destinations and FAQs. */
export function resolveResponse(raw: string, ctx: KnowledgeContext, activePackage?: TourPackage | null): BotResponse {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { text: FALLBACK_ANSWER, chips: FALLBACK_CHIPS };
  }

  // 1. Conversational intent / Persona fast-path when no specific tour search is intended
  if (isIdentityQuery(trimmed)) {
    return faqResponse(FAQS.identity, ctx);
  }
  if (isGreetingQuery(trimmed)) {
    return faqResponse(FAQS.hello, ctx);
  }
  if (isHowAreYouQuery(trimmed)) {
    return faqResponse(FAQS.howareyou, ctx);
  }
  if (isHelpQuery(trimmed)) {
    return faqResponse(FAQS.help, ctx);
  }
  if (isOkQuery(trimmed)) {
    return faqResponse(FAQS.ok, ctx);
  }
  if (isThanksQuery(trimmed)) {
    return faqResponse(FAQS.thanks, ctx);
  }
  if (isByeQuery(trimmed)) {
    return faqResponse(FAQS.bye, ctx);
  }

  const generic = isGenericQuery(trimmed);
  const packageQuestions = detectPackageQuestions(trimmed);

  if (!generic) {
    const tokens = significantTokens(trimmed);

    // If a package question is asked and a specific destination or package token is mentioned,
    // match that package and answer the question specifically for it.
    if (packageQuestions.length && tokens.length > 0) {
      for (const token of tokens) {
        const pkgMatches = findAllByToken(ctx.packages, token, (p) => [p.title, p.destination || ""]);
        if (pkgMatches.length >= 1) {
          const matchedPackage = pkgMatches[0];
          const publishedFaq = answerPublishedPackageFaq(matchedPackage, trimmed);
          if (publishedFaq) return publishedFaq;
          return packageQuestionsAnswer(matchedPackage, packageQuestions);
        }
      }
    }

    // Direct whole-query match on package
    const pkg = findBySubstringOrFuzzy(
      ctx.packages,
      trimmed,
      (p) => [p.title, p.destination || ""],
      ["title", "destination"]
    );
    if (pkg) {
      const publishedFaq = answerPublishedPackageFaq(pkg, trimmed);
      if (publishedFaq) return publishedFaq;
      return packageQuestions.length ? packageQuestionsAnswer(pkg, packageQuestions) : packageSummary(pkg);
    }

    // Direct whole-query match on destination
    const dest = findBySubstringOrFuzzy(
      ctx.destinations,
      trimmed,
      (d) => [d.name, d.description],
      ["name", "description"]
    );
    if (dest) return destinationSummary(dest);

    // Extract non-generic, specific tokens (e.g. "bali", "kerala", "europe")
    for (const token of tokens) {
      const pkgMatches = findAllByToken(ctx.packages, token, (p) => [p.title, p.destination || ""]);
      if (pkgMatches.length === 1) {
        const matchedPackage = pkgMatches[0];
        const publishedFaq = answerPublishedPackageFaq(matchedPackage, trimmed);
        if (publishedFaq) return publishedFaq;
        return packageQuestions.length ? packageQuestionsAnswer(matchedPackage, packageQuestions) : packageSummary(matchedPackage);
      }
      if (pkgMatches.length > 1) return multiPackageAnswer(pkgMatches);

      const destMatches = findAllByToken(ctx.destinations, token, (d) => [d.name]);
      if (destMatches.length === 1) return destinationSummary(destMatches[0]);
    }
  }

  // Follow-up questions on an active package
  if (activePackage && packageQuestions.length) {
    return packageQuestionsAnswer(activePackage, packageQuestions);
  }

  // FAQ Knowledge Base match
  const faq = findFaq(trimmed);
  if (faq) {
    return faqResponse(faq, ctx);
  }

  // Blog post search
  if (!generic) {
    const post = findBySubstringOrFuzzy(ctx.posts, trimmed, (p) => [p.title, p.excerpt], ["title", "excerpt"]);
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
  const panelRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const replyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageSeq = useRef(1);
  const activePackageId = useRef<string | null>(null);
  const messageTimestamps = useRef<number[]>([]);

  // Nudge the user with a teaser bubble a few seconds in, once, if unopened.
  useEffect(() => {
    if (open || teaserDismissed) return;
    const desktopViewport = window.matchMedia("(min-width: 1024px)");
    if (!desktopViewport.matches) return;
    const t = setTimeout(() => {
      if (desktopViewport.matches) setShowTeaser(true);
    }, 4000);
    return () => clearTimeout(t);
  }, [open, teaserDismissed]);

  // Keep the newest message in view without moving the page behind the dialog.
  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (!open) return;
    let frame = 0;
    const keepLatestMessageVisible = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "auto" });
      });
    };
    const viewport = window.visualViewport;
    window.addEventListener("resize", keepLatestMessageVisible);
    viewport?.addEventListener("resize", keepLatestMessageVisible);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", keepLatestMessageVisible);
      viewport?.removeEventListener("resize", keepLatestMessageVisible);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Opening the software keyboard immediately is disruptive on phones. Give
    // keyboard-and-mouse users the convenient autofocus, and focus the dialog
    // itself on touch-sized screens instead.
    const focusTarget = requestAnimationFrame(() => {
      if (window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) {
        inputRef.current?.focus({ preventScroll: true });
      } else {
        panelRef.current?.focus({ preventScroll: true });
      }
    });

    return () => cancelAnimationFrame(focusTarget);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleDialogKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => launcherRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === panelRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleDialogKeys);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleDialogKeys);
    };
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
  // updaters more than once); allocating from a ref keeps ids deterministic.
  const appendMessage = (msg: Omit<Message, "id">) => {
    const id = ++messageSeq.current;
    setMessages((prev) => [...prev, { id, ...msg }].slice(-MAX_CONVERSATION_MESSAGES));
  };

  const pushBotReply = (response: BotResponse) => {
    const securedResponse = secureBotResponse(response);
    setTyping(true);
    replyTimer.current = setTimeout(() => {
      replyTimer.current = null;
      setTyping(false);
      setHop((h) => h + 1);
      if (securedResponse.packageId) activePackageId.current = securedResponse.packageId;
      appendMessage({
        from: "bot",
        text: securedResponse.text,
        chips: securedResponse.chips,
        actions: securedResponse.actions,
      });
    }, 650);
  };

  const isRateLimited = (now: number) => {
    const recent = messageTimestamps.current.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    messageTimestamps.current = recent;
    if (recent.length >= RATE_LIMIT_MAX_MESSAGES) return true;
    messageTimestamps.current.push(now);
    return false;
  };

  const sendText = (raw: string, timestamp: number) => {
    if (!raw.trim() || typing) return;
    setInput("");
    if (isRateLimited(timestamp)) {
      appendMessage({ from: "user", text: "Message paused" });
      pushBotReply(SECURITY_RESPONSES.rateLimit);
      return;
    }

    const validated = validateChatInput(raw);
    if (validated.blockedResponse) {
      // Never echo a credential, identifier or malicious payload back into the
      // DOM or conversation history, even though React would escape the text.
      appendMessage({ from: "user", text: validated.displayText });
      pushBotReply(validated.blockedResponse);
      return;
    }
    if (!validated.text) return;

    appendMessage({ from: "user", text: validated.displayText });
    const activePackage = knowledge.packages.find((pkg) => pkg.id === activePackageId.current);
    pushBotReply(resolveResponse(validated.text, knowledge, activePackage));
  };

  const sendChip = (faqId: string, timestamp: number) => {
    const faq = FAQS[faqId];
    if (!faq || typing) return;
    if (isRateLimited(timestamp)) {
      appendMessage({ from: "user", text: "Message paused" });
      pushBotReply(SECURITY_RESPONSES.rateLimit);
      return;
    }
    appendMessage({ from: "user", text: faq.chipLabel });
    pushBotReply(faqResponse(faq, knowledge));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendText(input, e.timeStamp);
  };

  const resetConversation = () => {
    if (replyTimer.current) clearTimeout(replyTimer.current);
    setTyping(false);
    setInput("");
    activePackageId.current = null;
    messageTimestamps.current = [];
    messageSeq.current += 1;
    setMessages([
      { id: messageSeq.current, from: "bot", text: GREETING, chips: GREETING_CHIPS },
    ]);
  };

  // Keep the assistant off the admin console.
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/agent")) return null;

  return (
    <>
      {/* Teaser bubble */}
      {showTeaser && !open && pathname !== "/" && pathname !== "/book" && !pathname?.startsWith("/account/bookings/") && (
        <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-3 right-3 z-40 lg:bottom-24 lg:left-auto lg:right-6 lg:max-w-[280px]">
          <div className="relative border border-primary/10 bg-white px-4 py-3.5 pr-12 shadow-[0_18px_60px_rgba(7,32,60,0.16)]">
            <button
              onClick={() => {
                setShowTeaser(false);
                setTeaserDismissed(true);
              }}
              className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center text-foreground-light transition hover:bg-sand hover:text-primary"
              aria-label="Dismiss chat suggestion"
              type="button"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <button type="button" onClick={openPanel} className="flex min-h-11 w-full items-start gap-3 text-left">
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
          ref={panelRef}
          id="bandhan-chat-panel"
          role="dialog"
          aria-modal="true"
          aria-label={`${BOT_NAME}, travel assistant`}
          tabIndex={-1}
          className="chatbot-panel-enter fixed inset-0 z-[70] flex h-[100dvh] w-full flex-col overflow-hidden bg-[#f7f5ef] outline-none lg:inset-auto lg:bottom-24 lg:right-6 lg:h-[min(720px,calc(100dvh-7rem))] lg:w-[420px] lg:border lg:border-primary/10 lg:shadow-[0_30px_90px_rgba(7,32,60,0.26)]"
        >
          {/* Header */}
          <div className="relative shrink-0 bg-primary px-3 pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top))] text-white sm:px-4 lg:px-5 lg:pb-4 lg:pt-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-gold" />
            <div className="flex items-center gap-2 lg:gap-3">
              <span
                key={hop}
                className={`relative flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 bg-white/10 lg:h-11 lg:w-11 ${
                  hop > 0 ? "miles-hop" : ""
                }`}
              >
                <MilesAvatar className="h-8 w-8 lg:h-9 lg:w-9" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 border-2 border-primary bg-emerald-400" />
              </span>
              <div className="min-w-0 flex-1 leading-tight">
                <div className="flex items-center gap-2">
                  <p className="font-heading text-base font-bold">{BOT_NAME}</p>
                  <span className="hidden border border-emerald-300/30 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 min-[360px]:inline-flex">
                    Online
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[10px] text-slate-300 lg:mt-1 lg:text-[11px]">
                  Bandhan Tours · Trip assistant
                </p>
              </div>
              <button
                onClick={resetConversation}
                className="flex h-11 w-11 shrink-0 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white"
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
                className="flex h-11 w-11 shrink-0 items-center justify-center text-white/70 transition hover:bg-white/10 hover:text-white"
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
              className="flex min-h-11 items-center justify-center border-r border-primary/10 px-3 py-2 text-center text-[11px] font-bold text-primary transition hover:bg-gold/20 lg:px-4 lg:py-3 lg:text-[10px] lg:uppercase lg:tracking-[0.14em]"
            >
              Browse tours
            </Link>
            <Link
              href="/plan-trip"
              onClick={() => setOpen(false)}
              className="flex min-h-11 items-center justify-center px-3 py-2 text-center text-[11px] font-bold text-primary transition hover:bg-gold/20 lg:px-4 lg:py-3 lg:text-[10px] lg:uppercase lg:tracking-[0.14em]"
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
            className="min-h-0 flex-1 touch-pan-y space-y-4 overscroll-contain overflow-y-auto px-3 py-4 sm:px-4 lg:space-y-5 lg:px-5 lg:py-5"
          >
            {messages.map((m) => (
              <div key={m.id} className={`flex w-full flex-col ${m.from === "user" ? "items-end" : "items-start"}`}>
                <div className={m.from === "user" ? "flex max-w-[88%] justify-end lg:max-w-[84%]" : "flex max-w-full items-start gap-2 lg:max-w-[91%] lg:gap-2.5"}>
                  {m.from === "bot" && (
                    <MilesAvatar className="mt-0.5 h-6 w-6 shrink-0 lg:h-7 lg:w-7" />
                  )}
                  <div
                    className={`min-w-0 whitespace-pre-line break-words px-3.5 py-3 font-sans text-sm leading-5 lg:px-4 lg:text-[13px] lg:leading-6 ${
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
                  <div className="chatbot-scrollbar-none -mx-1 mt-2.5 flex max-w-full snap-x gap-2 overflow-x-auto px-1 pb-1 lg:ml-9 lg:flex-wrap lg:overflow-visible lg:px-0">
                    {m.actions.map((action) => (
                      <Link
                        key={`${m.id}-${action.href}`}
                        href={action.href}
                        onClick={() => setOpen(false)}
                        target={action.href.startsWith("http") ? "_blank" : undefined}
                        rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                        className="inline-flex min-h-11 shrink-0 snap-start items-center gap-2 border border-primary bg-white px-3.5 py-2 text-xs font-bold text-primary transition duration-200 hover:bg-primary hover:text-white lg:min-h-0 lg:text-[11px]"
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
                  <div className="chatbot-scrollbar-none -mx-1 mt-2.5 flex max-w-full snap-x gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:pl-9">
                    {m.chips.map((cid) => {
                      const faq = FAQS[cid];
                      if (!faq) return null;
                      return (
                        <button
                          key={cid}
                          onClick={(event) => sendChip(cid, event.timeStamp)}
                          disabled={typing}
                          type="button"
                          className="min-h-11 shrink-0 snap-start border border-primary/15 bg-white px-3.5 py-2 text-xs font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white disabled:opacity-50 lg:min-h-0 lg:px-3 lg:text-[11px]"
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
                <MilesAvatar className="h-6 w-6 shrink-0 lg:h-7 lg:w-7" />
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
          <form onSubmit={handleSubmit} className="shrink-0 border-t border-primary/10 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 lg:p-3.5">
            <div className="flex min-h-12 items-center gap-2 border border-primary/15 bg-slate-50 p-1 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Miles about your trip…"
                className="min-w-0 flex-1 bg-transparent px-2.5 py-2 text-base text-primary placeholder:text-foreground-light focus:outline-none lg:text-sm"
                aria-label="Type your message"
                aria-describedby="chat-security-note"
                autoComplete="off"
                enterKeyHint="send"
                maxLength={MAX_INPUT_LENGTH}
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                className="flex h-11 w-11 shrink-0 items-center justify-center bg-accent text-white transition hover:bg-accent-dark disabled:cursor-not-allowed disabled:opacity-35 lg:h-10 lg:w-10"
                aria-label="Send message"
              >
                <PlaneIcon className="h-4 w-4" />
              </button>
            </div>
            <p id="chat-security-note" className="mt-1.5 text-center text-[10px] leading-4 text-foreground-light lg:mt-2">
              Family-safe · Don&apos;t share passwords, OTPs, payment details or ID numbers.
            </p>
          </form>
        </div>
      )}

      {/* Launcher */}
      <button
        ref={launcherRef}
        onClick={() => (open ? setOpen(false) : openPanel())}
        className={`${open ? "hidden lg:flex" : "flex"} fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 h-14 w-14 items-center justify-center rounded-full bg-primary text-gold shadow-[0_14px_40px_rgba(7,32,60,0.28)] transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:bg-primary-light active:translate-y-0 active:scale-95 lg:bottom-6 lg:right-6`}
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
