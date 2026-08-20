import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { deleteSavedTraveller, updateSavedTraveller } from "@/lib/auth/users";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string | null;
    phone?: string | null;
    relationship?: string | null;
  };
  if (!body.name?.trim()) {
    return NextResponse.json({ ok: false, error: "Traveller name is required." }, { status: 400 });
  }
  const traveller = await updateSavedTraveller(userId, id, {
    name: body.name,
    email: body.email || null,
    phone: body.phone || null,
    relationship: body.relationship || null,
  });
  if (!traveller) return NextResponse.json({ ok: false, error: "Traveller not found." }, { status: 404 });
  return NextResponse.json({ ok: true, traveller });
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const { id } = await params;
  const deleted = await deleteSavedTraveller(userId, id);
  if (!deleted) return NextResponse.json({ ok: false, error: "Traveller not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
