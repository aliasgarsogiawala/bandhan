import { getSql } from "@/lib/db";
import type { Booking, NotificationChannel } from "@/lib/bookings/types";

/** A registered customer with aggregate booking activity for the list view. */
export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  created_at: string;
  bookings_count: number;
  last_booking_at: string | null;
}

/** A single logged communication tied to one of the customer's bookings. */
export interface CustomerCommunication {
  id: string;
  booking_id: string;
  booking_code: string;
  channel: NotificationChannel;
  message: string;
  created_at: string;
}

export interface CustomerDetail extends CustomerSummary {
  phone: string | null; // most recent contact phone seen on their bookings
  bookings: Booking[];
  communications: CustomerCommunication[];
}

export async function listCustomers(): Promise<CustomerSummary[]> {
  const sql = getSql();
  return (await sql`
    SELECT
      u.id,
      u.name,
      u.email,
      u.created_at,
      COUNT(b.id)::int AS bookings_count,
      MAX(b.created_at) AS last_booking_at
    FROM users u
    LEFT JOIN bookings b ON b.user_id = u.id
    GROUP BY u.id, u.name, u.email, u.created_at
    ORDER BY u.created_at DESC
  `) as CustomerSummary[];
}

export async function getCustomerDetail(id: string): Promise<CustomerDetail | null> {
  const sql = getSql();

  const users = (await sql`
    SELECT id, name, email, phone, created_at
    FROM users
    WHERE id = ${id}
    LIMIT 1
  `) as Array<Pick<CustomerSummary, "id" | "name" | "email" | "created_at"> & { phone: string | null }>;

  const user = users[0];
  if (!user) return null;

  const bookings = (await sql`
    SELECT * FROM bookings
    WHERE user_id = ${id}
    ORDER BY created_at DESC
  `) as Booking[];

  const communications = (await sql`
    SELECT n.id, n.booking_id, n.channel, n.message, n.created_at, b.booking_code
    FROM booking_notifications n
    JOIN bookings b ON b.id = n.booking_id
    WHERE b.user_id = ${id}
    ORDER BY n.created_at DESC
  `) as CustomerCommunication[];

  const lastBookingAt = bookings[0]?.created_at ?? null;
  const phone = user.phone || bookings.find((b) => b.contact_phone)?.contact_phone || null;

  return {
    ...user,
    phone,
    bookings_count: bookings.length,
    last_booking_at: lastBookingAt,
    bookings,
    communications,
  };
}
