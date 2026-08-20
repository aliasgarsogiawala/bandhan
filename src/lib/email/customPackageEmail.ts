import { BRAND, COMPANY, escapeHtml } from "./company";

/**
 * Builds the transactional email that delivers a customer's custom tour package
 * (itinerary / quotation) as a PDF. The PDF itself is sent as an attachment by
 * the mail provider; this template is the accompanying message and also links
 * to the same document in the customer portal as a fallback.
 *
 * Provider-agnostic: it returns `{ subject, html, text }`. Wire it into any
 * sender (Resend, SES, Nodemailer, …) and pass the PDF as the attachment.
 */
export interface CustomPackageEmailInput {
  /** Customer's name for the greeting. */
  customerName: string;
  /** Booking reference, e.g. "BKG-7QX4K2". */
  bookingCode: string;
  /** Trip title, e.g. "Your Custom Kerala Backwaters Escape". */
  packageTitle: string;
  destination?: string | null;
  /** Human travel date/period, e.g. "12–19 Sep 2026". */
  travelDate?: string | null;
  durationLabel?: string | null;
  travellersCount?: number | null;
  /** Quoted price, already formatted, e.g. "₹1,24,000". */
  priceAmount?: string | null;
  /** File name of the attached PDF, shown in the attachment chip. */
  pdfFileName?: string;
  /** Optional second PDF, used when quotation and brochure are separate files. */
  secondaryPdfFileName?: string;
  /** Direct download link to the PDF (portal/storage) — optional fallback. */
  pdfUrl?: string;
  secondaryPdfUrl?: string;
  /** Link to the booking inside the customer portal. */
  portalUrl?: string;
  /** Travel designer who prepared the plan, shown in the sign-off. */
  agentName?: string;
  /** Optional validity note, e.g. "This quote is held for 7 days." */
  validityNote?: string;
}

export interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

const FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

/** A bulletproof, table-based button that renders in Outlook too. */
function button(label: string, href: string, opts: { fill: string; text: string; border?: string }): string {
  const border = opts.border ?? opts.fill;
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr>
      <td align="center" bgcolor="${opts.fill}" style="border-radius:9999px;border:1px solid ${border};">
        <a href="${href}" target="_blank"
           style="display:inline-block;padding:13px 30px;font-family:${FONT_STACK};font-size:14px;font-weight:700;line-height:1;color:${opts.text};text-decoration:none;border-radius:9999px;">
          ${escapeHtml(label)}
        </a>
      </td>
    </tr>
  </table>`;
}

/** One label/value row inside the trip-summary card. */
function summaryRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:9px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT_STACK};font-size:13px;color:${BRAND.muted};">
      ${escapeHtml(label)}
    </td>
    <td align="right" style="padding:9px 0;border-bottom:1px solid ${BRAND.border};font-family:${FONT_STACK};font-size:13px;font-weight:700;color:${BRAND.foreground};">
      ${escapeHtml(value)}
    </td>
  </tr>`;
}

export function buildCustomPackageEmail(input: CustomPackageEmailInput): EmailContent {
  const {
    customerName,
    bookingCode,
    packageTitle,
    destination,
    travelDate,
    durationLabel,
    travellersCount,
    priceAmount,
    pdfFileName = `Bandhan-Tours-Itinerary-${bookingCode}.pdf`,
    secondaryPdfFileName,
    pdfUrl,
    secondaryPdfUrl,
    portalUrl,
    agentName,
    validityNote,
  } = input;

  const firstName = (customerName || "there").trim().split(/\s+/)[0];
  const subject = `Your travel documents are ready — ${packageTitle} (${bookingCode})`;
  const preheader = secondaryPdfFileName
    ? `Your personalised quotation and trip brochure for ${destination || packageTitle} are attached.`
    : `Your personalised travel plan and quotation for ${destination || packageTitle} is attached as a PDF.`;

  // ---- Trip summary rows (only include what we have) ----
  const rows: string[] = [];
  if (destination) rows.push(summaryRow("Destination", destination));
  if (travelDate) rows.push(summaryRow("Travel Dates", travelDate));
  if (durationLabel) rows.push(summaryRow("Duration", durationLabel));
  if (travellersCount != null) rows.push(summaryRow("Travellers", String(travellersCount)));
  rows.push(summaryRow("Booking Reference", bookingCode));
  if (priceAmount) rows.push(summaryRow("Quoted Price", priceAmount));

  const ctaButtons = [
    portalUrl ? button("View in My Account", portalUrl, { fill: BRAND.primary, text: BRAND.white }) : "",
    pdfUrl ? button(secondaryPdfUrl ? "Download Brochure" : "Download PDF", pdfUrl, { fill: BRAND.gold, text: BRAND.primary, border: BRAND.goldDark }) : "",
    secondaryPdfUrl ? button("Download Quotation", secondaryPdfUrl, { fill: BRAND.white, text: BRAND.primary, border: BRAND.primary }) : "",
  ].filter(Boolean);

  const html = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.sandBg};">
  <!-- Preheader (hidden preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${BRAND.sandBg};">
    ${escapeHtml(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.sandBg};">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${BRAND.white};border-radius:16px;overflow:hidden;border:1px solid ${BRAND.border};">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.primary};padding:26px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:${FONT_STACK};font-size:20px;font-weight:800;letter-spacing:0.3px;color:${BRAND.white};">
                    ${escapeHtml(COMPANY.name)}
                  </td>
                  <td align="right" style="font-family:${FONT_STACK};font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:${BRAND.gold};">
                    ${escapeHtml(COMPANY.tagline)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Gold accent rule -->
          <tr><td style="height:4px;line-height:4px;font-size:0;background-color:${BRAND.gold};">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:34px 32px 8px 32px;">
              <p style="margin:0 0 4px 0;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.accent};">
                Your Custom Itinerary
              </p>
              <h1 style="margin:0 0 16px 0;font-family:${FONT_STACK};font-size:24px;line-height:1.25;font-weight:800;color:${BRAND.primary};">
                ${escapeHtml(packageTitle)}
              </h1>
              <p style="margin:0 0 14px 0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:${BRAND.foreground};">
                Hi ${escapeHtml(firstName)},
              </p>
              <p style="margin:0 0 22px 0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:${BRAND.foreground};">
                Great news — your personalised travel plan is ready! We&apos;ve attached your
                <strong>${secondaryPdfFileName ? "quotation and trip brochure as separate PDFs" : "itinerary &amp; quotation as a PDF"}</strong>
                to this email. Together they cover your traveller configuration, day-by-day plan,
                inclusions, rooms and pricing, tailored to the preferences you shared with us.
              </p>
            </td>
          </tr>

          <!-- PDF attachment callout -->
          <tr>
            <td style="padding:0 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.sand};border:1px solid ${BRAND.border};border-radius:12px;">
                <tr>
                  <td width="46" style="padding:14px 0 14px 16px;vertical-align:middle;">
                    <div style="width:34px;height:34px;border-radius:8px;background-color:${BRAND.accent};font-family:${FONT_STACK};font-size:10px;font-weight:800;color:${BRAND.white};text-align:center;line-height:34px;">
                      PDF
                    </div>
                  </td>
                  <td style="padding:12px 16px;vertical-align:middle;font-family:${FONT_STACK};">
                    <div style="font-size:14px;font-weight:700;color:${BRAND.primary};">${escapeHtml(pdfFileName)}</div>
                    ${secondaryPdfFileName ? `<div style="margin-top:4px;font-size:14px;font-weight:700;color:${BRAND.primary};">${escapeHtml(secondaryPdfFileName)}</div>` : ""}
                    <div style="font-size:12px;color:${BRAND.muted};">Attached to this email${pdfUrl ? " · or download below" : ""}</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Trip summary -->
          <tr>
            <td style="padding:18px 32px 6px 32px;">
              <p style="margin:0 0 6px 0;font-family:${FONT_STACK};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};">
                Trip Summary
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${rows.join("")}
              </table>
              ${
                validityNote
                  ? `<p style="margin:14px 0 0 0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:${BRAND.muted};">${escapeHtml(
                      validityNote
                    )}</p>`
                  : ""
              }
            </td>
          </tr>

          ${
            ctaButtons.length
              ? `<!-- CTAs -->
          <tr>
            <td style="padding:26px 32px 6px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  ${ctaButtons.map((b) => `<td style="padding:0 6px;">${b}</td>`).join("")}
                </tr>
              </table>
            </td>
          </tr>`
              : ""
          }

          <!-- Next steps -->
          <tr>
            <td style="padding:24px 32px 0 32px;">
              <p style="margin:0 0 10px 0;font-family:${FONT_STACK};font-size:15px;line-height:1.65;color:${BRAND.foreground};">
                <strong>What happens next?</strong> Review the plan at your pace. Want to tweak the dates,
                hotels, or pace? Just reply to this email — nothing is locked in until you're delighted with it.
                When you're ready to confirm, a small advance secures your booking.
              </p>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding:18px 32px 30px 32px;">
              <p style="margin:0;font-family:${FONT_STACK};font-size:15px;line-height:1.6;color:${BRAND.foreground};">
                Warm regards,<br />
                <strong>${escapeHtml(agentName || `The ${COMPANY.name} Team`)}</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.primary};padding:24px 32px;">
              <p style="margin:0 0 8px 0;font-family:${FONT_STACK};font-size:13px;font-weight:700;color:${BRAND.white};">
                ${escapeHtml(COMPANY.name)}
              </p>
              <p style="margin:0 0 4px 0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:#AEBACB;">
                ${escapeHtml(COMPANY.address)}
              </p>
              <p style="margin:0 0 10px 0;font-family:${FONT_STACK};font-size:12px;line-height:1.6;color:#AEBACB;">
                <a href="${COMPANY.phoneHref}" style="color:${BRAND.gold};text-decoration:none;">${escapeHtml(COMPANY.phoneLabel)}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${COMPANY.email}" style="color:${BRAND.gold};text-decoration:none;">${escapeHtml(COMPANY.email)}</a>
                &nbsp;·&nbsp;
                <a href="${COMPANY.whatsappHref}" style="color:${BRAND.gold};text-decoration:none;">WhatsApp</a>
              </p>
              <p style="margin:0;font-family:${FONT_STACK};font-size:11px;line-height:1.6;color:#6E7F94;">
                You're receiving this because you requested a custom travel plan from ${escapeHtml(COMPANY.name)}.
                Office hours: ${escapeHtml(COMPANY.hours)}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // ---- Plain-text fallback ----
  const textLines: string[] = [
    `${COMPANY.name} — Your Custom Itinerary`,
    "",
    `Hi ${firstName},`,
    "",
    secondaryPdfFileName
      ? `Great news - your personalised quotation and trip brochure are attached as PDFs (${secondaryPdfFileName}; ${pdfFileName}).`
      : `Great news - your personalised travel plan is ready. Your full itinerary and quotation is attached as a PDF (${pdfFileName}).`,
    "",
    "TRIP SUMMARY",
    destination ? `- Destination: ${destination}` : "",
    travelDate ? `- Travel Dates: ${travelDate}` : "",
    durationLabel ? `- Duration: ${durationLabel}` : "",
    travellersCount != null ? `- Travellers: ${travellersCount}` : "",
    `- Booking Reference: ${bookingCode}`,
    priceAmount ? `- Quoted Price: ${priceAmount}` : "",
    validityNote ? `\n${validityNote}` : "",
    pdfUrl ? `\nDownload the brochure: ${pdfUrl}` : "",
    secondaryPdfUrl ? `Download the quotation: ${secondaryPdfUrl}` : "",
    portalUrl ? `View in your account: ${portalUrl}` : "",
    "",
    "Want to tweak the dates, hotels, or pace? Just reply to this email — nothing is locked in until you're happy. When you're ready to confirm, a small advance secures your booking.",
    "",
    `Warm regards,`,
    agentName || `The ${COMPANY.name} Team`,
    "",
    `${COMPANY.name} · ${COMPANY.address}`,
    `${COMPANY.phoneLabel} · ${COMPANY.email} · ${COMPANY.whatsappHref}`,
  ];

  return { subject, html, text: textLines.filter((l) => l !== "").join("\n") };
}
