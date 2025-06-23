"use client"

import TestimonialCard from "./TestimonialCard"
import CTAButton from "@/components/ui/truss/CTAButton"


const HeroSection = () => {
  const testimonials = [
    {
      name: "Sarah M.",
      location: "Bellevue, WA",
      rating: 5,
      review: "Top-notch work and great communication!",
      avatar: "/images/avatars/sarah-m.jpg",
      animationDelay: 3,
    },
    {
      name: "John D.",
      location: "Seattle, WA",
      rating: 5,
      review: "Excellent service, would highly recommend!",
      avatar: "/images/avatars/john-d.jpg",
      projectType: "Kitchen Painting",
      isActive: true,
      animationDelay: 3,
    },
    {
      name: "Jennifer L.",
      location: "Tacoma, WA",
      rating: 5,
      review: "Amazing job on our home's exterior!",
      avatar: "/images/avatars/jennifer-l.jpg",
      animationDelay: 2,
    },
  ]

  return (
    <section className="bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary-800 mb-6">Find Trusted Painters in Your Area</h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect with qualified painting contractors who match your project needs. Get quotes, compare profiles,
              and hire with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <CTAButton variant="secondary" size="lg">Post a Job</CTAButton>
              <CTAButton variant="outline" size="lg">Join as Contractor</CTAButton>
            </div>
          </div>

          {/* Right side - Image and testimonials */}
          <div className="relative flex justify-center order-1 lg:order-2">
            <div className="relative">
              <img
                src="/images/painter-hero.jpg"
                alt="Professional painter at work"
                className="rounded-lg shadow-lg w-[28rem] h-[28rem] object-cover"
              />

              {/* Floating testimonials positioned around the image */}
              <div className="absolute top-3 -left-28 w-72 animate-float-slow">
                <TestimonialCard {...testimonials[0]} />
              </div>

              <div className="absolute top-36 -right-32 w-80 animate-float-reverse">
                <TestimonialCard {...testimonials[1]} />
              </div>

              <div className="absolute bottom-2 -left-24 w-72 animate-float-slow">
                <TestimonialCard {...testimonials[2]} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
