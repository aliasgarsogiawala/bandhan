import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminReport } from "@/lib/admin/reports";

export async function GET(request: Request) {
  if (!requireAdmin(request)) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  try {
    const report = await getAdminReport();
    if (new URL(request.url).searchParams.get("format") === "csv") {
      const rows = [
        ["Metric", "Value"],
        ["Customers", report.totals.customers],
        ["Bookings", report.totals.bookings],
        ["Enquiries", report.totals.enquiries],
        ["Paid amount (INR)", (report.totals.paidMinor / 100).toFixed(2)],
        [],
        ["Booking status", "Count"],
        ...report.bookingStatuses.map((item) => [item.status, item.count]),
      ];
      const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? "").replaceAll('"', '""')}"`).join(",")).join("\n");
      return new Response(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=bandhan-report.csv" } });
    }
    return NextResponse.json({ ok: true, report });
  } catch (error) {
    console.error("admin report error:", error);
    return NextResponse.json({ ok: false, error: "Could not load reports." }, { status: 500 });
  }
}
