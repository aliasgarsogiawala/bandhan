import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { getActor } from "@/lib/bookings/authz";
import {
  addNotification,
  getBookingById,
  markBrochureSent,
} from "@/lib/bookings/db";
import {
  quotationBrochureFileName,
  renderQuotationBrochurePdf,
} from "@/lib/documents/quotationBrochurePdf";
import { buildCustomPackageEmail } from "@/lib/email/customPackageEmail";
import { sendTransactionalEmail } from "@/lib/email/sendEmail";
import { formatMoney } from "@/lib/bookings/pricing";

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
  const hasAccessToken = Boolean(body.token && body.token === booking.access_token);
  if (!isOwner && !actor && !hasAccessToken) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 403 });
  }

  const origin = new URL(request.url).origin;
  const brochureUrl = `${origin}/api/bookings/${booking.id}/brochure?token=${booking.access_token}`;
  const portalUrl = booking.user_id
    ? `${origin}/account/bookings/${booking.id}`
    : brochureUrl;
  const title =
    booking.package_snapshot?.title ||
    booking.package_title ||
    booking.destination ||
    "Your Personalised Holiday";
  const destination = booking.package_snapshot?.destination || booking.destination;
  const total = Number(booking.pricing_snapshot?.total || booking.price_amount || 0);
  const fileName = quotationBrochureFileName(booking);
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
    pdfUrl: brochureUrl,
    portalUrl,
    validityNote: `This indicative proposal is valid for ${
      booking.pricing_snapshot?.validityDays || 7
    } days and is subject to live availability verification.`,
  });

  if (body.channel === "whatsapp") {
    const phone = (body.recipientPhone || booking.contact_phone).replace(/\D/g, "");
    const message = [
      `Hello ${booking.contact_name},`,
      `Your Bandhan Tours proposal for ${title} is ready.`,
      `Quotation: ${booking.quotation_number}`,
      total ? `Indicative total: ${formatMoney(total)}` : "",
      `View or download the brochure: ${brochureUrl}`,
    ]
      .filter(Boolean)
      .join("\n");
    const shareUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    await addNotification(booking.id, "whatsapp", "Brochure prepared for WhatsApp sharing.");
    await markBrochureSent(booking.id);
    return NextResponse.json({ ok: true, delivered: true, mode: "share", shareUrl });
  }

  const recipient = (body.recipientEmail || booking.contact_email).trim().toLowerCase();
  const pdf = await renderQuotationBrochurePdf(booking);
  const result = await sendTransactionalEmail({
    to: recipient,
    ...email,
    attachments: [{ filename: fileName, content: Buffer.from(pdf).toString("base64") }],
  });

  if (result.delivered) {
    await addNotification(booking.id, "email", `Quotation brochure sent to ${recipient}.`);
    await markBrochureSent(booking.id);
    return NextResponse.json({ ok: true, delivered: true, provider: result.provider });
  }

  const mailtoUrl = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(
    email.subject
  )}&body=${encodeURIComponent(`${email.text}\n\nBrochure: ${brochureUrl}`)}`;
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
