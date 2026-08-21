import { getSql } from "@/lib/db";
import { getDepartureById } from "@/lib/departures/db";
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
  QuoteLineItem,
  QuoteSnapshot,
  RoomConfiguration,
  SelectedAddon,
  TravellerBreakdown,
} from "./pricing";
import { formatMoney, parseMoney } from "./pricing";

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
  internalRemarks?: string;
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
      terms_accepted, quotation_number, price_amount, status, internal_remarks, booked_for,
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
      ${status}, ${(input.internalRemarks || "").trim() || null}, ${party.bookedFor},
      ${party.booker?.name || null},
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
  if (toStatus === "confirmed") {
    return setPaymentStatus(bookingId, "received", changedBy);
  }
  const sql = getSql();
  const rows = (await sql`
    WITH current AS MATERIALIZED (
      SELECT * FROM bookings WHERE id = ${bookingId} FOR UPDATE
    ), restored AS (
      UPDATE group_departures
      SET
        seats_left = LEAST(
          seats_left + COALESCE(current.travellers_count, 1),
          total_seats
        ),
        status = CASE
          WHEN group_departures.status = 'sold-out' AND seats_left + COALESCE(current.travellers_count, 1) > 0
            THEN 'limited-seats'
          ELSE group_departures.status
        END,
        updated_at = now()
      FROM current
      WHERE group_departures.id = current.departure_id
        AND current.status = 'confirmed'
        AND ${toStatus} IN ('cancelled', 'rejected')
      RETURNING group_departures.id
    ), updated AS (
      UPDATE bookings SET status = ${toStatus}, updated_at = now()
      FROM current
      WHERE bookings.id = current.id
      RETURNING bookings.*
    ), history AS (
      INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
      SELECT current.id, current.status, ${toStatus}, ${note || null}, ${changedBy}
      FROM current JOIN updated ON updated.id = current.id
      RETURNING id
    )
    SELECT * FROM updated
  `) as Booking[];
  return rows[0] ?? null;
}

export async function setPricing(
  bookingId: string,
  priceAmount: string,
  changedBy: string
): Promise<Booking | null> {
  const current = await getBookingById(bookingId);
  if (!current) return null;

  const total = parseMoney(priceAmount);
  if (total <= 0) throw new Error("A valid quoted price is required.");

  const previous = current.pricing_snapshot || ({} as QuoteSnapshot);
  const depositPercent = Math.min(100, Math.max(0, Number(previous.depositPercent || 25)));
  const depositAmount = Math.round((total * depositPercent) / 100);
  const baseLines = (Array.isArray(previous.lineItems) ? previous.lineItems : []).filter(
    (line) => line.key !== "managed-price-adjustment" && line.key !== "managed-package-quote"
  );
  const baseTotal = baseLines.reduce((sum, line) => sum + Number(line.amount || 0), 0);
  const lineItems: QuoteLineItem[] = baseLines.length
    ? [
        ...baseLines,
        ...(baseTotal !== total
          ? [
              {
                key: "managed-price-adjustment",
                label: "Final quotation adjustment",
                quantity: 1,
                unitPrice: total - baseTotal,
                amount: total - baseTotal,
              },
            ]
          : []),
      ]
    : [
        {
          key: "managed-package-quote",
          label: "Package quotation",
          quantity: 1,
          unitPrice: total,
          amount: total,
        },
      ];
  const snapshot: QuoteSnapshot = {
    currency: "INR",
    lineItems,
    subtotal: total,
    total,
    depositPercent,
    depositAmount,
    balanceAmount: Math.max(0, total - depositAmount),
    validityDays: Math.max(1, Number(previous.validityDays || 7)),
    generatedAt: new Date().toISOString(),
    isIndicative: false,
  };

  const sql = getSql();
  const rows = (await sql`
    WITH current AS MATERIALIZED (
      SELECT id, status FROM bookings WHERE id = ${bookingId} FOR UPDATE
    ), updated AS (
      UPDATE bookings
      SET
        price_amount = ${formatMoney(total)},
        pricing_snapshot = ${JSON.stringify(snapshot)}::jsonb,
        quotation_status = 'generated',
        status = 'quoted',
        updated_at = now()
      FROM current
      WHERE bookings.id = current.id
      RETURNING bookings.*
    ), history AS (
      INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
      SELECT current.id, current.status, 'quoted', ${`Final price set to ${formatMoney(total)}`}, ${changedBy}
      FROM current JOIN updated ON updated.id = current.id
      RETURNING id
    )
    SELECT * FROM updated
  `) as Booking[];
  return rows[0] ?? null;
}

export async function setPaymentStatus(
  bookingId: string,
  paymentStatus: PaymentStatus,
  changedBy: string
): Promise<Booking | null> {
  const sql = getSql();
  if (paymentStatus === "received") {
    const rows = (await sql`
      WITH current AS MATERIALIZED (
        SELECT * FROM bookings WHERE id = ${bookingId} FOR UPDATE
      ), claimed AS (
        UPDATE group_departures
        SET
          seats_left = seats_left - COALESCE(current.travellers_count, 1),
          status = CASE
            WHEN seats_left - COALESCE(current.travellers_count, 1) <= 0 THEN 'sold-out'
            ELSE group_departures.status
          END,
          updated_at = now()
        FROM current
        WHERE group_departures.id = current.departure_id
          AND current.status IN ('approved', 'payment_pending')
          AND group_departures.seats_left >= COALESCE(current.travellers_count, 1)
        RETURNING group_departures.id
      ), updated AS (
        UPDATE bookings
        SET payment_status = 'received', status = 'confirmed', updated_at = now()
        FROM current
        WHERE bookings.id = current.id
          AND (
            current.status = 'confirmed'
            OR (
              current.status IN ('approved', 'payment_pending')
              AND (
                current.departure_id IS NULL
                OR EXISTS (SELECT 1 FROM claimed WHERE claimed.id = current.departure_id)
              )
            )
          )
        RETURNING bookings.*
      ), history AS (
        INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
        SELECT current.id, current.status, 'confirmed', 'Payment received', ${changedBy}
        FROM current JOIN updated ON updated.id = current.id
        WHERE current.status <> 'confirmed' OR current.payment_status <> 'received'
        RETURNING id
      )
      SELECT * FROM updated
    `) as Booking[];
    if (!rows[0]) {
      const current = await getBookingById(bookingId);
      if (current?.departure_id && ["approved", "payment_pending"].includes(current.status)) {
        throw new SoldOutError();
      }
    }
    return rows[0] ?? null;
  }

  const rows = (await sql`
    UPDATE bookings SET payment_status = ${paymentStatus}, updated_at = now()
    WHERE id = ${bookingId}
    RETURNING *
  `) as Booking[];
  return rows[0] ?? null;
}

export async function assignAgent(
  bookingId: string,
  agentId: string,
  changedBy: string,
  assignedTo = agentId
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    WITH current AS MATERIALIZED (
      SELECT id, status, agent_id FROM bookings WHERE id = ${bookingId} FOR UPDATE
    ), updated AS (
      UPDATE bookings
      SET
        agent_id = ${agentId},
        status = CASE WHEN current.status = 'new' THEN 'reviewing' ELSE current.status END,
        updated_at = now()
      FROM current
      WHERE bookings.id = current.id
      RETURNING bookings.*
    ), history AS (
      INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
      SELECT
        current.id,
        current.status,
        CASE WHEN current.status = 'new' THEN 'reviewing' ELSE current.status END,
        ${`Assigned to ${assignedTo}`},
        ${changedBy}
      FROM current JOIN updated ON updated.id = current.id
      WHERE current.agent_id IS DISTINCT FROM ${agentId}::uuid
      RETURNING id
    )
    SELECT * FROM updated
  `) as Booking[];
  return rows[0] ?? null;
}

export async function unassignAgent(
  bookingId: string,
  changedBy: string
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    WITH current AS MATERIALIZED (
      SELECT id, status, agent_id FROM bookings WHERE id = ${bookingId} FOR UPDATE
    ), updated AS (
      UPDATE bookings SET agent_id = NULL, updated_at = now()
      FROM current
      WHERE bookings.id = current.id
      RETURNING bookings.*
    ), history AS (
      INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
      SELECT current.id, current.status, current.status, 'Agent unassigned', ${changedBy}
      FROM current JOIN updated ON updated.id = current.id
      WHERE current.agent_id IS NOT NULL
      RETURNING id
    )
    SELECT * FROM updated
  `) as Booking[];
  return rows[0] ?? null;
}

export async function setRemarks(
  bookingId: string,
  remarks: string,
  changedBy = "system"
): Promise<Booking | null> {
  const sql = getSql();
  const rows = (await sql`
    WITH current AS MATERIALIZED (
      SELECT id, status, internal_remarks FROM bookings WHERE id = ${bookingId} FOR UPDATE
    ), updated AS (
      UPDATE bookings SET internal_remarks = ${remarks}, updated_at = now()
      FROM current
      WHERE bookings.id = current.id
      RETURNING bookings.*
    ), history AS (
      INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
      SELECT current.id, current.status, current.status, 'Internal remarks updated', ${changedBy}
      FROM current JOIN updated ON updated.id = current.id
      WHERE current.internal_remarks IS DISTINCT FROM ${remarks}
      RETURNING id
    )
    SELECT * FROM updated
  `) as Booking[];
  return rows[0] ?? null;
}

export interface ManagedBookingDetailsPatch {
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  destination?: string;
  travelDate?: string;
  departureCity?: string;
  durationLabel?: string;
  travellerNames?: string;
  budget?: string;
  specialRequirements?: string;
  travellers: TravellerBreakdown;
  rooms: RoomConfiguration;
  userId?: string | null;
}

export async function updateManagedBookingDetails(
  bookingId: string,
  patch: ManagedBookingDetailsPatch,
  changedBy: string
): Promise<Booking | null> {
  const current = await getBookingById(bookingId);
  if (!current) return null;
  const travellersCount =
    patch.travellers.adults +
    patch.travellers.childrenWithBed +
    patch.travellers.childrenWithoutBed +
    patch.travellers.infants;
  const packageSnapshot: BookingPackageSnapshot = {
    ...(current.package_snapshot || ({} as BookingPackageSnapshot)),
    destination: patch.destination?.trim() || current.destination || "To be confirmed",
    duration: patch.durationLabel?.trim() || current.duration_label || undefined,
  };

  const sql = getSql();
  const rows = (await sql`
    WITH locked AS MATERIALIZED (
      SELECT id, status FROM bookings WHERE id = ${bookingId} FOR UPDATE
    ), updated AS (
      UPDATE bookings
      SET
        user_id = ${patch.userId === undefined ? current.user_id : patch.userId},
        contact_name = ${patch.contactName.trim()},
        contact_email = ${patch.contactEmail.trim().toLowerCase()},
        contact_phone = ${patch.contactPhone.trim()},
        destination = ${(patch.destination || "").trim() || null},
        travel_date = ${(patch.travelDate || "").trim() || null},
        departure_city = ${(patch.departureCity || "").trim() || null},
        duration_label = ${(patch.durationLabel || "").trim() || null},
        traveller_names = ${(patch.travellerNames || "").trim() || null},
        budget = ${(patch.budget || "").trim() || null},
        special_requirements = ${(patch.specialRequirements || "").trim() || null},
        travellers_count = ${travellersCount},
        adults = ${patch.travellers.adults},
        children_with_bed = ${patch.travellers.childrenWithBed},
        children_without_bed = ${patch.travellers.childrenWithoutBed},
        infants = ${patch.travellers.infants},
        room_configuration = ${JSON.stringify(patch.rooms)}::jsonb,
        package_snapshot = ${JSON.stringify(packageSnapshot)}::jsonb,
        updated_at = now()
      FROM locked
      WHERE bookings.id = locked.id
      RETURNING bookings.*
    ), history AS (
      INSERT INTO booking_status_history (booking_id, from_status, to_status, note, changed_by)
      SELECT locked.id, locked.status, locked.status, 'Booking and traveller details updated', ${changedBy}
      FROM locked JOIN updated ON updated.id = locked.id
      RETURNING id
    )
    SELECT * FROM updated
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
