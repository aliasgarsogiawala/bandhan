import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth/session";
import { createContentItem } from "@/lib/content/db";
import type { Enquiry } from "@/lib/admin/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Enquiries are temporarily unavailable." },
      { status: 503 }
    );
  }
  const body = (await request.json().catch(() => null)) as Partial<Enquiry> | null;
  const name = (body?.name || "").trim();
  const email = (body?.email || "").trim().toLowerCase();
  const phone = (body?.phone || "").trim();
  const message = (body?.message || "").trim();
  if (name.length < 2 || !EMAIL_RE.test(email) || phone.length < 6 || message.length < 3) {
    return NextResponse.json(
      { ok: false, error: "Please provide a valid name, email, phone number, and message." },
      { status: 400 }
    );
  }

  const userId = await getSessionUserId();
  const enquiry = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    destination: (body?.destination || "").trim(),
    travelMonth: (body?.travelMonth || "").trim(),
    guests: (body?.guests || "").trim(),
    subject: (body?.subject || "").trim(),
    message: message.slice(0, 8000),
    source:
      body?.source === "contact-page" || body?.source === "mice-page"
        ? body.source
        : "enquiry-modal",
    status: "new" as const,
    createdAt: new Date().toISOString(),
    userId,
  };

  try {
    await createContentItem("enquiries", enquiry);
    return NextResponse.json({ ok: true, enquiry: { id: enquiry.id } }, { status: 201 });
  } catch (error) {
    console.error("create enquiry error:", error);
    return NextResponse.json({ ok: false, error: "Could not submit your enquiry." }, { status: 500 });
  }
}
