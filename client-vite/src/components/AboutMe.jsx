import React from "react";
import { Link } from "react-router-dom";
import SherryImage from "../assets/amina.jpg";

export default function AboutMe() {
  return (
    <section
      id="about-section"
      className="text-gray-800 px-4 sm:px-6 md:px-16 py-10 max-w-5xl mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-theseason text-[#572a31] mb-8">
          About ELIKA BEAUTY
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-8">
        <div className="w-full sm:w-auto flex flex-col items-center sm:items-start">
          <img
            src={SherryImage}
            alt="Amina, hairstylist and owner of Elika Beauty in Burnaby"
            className="w-40 h-40 sm:w-60 sm:h-60 rounded-full object-cover shadow-md mx-auto sm:mx-0"
          />

          <div className="mt-5 flex w-full sm:w-60 flex-col gap-3">
            <Link
              to="/services"
              className="
                group inline-flex items-center justify-center gap-2
                rounded-2xl px-5 py-3
                bg-[#572a31] text-white
                shadow-[0_10px_25px_rgba(87,42,49,0.18)]
                hover:shadow-[0_14px_32px_rgba(87,42,49,0.28)]
                hover:-translate-y-[1px]
                transition-all duration-300
              "
            >
              <span>Explore Salon Services</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              to="/hair-salon-burnaby"
              className="
                group inline-flex items-center justify-center gap-2
                rounded-2xl px-5 py-3
                border border-[#572a31]/20
                bg-[#F8F7F1] text-[#572a31]
                hover:border-[#572a31]/40
                hover:bg-white
                hover:-translate-y-[1px]
                transition-all duration-300
              "
            >
              <span>See Our Salon</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="text-gray-800 leading-relaxed">
          <p className="mb-4">
            I’m <strong>Amina</strong>, the owner of{" "}
            <strong className="font-theseason">ELIKA Beauty</strong>, formerly{" "}
            Tangles Hair Design, located in Burnaby.
            With <strong>30 years of professional experience</strong> — including{" "}
            <strong>24 years in Iran</strong> and <strong>8 years in Canada</strong> —
            I bring a deep, hands-on understanding of hair and beauty across
            different styles, hair types, and client needs.
          </p>

          <p className="mb-4">
            My focus is hair: healthy color, clean sections, and results that look
            beautiful in real life, not just the first day. I take time for a proper
            consultation so you know exactly what to expect — especially for
            highlights, corrections, and smoothing treatments.
          </p>

          <p className="mb-4">
            Elika Beauty is a full-service beauty space. You do not need to visit
            different places — we offer <strong>hair</strong> plus a professional
            team for <strong>nails</strong>, <strong>facials</strong>, and{" "}
            <strong>microblading</strong> — all in one spot.
          </p>

          <p className="mb-3 font-medium">Signature services at Elika Beauty include:</p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Balayage and dimensional highlights</li>
            <li>Professional hair color and color correction</li>
            <li>Keratin and smoothing treatments</li>
            <li>Women’s haircuts, styling, and blowouts</li>
            <li>Nails, facials, and microblading with our team</li>
          </ul>

          <p>
            Clients choose Elika Beauty for a calm, professional environment,
            detailed work, and a long-term focus on healthy, beautiful results.
          </p>
        </div>
      </div>
    </section>
  );
}