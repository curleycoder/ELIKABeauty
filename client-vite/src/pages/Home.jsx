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

      {/* <FAQ /> */}
      </section>

{/* FOOTER FINAL CTA */}
<section className="mt-6">
  <div className="bg-[#fcfaf8] border-t px-6 py-8 text-center sm:px-10 sm:py-10">
    <h2 className="text-2xl font-theseason text-[#440008] sm:text-3xl">
      Ready to Book Your Appointment?
    </h2>

    <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#440008] sm:text-base sm:leading-7">
      Book online, or contact us if you’re not sure which service to choose.
    </p>

    <div className="mt-7 flex flex-col justify-center gap-4 sm:flex-row">
      <Link
        to="/booking"
        className="
          rounded-full bg-[#440008] px-8 py-3
          text-[#F8F7F1]
          shadow-[0_10px_25px_rgba(68,0,8,0.18)]
          transition-all duration-300
          hover:-translate-y-[1px]
          hover:shadow-[0_14px_30px_rgba(68,0,8,0.25)]
        "
      >
        Book Appointment
      </Link>

      <a
        href="tel:+16044383727"
        className="
          rounded-full border border-[#572a31]/25
          bg-[#F8F7F1] px-8 py-3
          text-[#572a31]
          transition-all duration-300
          hover:border-[#572a31]/45
          hover:bg-white
        "
      >
        Call Now
      </a>
    </div>

    <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 text-sm text-[#440008]">
      <Link className="underline transition hover:opacity-80" to="/about">
        About
      </Link>

      <span className="text-white/40">•</span>

      <Link className="underline transition hover:opacity-80" to="/services">
        Services
      </Link>
    </div>

    <div className="mt-4 flex justify-center gap-4 text-xs text-[#440008]/70">
      <Link className="transition hover:underline" to="/privacy-policy">
        Privacy Policy
      </Link>

      <Link className="transition hover:underline" to="/terms">
        Terms
      </Link>
    </div>
  </div>
</section>
    </>
  );
}
