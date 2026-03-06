import React from "react";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";
import GoogleReview from "../components/GoogleReview";
import FAQ from "../components/FAQ";
import Instagram from "../components/Instagram";
import IntroSection from "../components/Intro";
import { Link } from "react-router-dom";



export default function Home() {
  return (
    <>
      {/* HERO */}
      <HeroSection />
      <IntroSection />

        <AboutMe />
        <GoogleReview />
        {/* <Gallery /> */}
        
      {/* INSPIRATION */}
      <section className="mt-10 sm:mt-16">
        <Instagram />
      </section>
            <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-8 space-y-12 sm:space-y-20">

      <FAQ />
      </section>

      {/* FINAL CTA */}
<section className="mt-10 ">
  <div className="">
    <div className="rounded-2xl border border-[#572a31]/15 bg-[#E7A45D]/50 p-6 sm:p-10 text-center">
      <h2 className="text-2xl sm:text-3xl font-theseason text-[#440008]">
        Ready to Book Your Appointment?
      </h2>

      <p className="mt-3 text-[#440008]/80 max-w-2xl mx-auto">
        Book online, or contact us if you’re not sure which service to choose.
      </p>

      {/* CTA BUTTONS (Luxury) */}
      <div className="mt-7 flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/booking"
          className="
            rounded-full px-8 py-3
            bg-[#440008] text-[#F8F7F1]
            shadow-[0_10px_25px_rgba(68,0,8,0.18)]
            hover:shadow-[0_14px_30px_rgba(68,0,8,0.25)]
            hover:-translate-y-[1px]
            transition-all duration-300
          "
        >
          Book Appointment
        </Link>

        <a
          href="tel:+16044383727"
          className="
            rounded-full px-8 py-3
            bg-[#F8F7F1] text-[#572a31]
            border border-[#572a31]/25
            hover:border-[#572a31]/45
            hover:bg-white
            transition-all duration-300
          "
        >
          Call Now
        </a>
      </div>

      {/* SEO LINKS (clean row) */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-[#440008]/80">
        <Link className="underline hover:opacity-80 transition" to="/hair-salon-burnaby">
          Hair Salon Burnaby
        </Link>
        <span className="text-[#440008]/40">•</span>
        <Link className="underline hover:opacity-80 transition" to="/hair-color-burnaby">
          Hair Color Burnaby
        </Link>
        <span className="text-[#440008]/40">•</span>
        <Link className="underline hover:opacity-80 transition" to="/contact">
          Contact
        </Link>
      </div>
    </div>
  </div>
</section>
    </>
  );
}
