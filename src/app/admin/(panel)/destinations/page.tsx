"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { destinationsResource } from "@/lib/admin/resources";

export default function DestinationsPage() {
  return <ResourceManager config={destinationsResource} />;
}
