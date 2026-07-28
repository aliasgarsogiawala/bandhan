"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, ExternalLink, LogOut, Menu, Plane, X } from "lucide-react";
import { adminNavGroups } from "./adminNav";

const isActive = (pathname: string, href: string) =>
  href === "/admin" || href === "/admin/finance"
    ? pathname === href
    : pathname.startsWith(href);

export const AdminShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const navigation = (
    <nav className="space-y-5" aria-label="Admin navigation">
      {adminNavGroups.map((group) => {
        const groupActive = group.items.some((item) => isActive(pathname, item.href));
        const isCollapsed = collapsed[group.label] && !groupActive;
        return (
          <section key={group.label}>
            <button
              type="button"
              onClick={() =>
                setCollapsed((current) => ({ ...current, [group.label]: !current[group.label] }))
              }
              className="mb-1.5 flex w-full items-center justify-between px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 hover:text-slate-300"
              aria-expanded={!isCollapsed}
            >
              {group.label}
              <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isCollapsed ? "-rotate-90" : ""}`} />
            </button>
            {!isCollapsed && (
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-300 hover:bg-white/8 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-[17px] w-[17px] ${active ? "text-accent" : "text-slate-500"}`} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </nav>
  );

  const sidebar = (
    <div className="flex h-full flex-col bg-[#071a2f]">
      <div className="flex h-[72px] items-center justify-between border-b border-white/8 px-5">
        <Link href="/admin" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-primary">
            <Plane className="h-5 w-5 -rotate-12" />
          </span>
          <span>
            <span className="block font-heading text-sm font-semibold tracking-tight text-white">Bandhan Tours</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-slate-500">Back office</span>
          </span>
        </Link>
        <button className="lg:hidden text-slate-400" onClick={() => setMobileOpen(false)} aria-label="Close menu">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">{navigation}</div>

      <div className="border-t border-white/8 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-md px-3 py-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white">BA</span>
          <span className="min-w-0">
            <span className="block truncate text-xs font-semibold text-white">Bandhan Admin</span>
            <span className="block truncate text-[10px] text-slate-500">Finance & operations</span>
          </span>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-xs font-medium text-slate-400 hover:bg-white/8 hover:text-white disabled:opacity-50"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Signing out…" : "Sign out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] lg:block">{sidebar}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-primary/50" onClick={() => setMobileOpen(false)} aria-label="Close menu" />
          <aside className="relative h-full w-[280px] shadow-2xl">{sidebar}</aside>
        </div>
      )}

      <div className="min-w-0 lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <button onClick={() => setMobileOpen(true)} className="text-primary lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden lg:block">
            <p className="text-xs font-medium text-slate-500">Bandhan Tours Private Limited</p>
            <p className="text-[10px] text-slate-400">India · INR · FY 2026–27</p>
          </div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-accent">
            View website <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </header>
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default AdminShell;
