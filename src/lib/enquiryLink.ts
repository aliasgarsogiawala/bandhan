/**
 * Every "Enquire / Book / Plan" CTA routes to the contact page instead of a
 * popup. When a specific destination or package is in context we carry it along
 * so the contact form can pre-fill, scroll into view, and highlight itself.
 */
export function contactEnquiryHref(destination?: string): string {
  const value = (destination || "").trim();
  return value
    ? `/contact?destination=${encodeURIComponent(value)}`
    : `/contact?enquiry=1`;
}
