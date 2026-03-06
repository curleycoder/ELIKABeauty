import React from "react";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";
import GoogleReview from "../components/GoogleReview";
import Gallery from "../components/Gallery";
import FAQ from "../components/FAQ";
import Instagram from "../components/Instagram";
import IntroSection from "../components/Intro";
import { Link } from "react-router-dom";


const featuredServices = [
  {
    title: "Hair Color",
    to: "/hair-color-burnaby",
    image: "/images/services/hair-color/hair-color-hero.jpg",
    desc: "Explore balayage, highlights, root touch-ups, and customized color services.",
  },
  {
    title: "Balayage",
    to: "/balayage-burnaby",
    image: "/images/services/balayage/balayage-hero.jpg",
    desc: "Soft blended color with low-maintenance grow-out.",
  },
  {
    title: "Highlights",
    to: "/highlights-burnaby",
    image: "/images/services/highlights/highlights-hero.jpg",
    desc: "Dimensional brightness with custom toning.",
  },
  {
    title: "Keratin Treatment",
    to: "/keratin-treatment-burnaby",
    image: "/images/services/keratin/keratin-hero.jpg",
    desc: "Smoother hair, less frizz, easier styling.",
  },
  {
    title: "Perm",
    to: "/perm-burnaby",
    image: "/images/services/perm/perm-hero.jpg",
    desc: "Curls or waves tailored to your hair type.",
  },
  {
    title: "Women’s Haircut",
    to: "/womens-haircut-burnaby",
    image: "/images/services/haircutwoman/haircut-hero.jpg",
    desc: "Shape, layers, and styling for your lifestyle.",
  },
  {
    title: "Men’s Haircut",
    to: "/mens-haircut-burnaby",
    image: "/images/services/haircutmen/haircut-hero.jpg",
    desc: "Clean cuts with sharp detail and easy maintenance.",
  },
    {
    title: "Men’s Haircut",
    to: "/mens-haircut-burnaby",
    image: "/images/services/haircutmen/haircut-hero.jpg",
    desc: "Clean cuts with sharp detail and easy maintenance.",
  },
];


export default function Home() {
  return (
    <>
      {/* HERO */}
      <HeroSection />
      <IntroSection />


<section className="mt-14 w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
  <div className="max-w-6xl mx-auto">
    <div className="text-center">
      <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#572a31]/60">
        Elika Beauty Services
      </p>

      <h2 className="mt-3 text-3xl sm:text-4xl font-theseason text-[#572a31]">
        Explore Our Services
      </h2>

      <p className="mt-3 text-[#572a31]/80 max-w-2xl mx-auto leading-7">
        Discover color, texture, cuts, and beauty services designed around your
        goals, style, and maintenance level.
      </p>

      <div className="mt-4">
        <Link
          to="/services"
          className="text-sm underline underline-offset-4 text-[#572a31] hover:opacity-80 transition"
        >
          View all services
        </Link>
      </div>
    </div>

    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featuredServices.map((service) => (
        <Link
          key={service.to}
          to={service.to}
          className="group overflow-hidden rounded-[28px] border border-[#572a31]/15 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
          <div className="relative h-72 overflow-hidden">
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/80 via-[#2e1118]/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="inline-flex rounded-full bg-white/85 px-3 py-1 text-xs uppercase tracking-[0.15em] text-[#572a31] backdrop-blur-sm">
                View Service
              </div>

              <h3 className="mt-3 text-2xl font-theseason text-white">
                {service.title}
              </h3>
            </div>
          </div>

          <div className="p-5">
            <p className="text-sm leading-6 text-[#572a31]/80">
              {service.desc}
            </p>

            <div className="mt-4 inline-flex items-center text-sm font-medium text-[#572a31] underline underline-offset-4">
              View details
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

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
