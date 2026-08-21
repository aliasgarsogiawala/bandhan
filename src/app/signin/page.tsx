import { Suspense } from "react";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Customer Sign In | Bandhan Tours",
};

export default function SignInPage() {
  return (
    <Suspense>
      <AuthCard mode="signin" />
    </Suspense>
  );
}
