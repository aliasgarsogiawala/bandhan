"use client";

import React, { useState } from "react";
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
import EnquiryModal from "@/components/common/EnquiryModal";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollPlane } from "@/components/ui/ScrollPlane";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");

  const handleOpenModal = (destination: string = "") => {
    setSelectedDestination(destination);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDestination("");
  };

  const handleSearchSubmit = (searchQuery: string) => {
    handleOpenModal(searchQuery);
  };

  return (
    <div className="min-h-screen bg-sand flex flex-col overflow-x-hidden selection:bg-accent/20 selection:text-accent-dark">
      {/* 1. Transparent Sticky Navbar */}
      <Navbar onEnquiryClick={() => handleOpenModal("")} />

      {/* 2. Hero Section & 3. Floating Search Card */}
      <Hero
        onSearchSubmit={handleSearchSubmit}
        onPlanTripClick={() => handleOpenModal("")}
      />

      {/* Scroll-driven plane doing a loop-de-loop across the page */}
      <ScrollPlane />

      {/* 4. Popular Destinations */}
      <ScrollReveal>
        <PopularDestinations onDestinationSelect={handleOpenModal} />
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
        <GroupDepartures onBookNowSelect={handleOpenModal} />
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
        <CTA onStartPlanningClick={() => handleOpenModal("")} />
      </ScrollReveal>

      {/* 11. Footer */}
      <Footer />

      {/* 12. Inquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        defaultDestination={selectedDestination}
      />
    </div>
  );
}
