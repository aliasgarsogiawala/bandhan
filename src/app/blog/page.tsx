import { Suspense } from "react";
import type { Metadata } from "next";
import BlogListClient from "@/components/blog/BlogListClient";

export const metadata: Metadata = {
  title: "Travel Blog | Bandhan Tours",
  description:
    "Seasonal guides, destination deep-dives, and honest travel advice from the designers behind Bandhan Tours' journeys.",
};

export default function BlogPage() {
  return (
    <Suspense>
      <BlogListClient />
    </Suspense>
  );
}
