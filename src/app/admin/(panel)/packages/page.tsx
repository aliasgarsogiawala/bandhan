"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { packagesResource } from "@/lib/admin/resources";

export default function PackagesPage() {
  return <ResourceManager config={packagesResource} />;
}
