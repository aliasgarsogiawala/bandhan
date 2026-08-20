import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { getCustomerDetail } from "@/lib/admin/customers";
import { updateUserProfile } from "@/lib/auth/users";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { name?: string; email?: string; phone?: string };
  const name = body.name?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid name and email." }, { status: 400 });
  }
  try {
    const user = await updateUserProfile(id, { name, email, phone: body.phone });
    if (!user) return NextResponse.json({ ok: false, error: "Customer not found." }, { status: 404 });
    const customer = await getCustomerDetail(id);
    return NextResponse.json({ ok: true, customer });
  } catch (error) {
    console.error("update customer error:", error);
    return NextResponse.json({ ok: false, error: "Could not update customer." }, { status: 409 });
  }
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
