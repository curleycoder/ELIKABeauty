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
      {/* HERO */}
      <HeroSection />

      {/* SEO INTRO */}
      <section className="bg-[#200027] sm:px-6 lg:px-12 pt-6 pb-10 sm:pt-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm tracking-widest uppercase text-[#ceaa5b]">
            Burnaby • Serving Metro Vancouver
          </p>

          {/* Location + trust bridge */}
          <p className="mt-2 text-sm text-[#ceaa5b]">
            3790 Canada Way #102, Burnaby • Formerly Tangles Hair Design
          </p>

          <h1 className="mt-3 text-2xl sm:text-4xl font-display font-brownsugar text-[#ceaa5b] leading-tight">
            <span className="font-sans">
              ELIKA BEAUTY
            </span>
            <span className="block text-lg sm:text-2xl font-sans text-[#ceaa5b] mt-2">
              Hair Salon in Burnaby
            </span>
          </h1>

          <p className="mt-4 text-[#ceaa5b] leading-relaxed">
            Specializing in balayage, highlights, hair colour, colour correction, and keratin
            treatments—with precision haircuts available. Focused on healthy, natural-looking results
            delivered with experience and care.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-12 sm:space-y-20">
        <AboutMe />
        <GoogleReview />
        <Gallery />
        <FAQ />
      </main>

      {/* INSPIRATION */}
      <section className="mt-10 sm:mt-16">
        <Instagram />
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#200027] py-12 sm:py-16 mt-10">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-sans text-[#ceaa5b]">
            Ready to Book Your Appointment?
          </h2>

          <p className="mt-3 text-[#ceaa5b]/80">
            Book online, or contact us if you’re not sure which service to choose.
          </p>

          {/* New client matching (high-conversion) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/match"
              className="inline-block rounded-xl px-8 py-4 border border-[#ceaa5b] text-[#ceaa5b] hover:bg-[#ceaa5b]/40 transition"
            >
              New Client? Get Matched
            </a>

            <a
              href="/booking"
              className="inline-block rounded-xl px-8 py-4 bg-[#ceaa5b] text-[#200027] hover:opacity-90 transition"
            >
              Book Appointment
            </a>

            <a
              href="tel:+1XXXXXXXXXX"
              className="inline-block rounded-xl px-8 py-4 bg-white text-[#55203d] border border-gray-200 hover:bg-[#ceaa5b]-50 transition"
            >
              Call Now
            </a>
          </div>

          <div className="mt-4">
            <a href="/pricing" className="text-sm text-[#200027] underline hover:opacity-80">
              View pricing / starting at
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
