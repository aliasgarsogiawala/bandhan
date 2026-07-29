import { redirect } from "next/navigation";

export default async function BookingQuotationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/api/bookings/${id}/brochure`);
}
