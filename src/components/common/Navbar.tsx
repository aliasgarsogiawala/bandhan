"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

interface NavbarProps {
  onEnquiryClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onEnquiryClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Domestic Tours", href: "/#domestic-tours" },
    { label: "International Tours", href: "/#international-tours" },
    { label: "Group Tours", href: "/#group-departures" },
    { label: "Special Packages", href: "/#special-packages" },
    { label: "About", href: "/#why-choose-us" },
    { label: "Contact", href: "/contact" },
  ];

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
          <a href="#" className="relative z-50 flex items-center">
            <Image
              src="/logo.svg"
              alt="Bandhan Tours"
              width={150}
              height={55}
              priority
              className={`transition-all duration-300 object-contain h-[45px] w-auto`}
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium tracking-wide text-white/85 hover:text-gold transition-colors duration-300 relative after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-gold hover:after:w-full after:transition-all after:duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Call to action & search */}
          <div className="hidden lg:flex items-center gap-4">
            <PrimaryButton
              variant="coral"
              size="sm"
              onClick={onEnquiryClick}
              className="hover:scale-105 duration-300"
            >
              Enquire Now
            </PrimaryButton>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-white/90 focus:outline-none z-50"
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
        </Container>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 bg-primary/98 z-40 flex flex-col justify-center px-8 transition-all duration-500 ease-in-out lg:hidden ${
            isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          }`}
        >
          <div className="flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-bold font-heading text-white/90 hover:text-gold transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-6">
              <PrimaryButton
                variant="coral"
                size="lg"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onEnquiryClick();
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
