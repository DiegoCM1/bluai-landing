"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import TestimonialImg from "@/public/images/roberto-cabezas-profile.jpeg";

// Array of testimonial objects
const testimonials = [
  {
    text: `“In disaster response, timing and clarity save lives. BluEye puts both directly into people’s hands, even when the grid goes down. It’s a smart, practical solution with real-world impact.”`,
    name: "Roberto Cabezas",
    role: "Creative Technology Director at Centro",
    img: TestimonialImg,
    link: "https://www.linkedin.com/in/roberto-cabezas-h/",
  },
  {
    text: `“BluEye is revolutionizing disaster response with its real-time, offline-ready technology. This is what the future of safety looks like.”`,
    name: "Roberto Cabezas",
    role: "Emergency Response Expert",
    img: TestimonialImg,
    link: "#",
  },
  // Add more testimonials here...
];

export default function LargeTestimonial() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Go to next testimonial
  const handleNext = () => {
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Go to previous testimonial
  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Auto-slide every 6 seconds
  useEffect(() => {
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  // Current testimonial info
  const { text, name, role, img, link } = testimonials[current];

  return (
    <section className="relative bg-gray-900 text-white py-12 md:pt-20 overflow-hidden">
      {/* Title */}
      <div className="mx-auto max-w-3xl pb-8 text-center md:pb-12">
        <h2 className="text-3xl font-bold text-gray-200 md:text-4xl">
          Our Testimonies.
        </h2>
      </div>


      {/* Side Arrows*/}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-80 -translate-y-1/2 transform p-2 text-gray-400 hover:text-white z-10 bg-gray-900/50 rounded-r"
        aria-label="Previous testimonial"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={handleNext}
        className="absolute right-0 top-80 -translate-y-1/2 transform p-2 text-gray-400 hover:text-white z-10 bg-gray-900/50 rounded-l"
        aria-label="Next testimonial"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="relative mx-auto max-w-2xl px-4 sm:px-6">
        {/* Main Content */}
        <div className="py-12 md:py-20">
          <div
            className={`space-y-3 text-center transition-opacity duration-300 ease-in-out ${
              isTransitioning ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* Profile picture with decorative SVG */}
            <div className="relative inline-flex">
              <svg
                className="absolute -left-6 -top-2 -z-10"
                width={40}
                height={49}
                viewBox="0 0 40 49"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.7976 -0.000136375L39.9352 23.4746L33.4178 31.7234L13.7686 11.4275L22.7976 -0.000136375ZM9.34947 17.0206L26.4871 40.4953L19.9697 48.7441L0.320491 28.4482L9.34947 17.0206Z"
                  fill="#D1D5DB"
                />
              </svg>
              <Image
                className="rounded-full"
                src={img}
                width={48}
                height={48}
                alt={`Testimonial by ${name}`}
              />
            </div>

            {/* Testimonial text */}
            <p className="text-2xl font-bold">{text}</p>

            {/* Author and role */}
            <div className="text-sm font-medium text-gray-500">
              <span>{name}</span> <span className="text-gray-400">/</span>{" "}
              <a
                className="text-blue-500"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {role}
              </a>
            </div>

            {/* Dots as position indicators */}
            <div className="mt-6 flex justify-center space-x-2">
              {testimonials.map((_, index) => (
                <span
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all ${
                    index === current ? "bg-blue-500 w-3" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
