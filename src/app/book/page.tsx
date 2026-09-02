import { Suspense } from "react";
import BookingEngine from "@/components/booking/BookingEngine";
import { Container } from "@/components/ui/Container";
import PageShell from "@/components/ui/PageShell";

export default function BookPage() {
  return (
    <PageShell
      tone="custom"
      offsetTop
      className="bg-[radial-gradient(circle_at_top_right,rgba(254,209,79,0.10),transparent_34%),linear-gradient(180deg,#F8F5F1_0%,#F3EFE9_100%)]"
      mainClassName="pb-16 sm:pb-24"
    >
      <Container>
        <Suspense
          fallback={
            <div className="border border-primary/12 bg-white p-12 text-center text-sm text-foreground-muted shadow-premium">
              Preparing the booking engine…
            </div>
          }
        >
          <BookingEngine />
        </Suspense>
      </Container>
    </PageShell>
  );
}
