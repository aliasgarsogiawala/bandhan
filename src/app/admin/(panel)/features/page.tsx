"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { featuresResource } from "@/lib/admin/resources";

export default function FeaturesPage() {
  return <ResourceManager config={featuresResource} />;
}
