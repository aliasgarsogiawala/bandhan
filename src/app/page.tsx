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
import { contactEnquiryHref } from "@/lib/enquiryLink";

export default function Home() {
  const router = useRouter();

  const handleEnquire = (destination: string = "") => {
    router.push(contactEnquiryHref(destination));
  };
  const handleSearch = (href: string) => router.push(href);

  return (
    <div className="home-page min-h-screen flex flex-col overflow-x-hidden bg-sand-light selection:bg-accent/20 selection:text-accent-dark">
      {/* 1. Transparent Sticky Navbar */}
      <Navbar onEnquiryClick={() => handleEnquire("")} />

      {/*
        Sections animate their own internals via the Stagger primitive,
        giving a sequenced editorial rhythm instead of one blocky reveal.
      */}
      <main className="flex flex-col">
        {/* 2. Hero Section & 3. Floating Search Card */}
        <Hero
          onSearchSubmit={handleSearch}
          onPlanTripClick={() => router.push("/book?type=custom")}
        />

        {/* 4. Popular Destinations */}
        <PopularDestinations />

        {/* 5. Featured Tour Packages */}
        <FeaturedPackages />

        {/* 6. Why Choose Bandhan */}
        <WhyChooseUs />

        {/* 7. Upcoming Group Departures */}
        <GroupDepartures />

        {/* 8. Testimonials */}
        <Testimonials />

        {/* 9. Travel Gallery */}
        <TravelGallery />

        {/* 10. CTA Section */}
        <CTA onStartPlanningClick={() => router.push("/book?type=custom")} />
      </main>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
}
