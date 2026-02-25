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
      <p className="mt-4 text-sm text-[#572a31]/80">
  Looking for a trusted{" "}
  <Link to="/hair-salon-burnaby" className="underline">
    hair salon in Burnaby
  </Link>{" "}
  specializing in modern colour techniques? Explore our{" "}
  <Link to="/hair-color-burnaby" className="underline">
    professional hair color services
  </Link>.
</p>

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
      <section className="mt-12 w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8 py-5 sm:py-1 space-y-12 sm:space-y-6">
       <section className="mt-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-5xl mx-auto text-center">

    {/* HEADING */}
    <h2 className="text-2xl sm:text-3xl font-theseason text-[#572a31]">
      Popular Services
    </h2>

    <p className="mt-3 text-[#572a31]/80 max-w-2xl mx-auto">
      Choose a service to see details, pricing guidance, and examples.
    </p>

    <div className="mt-4">
      <a
        href="/services"
        className="text-sm underline text-[#572a31] hover:opacity-80 transition"
      >
        View all services
      </a>
    </div>

    {/* GRID */}
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      
      <a href="/balayage-burnaby" className="rounded-2xl border border-[#572a31]/15 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="font-bold font-theseason text-[#572a31]">Balayage</div>
        <div className="mt-2 text-sm text-[#572a31]/70">
          Soft blended color with low-maintenance grow-out.
        </div>
        <div className="mt-4 text-sm text-[#572a31] underline">
          View details
        </div>
      </a>

      <a href="/highlights-burnaby" className="rounded-2xl border border-[#572a31]/15 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="font-bold font-theseason text-[#572a31]">Highlights</div>
        <div className="mt-2 text-sm">
          Dimensional brightness with custom toning.
        </div>
        <div className="mt-4 text-sm text-[#572a31] underline">
          View details
        </div>
      </a>

      <a href="/keratin-treatment-burnaby" className="rounded-2xl border border-[#572a31]/15 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="font-bold font-theseason text-[#572a31]">Keratin Treatment</div>
        <div className="mt-2 text-sm">
          Smoother hair, less frizz, easier styling.
        </div>
        <div className="mt-4 text-sm text-[#572a31] underline">
          View details
        </div>
      </a>

      <a href="/perm-burnaby" className="rounded-2xl border border-[#572a31]/15 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="font-bold font-theseason text-[#572a31]">Perm</div>
        <div className="mt-2 text-sm">
          Curls or waves tailored to your hair type.
        </div>
        <div className="mt-4 text-sm text-[#572a31] underline">
          View details
        </div>
      </a>

      <a href="/womens-haircut-burnaby" className="rounded-2xl border border-[#572a31]/15 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="font-bold font-theseason text-[#572a31]">Women’s Haircut</div>
        <div className="mt-2 text-sm ">
          Shape, layers, and styling for your lifestyle.
        </div>
        <div className="mt-4 text-sm text-[#572a31] underline">
          View details
        </div>
      </a>

      <a href="/mens-haircut-burnaby" className="rounded-2xl border border-[#572a31]/15 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="font-bold font-theseason text-[#572a31]">Men’s Haircut</div>
        <div className="mt-2 text-sm ">
          Clean cuts with sharp detail and easy maintenance.
        </div>
        <div className="mt-4 text-sm text-[#572a31] underline">
          View details
        </div>
      </a>

    </div>
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
