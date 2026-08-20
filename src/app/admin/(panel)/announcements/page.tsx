"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { announcementsResource } from "@/lib/admin/resources";

export default function AnnouncementsPage() {
  return <ResourceManager config={announcementsResource} />;
}
