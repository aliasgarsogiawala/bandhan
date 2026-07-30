"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { useAuth } from "@/lib/auth/useAuth";

interface NavbarProps {
  onEnquiryClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onEnquiryClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPackagesOpen, setIsPackagesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);
  const [isMobilePackagesOpen, setIsMobilePackagesOpen] = useState(false);

  const { user, signOut } = useAuth();
  const router = useRouter();
  const openEnquiry = onEnquiryClick || (() => router.push("/contact"));

  const packagesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileProfileRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
    setIsMobileProfileOpen(false);
    await signOut();
    router.refresh();
  };

  const firstName = user?.name?.split(" ")[0] || "";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (packagesRef.current && !packagesRef.current.contains(target)) {
        setIsPackagesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setIsProfileOpen(false);
      }
      if (mobileProfileRef.current && !mobileProfileRef.current.contains(target)) {
        setIsMobileProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Group Tours", href: "/#group-departures" },
    { label: "Plan a Custom Trip", href: "/plan-trip" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/#why-choose-us" },
    { label: "Contact", href: "/contact" },
  ];

  const packagesList = [
    { label: "All Packages", href: "/packages" },
    { label: "Domestic", href: "/packages?category=domestic" },
    { label: "International", href: "/packages?category=international" },
    { label: "North East", href: "/packages?category=northeast" },
  ];

  const togglePackages = () => {
    setIsPackagesOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const toggleMobileProfile = () => {
    setIsMobileProfileOpen((prev) => !prev);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-45 transition-all duration-500 ${
          isScrolled
            ? "bg-primary/95 backdrop-blur-md py-4 shadow-lg border-b border-primary-light/30"
            : "bg-transparent py-6"
        }`}
      >
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="relative z-50 flex items-center shrink-0">
            <Image
              src="/logo.svg"
              alt="Bandhan Tours"
              width={150}
              height={55}
              priority
              className="transition-all duration-300 object-contain h-[45px] w-auto"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Home Link */}
            <Link
              href="/"
              className="text-sm font-medium tracking-wide text-white/85 hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
            >
              Home
            </Link>

            {/* Packages Dropdown Trigger & Menu */}
            <div
              className="relative py-1"
              ref={packagesRef}
            >
              <button
                onClick={togglePackages}
                aria-expanded={isPackagesOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 text-sm font-medium tracking-wide transition-colors duration-300 focus:outline-none relative after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:bg-gold after:transition-all after:duration-300 ${
                  isPackagesOpen
                    ? "text-gold after:w-full"
                    : "text-white/85 hover:text-gold after:w-0 hover:after:w-full"
                }`}
              >
                Packages
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${
                    isPackagesOpen ? "rotate-180 text-gold" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Dropdown panel */}
              <div
                className="absolute left-0 top-full w-56 pt-3"
              >
                <div
                  className={`rounded-2xl bg-primary/95 backdrop-blur-md border border-white/10 shadow-premium p-2 transition-all duration-300 origin-top-left ${
                  isPackagesOpen
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                }`}
                >
                  {packagesList.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsPackagesOpen(false)}
                      className="block px-4 py-2.5 rounded-xl text-sm font-medium text-white/85 hover:text-primary hover:bg-gold transition-all duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Other Navigation Links */}
            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap text-sm font-medium tracking-wide text-white/85 hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Call to action & account */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={toggleProfile}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  className="flex items-center focus:outline-none relative transition-transform duration-300 hover:scale-105"
                  aria-label="Toggle profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gold text-primary flex items-center justify-center text-sm font-bold uppercase shadow-soft border-2 border-white/20 hover:border-gold transition-colors duration-300">
                    {firstName.charAt(0) || "U"}
                  </div>
                </button>

                {/* Profile Dropdown Panel */}
                <div
                  className={`absolute right-0 mt-3 w-64 rounded-2xl bg-primary/95 backdrop-blur-md border border-white/10 shadow-premium p-3 transition-all duration-300 origin-top-right ${
                    isProfileOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                  }`}
                >
                  <div className="px-4 py-2 border-b border-white/10 mb-2">
                    <p className="text-[11px] text-white/50 font-semibold uppercase tracking-wider">
                      Logged In As
                    </p>
                    <p className="text-sm font-bold text-gold truncate mt-0.5">
                      Hi, {user.name || "User"}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-accent/25 transition-all duration-200 text-left cursor-pointer focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/signin"
                className="text-sm font-medium tracking-wide text-white/85 hover:text-gold transition-colors duration-300"
              >
                Sign In
              </Link>
            )}
            <PrimaryButton
              variant="coral"
              size="sm"
              onClick={openEnquiry}
              className="hover:scale-105 duration-300 shrink-0"
            >
              Enquire Now
            </PrimaryButton>
          </div>

          {/* Mobile Actions Container (Avatar & Hamburger) */}
          <div className="flex lg:hidden items-center gap-3 relative z-50">
            {user && (
              <div className="relative" ref={mobileProfileRef}>
                <button
                  onClick={toggleMobileProfile}
                  aria-expanded={isMobileProfileOpen}
                  aria-haspopup="true"
                  className="flex items-center focus:outline-none transition-transform duration-300 hover:scale-105"
                  aria-label="Toggle profile menu"
                >
                  <div className="w-8 h-8 rounded-full bg-gold text-primary flex items-center justify-center text-sm font-bold uppercase shadow-soft border-2 border-white/20">
                    {firstName.charAt(0) || "U"}
                  </div>
                </button>

                {/* Mobile Profile Dropdown Panel */}
                <div
                  className={`absolute right-0 mt-3 w-56 rounded-2xl bg-primary/98 backdrop-blur-lg border border-white/10 shadow-premium p-3 transition-all duration-300 origin-top-right ${
                    isMobileProfileOpen
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
                  }`}
                >
                  <div className="px-3 py-1.5 border-b border-white/10 mb-2">
                    <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">
                      Logged In As
                    </p>
                    <p className="text-sm font-bold text-gold truncate">
                      Hi, {user.name || "User"}
                    </p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-white/80 hover:text-white hover:bg-accent/25 transition-all duration-200 text-left focus:outline-none cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Hamburger menu trigger */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMobileProfileOpen(false);
              }}
              className="p-2 text-white/90 focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 bg-primary/98 z-40 flex flex-col justify-center px-8 transition-all duration-500 ease-in-out lg:hidden ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-6 text-center max-h-[80vh] overflow-y-auto py-8">
            {/* Home link */}
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-bold font-heading text-white/90 hover:text-gold transition-colors duration-300"
            >
              Home
            </Link>

            {/* Mobile Packages Collapsible Trigger & Submenu */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setIsMobilePackagesOpen(!isMobilePackagesOpen)}
                className="flex items-center gap-2 text-2xl font-bold font-heading text-white/90 hover:text-gold transition-colors duration-300 focus:outline-none"
              >
                Packages
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-300 ${
                    isMobilePackagesOpen ? "rotate-180 text-gold" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                className={`flex flex-col gap-4 mt-4 transition-all duration-300 overflow-hidden ${
                  isMobilePackagesOpen
                    ? "max-h-[300px] opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
              >
                {packagesList.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-semibold text-white/70 hover:text-gold transition-colors duration-300"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Other standard navlinks */}
            {navLinks.slice(1).map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold font-heading text-white/90 hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}

            {/* If logged out, show Sign In */}
            {!user && (
              <Link
                href="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold font-heading text-white/90 hover:text-gold transition-colors duration-300"
              >
                Sign In
              </Link>
            )}

            {/* Enquire Now Action Button */}
            <div className="pt-4 flex justify-center">
              <PrimaryButton
                variant="coral"
                size="lg"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openEnquiry();
                }}
                className="w-full max-w-[280px]"
              >
                Enquire Now
              </PrimaryButton>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
