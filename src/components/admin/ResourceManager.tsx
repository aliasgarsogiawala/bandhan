"use client";

import React, { useMemo, useState } from "react";
import { store, useCollection } from "@/lib/admin/store";
import type { FieldConfig, ResourceConfig, WithId } from "@/lib/admin/types";
import PageHeader from "./PageHeader";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

function emptyDraft<T extends WithId>(config: ResourceConfig<T>): Record<string, unknown> {
  return { ...config.empty };
}

const FormField: React.FC<{
  field: FieldConfig;
  value: unknown;
  onChange: (name: string, value: unknown) => void;
}> = ({ field, value, onChange }) => {
  const base =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent font-medium text-sm transition-colors text-primary bg-slate-50/50";

  if (field.type === "textarea") {
    return (
      <textarea
        rows={3}
        value={(value as string) ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        className={base}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        value={(value as string) ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        className={base}
      >
        <option value="">Select…</option>
        {field.options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(field.name, e.target.checked)}
          className="w-4 h-4 accent-accent"
        />
        <span className="text-sm text-foreground-muted">{field.help || "Enabled"}</span>
      </label>
    );
  }

  if (field.type === "number") {
    return (
      <input
        type="number"
        value={value === undefined || value === null ? "" : (value as number)}
        onChange={(e) => onChange(field.name, e.target.value === "" ? "" : Number(e.target.value))}
        placeholder={field.placeholder}
        className={base}
      />
    );
  }

  if (field.type === "tags") {
    const arr = Array.isArray(value) ? (value as string[]) : [];
    return (
      <>
        <input
          type="text"
          value={arr.join(", ")}
          onChange={(e) =>
            onChange(
              field.name,
              e.target.value
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean)
            )
          }
          placeholder={field.placeholder}
          className={base}
        />
        <p className="text-[11px] text-foreground-light mt-1">Separate items with commas.</p>
      </>
    );
  }

  // text + image
  return (
    <>
      <input
        type="text"
        value={(value as string) ?? ""}
        onChange={(e) => onChange(field.name, e.target.value)}
        placeholder={field.placeholder}
        className={base}
      />
      {field.type === "image" && typeof value === "string" && value && (
        <div className="mt-2 relative w-full h-28 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
    </>
  );
};

export function ResourceManager<T extends WithId>({ config }: { config: ResourceConfig<T> }) {
  const { items, ready } = useCollection<T>(config.key);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<T | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      config.searchKeys.some((k) =>
        String((item as Record<string, unknown>)[k] ?? "").toLowerCase().includes(q)
      )
    );
  }, [items, search, config.searchKeys]);

  const openNew = () => {
    setEditing(null);
    setDraft(emptyDraft(config));
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setDraft({ ...item } as Record<string, unknown>);
  };

  const close = () => {
    setEditing(null);
    setDraft(null);
  };

  const setField = (name: string, value: unknown) =>
    setDraft((d) => (d ? { ...d, [name]: value } : d));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft) return;
    if (editing) {
      store.update(config.key, editing.id, draft);
    } else {
      store.add(config.key, draft);
    }
    close();
  };

  const remove = (item: T) => {
    if (window.confirm(`Delete this ${config.singular.toLowerCase()}? This cannot be undone.`)) {
      store.remove(config.key, item.id);
    }
  };

  return (
    <div>
      <PageHeader
        title={config.title}
        description={config.description}
        action={
          <PrimaryButton variant="coral" size="sm" onClick={openNew}>
            + Add {config.singular}
          </PrimaryButton>
        }
      />

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}…`}
          className="w-full sm:max-w-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-accent text-sm text-primary bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand/60 border-b border-slate-100 text-left">
                {config.columns.map((c) => (
                  <th
                    key={c.key}
                    className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-foreground-muted whitespace-nowrap"
                  >
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 text-right font-semibold text-xs uppercase tracking-wider text-foreground-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!ready ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-foreground-muted">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={config.columns.length + 1} className="px-4 py-10 text-center text-foreground-muted">
                    No {config.title.toLowerCase()} found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-sand/40 transition-colors">
                    {config.columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 align-middle ${c.className || "text-foreground"}`}>
                        {c.render ? c.render(item) : String((item as Record<string, unknown>)[c.key] ?? "—")}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-xs font-semibold text-primary hover:text-accent px-2 py-1"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(item)}
                        className="text-xs font-semibold text-accent hover:text-accent-dark px-2 py-1"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-foreground-light mt-3">
        Showing {filtered.length} of {items.length} {config.title.toLowerCase()}.
      </p>

      {/* Form modal */}
      {draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/45 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 max-h-[90vh] flex flex-col animate-scale-up">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold font-heading text-primary">
                {editing ? `Edit ${config.singular}` : `New ${config.singular}`}
              </h3>
              <button onClick={close} className="p-2 text-foreground-muted hover:text-primary rounded-full hover:bg-slate-100" aria-label="Close">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={save} className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {config.fields.map((field) => (
                  <div key={field.name} className={`space-y-1.5 ${field.fullWidth ? "sm:col-span-2" : ""}`}>
                    <label className="text-xs font-semibold text-primary uppercase tracking-wide">
                      {field.label}
                      {field.required && <span className="text-accent"> *</span>}
                    </label>
                    <FormField field={field} value={draft[field.name]} onChange={setField} />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={close}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold text-primary border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <PrimaryButton type="submit" variant="navy" size="md">
                  {editing ? "Save Changes" : `Create ${config.singular}`}
                </PrimaryButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/** Small helper to render a thumbnail inside a table cell.
 *  Uses a plain <img> so admins can paste image URLs from any host. */
export function Thumb({ src, alt }: { src?: string; alt: string }) {
  if (!src) return <span className="text-foreground-light">—</span>;
  return (
    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

export default ResourceManager;
