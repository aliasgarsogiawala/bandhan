import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { listCustomerEnquiries } from "@/lib/content/db";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const enquiries = await listCustomerEnquiries(userId);
  return NextResponse.json({ ok: true, enquiries });
}
