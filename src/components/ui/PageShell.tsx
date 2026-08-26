import React from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

type Tone = "sand" | "white" | "ink" | "custom";

const TONES: Record<Tone, string> = {
  sand: "bg-sand",
  white: "bg-white",
  ink: "bg-ink",
  /** Opt out when the page paints its own surface through `className`. */
  custom: "",
};

interface PageShellProps {
  children: React.ReactNode;
  /** Page surface behind the content. Defaults to the warm stone neutral. */
  tone?: Tone;
  /**
   * Pad the top of `<main>` to clear the floating navbar. Only needed for
   * pages that open straight into content instead of a `PageHero`.
   */
  offsetTop?: boolean;
  onEnquiryClick?: () => void;
  className?: string;
  mainClassName?: string;
}

/**
 * Navbar → main → Footer scaffold for every page outside the admin and agent
 * panels. Centralising it keeps the page surface, the column flow, and the
 * navbar offset identical everywhere instead of re-derived per route.
 */
export const PageShell: React.FC<PageShellProps> = ({
  children,
  tone = "sand",
  offsetTop = false,
  onEnquiryClick,
  className = "",
  mainClassName = "",
}) => (
  // `overflow-x-clip`, not `hidden`: hidden makes this a scroll container and
  // breaks `position: sticky` for every descendant.
  <div className={`flex min-h-screen flex-col overflow-x-clip ${TONES[tone]} ${className}`}>
    <Navbar onEnquiryClick={onEnquiryClick} solidAtTop={offsetTop} />
    <main className={`flex-1 ${offsetTop ? "pt-28 sm:pt-32" : ""} ${mainClassName}`}>
      {children}
    </main>
    <Footer />
  </div>
);

export default PageShell;
