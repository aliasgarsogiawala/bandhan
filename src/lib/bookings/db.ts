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
import type { BookingParty } from "./party";
import type {
  BookingPackageSnapshot,
  BookingSource,
  QuoteSnapshot,
  RoomConfiguration,
  SelectedAddon,
  TravellerBreakdown,
} from "./pricing";
import { formatMoney } from "./pricing";

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
  /** Agent this booking belongs to, set when an agent raises it for a client. */
  agentId?: string | null;
  agentReference?: string | null;
  packageId?: string;
  packageTitle?: string;
  departureId?: string;
  destination?: string;
  travelDate?: string;
  travellersCount?: number;
  travellerNames?: string;
  budget?: string;
  specialRequirements?: string;
  bookingSource?: BookingSource;
  departureCity?: string;
  durationLabel?: string;
  travellers?: TravellerBreakdown;
  rooms?: RoomConfiguration;
  selectedAddons?: SelectedAddon[];
  pricingSnapshot?: QuoteSnapshot;
  packageSnapshot?: BookingPackageSnapshot;
  termsAccepted?: boolean;
  /** Lead traveller and, when the trip was arranged for them, the booker. */
  party: BookingParty;
  /** Opening status — agent-raised bookings skip the unassigned 'new' queue. */
  status?: BookingStatus;
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
  const quotationNumber = `QT-${code.replace("BKG-", "")}`;
  const travellers = input.travellers || {
    adults: Math.max(1, input.travellersCount || 1),
    childrenWithBed: 0,
    childrenWithoutBed: 0,
    infants: 0,
  };
  const rooms = input.rooms || { singleRooms: 0, doubleRooms: 1, tripleRooms: 0 };
  const selectedAddons = JSON.stringify(input.selectedAddons || []);
  const pricingSnapshot = JSON.stringify(input.pricingSnapshot || {});
  const packageSnapshot = JSON.stringify(input.packageSnapshot || {});
  const { party } = input;
  const status: BookingStatus = input.status || "new";
  const rows = (await sql`
    INSERT INTO bookings (
      booking_code, type, user_id, agent_id, package_id, package_title, departure_id, destination,
      travel_date, travellers_count, traveller_names, budget, special_requirements,
      contact_name, contact_email, contact_phone, booking_source, departure_city,
      duration_label, adults, children_with_bed, children_without_bed, infants,
      room_configuration, selected_addons, pricing_snapshot, package_snapshot,
      terms_accepted, quotation_number, price_amount, status, booked_for,
      booker_name, booker_email, booker_phone, booker_relation, notify_booker, agent_reference
    ) VALUES (
      ${code}, ${input.type}, ${input.userId || null}, ${input.agentId || null},
      ${input.packageId || null},
      ${packageTitle || null}, ${input.departureId || null}, ${destination || null},
      ${travelDate || null}, ${input.travellersCount ?? null}, ${input.travellerNames || null},
      ${input.budget || null}, ${input.specialRequirements || null}, ${party.contact.name},
      ${party.contact.email}, ${party.contact.phone}, ${input.bookingSource || "package"},
      ${input.departureCity || null}, ${input.durationLabel || null}, ${travellers.adults},
      ${travellers.childrenWithBed}, ${travellers.childrenWithoutBed}, ${travellers.infants},
      ${JSON.stringify(rooms)}::jsonb, ${selectedAddons}::jsonb, ${pricingSnapshot}::jsonb,
      ${packageSnapshot}::jsonb, ${Boolean(input.termsAccepted)}, ${quotationNumber},
      ${input.pricingSnapshot?.total ? formatMoney(input.pricingSnapshot.total) : null},
      ${status}, ${party.bookedFor}, ${party.booker?.name || null},
      ${party.booker?.email || null}, ${party.booker?.phone || null},
      ${party.relation || null}, ${party.notifyBooker}, ${input.agentReference || null}
    )
    RETURNING *
  `) as Booking[];

  const booking = rows[0];
  await sql`
    INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
    VALUES (
      ${booking.id}, NULL, ${status},
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

export async function getBookingByAccessToken(
  id: string,
  accessToken: string
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM bookings WHERE id = ${id} AND access_token = ${accessToken} LIMIT 1
  `) as Booking[];
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

export async function updateCustomerBookingDetails(
  bookingId: string,
  patch: {
    travellerNames?: string;
    contactPhone?: string;
    specialRequirements?: string;
  }
): Promise<Booking | null> {
  const sql = getSql();
  const current = await getBookingById(bookingId);
  if (!current) return null;
  const rows = (await sql`
    UPDATE bookings
    SET
      traveller_names = ${patch.travellerNames?.trim() ?? current.traveller_names},
      contact_phone = ${patch.contactPhone?.trim() || current.contact_phone},
      special_requirements = ${patch.specialRequirements?.trim() ?? current.special_requirements},
      updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];
  if (rows[0]) {
    await sql`
      INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
      VALUES (${bookingId}, ${current.status}, ${current.status}, 'Traveller details updated', 'customer')
    `;
  }
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

export async function markBrochureSent(bookingId: string): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE bookings
    SET brochure_sent_at = now(), quotation_status = 'sent', updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];
  return rows[0] ?? null;
}
