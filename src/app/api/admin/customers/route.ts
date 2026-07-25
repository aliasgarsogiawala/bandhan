import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { listCustomers } from "@/lib/admin/customers";

export async function GET(request: Request) {
  if (!isDbConfigured()) return NextResponse.json({ customers: [] });
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  try {
    const customers = await listCustomers();
    return NextResponse.json({ ok: true, customers });
  } catch (error) {
    console.error("list customers error:", error);
    return NextResponse.json({ ok: false, error: "Could not load customers." }, { status: 500 });
  }
}
