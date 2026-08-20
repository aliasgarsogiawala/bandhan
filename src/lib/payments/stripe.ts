import "server-only";

import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY is not configured.");
  if (!stripe) stripe = new Stripe(secret);
  return stripe;
}
