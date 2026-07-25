import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { getActor } from "@/lib/bookings/authz";
import { addDocument, getBookingById } from "@/lib/bookings/db";
import type { DocumentType } from "@/lib/bookings/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

const DOC_TYPES: DocumentType[] = ["quotation", "invoice", "itinerary", "voucher", "other"];

export async function POST(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, error: "Not available." }, { status: 503 });
  }

  const actor = await getActor(request);
  if (!actor) return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });

  const { id } = await params;
  const existing = await getBookingById(id);
  if (!existing) return NextResponse.json({ ok: false, error: "Booking not found." }, { status: 404 });

  let body: { docType?: string; url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const docType = DOC_TYPES.includes(body.docType as DocumentType)
    ? (body.docType as DocumentType)
    : "other";
  const url = (body.url || "").trim();
  if (!url) return NextResponse.json({ ok: false, error: "Missing document URL." }, { status: 400 });

  try {
    const document = await addDocument(id, docType, url, actor.label);
    return NextResponse.json({ ok: true, document });
  } catch (error) {
    console.error("add document error:", error);
    return NextResponse.json({ ok: false, error: "Could not attach the document." }, { status: 500 });
  }
}
