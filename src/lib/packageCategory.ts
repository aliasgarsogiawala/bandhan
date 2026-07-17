export type CategoryTab = "all" | "domestic" | "international" | "north-east";

export const CATEGORY_TABS: { key: CategoryTab; label: string }[] = [
  { key: "all", label: "All Packages" },
  { key: "domestic", label: "Domestic Tours" },
  { key: "international", label: "International" },
  { key: "north-east", label: "North East" },
];

const VALID_TABS: CategoryTab[] = ["domestic", "international", "north-east"];

/** "North East" -> "north-east", so free-text category strings compare cleanly against tab keys. */
export function categorySlug(category: string): string {
  return category.trim().toLowerCase().replace(/\s+/g, "-");
}

export function matchesCategory(pkgCategory: string, tab: CategoryTab): boolean {
  return tab === "all" || categorySlug(pkgCategory) === tab;
}

export function parseCategoryParam(value: string | null): CategoryTab {
  return VALID_TABS.includes(value as CategoryTab) ? (value as CategoryTab) : "all";
}
