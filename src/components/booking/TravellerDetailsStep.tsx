"use client";

import { BadgeCheck, Gift, Info, Lock, User, UserPlus } from "lucide-react";
import { GUEST_RELATIONS, type PartyContact } from "@/lib/bookings/party";
import type { BookedFor } from "@/lib/bookings/types";
import type { AuthUser } from "@/lib/auth/useAuth";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-primary outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10";
const lockedInputClass = `${inputClass} cursor-not-allowed bg-slate-50 text-foreground-muted`;

export interface PartyDraft {
  bookedFor: BookedFor;
  /** Lead traveller as typed. */
  traveller: PartyContact;
  /** Arranger as typed — only used when booking for someone else. */
  booker: PartyContact;
  relation: string;
  notifyBooker: boolean;
}

export const emptyPartyDraft: PartyDraft = {
  bookedFor: "self",
  traveller: { name: "", email: "", phone: "" },
  booker: { name: "", email: "", phone: "" },
  relation: GUEST_RELATIONS[0],
  notifyBooker: true,
};

/**
 * The name and email actually submitted for each side of the party.
 *
 * A signed-in customer's own identity always comes from their account rather
 * than the form — the same rule the API enforces — so what the traveller sees
 * on screen matches what gets saved.
 */
export function resolveParty(draft: PartyDraft, user: AuthUser | null) {
  if (draft.bookedFor === "self") {
    return {
      traveller: {
        name: user ? user.name : draft.traveller.name,
        email: user ? user.email : draft.traveller.email,
        phone: draft.traveller.phone,
      },
      booker: null,
      identityLocked: Boolean(user),
    };
  }
  return {
    traveller: draft.traveller,
    booker: {
      name: user ? user.name : draft.booker.name,
      email: user ? user.email : draft.booker.email,
      phone: draft.booker.phone,
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
  const bookingForSomeoneElse = draft.bookedFor === "guest";
  const set = (patch: Partial<PartyDraft>) => onChange({ ...draft, ...patch });
  const setTraveller = (patch: Partial<PartyContact>) =>
    set({ traveller: { ...draft.traveller, ...patch } });
  const setBooker = (patch: Partial<PartyContact>) =>
    set({ booker: { ...draft.booker, ...patch } });

  return (
    <div>
      <h2 className="font-heading text-2xl font-bold text-primary">Traveller details</h2>
      <p className="mt-2 text-sm text-foreground-muted">
        Tell us who is travelling. Your brochure is personalised with these names and sent to
        the contact details below.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(
          [
            [
              "self",
              "I'm travelling",
              "Book this trip in my own name",
              <User key="self" size={20} />,
            ],
            [
              "guest",
              "I'm booking for someone else",
              "A gift, family, friends or colleagues",
              <Gift key="guest" size={20} />,
            ],
          ] as const
        ).map(([value, label, hint, icon]) => (
          <button
            type="button"
            key={value}
            onClick={() => set({ bookedFor: value })}
            aria-pressed={draft.bookedFor === value}
            className={`rounded-2xl border p-4 text-left transition ${
              draft.bookedFor === value
                ? "border-primary bg-primary text-white shadow-lg"
                : "border-slate-200 hover:border-primary/30"
            }`}
          >
            <span className={draft.bookedFor === value ? "text-gold" : "text-accent"}>{icon}</span>
            <strong className="mt-3 block text-sm">{label}</strong>
            <span
              className={`mt-1 block text-xs ${
                draft.bookedFor === value ? "text-slate-300" : "text-foreground-muted"
              }`}
            >
              {hint}
            </span>
          </button>
        ))}
      </div>

      {requiresAccount && !authLoading && !user ? (
        <div className="mt-5 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-primary">
          Custom trips are saved to a customer account so our designers can follow up.{" "}
          <button
            type="button"
            onClick={onSignIn}
            className="font-bold text-accent underline-offset-2 hover:underline"
          >
            Sign in now
          </button>{" "}
          or continue — we&apos;ll ask you to sign in when you submit, and everything here stays
          exactly as you left it.
        </div>
      ) : null}

      {/* ---------------- Booking for yourself ---------------- */}
      {!bookingForSomeoneElse ? (
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
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Phone
              </span>
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
              Your name and email come from your account, so every booking stays under one
              profile. Update them in My Account to change them here.
            </p>
          ) : null}
        </div>
      ) : (
        /* ---------------- Booking for someone else ---------------- */
        <div className="mt-7 space-y-6">
          <section className="rounded-3xl border border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-accent" />
              <h3 className="text-sm font-bold text-primary">Who&apos;s travelling</h3>
            </div>
            <p className="mt-1 text-xs text-foreground-muted">
              The brochure and travel documents are made out in this name.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Lead traveller&apos;s full name
                </span>
                <input
                  value={draft.traveller.name}
                  onChange={(event) => setTraveller({ name: event.target.value })}
                  className={inputClass}
                  placeholder="As printed on their ID"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Their email{" "}
                  <span className="font-medium normal-case text-foreground-light">optional</span>
                </span>
                <input
                  type="email"
                  value={draft.traveller.email}
                  onChange={(event) => setTraveller({ email: event.target.value })}
                  className={inputClass}
                  placeholder="name@example.com"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Their phone{" "}
                  <span className="font-medium normal-case text-foreground-light">optional</span>
                </span>
                <input
                  type="tel"
                  value={draft.traveller.phone}
                  onChange={(event) => setTraveller({ phone: event.target.value })}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </label>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-foreground-muted">
              <Info size={14} className="mt-0.5 shrink-0 text-accent" />
              Don&apos;t have their contact details? Leave these blank — we&apos;ll use yours for
              everything and you can add theirs later.
            </p>
            <div className="mt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                They are my
              </span>
              <div className="mt-3 flex flex-wrap gap-2">
                {GUEST_RELATIONS.map((relation) => (
                  <button
                    type="button"
                    key={relation}
                    onClick={() => set({ relation })}
                    className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                      draft.relation === relation
                        ? "border-accent bg-accent text-white"
                        : "border-slate-200 bg-white text-primary hover:border-accent"
                    }`}
                  >
                    {relation}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-accent/25 bg-accent/[0.04] p-5">
            <div className="flex items-center gap-2">
              <User size={18} className="text-accent" />
              <h3 className="text-sm font-bold text-primary">Your details</h3>
            </div>
            <p className="mt-1 text-xs text-foreground-muted">
              You&apos;re arranging this trip, so quotations, payment requests and updates come to
              you.
            </p>
            {user ? <div className="mt-4"><SignedInBadge user={user} /></div> : null}
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Your name
                </span>
                <input
                  value={user ? user.name : draft.booker.name}
                  disabled={Boolean(user)}
                  onChange={(event) => setBooker({ name: event.target.value })}
                  className={user ? lockedInputClass : inputClass}
                  placeholder="Your full name"
                />
              </label>
              <label className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Your phone
                </span>
                <input
                  type="tel"
                  value={draft.booker.phone}
                  onChange={(event) => setBooker({ phone: event.target.value })}
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </label>
              <label className="space-y-2 sm:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Your email
                </span>
                <input
                  type="email"
                  value={user ? user.email : draft.booker.email}
                  disabled={Boolean(user)}
                  onChange={(event) => setBooker({ email: event.target.value })}
                  className={user ? lockedInputClass : inputClass}
                  placeholder="name@example.com"
                />
              </label>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <input
                type="checkbox"
                checked={draft.notifyBooker}
                onChange={(event) => set({ notifyBooker: event.target.checked })}
                className="mt-0.5 h-4 w-4 accent-accent"
              />
              <span className="text-xs leading-relaxed text-foreground-muted">
                Copy me on everything sent to the traveller, including the brochure and booking
                confirmation.
              </span>
            </label>
          </section>
        </div>
      )}
    </div>
  );
}
