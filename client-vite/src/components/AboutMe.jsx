import React from "react";
import SherryImage from "../assets/amina.jpg";

export default function AboutMe() {
  return (
    <section
      id="about-section"
      className="bg-white text-gray-800 px-4 sm:px-6 md:px-16 py-10 max-w-5xl mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-theseason text-[#7a3b44] mb-8">
          About ELIKA BEAUTY
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-8">
        <img
          src={SherryImage}
          alt="Amina, hairstylist and owner of Elika Beauty in Burnaby"
          className="w-40 h-40 sm:w-60 sm:h-60 rounded-full object-cover shadow-md mx-auto sm:mx-0"
        />

        <div className="text-gray-800 leading-relaxed">
          <p className="mb-4">
            I’m <strong>Amina</strong>, the new owner of <strong>Elika Beauty</strong> — formerly{" "}
            <strong>Tangles Hair Design</strong> — located in Burnaby. I’ve worked as a professional
            hairstylist for <strong>8 years in Canada</strong> and <strong>24 years in Iran</strong>,
            for a total of <strong>30 years of experience</strong> in the beauty industry.
          </p>

          <p className="mb-4">
            My focus is hair: healthy color, clean sections, and results that look beautiful in real
            life (not just the first day). I take time for a proper consultation so you know exactly
            what to expect — especially for highlights, corrections, and smoothing treatments.
          </p>

          <p className="mb-4">
            Elika Beauty is a full-service beauty space. You don’t need to visit different places —
            we offer <strong>hair</strong> plus a professional team for{" "}
            <strong>nails</strong>, <strong>facials</strong>, and{" "}
            <strong>microblading</strong> — all in one spot.
          </p>

          <p className="mb-3 font-medium">Signature services at Elika Beauty include:</p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Balayage and dimensional highlights</li>
            <li>Professional hair color & color correction</li>
            <li>Keratin and smoothing treatments</li>
            <li>Women’s haircuts, styling, and blowouts</li>
            <li>Nails, facials, and microblading (with our team)</li>
          </ul>

          <p>
            Clients choose Elika Beauty for a calm, professional environment, detailed work, and a
            long-term focus on healthy, beautiful results.
          </p>
        </div>
      </div>
    </section>
  );
}
