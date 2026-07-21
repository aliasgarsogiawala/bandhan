import React from "react";
import type { Metadata } from "next";
import AgentShell from "@/components/agent/AgentShell";

export const metadata: Metadata = {
  title: "Agent Portal | Bandhan Tours",
};

export default function AgentPanelLayout({ children }: { children: React.ReactNode }) {
  return <AgentShell>{children}</AgentShell>;
}
