"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const agentNav = [
  { label: "Dashboard", href: "/agent" },
];

const isActive = (pathname: string, href: string) =>
  href === "/agent" ? pathname === "/agent" : pathname.startsWith(href);

export const AgentShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/agent/logout", { method: "POST" });
    router.replace("/agent/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-sand-dark/40 flex flex-col text-foreground">
      <header className="bg-primary px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gold text-primary flex items-center justify-center font-heading font-extrabold">
            B
          </div>
          <div className="leading-tight">
            <p className="text-white font-heading font-bold text-sm">Bandhan Tours</p>
            <p className="text-slate-400 text-[11px]">Agent Portal</p>
          </div>
        </div>

        <nav className="hidden sm:flex items-center gap-1">
          {agentNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive(pathname, item.href)
                  ? "bg-accent text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors disabled:opacity-60"
        >
          {loggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto">{children}</main>
    </div>
  );
};

export default AgentShell;
