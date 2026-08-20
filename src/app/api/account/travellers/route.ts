import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { createSavedTraveller, listSavedTravellers } from "@/lib/auth/users";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  return NextResponse.json({ ok: true, travellers: await listSavedTravellers(userId) });
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    phone?: string;
    relationship?: string;
  };
  if (!body.name?.trim()) {
    return NextResponse.json({ ok: false, error: "Traveller name is required." }, { status: 400 });
  }
  const traveller = await createSavedTraveller(userId, {
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    relationship: body.relationship || null,
  });
  return NextResponse.json({ ok: true, traveller }, { status: 201 });
}
