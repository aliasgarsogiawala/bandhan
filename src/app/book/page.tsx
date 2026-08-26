import { Suspense } from "react";
import BookingEngine from "@/components/booking/BookingEngine";
import { Container } from "@/components/ui/Container";
import PageShell from "@/components/ui/PageShell";

export default function BookPage() {
  return (
    <PageShell
      tone="custom"
      offsetTop
      className="bg-[radial-gradient(circle_at_top_right,rgba(247,185,70,0.12),transparent_30%),linear-gradient(180deg,#f7f3eb_0%,#f3efe7_100%)]"
      mainClassName="pb-16 sm:pb-24"
    >
      <Container>
        <Suspense
          fallback={
            <div className="rounded-3xl bg-white p-12 text-center text-sm text-foreground-muted shadow-soft">
              Preparing the booking engine...
            </div>
          }
        >
          <BookingEngine />
        </Suspense>
      </Container>
    </PageShell>
  );
}
