import type { Metadata } from "next";
import { Inter, Poppins, Cormorant_Garamond, Noto_Sans_Devanagari } from "next/font/google";
import "@/styles/globals.css";
import Chatbot from "@/components/common/Chatbot";
import { siteUrl } from "@/lib/siteConfig";
import { AuthProvider } from "@/lib/auth/useAuth";
import ScrollProgress from "@/components/ui/ScrollProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

/** Display serif for marketing headlines. Admin/agent panels stay on Poppins. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const devanagari = Noto_Sans_Devanagari({
  variable: "--font-devanagari",
  subsets: ["devanagari"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bandhan Tours | Where Colors Come Alive",
  description: "Experience premium, modern, and curated domestic & international travel bookings with Bandhan Tours.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} ${cormorant.variable} ${devanagari.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-white text-foreground font-sans selection:bg-gold/30"
      >
        <ScrollProgress />
        <AuthProvider>
          {children}
          <Chatbot />
        </AuthProvider>
      </body>
    </html>
  );
}
