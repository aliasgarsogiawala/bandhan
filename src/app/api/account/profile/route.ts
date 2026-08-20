import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth/session";
import { findUserById, updateUserProfile } from "@/lib/auth/users";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });
  const user = await findUserById(userId);
  return NextResponse.json({ ok: true, user });
}

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ ok: false, error: "Not signed in." }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as {
    name?: string;
    email?: string;
    phone?: string;
  };
  const name = body.name?.trim() || "";
  const email = body.email?.trim().toLowerCase() || "";
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid name and email." }, { status: 400 });
  }

  try {
    const user = await updateUserProfile(userId, { name, email, phone: body.phone });
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("update profile error:", error);
    return NextResponse.json(
      { ok: false, error: "That email may already be in use." },
      { status: 409 }
    );
  }
}
