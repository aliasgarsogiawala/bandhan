import type { LucideIcon } from "lucide-react";
import {
  BadgeIndianRupee,
  BookOpenText,
  CalendarRange,
  ChartNoAxesCombined,
  CircleGauge,
  ClipboardList,
  FileCheck2,
  FileClock,
  FileText,
  GalleryHorizontal,
  Images,
  Landmark,
  MapPinned,
  MessageSquareText,
  PackageOpen,
  ReceiptIndianRupee,
  Settings2,
  ShieldMinus,
  Tags,
  UserRoundCog,
  UsersRound,
  WalletCards,
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
    ],
  },
  {
    label: "Finance",
    items: [
      { label: "Overview", href: "/admin/finance", icon: ChartNoAxesCombined },
      { label: "Quotations", href: "/admin/finance/quotations", icon: FileText },
      { label: "Proforma invoices", href: "/admin/finance/proforma-invoices", icon: FileClock },
      { label: "Invoices", href: "/admin/finance/invoices", icon: ReceiptIndianRupee },
      { label: "Credit notes", href: "/admin/finance/credit-notes", icon: ShieldMinus },
      { label: "Expenses", href: "/admin/finance/expenses", icon: WalletCards },
      { label: "Reports", href: "/admin/finance/reports/invoices", icon: BadgeIndianRupee },
      { label: "Reminders", href: "/admin/finance/reminders", icon: CalendarRange },
      { label: "HSN / SAC", href: "/admin/finance/hsn-codes", icon: Tags },
      { label: "Settings", href: "/admin/finance/settings", icon: Settings2 },
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
    ],
  },
];
