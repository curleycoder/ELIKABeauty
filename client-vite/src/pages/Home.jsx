import React from "react";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";
import GoogleReview from "../components/GoogleReview";
import Gallery from "../components/Gallery";
import FAQ from "../components/FAQ";
import Instagram from "../components/Instagram";

export default function Home() {
  return (
    <>
      {/* HERO (keep your booking overlay here) */}
      <HeroSection />

      {/* SEO INTRO (text only - no booking button here) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 pt-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm tracking-widest uppercase text-gray-500">
            North Burnaby • Serving Metro Vancouver
          </p>

          <h1 className="mt-3 text-2xl sm:text-4xl font-display text-[#55203d] leading-tight">
            Beauty Shohre Studio
            <span className="block text-lg sm:text-2xl font-normal text-gray-700 mt-2">
              Hair Salon in North Burnaby
            </span>
          </h1>

          <p className="mt-4 text-gray-700 leading-relaxed">
            Specializing in balayage, highlights, hair color, keratin treatments,
            and precision haircuts. Focused on healthy, natural-looking results
            delivered with experience and care.
          </p>

          <div className="mt-7 h-px w-24 mx-auto bg-gray-200" />
        </div>
      </section>

      {/* MAIN CONTENT (trust -> proof -> proof) */}
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-12 max-w-screen-xl mx-auto space-y-20">
        <AboutMe />
        <GoogleReview />
        <Gallery />
        <FAQ />
      </div>

      {/* INSPIRATION (heavy JS) */}
      <Instagram />

      {/* FINAL CTA (second booking - only here) */}
      <section className="bg-[#f8f4f6] py-16 mt-10">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-display text-[#55203d]">
            Ready to Book Your Appointment?
          </h2>

          <p className="mt-3 text-gray-700">
            Book online, or contact us if you’re not sure which service to choose.
          </p>

          <a
            href="/booking"
            className="inline-block mt-6 rounded-xl px-8 py-4 bg-[#55203d] text-white hover:opacity-90 transition"
          >
            Book Appointment
          </a>
        </div>
      </section>
    </>
  );
}
