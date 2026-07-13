"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Container } from "@/components/ui/Container";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer id="footer" className="bg-slate-950 text-slate-400 pt-20 pb-8 border-t border-slate-900 relative z-10">
      <Container className="space-y-16">
        
        {/* Footer Top Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Brand Column */}
          <div className="space-y-6">
            <Image
              src="/logo.svg"
              alt="Bandhan Tours"
              width={160}
              height={58}
              className="object-contain"
            />
            <p className="text-sm text-slate-400 font-sans leading-relaxed">
              We create custom travel experiences designed to showcase the authentic colors and rich culture of every destination.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/bandhantours1222"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-accent text-white flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/bandhantours"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-accent text-white flex items-center justify-center transition-colors duration-300"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 stroke-[2] stroke-current fill-none" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/82365776/admin"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-slate-900 hover:bg-accent text-white flex items-center justify-center transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-6">
            <h4 className="text-white font-heading font-bold text-base uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              <li>
                <a href="#" className="hover:text-gold transition-colors duration-300">Home</a>
              </li>
              <li>
                <a href="#domestic-tours" className="hover:text-gold transition-colors duration-300">Domestic Holidays</a>
              </li>
              <li>
                <a href="#international-tours" className="hover:text-gold transition-colors duration-300">International Holidays</a>
              </li>
              <li>
                <a href="#group-departures" className="hover:text-gold transition-colors duration-300">Group Departures</a>
              </li>
              <li>
                <a href="#why-choose-us" className="hover:text-gold transition-colors duration-300">About Us</a>
              </li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-6">
            <h4 className="text-white font-heading font-bold text-base uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-4 font-sans text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>+91 98300 12345 / +91 33 2464 1234</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>info@bandhantours.com</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>122, Rash Behari Avenue, 2nd Floor, Kolkata - 700029, West Bengal, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-6">
            <h4 className="text-white font-heading font-bold text-base uppercase tracking-wider">
              Newsletter
            </h4>
            <p className="text-sm font-sans text-slate-400">
              Subscribe to get exclusive discounts, group tour announcements, and travel stories direct to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-accent w-full"
              />
              <button
                type="submit"
                className="bg-accent hover:bg-accent-dark text-white rounded-xl px-4 py-2.5 flex items-center justify-center transition-colors duration-300"
                aria-label="Subscribe"
              >
                <svg className="w-4 h-4 fill-none stroke-[2] stroke-current" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
            {subscribed && (
              <span className="text-xs text-emerald-400 font-medium block animate-fade-in">
                Successfully Subscribed!
              </span>
            )}
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-slate-900/50 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-sans gap-4">
          <p>© {new Date().getFullYear()} Bandhan Tours. All Rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>

      </Container>
    </footer>
  );
};

export default Footer;
