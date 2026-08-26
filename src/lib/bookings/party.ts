import type { BookedFor } from "./types";

/**
 * Booking-party rules, shared by the public booking engine and the agent
 * portal so both endpoints agree on who a booking belongs to.
 *
 * Every booking has exactly one **lead traveller** (`contact`) — the person
 * the brochure is addressed to and the travel documents are issued for. When
 * someone else arranged the trip, that arranger is the **booker**:
 *
 *   self   — traveller and booker are the same person, so there is no booker
 *   client — an agent booking for their client; the agent is the booker
 *   guest  — legacy: a customer booking for someone else. No route creates
 *            these any more (the public site books personally; arranging for
 *            others is an agent journey), but existing rows still read back.
 *
 * A traveller booked by someone else often has no email or phone of their own
 * to give (a child, a parent, a corporate guest), so those fall back to the
 * booker's details. That keeps `contact_email`/`contact_phone` reliably
 * deliverable for every booking without forcing anyone to invent an address.
 */

export interface PartyContactInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface PartyContact {
  name: string;
  email: string;
  phone: string;
}

export interface BookingParty {
  bookedFor: BookedFor;
  /** The lead traveller. Always complete — see the fallback rule above. */
  contact: PartyContact;
  /** The arranger, or null on a `self` booking where they are the traveller. */
  booker: PartyContact | null;
  relation: string | null;
  notifyBooker: boolean;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** A validation failure carrying a message that is safe to show the user. */
export class PartyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PartyError";
  }
}

export function isBookedFor(value: unknown): value is BookedFor {
  return value === "self" || value === "guest" || value === "client";
}

const clean = (value?: string | null) => (value || "").trim();
const cleanEmail = (value?: string | null) => clean(value).toLowerCase();
const digits = (value: string) => value.replace(/\D/g, "");

function requireName(value: string, label: string): string {
  if (value.length < 2) throw new PartyError(`Please enter ${label}.`);
  return value;
}

function requireEmail(value: string, label: string): string {
  if (!EMAIL_RE.test(value)) throw new PartyError(`Please enter a valid ${label}.`);
  return value;
}

function requirePhone(value: string, label: string): string {
  if (digits(value).length < 8) throw new PartyError(`Please enter a valid ${label}.`);
  return value;
}

export interface NormalizePartyInput {
  bookedFor?: unknown;
  /** Lead traveller details as submitted. */
  contact?: PartyContactInput;
  /** Arranger details as submitted. Ignored for `self`. */
  booker?: PartyContactInput;
  relation?: string;
  notifyBooker?: boolean;
}

export interface NormalizePartyOptions {
  /** Signed-in account, used to pin the identity of a `self` booking. */
  account?: { name: string; email: string } | null;
  /** Pre-resolved booker for `client` bookings — the acting agent. */
  agentContact?: PartyContact | null;
  /** Restrict which journeys this caller may create. */
  allow?: BookedFor[];
}

/**
 * Validates a submitted booking party and returns it in the shape the
 * database expects. Throws {@link PartyError} with a user-facing message.
 */
export function normalizeParty(
  input: NormalizePartyInput,
  options: NormalizePartyOptions = {}
): BookingParty {
  const bookedFor: BookedFor = isBookedFor(input.bookedFor) ? input.bookedFor : "self";
  const allow = options.allow;
  if (allow && !allow.includes(bookedFor)) {
    throw new PartyError("This booking journey isn't available here.");
  }

  const submitted = input.contact || {};

  if (bookedFor === "self") {
    // A signed-in customer books as themselves: the account is the source of
    // truth for who they are, so only the phone comes off the form.
    const account = options.account;
    return {
      bookedFor,
      contact: {
        name: account
          ? account.name
          : requireName(clean(submitted.name), "the lead traveller's name"),
        email: account
          ? account.email
          : requireEmail(cleanEmail(submitted.email), "email address"),
        phone: requirePhone(clean(submitted.phone), "phone number"),
      },
      booker: null,
      relation: null,
      notifyBooker: true,
    };
  }

  const booker =
    bookedFor === "client" && options.agentContact
      ? options.agentContact
      : {
          name: requireName(clean(input.booker?.name), "your name"),
          email: requireEmail(cleanEmail(input.booker?.email), "email address for yourself"),
          phone: requirePhone(clean(input.booker?.phone), "phone number for yourself"),
        };

  // The traveller's own contact details are optional — whatever they don't
  // have, the booker covers, so the booking always has a reachable contact.
  const travellerEmail = cleanEmail(submitted.email);
  const travellerPhone = clean(submitted.phone);
  if (travellerEmail && !EMAIL_RE.test(travellerEmail)) {
    throw new PartyError("Please enter a valid email address for the lead traveller.");
  }
  if (travellerPhone && digits(travellerPhone).length < 8) {
    throw new PartyError("Please enter a valid phone number for the lead traveller.");
  }

  return {
    bookedFor,
    contact: {
      name: requireName(
        clean(submitted.name),
        bookedFor === "client" ? "your client's name" : "the traveller's name"
      ),
      email: travellerEmail || booker.email,
      phone: travellerPhone || booker.phone,
    },
    booker,
    relation: clean(input.relation) || null,
    notifyBooker: input.notifyBooker !== false,
  };
}

/** Everyone who should receive booking updates, de-duplicated by email. */
export function partyRecipients(party: BookingParty): PartyContact[] {
  const recipients = [party.contact];
  if (party.booker && party.notifyBooker && party.booker.email !== party.contact.email) {
    recipients.push(party.booker);
  }
  return recipients;
}
