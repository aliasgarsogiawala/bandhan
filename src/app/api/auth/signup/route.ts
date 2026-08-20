import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { createUser } from "@/lib/auth/users";
import { hashPassword } from "@/lib/auth/password";
import { isAuthConfigured, signSession, USER_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Authentication is not configured." }, { status: 503 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Sign-up isn't available yet — the database isn't configured." },
      { status: 503 }
    );
  }

  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (name.length < 2) return fail("Please enter your name.");
  if (!EMAIL_RE.test(email)) return fail("Please enter a valid email address.");
  if (password.length < 8) return fail("Password must be at least 8 characters.");

  try {
    const user = await createUser(name, email, hashPassword(password));
    const response = NextResponse.json({ ok: true, user });
    response.cookies.set(USER_COOKIE, signSession(user.id), sessionCookieOptions());
    return response;
  } catch (error: unknown) {
    const code = (error as { code?: string })?.code;
    const message = String((error as { message?: string })?.message ?? "");
    if (code === "23505" || message.includes("duplicate")) {
      return NextResponse.json(
        { ok: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }
    console.error("signup error:", error);
    return NextResponse.json(
      { ok: false, error: "Could not create your account. Please try again." },
      { status: 500 }
    );
  }
}

function fail(error: string) {
  return NextResponse.json({ ok: false, error }, { status: 400 });
}
