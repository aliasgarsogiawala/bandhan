"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { blogResource } from "@/lib/admin/resources";

export default function BlogPage() {
  return <ResourceManager config={blogResource} />;
}
