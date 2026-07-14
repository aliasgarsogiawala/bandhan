"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { testimonialsResource } from "@/lib/admin/resources";

export default function TestimonialsPage() {
  return <ResourceManager config={testimonialsResource} />;
}
