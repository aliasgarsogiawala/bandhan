import type { Metadata } from "next";
import NotFoundView from "@/components/notFound/NotFoundView";

export const metadata: Metadata = {
  title: "Page Not Found | Bandhan Tours",
};

export default function NotFound() {
  return <NotFoundView />;
}
