/** Published fares exclude taxes; the asterisk on every price points at this note. */
export const TAX_NOTE = "*Taxes applicable";

/** "₹38,999/-" -> "₹38,999/-*". Text without a figure ("On request") is left alone. */
export function withTaxMark(price: string | number | null | undefined): string {
  const value = String(price ?? "").trim();
  return /\d/.test(value) && !value.endsWith("*") ? `${value}*` : value;
}
