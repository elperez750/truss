"use client";

import Image from "next/image";
import api from "@/lib/api";
import { useState } from "react";
import Navbar from "@/components/ui/truss/Navbar";
import HeroSection from "@/components/features/marketing/HeroSection";
import AboutSection from "@/components/features/marketing/AboutSection";
import WhyUs from "@/components/features/marketing/WhyUs";
import CTASection from "@/components/features/marketing/CTASection";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <WhyUs />
      <CTASection />
      <Footer />
    </div>
  );
}
