"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { galleryResource } from "@/lib/admin/resources";

export default function GalleryPage() {
  return <ResourceManager config={galleryResource} />;
}
