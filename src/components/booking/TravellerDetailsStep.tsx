"use client";

import { BadgeCheck, Info, Lock } from "lucide-react";
import type { PartyContact } from "@/lib/bookings/party";
import type { AuthUser } from "@/lib/auth/useAuth";
import { Field, fieldClass, fieldClassLocked } from "@/components/booking/fields";

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
    <div className="flex items-center gap-3 border border-emerald-600/20 bg-emerald-500/[0.07] px-4 py-3.5">
      <BadgeCheck size={20} className="shrink-0 text-emerald-600" />
      <div className="min-w-0">
        <p className="text-sm font-bold text-primary">Signed in as {user.name}</p>
        <p className="truncate text-xs text-foreground-muted">{user.email}</p>
      </div>
      <Lock size={14} className="ml-auto shrink-0 text-emerald-600" />
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2.5 text-xs leading-5 text-foreground-muted">
      <Info size={14} className="mt-px shrink-0 text-accent" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

export default function TravellerDetailsStep({
  draft,
  onChange,
  user,
}: {
  draft: PartyDraft;
  onChange: (next: PartyDraft) => void;
  user: AuthUser | null;
}) {
  const setTraveller = (patch: Partial<PartyContact>) =>
    onChange({ ...draft, traveller: { ...draft.traveller, ...patch } });

  return (
    <div className="space-y-6">
      {user ? <SignedInBadge user={user} /> : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name">
          <input
            value={user ? user.name : draft.traveller.name}
            disabled={Boolean(user)}
            onChange={(event) => setTraveller({ name: event.target.value })}
            className={user ? fieldClassLocked : fieldClass}
            placeholder="As printed on your ID"
            autoComplete="name"
          />
        </Field>
        <Field label="Phone">
          <input
            type="tel"
            value={draft.traveller.phone}
            onChange={(event) => setTraveller({ phone: event.target.value })}
            className={fieldClass}
            placeholder="+91 98765 43210"
            autoComplete="tel"
          />
        </Field>
        <Field label="Email address" className="sm:col-span-2">
          <input
            type="email"
            value={user ? user.email : draft.traveller.email}
            disabled={Boolean(user)}
            onChange={(event) => setTraveller({ email: event.target.value })}
            className={user ? fieldClassLocked : fieldClass}
            placeholder="name@example.com"
            autoComplete="email"
          />
        </Field>
      </div>

      <div className="space-y-2.5 border-t border-primary/10 pt-5">
        {user ? (
          <Note>
            Your name and email come from your account, so every booking stays under one profile.
            Update them in My Account to change them here.
          </Note>
        ) : null}
        <Note>
          Travelling with others? Add everyone&apos;s names below — the whole party goes on one
          booking under your name.
        </Note>
      </div>
    </div>
  );
}
