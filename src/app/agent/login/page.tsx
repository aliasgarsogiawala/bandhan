import type { Metadata } from "next";
import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Agent Sign In | Bandhan Tours",
};

export default function AgentLoginPage() {
  return (
    <Suspense>
      <AuthCard mode="signin" defaultRole="agent" />
    </Suspense>
  );
}
