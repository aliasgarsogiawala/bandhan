import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { findUserByEmail } from "@/lib/auth/users";
import { verifyPassword } from "@/lib/auth/password";
import { isAuthConfigured, signSession, USER_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Authentication is not configured." }, { status: 503 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Sign-in isn't available yet — the database isn't configured." },
      { status: 503 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Enter your email and password." }, { status: 400 });
  }

  try {
    const user = await findUserByEmail(email);
    // Generic message either way so we don't reveal which emails are registered.
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ ok: false, error: "Invalid email or password." }, { status: 401 });
    }

    const response = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
    response.cookies.set(USER_COOKIE, signSession(user.id), sessionCookieOptions());
    return response;
  } catch (error) {
    console.error("login error:", error);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
