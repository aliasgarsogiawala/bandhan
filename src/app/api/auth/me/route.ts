import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";

export async function GET() {
  if (!isDbConfigured()) return NextResponse.json({ user: null });

  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ user: null });

  try {
    const user = await findUserById(userId);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("auth/me error:", error);
    return NextResponse.json({ user: null });
  }
}
