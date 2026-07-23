"use client";

import React, { useMemo, useRef, useState } from "react";
import { uploadFiles } from "@/lib/uploadthing";
import { useCollection } from "@/lib/admin/store";
import type { GalleryItem } from "@/data/mockData";

interface MediaPickerProps {
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  label?: string;
}

const fieldClass =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50";

export default function MediaPicker({ value, onChange, multiple = false, label }: MediaPickerProps) {
  const { items: gallery } = useCollection<GalleryItem>("gallery");
  const inputRef = useRef<HTMLInputElement>(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const selected = useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value]
  );

  const update = (next: string[]) => onChange(multiple ? next : next[0] || "");

  const toggleLibraryItem = (url: string) => {
    if (!multiple) {
      update([url]);
      setShowLibrary(false);
      return;
    }
    update(selected.includes(url) ? selected.filter((item) => item !== url) : [...selected, url]);
  };

  const remove = (url: string) => update(selected.filter((item) => item !== url));

  const upload = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    try {
      const result = await uploadFiles("imageUploader", {
        files: Array.from(files).slice(0, 10),
      });
      const urls = result.map((file) => file.url);
      update(multiple ? [...selected, ...urls] : urls);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {label && <p className="text-xs font-semibold text-primary uppercase tracking-wide">{label}</p>}
      <div className="flex flex-wrap gap-2">
        {selected.map((url, index) => (
          <div key={`${url}-${index}`} className="relative w-24 h-20 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Selected media ${index + 1}`} className="w-full h-full object-cover" />
            {multiple && index === 0 && (
              <span className="absolute left-1 bottom-1 px-1.5 py-0.5 rounded bg-primary/85 text-white text-[9px] font-bold uppercase">
                Cover
              </span>
            )}
            <button type="button" onClick={() => remove(url)} className="absolute top-1 right-1 w-6 h-6 rounded-full bg-primary/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
              ×
            </button>
          </div>
        ))}
        {selected.length === 0 && <div className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-foreground-muted">No media selected yet.</div>}
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setShowLibrary((open) => !open)} className="px-3.5 py-2 rounded-full border border-primary/15 text-xs font-bold text-primary hover:border-primary hover:bg-primary hover:text-white transition-colors">
          {showLibrary ? "Hide gallery" : "Choose from gallery"}
        </button>
        <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading} className="px-3.5 py-2 rounded-full bg-accent text-white text-xs font-bold hover:bg-accent-dark disabled:opacity-60 transition-colors">
          {uploading ? "Uploading…" : multiple ? "Upload images" : "Upload image"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple={multiple} onChange={(event) => void upload(event.target.files)} className="hidden" />
      </div>

      {showLibrary && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 rounded-2xl border border-slate-100 bg-sand/60 p-3 max-h-56 overflow-y-auto">
          {gallery.map((item) => {
            const active = selected.includes(item.image);
            return (
              <button key={item.id} type="button" onClick={() => toggleLibraryItem(item.image)} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${active ? "border-accent" : "border-transparent"}`} title={item.title}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                {active && <span className="absolute inset-0 bg-accent/35 flex items-center justify-center text-white text-xl">✓</span>}
              </button>
            );
          })}
          {gallery.length === 0 && <p className="col-span-full py-4 text-xs text-foreground-muted">Add images in the Gallery section first, or upload new media.</p>}
        </div>
      )}

      <input type="url" value={multiple ? "" : (typeof value === "string" ? value : "")} onChange={(event) => !multiple && onChange(event.target.value)} placeholder="Or paste an image URL" className={fieldClass} />
      {multiple && <p className="text-[11px] text-foreground-light">The first image is used as the cover. Upload or choose as many as you need.</p>}
      {error && <p className="text-xs text-accent-dark">{error}</p>}
    </div>
  );
}
