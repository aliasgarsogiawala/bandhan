import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Download, FileText, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getSessionUserId } from "@/lib/auth/session";
import { getBookingById } from "@/lib/bookings/db";
import { formatMoney } from "@/lib/bookings/pricing";
import { isDbConfigured } from "@/lib/db";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ test?: string }>;
}

export default async function BookingConfirmationPage({ params, searchParams }: ConfirmationPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const requestedTestPreview = query.test === "1";
  const isTestPreview = process.env.NODE_ENV !== "production" && requestedTestPreview;

  if (!isDbConfigured()) notFound();

  const userId = await getSessionUserId();
  if (!userId) {
    redirect(`/signin?redirect=${encodeURIComponent(`/account/bookings/${id}/confirmation${isTestPreview ? "?test=1" : ""}`)}`);
  }

  const booking = await getBookingById(id);
  if (!booking || booking.user_id !== userId) notFound();

  const isConfirmed = ["confirmed", "completed"].includes(booking.status);
  if (!isConfirmed && !isTestPreview) redirect(`/account/bookings/${id}`);

  const documentQuery = isTestPreview ? "?test=1" : "";
  const downloadQuery = isTestPreview ? "?test=1&download=1" : "?download=1";
  const amount = Number(booking.pricing_snapshot?.depositAmount || 0);

  return (
    <main className="min-h-screen bg-sand-light py-10 sm:py-16">
      <Container className="max-w-4xl">
        <Link href="/" className="font-heading text-lg font-extrabold text-primary">Bandhan Tours</Link>

        <section className="mt-8 overflow-hidden rounded-[8px] border border-primary/10 bg-white shadow-premium">
          <div className="bg-primary px-6 py-10 text-center text-white sm:px-10 sm:py-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
              <CheckCircle2 size={36} strokeWidth={2.5} />
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.22em] text-gold">
              {isTestPreview ? "Test checkout completed" : "Payment received"}
            </p>
            <h1 className="mt-2 font-heading text-3xl font-extrabold sm:text-4xl">
              {isTestPreview ? "Final confirmation preview" : "Your trip is confirmed"}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
              Booking <strong className="text-white">{booking.booking_code}</strong> for {booking.package_title || booking.destination || "your trip"}.
            </p>
          </div>

          <div className="p-6 sm:p-9">
            {isTestPreview ? (
              <div className="flex gap-3 rounded-[6px] border border-amber-300 bg-amber-50 p-4 text-amber-900">
                <ShieldCheck className="mt-0.5 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold">Safe test simulation</p>
                  <p className="mt-1 text-xs leading-relaxed">No payment was collected, no seats were consumed, and the booking status remains unchanged. This route is unavailable in production.</p>
                </div>
              </div>
            ) : null}

            <dl className="mt-7 grid gap-px overflow-hidden rounded-[6px] border border-primary/10 bg-primary/10 sm:grid-cols-2">
              {[
                ["Trip", booking.package_title || booking.destination || "Bandhan Tours holiday"],
                ["Travel date", booking.travel_date || "To be confirmed"],
                ["Lead traveller", booking.contact_name],
                ["Travellers", String(booking.travellers_count || 1)],
                ["Booking reference", booking.booking_code],
                ["Advance", amount > 0 ? formatMoney(amount) : "As per quotation"],
              ].map(([label, value]) => (
                <div key={label} className="bg-white p-4">
                  <dt className="text-[9px] font-bold uppercase tracking-[0.16em] text-foreground-light">{label}</dt>
                  <dd className="mt-1 text-sm font-semibold text-primary">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <a href={`/api/bookings/${booking.id}/confirmation${documentQuery}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[5px] bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary-light">
                <FileText size={17} /> Preview confirmation PDF
              </a>
              <a href={`/api/bookings/${booking.id}/confirmation${downloadQuery}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[5px] border border-primary/20 px-5 py-3 text-sm font-bold text-primary hover:border-accent hover:text-accent">
                <Download size={17} /> Download confirmation
              </a>
            </div>

            <div className="mt-7 flex flex-wrap justify-between gap-4 border-t border-primary/10 pt-6">
              <Link href={`/account/bookings/${booking.id}`} className="text-sm font-bold text-accent hover:text-accent-dark">← Back to booking</Link>
              <Link href="/packages" className="text-sm font-bold text-primary hover:text-accent">Explore more trips →</Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
