import { getSql } from "@/lib/db";
import { decrementSeats, getDepartureById, restoreSeats } from "@/lib/departures/db";
import type {
  Booking,
  BookingDetail,
  BookingDocument,
  BookingHistoryEntry,
  BookingNotification,
  BookingStatus,
  BookingType,
  DocumentType,
  NotificationChannel,
  PaymentStatus,
} from "./types";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I

function randomCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  return `BKG-${code}`;
}

async function uniqueBookingCode(): Promise<string> {
  const sql = getSql();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode();
    const rows = (await sql`SELECT 1 FROM bookings WHERE booking_code = ${code} LIMIT 1`) as unknown[];
    if (rows.length === 0) return code;
  }
  throw new Error("Could not generate a unique booking code.");
}

export interface CreateBookingInput {
  type: BookingType;
  userId?: string | null;
  packageId?: string;
  packageTitle?: string;
  departureId?: string;
  destination?: string;
  travelDate?: string;
  travellersCount?: number;
  travellerNames?: string;
  budget?: string;
  specialRequirements?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  /** Who logged this request — defaults to 'system' for the public booking forms. */
  createdBy?: string;
  createdNote?: string;
}

export class SoldOutError extends Error {
  constructor() {
    super("This departure is sold out.");
    this.name = "SoldOutError";
  }
}

export async function createBooking(input: CreateBookingInput): Promise<Booking> {
  let destination = input.destination;
  let travelDate = input.travelDate;
  let packageTitle = input.packageTitle;

  if (input.departureId) {
    const departure = await getDepartureById(input.departureId);
    if (!departure || departure.seats_left <= 0) throw new SoldOutError();
    destination = destination || departure.destination;
    travelDate = travelDate || departure.date;
    packageTitle = packageTitle || departure.destination;
  }

  const sql = getSql();
  const code = await uniqueBookingCode();
  const rows = (await sql`
    INSERT INTO bookings (
      booking_code, type, user_id, package_id, package_title, departure_id, destination,
      travel_date, travellers_count, traveller_names, budget, special_requirements,
      contact_name, contact_email, contact_phone
    ) VALUES (
      ${code}, ${input.type}, ${input.userId || null}, ${input.packageId || null},
      ${packageTitle || null}, ${input.departureId || null}, ${destination || null},
      ${travelDate || null}, ${input.travellersCount ?? null}, ${input.travellerNames || null},
      ${input.budget || null}, ${input.specialRequirements || null}, ${input.contactName},
      ${input.contactEmail}, ${input.contactPhone}
    )
    RETURNING *
  `) as Booking[];

  const booking = rows[0];
  await sql`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (
      ${booking.id}, NULL, 'new',
      ${input.createdNote || "Request submitted"}, ${input.createdBy || "system"}
    )
  `;
  return booking;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`SELECT * FROM bookings WHERE id = ${id} LIMIT 1`) as Booking[];
  return rows[0] ?? null;
}

export async function getBookingDetail(id: string): Promise<BookingDetail | null> {
  const booking = await getBookingById(id);
  if (!booking) return null;
  const [history, documents, notifications] = await Promise.all([
    listHistory(id),
    listDocuments(id),
    listNotifications(id),
  ]);
  return { ...booking, history, documents, notifications };
}

export async function listForUser(userId: string): Promise<Booking[]> {
  const sql = getSql();
  return (await sql`
    SELECT * FROM bookings WHERE user_id = ${userId} ORDER BY created_at DESC
  `) as Booking[];
}

export async function listForAgent(agentId: string): Promise<Booking[]> {
  const sql = getSql();
  return (await sql`
    SELECT * FROM bookings
    WHERE agent_id = ${agentId} OR agent_id IS NULL
    ORDER BY created_at DESC
  `) as Booking[];
}

export async function listAll(): Promise<Booking[]> {
  const sql = getSql();
  return (await sql`SELECT * FROM bookings ORDER BY created_at DESC`) as Booking[];
}

export async function updateStatus(
  bookingId: string,
  toStatus: BookingStatus,
  changedBy: string,
  note?: string
): Promise<Booking | null> {
  const sql = getSql();
  const current = await getBookingById(bookingId);
  if (!current) return null;

  // Seats are claimed only once a booking is actually confirmed (payment
  // received), and released if a confirmed booking later falls through —
  // this is the one place every status transition passes through.
  if (current.departure_id && toStatus === "confirmed" && current.status !== "confirmed") {
    const claimed = await decrementSeats(current.departure_id, current.travellers_count || 1);
    if (!claimed) throw new SoldOutError();
  } else if (
    current.departure_id &&
    current.status === "confirmed" &&
    (toStatus === "cancelled" || toStatus === "rejected")
  ) {
    await restoreSeats(current.departure_id, current.travellers_count || 1);
  }

  const rows = (await sql`
    UPDATE bookings SET status = ${toStatus}, updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];

  await sql`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (${bookingId}, ${current.status}, ${toStatus}, ${note || null}, ${changedBy})
  `;

  return rows[0] ?? null;
}

export async function setPricing(
  bookingId: string,
  priceAmount: string,
  changedBy: string
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE bookings SET price_amount = ${priceAmount}, updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];
  if (rows[0]) {
    await updateStatus(bookingId, "quoted", changedBy, `Price set to ${priceAmount}`);
    return getBookingById(bookingId);
  }
  return rows[0] ?? null;
}

export async function setPaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus,
  changedBy: string
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE bookings SET payment_status = ${paymentStatus}, updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];
  if (rows[0] && paymentStatus === "received") {
    await updateStatus(bookingId, "confirmed", changedBy, "Payment received");
    return getBookingById(bookingId);
  }
  return rows[0] ?? null;
}

export async function assignAgent(
  bookingId: string,
  agentId: string,
  changedBy: string
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE bookings SET agent_id = ${agentId}, updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];
  if (rows[0] && rows[0].status === "new") {
    await updateStatus(bookingId, "reviewing", changedBy, "Assigned to agent");
    return getBookingById(bookingId);
  }
  return rows[0] ?? null;
}

export async function setRemarks(
  bookingId: string,
  remarks: string
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE bookings SET internal_remarks = ${remarks}, updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];
  return rows[0] ?? null;
}

export async function listHistory(bookingId: string): Promise<BookingHistoryEntry[]> {
  const sql = getSql();
  return (await sql`
    SELECT * FROM booking_status_history WHERE booking_id = ${bookingId} ORDER BY created_at ASC
  `) as BookingHistoryEntry[];
}

export async function addDocument(
  bookingId: string,
  docType: DocumentType,
  url: string,
  uploadedBy: string
): Promise<BookingDocument> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO booking_documents (booking_id, doc_type, url, uploaded_by)
    VALUES (${bookingId}, ${docType}, ${url}, ${uploadedBy})
    RETURNING *
  `) as BookingDocument[];
  return rows[0];
}

export async function listDocuments(bookingId: string): Promise<BookingDocument[]> {
  const sql = getSql();
  return (await sql`
    SELECT * FROM booking_documents WHERE booking_id = ${bookingId} ORDER BY created_at DESC
  `) as BookingDocument[];
}

export async function addNotification(
  bookingId: string,
  channel: NotificationChannel,
  message: string
): Promise<BookingNotification> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO booking_notifications (booking_id, channel, message)
    VALUES (${bookingId}, ${channel}, ${message})
    RETURNING *
  `) as BookingNotification[];
  return rows[0];
}

export async function listNotifications(bookingId: string): Promise<BookingNotification[]> {
  const sql = getSql();
  return (await sql`
    SELECT * FROM booking_notifications WHERE booking_id = ${bookingId} ORDER BY created_at DESC
  `) as BookingNotification[];
}
