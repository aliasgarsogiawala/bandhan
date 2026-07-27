/**
 * Shared company + brand constants used across transactional email templates.
 * Colours mirror the site palette in globals.css. Email clients don't load web
 * fonts or CSS classes reliably, so templates use these hex values inline.
 */

export const COMPANY = {
  name: "Bandhan Tours",
  tagline: "Where Colours Come Alive",
  email: "info@bandhantours.com",
  phoneLabel: "+91 98300 12345",
  phoneHref: "tel:+919830012345",
  whatsappLabel: "+91 98300 12345",
  whatsappHref: "https://wa.me/919830012345",
  address: "122, Rash Behari Avenue, 2nd Floor, Kolkata – 700029, West Bengal",
  website: "https://bandhantours.com",
  hours: "Mon–Sat, 10:00 AM – 7:00 PM IST",
} as const;

export const BRAND = {
  primary: "#07203c",
  primaryLight: "#123358",
  accent: "#fe4f4f",
  accentDark: "#e03232",
  gold: "#FED14F",
  goldDark: "#DCA311",
  sand: "#FBF9F6",
  sandBg: "#FAF7F2",
  foreground: "#1E252D",
  muted: "#5F6C7D",
  light: "#94A3B8",
  border: "#E7E2DA",
  white: "#FFFFFF",
} as const;

/** Escape user-supplied text so it can't break or inject into the email HTML. */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
