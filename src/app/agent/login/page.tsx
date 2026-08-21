import type { Metadata } from "next";
import { Suspense } from "react";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Agent Sign In | Bandhan Tours",
  description: "Secure sign in for authorised Bandhan Tours agents.",
  robots: { index: false, follow: false },
};

export default function AgentLoginPage() {
  return (
    <Suspense>
      <AuthCard mode="signin" portal="agent" />
    </Suspense>
  );
}
