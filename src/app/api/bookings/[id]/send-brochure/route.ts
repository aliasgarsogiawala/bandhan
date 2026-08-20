import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { actorCanManageBooking, getActor } from "@/lib/bookings/authz";
import {
  addNotification,
  getBookingById,
  markBrochureSent,
} from "@/lib/bookings/db";
import {
  renderQuotationBrochurePdf,
  tripBrochureFileName,
} from "@/lib/documents/quotationBrochurePdf";
import { quotationFileName, renderQuotationPdf } from "@/lib/documents/quotationPdf";
import { buildCustomPackageEmail } from "@/lib/email/customPackageEmail";
import { sendTransactionalEmail } from "@/lib/email/sendEmail";
import { formatMoney, parseMoney } from "@/lib/bookings/pricing";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface DeliveryBody {
  token?: string;
  channel?: "email" | "whatsapp";
  recipientEmail?: string;
  recipientPhone?: string;
}

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const booking = await getBookingById(id);
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as DeliveryBody;
  const userId = await getSessionUserId();
  const actor = await getActor(request);
  const isOwner = Boolean(userId && booking.user_id === userId);
  const actorHasAccess = actor ? actorCanManageBooking(actor, booking) : false;
  const hasAccessToken = Boolean(body.token && body.token === booking.access_token);
  if (!isOwner && !actorHasAccess && !hasAccessToken) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }
  const canOverrideRecipient = isOwner || actorHasAccess;

  const origin = new URL(request.url).origin;
  const brochureUrl = `${origin}/api/bookings/${booking.id}/brochure?token=${booking.access_token}`;
  const quotationUrl = `${origin}/api/bookings/${booking.id}/quotation?token=${booking.access_token}`;
  const portalUrl = booking.user_id
    ? `${origin}/account/bookings/${booking.id}`
    : brochureUrl;
  const title =
    booking.package_snapshot?.title ||
    booking.package_title ||
    booking.destination ||
    "Your Personalised Holiday";
  const destination = booking.package_snapshot?.destination || booking.destination;
  const total = parseMoney(booking.pricing_snapshot?.total || booking.price_amount || 0);
  const fileName = tripBrochureFileName(booking);
  const quoteFileName = quotationFileName(booking);
  const email = buildCustomPackageEmail({
    customerName: booking.contact_name,
    bookingCode: booking.booking_code,
    packageTitle: title,
    destination,
    travelDate: booking.travel_date,
    durationLabel: booking.duration_label || booking.package_snapshot?.duration,
    travellersCount: booking.travellers_count,
    priceAmount: total ? formatMoney(total) : null,
    pdfFileName: fileName,
    secondaryPdfFileName: quoteFileName,
    pdfUrl: brochureUrl,
    secondaryPdfUrl: quotationUrl,
    portalUrl,
    validityNote: `This indicative proposal is valid for ${
      booking.pricing_snapshot?.validityDays || 7
    } days and is subject to live availability verification.`,
  });

  if (body.channel === "whatsapp") {
    const phone = (
      (canOverrideRecipient ? body.recipientPhone : undefined) || booking.contact_phone
    ).replace(/\D/g, "");
    const message = [
      `Hello ${booking.contact_name},`,
      `Your Bandhan Tours proposal for ${title} is ready.`,
      `Quotation: ${booking.quotation_number}`,
      total ? `Indicative total: ${formatMoney(total)}` : "",
      `View or download the quotation: ${quotationUrl}`,
      `View or download the trip brochure: ${brochureUrl}`,
    ]
      .filter(Boolean)
      .join("\n");
    const shareUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    await addNotification(booking.id, "whatsapp", "Quotation and brochure prepared for WhatsApp sharing.");
    await markBrochureSent(booking.id);
    return NextResponse.json({ ok: true, delivered: true, mode: "share", shareUrl });
  }

  const recipient = (
    (canOverrideRecipient ? body.recipientEmail : undefined) || booking.contact_email
  )
    .trim()
    .toLowerCase();
  // Whoever arranged the trip asked to be kept in the loop, so they are copied
  // on what the traveller receives.
  const copies =
    booking.notify_booker && booking.booker_email && booking.booker_email !== recipient
      ? [booking.booker_email]
      : undefined;
  const [pdf, quotationPdf] = await Promise.all([
    renderQuotationBrochurePdf(booking),
    renderQuotationPdf(booking),
  ]);
  const result = await sendTransactionalEmail({
    to: recipient,
    cc: copies,
    ...email,
    attachments: [
      { filename: quoteFileName, content: Buffer.from(quotationPdf).toString("base64") },
      { filename: fileName, content: Buffer.from(pdf).toString("base64") },
    ],
  });

  if (result.delivered) {
    await addNotification(
      booking.id,
      "email",
      `Quotation and trip brochure sent to ${recipient}${copies ? ` (copied to ${copies.join(", ")})` : ""}.`
    );
    await markBrochureSent(booking.id);
    return NextResponse.json({ ok: true, delivered: true, provider: result.provider });
  }

  const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
    email.subject
  )}&body=${encodeURIComponent(
    `${email.text}\n\nQuotation: ${quotationUrl}\nBrochure: ${brochureUrl}`
  )}`;
  await addNotification(
    booking.id,
    "email",
    `Email draft prepared for ${recipient}; transactional email provider is not configured.`
  );
  return NextResponse.json({
    ok: true,
    delivered: false,
    provider: result.provider,
    error: result.error,
    mailtoUrl,
  });
}
