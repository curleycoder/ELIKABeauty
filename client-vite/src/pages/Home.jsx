import React from "react";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";
import GoogleReview from "../components/GoogleReview";
import Gallery from "../components/Gallery";
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
      <section className=" w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-5 sm:py-1 space-y-12 sm:space-y-6">
        <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-4">
  <div className="flex items-end justify-between gap-4">
    <div>
      <h2 className="text-2xl sm:text-3xl font-theseason text-[#572a31]">
        Popular Services
      </h2>
      <p className="text-[#572a31]/70 mt-1">
        Choose a service to see details, pricing guidance, and examples.
      </p>
    </div>

    <a href="/services" className="underline text-[#572a31]">
      View all services
    </a>
  </div>

  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <a href="/balayage-burnaby" className="rounded-2xl border p-5 hover:shadow-sm transition">
      <div className="font-semibold text-[#572a31]">Balayage</div>
      <div className="mt-2 text-sm text-[#572a31]/70">
        Soft blended color with low-maintenance grow-out.
      </div>
      <div className="mt-4 underline text-sm text-[#572a31]">View details</div>
    </a>

    <a href="/highlights-burnaby" className="rounded-2xl border p-5 hover:shadow-sm transition">
      <div className="font-semibold text-[#572a31]">Highlights</div>
      <div className="mt-2 text-sm text-[#572a31]/70">
        Dimensional brightness with custom toning.
      </div>
      <div className="mt-4 underline text-sm text-[#572a31]">View details</div>
    </a>

    <a href="/keratin-treatment-burnaby" className="rounded-2xl border p-5 hover:shadow-sm transition">
      <div className="font-semibold text-[#572a31]">Keratin Treatment</div>
      <div className="mt-2 text-sm text-[#572a31]/70">
        Smoother hair, less frizz, easier styling.
      </div>
      <div className="mt-4 underline text-sm text-[#572a31]">View details</div>
    </a>

    <a href="/perm-burnaby" className="rounded-2xl border p-5 hover:shadow-sm transition">
      <div className="font-semibold text-[#572a31]">Perm</div>
      <div className="mt-2 text-sm text-[#572a31]/70">
        Curls or waves tailored to your hair type.
      </div>
      <div className="mt-4 underline text-sm text-[#572a31]">View details</div>
    </a>

    <a href="/womens-haircut-burnaby" className="rounded-2xl border p-5 hover:shadow-sm transition">
      <div className="font-semibold text-[#572a31]">Women’s Haircut</div>
      <div className="mt-2 text-sm text-[#572a31]/70">
        Shape, layers, and styling for your lifestyle.
      </div>
      <div className="mt-4 underline text-sm text-[#572a31]">View details</div>
    </a>

    <a href="/mens-haircut-burnaby" className="rounded-2xl border p-5 hover:shadow-sm transition">
      <div className="font-semibold text-[#572a31]">Men’s Haircut</div>
      <div className="mt-2 text-sm text-[#572a31]/70">
        Clean cuts with sharp detail and easy maintenance.
      </div>
      <div className="mt-4 underline text-sm text-[#572a31]">View details</div>
    </a>
  </div>
</section>
        <AboutMe />
        <GoogleReview />
        {/* <Gallery /> */}
        
      </section>

      {/* INSPIRATION */}
      <section className="mt-10 sm:mt-16">
        <Instagram />
      </section>
            <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-8 space-y-12 sm:space-y-20">

      <FAQ />
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#E7A45D] py-8 sm:py-8 mt-6">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-theseason text-[#440008]">
            Ready to Book Your Appointment?
          </h2>

          <p className="mt-3 text-[#440008]/80">
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
              className="inline-block rounded-lg px-6 py-4 bg-[#440008] text-[#F8F7F1] hover:opacity-90 transition"
            >
              Book Appointment
            </a>

            <a
              href="tel:+16044383727"
              className="inline-block rounded-lg px-6 py-4 bg-[#F8F7F1] text-[#572a31] border border-gray-200 hover:bg-[#ceaa5b]-50 transition"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
