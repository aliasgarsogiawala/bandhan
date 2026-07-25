import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getCustomerDetail } from "@/lib/admin/customers";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const customer = await getCustomerDetail(id);
    if (!customer) {
      return NextResponse.json({ ok: false, error: "Customer not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    console.error("get customer error:", error);
    return NextResponse.json({ ok: false, error: "Could not load the customer." }, { status: 500 });
  }
}
