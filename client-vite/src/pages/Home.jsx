import React from "react";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";
import GoogleReview from "../components/GoogleReview";
import Gallery from "../components/Gallery";
import FAQ from "../components/FAQ";
import Instagram from "../components/Instagram";
import IntroSection from "../components/Intro";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <HeroSection />
      <IntroSection />

      {/* SEO INTRO */}
      {/* <section className="bg-[#200027] sm:px-6 lg:px-12 pt-6 pb-10 sm:pt-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs sm:text-sm tracking-widest uppercase text-[#ceaa5b]">
            Burnaby • Serving Metro Vancouver
          </p> */}

          {/* Location + trust bridge */}
          {/* <p className="mt-2 text-sm text-[#ceaa5b]">
            3790 Canada Way #102, Burnaby • Formerly Tangles Hair Design
          </p>

          <h1 className="mt-3 text-2xl sm:text-4xl font-display font-theseason text-[#ceaa5b] leading-tight">
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
      </section> */}

      {/* MAIN CONTENT */}
      <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-12 sm:space-y-20">
        <AboutMe />
        <GoogleReview />
        {/* <Gallery /> */}
        
      </section>

      {/* INSPIRATION */}
      <section className="mt-10 sm:mt-16">
        <Instagram />
      </section>
            <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 space-y-12 sm:space-y-20">

      <FAQ />
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#7a3b44] py-12 sm:py-16 mt-10">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-theseason text-[#F8F7F1]">
            Ready to Book Your Appointment?
          </h2>

          <p className="mt-3 text-[#F8F7F1]/80">
            Book online, or contact us if you’re not sure which service to choose.
          </p>

          {/* New client matching (high-conversion) */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            {/* <a
              href="/match"
              className="inline-block rounded-xl px-8 py-4 border border-[#F8F7F1] text-[#F8F7F1] hover:bg-[#7a3b44]/10 transition"
            >
              New Client? Get Matched
            </a> */}

            <a
              href="/booking"
              className="inline-block rounded-lg px-8 py-4 bg-[#FE8269] text-[#F8F7F1] hover:opacity-90 transition"
            >
              Book Appointment
            </a>

            <a
              href="tel:+17785139006"
              className="inline-block rounded-lg px-8 py-4 bg-[#F8F7F1] text-[#7a3b44] border border-gray-200 hover:bg-[#ceaa5b]-50 transition"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
