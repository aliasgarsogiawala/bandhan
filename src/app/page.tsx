"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/home/Hero";
import PopularDestinations from "@/components/home/PopularDestinations";
import FeaturedPackages from "@/components/home/FeaturedPackages";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import GroupDepartures from "@/components/home/GroupDepartures";
import Testimonials from "@/components/home/Testimonials";
import TravelGallery from "@/components/home/TravelGallery";
import CTA from "@/components/home/CTA";
import PageShell from "@/components/ui/PageShell";
import { contactEnquiryHref } from "@/lib/enquiryLink";

export default function Home() {
  const router = useRouter();

  const handleEnquire = (destination: string = "") => {
    router.push(contactEnquiryHref(destination));
  };
  const handleSearch = (href: string) => router.push(href);

  return (
    <PageShell
      tone="custom"
      className="home-page bg-sand-light selection:bg-accent/20 selection:text-accent-dark"
      mainClassName="flex flex-col"
      onEnquiryClick={() => handleEnquire("")}
    >
      {/*
        Sections animate their own internals via the Stagger primitive,
        giving a sequenced editorial rhythm instead of one blocky reveal.
      */}
      <Hero
        onSearchSubmit={handleSearch}
        onPlanTripClick={() => router.push("/book?type=custom")}
      />
      <PopularDestinations />
      <FeaturedPackages />
      <WhyChooseUs />
      <GroupDepartures />
      <Testimonials />
      <TravelGallery />
      <CTA onStartPlanningClick={() => router.push("/book?type=custom")} />
    </PageShell>
  );
}
