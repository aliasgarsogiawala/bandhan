import { NextResponse } from "next/server";
import { isDbConfigured } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/auth";
import { normalizePackageDates, PackageDateError } from "@/lib/packageDates";
import {
  createContentItem,
  deleteContentItem,
  isCollectionKey,
  listContent,
  listPublicContent,
  updateContentItem,
} from "@/lib/content/db";

interface RouteParams {
  params: Promise<{ collection: string }>;
}

export const dynamic = "force-dynamic";
const noStore = { "Cache-Control": "private, no-store, max-age=0" };

function unavailable() {
  return NextResponse.json(
    { ok: false, error: "The shared content database is not configured." },
    { status: 503 }
  );
}

export async function GET(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) return unavailable();
  const { collection } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ ok: false, error: "Unknown content collection." }, { status: 404 });
  }
  if (collection === "enquiries" && !requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }

  try {
    const items = requireAdmin(request)
      ? await listContent(collection)
      : await listPublicContent(collection as Exclude<typeof collection, "enquiries">);
    return NextResponse.json({ ok: true, items }, { headers: noStore });
  } catch (error) {
    console.error("list content error:", error);
    return NextResponse.json({ ok: false, error: "Could not load content." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) return unavailable();
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { collection } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ ok: false, error: "Unknown content collection." }, { status: 404 });
  }
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!body || !id) {
    return NextResponse.json({ ok: false, error: "Every content item needs an id." }, { status: 400 });
  }
  try {
    const fields = collection === "packages" && Object.hasOwn(body, "departureDates")
      ? { ...body, departureDates: normalizePackageDates(body.departureDates) }
      : body;
    const item = await createContentItem(collection, { ...fields, id });
    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    if (error instanceof PackageDateError) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    console.error("create content error:", error);
    return NextResponse.json({ ok: false, error: "Could not save content." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) return unavailable();
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { collection } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ ok: false, error: "Unknown content collection." }, { status: 404 });
  }
  const body = (await request.json().catch(() => null)) as
    | { id?: string; patch?: Record<string, unknown> }
    | null;
  if (!body?.id || !body.patch) {
    return NextResponse.json({ ok: false, error: "Missing item id or update." }, { status: 400 });
  }
  try {
    const patch = collection === "packages" && Object.hasOwn(body.patch, "departureDates")
      ? { ...body.patch, departureDates: normalizePackageDates(body.patch.departureDates) }
      : body.patch;
    const item = await updateContentItem(collection, body.id, patch);
    if (!item) return NextResponse.json({ ok: false, error: "Item not found." }, { status: 404 });
    return NextResponse.json({ ok: true, item });
  } catch (error) {
    if (error instanceof PackageDateError) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    console.error("update content error:", error);
    return NextResponse.json({ ok: false, error: "Could not update content." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!isDbConfigured()) return unavailable();
  if (!requireAdmin(request)) {
    return NextResponse.json({ ok: false, error: "Not authorized." }, { status: 401 });
  }
  const { collection } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ ok: false, error: "Unknown content collection." }, { status: 404 });
  }
  const id = new URL(request.url).searchParams.get("id")?.trim();
  if (!id) return NextResponse.json({ ok: false, error: "Missing item id." }, { status: 400 });
  try {
    const removed = await deleteContentItem(collection, id);
    return NextResponse.json({ ok: true, removed });
  } catch (error) {
    console.error("delete content error:", error);
    return NextResponse.json({ ok: false, error: "Could not delete content." }, { status: 500 });
  }
}
