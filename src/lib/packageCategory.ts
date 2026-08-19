export type CategoryTab = "all" | "domestic" | "international" | "north-east";

export const CATEGORY_TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All Packages" },
  { key: "north-east", label: "North East" },
  { key: "domestic", label: "Domestic Tours" },
  { key: "international", label: "International" },
];

const VALID_TABS: CategoryTab[] = ["north-east", "domestic", "international"];

/** "North East" -> "north-east", so free-text category strings compare cleanly against tab keys. */
export function categorySlug(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

export function matchesCategory(pkgCategory: string, tab: CategoryTab): boolean {
  return tab === "all" || categorySlug(pkgCategory) === tab;
}

export function parseCategoryParam(value: string | null): CategoryTab {
  if (!value) return "all";
  // Tolerate the legacy "northeast" spelling still present in old links.
  const normalised = categorySlug(value.replace(/^northeast$/i, "north east"));
  return VALID_TABS.includes(normalised as CategoryTab) ? (normalised as CategoryTab) : "all";
}
