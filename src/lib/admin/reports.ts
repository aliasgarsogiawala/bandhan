import "server-only";

import { getSql } from "@/lib/db";

export interface AdminReport {
  totals: { customers: number; bookings: number; enquiries: number; paidMinor: number };
  bookingStatuses: Array<{ status: string; count: number }>;
  monthlyBookings: Array<{ month: string; count: number }>;
  recentPayments: Array<{ bookingCode: string; amountMinor: number; status: string; createdAt: string }>;
}

export async function getAdminReport(): Promise<AdminReport> {
  const sql = getSql();
  const [totals, bookingStatuses, monthlyBookings, recentPayments] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS customers,
        (SELECT COUNT(*)::int FROM bookings) AS bookings,
        (SELECT COUNT(*)::int FROM site_content WHERE collection_key = 'enquiries') AS enquiries,
        (SELECT COALESCE(SUM(amount_minor), 0)::int FROM booking_payments WHERE status = 'paid') AS paid_minor
    `,
    sql`SELECT status, COUNT(*)::int AS count FROM bookings GROUP BY status ORDER BY count DESC`,
    sql`
      SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM bookings
      WHERE created_at >= date_trunc('month', now()) - interval '5 months'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at)
    `,
    sql`
      SELECT b.booking_code, p.amount_minor, p.status, p.created_at
      FROM booking_payments p
      JOIN bookings b ON b.id = p.booking_id
      ORDER BY p.created_at DESC
      LIMIT 20
    `,
  ]);
  const total = (totals as Array<{ customers: number; bookings: number; enquiries: number; paid_minor: number }>)[0];
  return {
    totals: { customers: total.customers, bookings: total.bookings, enquiries: total.enquiries, paidMinor: total.paid_minor },
    bookingStatuses: bookingStatuses as Array<{ status: string; count: number }>,
    monthlyBookings: monthlyBookings as Array<{ month: string; count: number }>,
    recentPayments: (recentPayments as Array<{ booking_code: string; amount_minor: number; status: string; created_at: string }>).map((item) => ({
      bookingCode: item.booking_code,
      amountMinor: item.amount_minor,
      status: item.status,
      createdAt: item.created_at,
    })),
  };
}
