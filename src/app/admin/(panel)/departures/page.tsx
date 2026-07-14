"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { departuresResource } from "@/lib/admin/resources";

export default function DeparturesPage() {
  return <ResourceManager config={departuresResource} />;
}
