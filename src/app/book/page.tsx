import { Suspense } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import BookingEngine from "@/components/booking/BookingEngine";
import { Container } from "@/components/ui/Container";

export default function BookPage() {
  return (
    <div className="min-h-screen bg-sand">
      <div className="fixed inset-x-0 top-0 z-30 h-20 bg-primary" aria-hidden="true" />
      <Navbar />
      <main className="pb-20 pt-28 sm:pt-32">
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
      </main>
      <Footer />
    </div>
  );
}
