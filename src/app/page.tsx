"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/home/Hero";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import GroupDepartures from "@/components/home/GroupDepartures";
import Testimonials from "@/components/home/Testimonials";
import TravelGallery from "@/components/home/TravelGallery";
import CTA from "@/components/home/CTA";
import Footer from "@/components/common/Footer";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollPlane } from "@/components/ui/ScrollPlane";
import { contactEnquiryHref } from "@/lib/enquiryLink";

export default function Home() {
  const router = useRouter();

  const handleEnquire = (destination: string = "") => {
    router.push(contactEnquiryHref(destination));
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden selection:bg-accent/20 selection:text-accent-dark">
      {/* 1. Transparent Sticky Navbar */}
      <Navbar onEnquiryClick={() => handleEnquire("")} />

      {/* 2. Hero Section & 3. Floating Search Card */}
      <Hero
        onSearchSubmit={handleEnquire}
        onPlanTripClick={() => handleEnquire("")}
      />

      {/* Scroll-driven plane doing a loop-de-loop across the page */}
      <ScrollPlane />

      {/* 4. Popular Destinations */}
      <ScrollReveal>
        <PopularDestinations onDestinationSelect={handleEnquire} />
      </ScrollReveal>

      {/* 5. Featured Tour Packages */}
      <ScrollReveal>
        <FeaturedPackages />
      </ScrollReveal>

      {/* 6. Why Choose Bandhan */}
      <ScrollReveal>
        <WhyChooseUs />
      </ScrollReveal>

      {/* 7. Upcoming Group Departures */}
      <ScrollReveal>
        <GroupDepartures />
      </ScrollReveal>

      {/* 8. Testimonials */}
      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      {/* 9. Travel Gallery */}
      <ScrollReveal>
        <TravelGallery />
      </ScrollReveal>

      {/* 10. CTA Section */}
      <ScrollReveal>
        <CTA onStartPlanningClick={() => handleEnquire("")} />
      </ScrollReveal>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
