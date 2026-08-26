"use client";

import { BadgeCheck, Info, Lock } from "lucide-react";
import type { PartyContact } from "@/lib/bookings/party";
import type { AuthUser } from "@/lib/auth/useAuth";

const inputClass =
  "relative z-10 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10";
const lockedInputClass = `${inputClass} cursor-not-allowed bg-slate-50 text-foreground-muted`;

/**
 * The public booking engine only ever creates a personal booking — the
 * traveller is the customer. Arranging travel on someone else's behalf is an
 * agent journey and lives in the agent portal, where the client is captured
 * separately from the agent placing the booking.
 */
export interface PartyDraft {
  /** The traveller, as typed. */
  traveller: PartyContact;
}

export const emptyPartyDraft: PartyDraft = {
  traveller: { name: "", email: "", phone: "" },
};

/**
 * The name and email actually submitted for the booking.
 *
 * A signed-in customer's identity always comes from their account rather than
 * the form — the same rule the API enforces — so what the traveller sees on
 * screen matches what gets saved.
 */
export function resolveParty(draft: PartyDraft, user: AuthUser | null) {
  return {
    traveller: {
      name: user ? user.name : draft.traveller.name,
      email: user ? user.email : draft.traveller.email,
      phone: draft.traveller.phone,
    },
    identityLocked: Boolean(user),
  };
}

function SignedInBadge({ user }: { user: AuthUser }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
      <BadgeCheck size={20} className="shrink-0 text-emerald-600" />
      <div className="min-w-0">
        <p className="text-sm font-bold text-primary">Signed in as {user.name}</p>
        <p className="truncate text-xs text-foreground-muted">{user.email}</p>
      </div>
      <Lock size={14} className="ml-auto shrink-0 text-emerald-600" />
    </div>
  );
}

export default function TravellerDetailsStep({
  draft,
  onChange,
  user,
  authLoading,
  onSignIn,
  requiresAccount,
}: {
  draft: PartyDraft;
  onChange: (next: PartyDraft) => void;
  user: AuthUser | null;
  authLoading: boolean;
  onSignIn: () => void;
  /** Custom trips are saved to an account, so the sign-in nudge is shown. */
  requiresAccount: boolean;
}) {
  const setTraveller = (patch: Partial<PartyContact>) =>
    onChange({ ...draft, traveller: { ...draft.traveller, ...patch } });

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-primary">Your details</h2>
      <p className="mt-2 text-sm text-foreground-muted">
        This trip is booked in your name. Your brochure is personalised with these details and
        sent to the contact details below.
      </p>

      {requiresAccount && !authLoading && !user ? (
        <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-primary">
          Custom trips are saved to a customer account so our designers can follow up.{" "}
          <button
            type="button"
            onClick={onSignIn}
            className="relative z-10 font-bold text-accent underline-offset-2 hover:underline"
          >
            Sign in now
          </button>{" "}
          or continue — we&apos;ll ask you to sign in when you submit, and everything here stays
          exactly as you left it.
        </div>
      ) : null}

      <div className="mt-7 space-y-5">
        {user ? <SignedInBadge user={user} /> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Full name
            </span>
            <input
              value={user ? user.name : draft.traveller.name}
              disabled={Boolean(user)}
              onChange={(event) => setTraveller({ name: event.target.value })}
              className={user ? lockedInputClass : inputClass}
              placeholder="As printed on your ID"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Phone</span>
            <input
              type="tel"
              value={draft.traveller.phone}
              onChange={(event) => setTraveller({ phone: event.target.value })}
              className={inputClass}
              placeholder="+91 98765 43210"
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Email address
            </span>
            <input
              type="email"
              value={user ? user.email : draft.traveller.email}
              disabled={Boolean(user)}
              onChange={(event) => setTraveller({ email: event.target.value })}
              className={user ? lockedInputClass : inputClass}
              placeholder="name@example.com"
            />
          </label>
        </div>
        {user ? (
          <p className="flex items-start gap-2 text-xs leading-relaxed text-foreground-muted">
            <Info size={14} className="mt-0.5 shrink-0 text-accent" />
            Your name and email come from your account, so every booking stays under one profile.
            Update them in My Account to change them here.
          </p>
        ) : null}
        <p className="flex items-start gap-2 text-xs leading-relaxed text-foreground-muted">
          <Info size={14} className="mt-0.5 shrink-0 text-accent" />
          Travelling with others? Add everyone&apos;s names below — the whole party goes on one
          booking under your name.
        </p>
      </div>
    </div>
  );
}
