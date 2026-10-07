"use client";

import React, { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ImagePlus, Search, Trash2, TriangleAlert } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { store, useCollection } from "@/lib/admin/store";
import type { Destination, PackageGalleryImage, TourPackage } from "@/data/mockData";

type Tab = "packages" | "destinations";

interface GalleryDraft {
  image: string;
  caption: string;
}

interface ImageDraft {
  image: string;
  heroImage: string;
  gallery: GalleryDraft[];
}

interface ManagedItem {
  id: string;
  title: string;
  subtitle: string;
  isDraft: boolean;
  images: ImageDraft;
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-primary transition-colors focus:border-accent focus:outline-none";

// Links to a web page that *shows* an image, rather than the image file itself.
const PAGE_LINK_PATTERNS = [
  /google\.[a-z.]+\/(imgres|search)/i,
  /drive\.google\.com\/(file|open)/i,
  /instagram\.com\/(p|reel)\//i,
  /pinterest\.[a-z.]+\/pin\//i,
  /facebook\.com\//i,
];

/** Returns an error message for an unusable link, or "" when it looks fine. */
function linkProblem(url: string): string {
  const value = url.trim();
  if (!value) return "";
  if (!/^https:\/\/\S+$/i.test(value)) return "The link must start with https:// and contain no spaces.";
  if (PAGE_LINK_PATTERNS.some((pattern) => pattern.test(value))) {
    return "This is a link to a web page, not the image itself. Right-click the image and choose “Copy image address”.";
  }
  return "";
}

function fromPackage(pkg: TourPackage): ManagedItem {
  return {
    id: pkg.id,
    title: pkg.title,
    subtitle: [pkg.category, pkg.duration].filter(Boolean).join(" · "),
    isDraft: pkg.status === "draft",
    images: {
      image: pkg.image || "",
      heroImage: pkg.heroImage || "",
      gallery: (pkg.gallery || [])
        .filter((slide) => !slide.placeholder)
        .map((slide) => ({ image: slide.image, caption: slide.caption || "" })),
    },
  };
}

function fromDestination(destination: Destination): ManagedItem {
  return {
    id: destination.id,
    title: destination.name,
    subtitle: [destination.country, destination.region].filter(Boolean).join(" · "),
    isDraft: destination.status === "draft",
    images: {
      image: destination.image || "",
      heroImage: "",
      gallery: (destination.gallery || []).map((image) => ({ image, caption: "" })),
    },
  };
}

function ImagePreview({ url, className = "" }: { url: string; className?: string }) {
  const [failedUrl, setFailedUrl] = useState("");
  const failed = Boolean(url) && failedUrl === url;

  return (
    <div className={`relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 ${className}`}>
      {url && !failed ? (
        // Team-pasted links can be on any host, so this preview bypasses next/image.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" loading="lazy" onError={() => setFailedUrl(url)} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center p-2 text-center text-[11px] font-semibold text-foreground-light">
          {failed ? "Image didn't load" : "No image"}
        </div>
      )}
    </div>
  );
}

function UrlField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const problem = linkProblem(value);
  return (
    <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
      <ImagePreview url={problem ? "" : value.trim()} className="aspect-[4/3] w-full" />
      <div className="space-y-1.5">
        <label className="block text-xs font-semibold uppercase tracking-wide text-primary">
          {label}
          <input
            type="url"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://… paste the image address"
            className={`${fieldClass} mt-1.5 normal-case tracking-normal`}
          />
        </label>
        <p className="text-[11px] text-foreground-light">{hint}</p>
        {problem && (
          <p className="flex items-start gap-1.5 text-xs font-medium text-accent-dark">
            <TriangleAlert size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
            {problem}
          </p>
        )}
      </div>
    </div>
  );
}

function ItemEditor({ item, tab }: { item: ManagedItem; tab: Tab }) {
  const [draft, setDraft] = useState<ImageDraft>(item.images);
  const [newUrl, setNewUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const dirty = JSON.stringify(draft) !== JSON.stringify(item.images);
  const allUrls = [draft.image, draft.heroImage, ...draft.gallery.map((slide) => slide.image)];
  const hasProblem = allUrls.some((url) => linkProblem(url));
  const newUrlProblem = linkProblem(newUrl);

  const setField = (field: "image" | "heroImage", value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setMessage(null);
  };

  const updateGallery = (next: GalleryDraft[]) => {
    setDraft((current) => ({ ...current, gallery: next }));
    setMessage(null);
  };

  const moveSlide = (index: number, offset: -1 | 1) => {
    const next = [...draft.gallery];
    const [slide] = next.splice(index, 1);
    next.splice(index + offset, 0, slide);
    updateGallery(next);
  };

  const addSlide = () => {
    const url = newUrl.trim();
    if (!url || newUrlProblem) return;
    updateGallery([...draft.gallery, { image: url, caption: "" }]);
    setNewUrl("");
  };

  const save = async () => {
    if (hasProblem) {
      setMessage({ kind: "error", text: "Fix the highlighted links before saving." });
      return;
    }
    if (!draft.image.trim()) {
      setMessage({ kind: "error", text: "A cover image is required." });
      return;
    }
    setSaving(true);
    setMessage(null);
    const gallery = draft.gallery.filter((slide) => slide.image.trim());
    try {
      if (tab === "packages") {
        await store.update<TourPackage>("packages", item.id, {
          image: draft.image.trim(),
          heroImage: draft.heroImage.trim(),
          gallery: gallery.map<PackageGalleryImage>((slide) => ({
            image: slide.image.trim(),
            caption: slide.caption.trim() || item.title,
          })),
        });
      } else {
        await store.update<Destination>("destinations", item.id, {
          image: draft.image.trim(),
          gallery: gallery.map((slide) => slide.image.trim()),
        });
      }
      setMessage({ kind: "ok", text: "Saved — the website now shows these images." });
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Could not save. Try again." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 border-t border-slate-100 px-4 py-5 sm:px-5">
      <UrlField
        label="Cover image"
        hint="Shown on cards and listings across the site."
        value={draft.image}
        onChange={(value) => setField("image", value)}
      />

      {tab === "packages" && (
        <UrlField
          label="Banner image (top of the itinerary page)"
          hint="Leave empty to use the cover image."
          value={draft.heroImage}
          onChange={(value) => setField("heroImage", value)}
        />
      )}

      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Gallery <span className="text-accent">{draft.gallery.length}</span>
          </p>
          <p className="text-[11px] text-foreground-light">
            {tab === "packages"
              ? "Shown in the itinerary's photo grid and beside the day-by-day plan. "
              : "Shown in the destination's photo grid. "}
            With fewer than 6 photos, the site fills the gaps with stock travel photos.
          </p>
        </div>

        {draft.gallery.map((slide, index) => {
          const problem = linkProblem(slide.image);
          return (
            <div key={index} className="grid gap-3 rounded-2xl border border-slate-100 bg-sand/40 p-3 sm:grid-cols-[120px_1fr_auto]">
              <ImagePreview url={problem ? "" : slide.image.trim()} className="aspect-[4/3] w-full" />
              <div className="space-y-2">
                <input
                  type="url"
                  value={slide.image}
                  aria-label={`Gallery image ${index + 1} link`}
                  onChange={(event) =>
                    updateGallery(draft.gallery.map((s, i) => (i === index ? { ...s, image: event.target.value } : s)))
                  }
                  className={fieldClass}
                />
                {tab === "packages" && (
                  <input
                    type="text"
                    value={slide.caption}
                    aria-label={`Gallery image ${index + 1} caption`}
                    placeholder="Caption (optional)"
                    onChange={(event) =>
                      updateGallery(draft.gallery.map((s, i) => (i === index ? { ...s, caption: event.target.value } : s)))
                    }
                    className={fieldClass}
                  />
                )}
                {problem && <p className="text-xs font-medium text-accent-dark">{problem}</p>}
              </div>
              <div className="flex gap-1 sm:flex-col">
                <button type="button" onClick={() => moveSlide(index, -1)} disabled={index === 0} aria-label="Move up" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary disabled:opacity-30">
                  <ArrowUp size={16} />
                </button>
                <button type="button" onClick={() => moveSlide(index, 1)} disabled={index === draft.gallery.length - 1} aria-label="Move down" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary disabled:opacity-30">
                  <ArrowDown size={16} />
                </button>
                <button type="button" onClick={() => updateGallery(draft.gallery.filter((_, i) => i !== index))} aria-label="Remove image" className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-accent-dark hover:bg-accent/10">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        <div className="space-y-1.5">
          <div className="flex gap-2">
            <input
              type="url"
              value={newUrl}
              onChange={(event) => setNewUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  addSlide();
                }
              }}
              placeholder="Paste an image address to add it to the gallery"
              className={fieldClass}
            />
            <button type="button" onClick={addSlide} disabled={!newUrl.trim() || Boolean(newUrlProblem)} className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-4 text-xs font-bold text-primary hover:bg-slate-50 disabled:opacity-40">
              <ImagePlus size={15} /> Add
            </button>
          </div>
          {newUrlProblem && <p className="text-xs font-medium text-accent-dark">{newUrlProblem}</p>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
        <PrimaryButton type="button" variant="navy" size="sm" onClick={save} isLoading={saving} disabled={!dirty || saving}>
          Save images
        </PrimaryButton>
        {dirty && !saving && (
          <button type="button" onClick={() => { setDraft(item.images); setMessage(null); }} className="text-xs font-bold text-foreground-muted hover:text-primary">
            Discard changes
          </button>
        )}
        {message && (
          <p role="status" className={`text-sm font-medium ${message.kind === "ok" ? "text-emerald-600" : "text-accent-dark"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ImageManager() {
  const { items: packages, ready: packagesReady } = useCollection<TourPackage>("packages");
  const { items: destinations, ready: destinationsReady } = useCollection<Destination>("destinations");
  const [tab, setTab] = useState<Tab>("packages");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const items = useMemo(() => {
    const all = tab === "packages" ? packages.map(fromPackage) : destinations.map(fromDestination);
    const q = query.trim().toLowerCase();
    return q ? all.filter((item) => `${item.title} ${item.subtitle} ${item.id}`.toLowerCase().includes(q)) : all;
  }, [tab, packages, destinations, query]);

  const ready = tab === "packages" ? packagesReady : destinationsReady;

  return (
    <div>
      <PageHeader
        title="Image Manager"
        description="Change any itinerary or destination photo by pasting an image link. Only the link is saved, so there are no image storage costs."
      />

      <div className="mb-5 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-primary">
        <p className="font-semibold">How to get an image link</p>
        <p className="mt-0.5 text-foreground-muted">
          Open the photo in your browser, right-click it and choose <strong>“Copy image address”</strong>, then paste it here.
          The link should usually end in .jpg, .png or .webp. If the website that hosts the photo deletes it, it disappears from our site too.
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2" role="tablist">
          {(["packages", "destinations"] as const).map((key) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => { setTab(key); setOpenId(null); }}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-colors ${tab === key ? "bg-primary text-white" : "border border-slate-200 text-primary hover:bg-slate-50"}`}
            >
              {key === "packages" ? `Itineraries (${packages.length})` : `Destinations (${destinations.length})`}
            </button>
          ))}
        </div>
        <label className="relative sm:w-72">
          <span className="sr-only">Search</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-foreground-light" aria-hidden="true" />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name" className={`${fieldClass} pl-9`} />
        </label>
      </div>

      {!ready && <p className="py-6 text-sm text-foreground-muted">Loading…</p>}

      <div className="space-y-3">
        {items.map((item) => {
          const open = openId === item.id;
          return (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-slate-50 sm:px-5"
              >
                <ImagePreview url={item.images.image} className="h-14 w-20 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-primary">
                    {item.title}
                    {item.isDraft && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-500">Draft</span>}
                  </p>
                  <p className="truncate text-xs text-foreground-muted">
                    {item.subtitle || item.id} · {1 + (item.images.heroImage ? 1 : 0) + item.images.gallery.length} images
                  </p>
                </div>
                <ChevronDown size={18} className={`shrink-0 text-foreground-light transition-transform ${open ? "rotate-180" : ""}`} />
              </button>
              {open && <ItemEditor key={item.id} item={item} tab={tab} />}
            </div>
          );
        })}
        {ready && items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-foreground-muted">
            Nothing matches “{query}”.
          </p>
        )}
      </div>
    </div>
  );
}
