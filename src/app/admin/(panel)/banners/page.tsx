"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { bannersResource } from "@/lib/admin/resources";

export default function BannersPage() {
  return <ResourceManager config={bannersResource} />;
}
