import type { Metadata } from "next";
import DestinationGuideClient from "@/components/destinations/DestinationGuideClient";

interface DestinationPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Destination Guide | Bandhan Tours",
  description: "Explore destination guides and build a personalised holiday with Bandhan Tours.",
};

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { id } = await params;
  return <DestinationGuideClient id={id} />;
}
