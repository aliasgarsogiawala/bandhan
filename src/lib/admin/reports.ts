import "server-only";

import { getSql } from "@/lib/db";

export interface AdminReport {
  totals: { customers: number; bookings: number; enquiries: number; paymentsRecorded: number };
  bookingStatuses: Array<{ status: string; count: number }>;
  monthlyBookings: Array<{ month: string; count: number }>;
}

export async function getAdminReport(): Promise<AdminReport> {
  const sql = getSql();
  const [totals, bookingStatuses, monthlyBookings] = await Promise.all([
    sql`
      SELECT
        (SELECT COUNT(*)::int FROM users) AS customers,
        (SELECT COUNT(*)::int FROM bookings) AS bookings,
        (SELECT COUNT(*)::int FROM site_content WHERE collection_key = 'enquiries') AS enquiries,
        (SELECT COUNT(*)::int FROM bookings WHERE payment_status = 'received') AS payments_recorded
    `,
    sql`SELECT status, COUNT(*)::int AS count FROM bookings GROUP BY status ORDER BY count DESC`,
    sql`
      SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM bookings
      WHERE created_at >= date_trunc('month', now()) - interval '5 months'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at)
    `,
  ]);
  const total = (totals as Array<{
    customers: number;
    bookings: number;
    enquiries: number;
    payments_recorded: number;
  }>)[0];
  return {
    totals: {
      customers: total.customers,
      bookings: total.bookings,
      enquiries: total.enquiries,
      paymentsRecorded: total.payments_recorded,
    },
    bookingStatuses: bookingStatuses as Array<{ status: string; count: number }>,
    monthlyBookings: monthlyBookings as Array<{ month: string; count: number }>,
  };
}
