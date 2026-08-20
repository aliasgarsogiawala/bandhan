import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  CalendarRange,
  CircleGauge,
  ClipboardList,
  FileCheck2,
  GalleryHorizontal,
  Images,
  MapPinned,
  MessageSquareText,
  PackageOpen,
  UserRoundCog,
  UsersRound,
  Megaphone,
  PanelTop,
  ChartNoAxesCombined,
} from "lucide-react";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/admin", icon: CircleGauge },
      { label: "Enquiries", href: "/admin/enquiries", icon: MessageSquareText },
      { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
      { label: "Customers", href: "/admin/customers", icon: UsersRound },
      { label: "Agents", href: "/admin/agents", icon: UserRoundCog },
      { label: "Reports", href: "/admin/reports", icon: ChartNoAxesCombined },
    ],
  },
  {
    label: "Website",
    items: [
      { label: "Packages", href: "/admin/packages", icon: PackageOpen },
      { label: "Destinations", href: "/admin/destinations", icon: MapPinned },
      { label: "Departures", href: "/admin/departures", icon: CalendarRange },
      { label: "Testimonials", href: "/admin/testimonials", icon: FileCheck2 },
      { label: "Gallery", href: "/admin/gallery", icon: Images },
      { label: "Features", href: "/admin/features", icon: GalleryHorizontal },
      { label: "Blog", href: "/admin/blog", icon: BookOpenText },
      { label: "Banners", href: "/admin/banners", icon: PanelTop },
      { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    ],
  },
];
