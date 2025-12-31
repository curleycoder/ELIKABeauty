import React from "react";
import SherryImage from "../assets/sherry.jpg";

export default function AboutMe() {
  return (
    <section
      id="about-section"
      className="bg-white text-gray-800 px-4 sm:px-6 md:px-16 py-8 max-w-5xl mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl text-[#55203d] mb-6">
          <span className="border-t border-b py-2 font-display border-gray-300 px-4 sm:px-6">
            About the Hairstylist
          </span>
        </h2>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img
          src={SherryImage}
          alt="Shohreh, hairstylist in North Burnaby serving Metro Vancouver"
          className="w-40 h-40 sm:w-60 sm:h-60 rounded-full object-cover shadow-md mx-auto sm:mx-0"
        />

        <div className="mb-6 text-gray-800 leading-relaxed">
          <p className="mb-4">
            I’m <strong>Shohreh</strong>, a professional <strong>hairstylist in North Burnaby</strong> with
            over <strong>30 years of experience</strong> in the beauty industry. I serve clients across
            <strong> Metro Vancouver</strong> from my private studio, focusing on high-quality hair
            services with consistent, natural-looking results.
          </p>

          <p className="mb-4">
            At Beauty Shohre Studio, I work one-on-one with each client from consultation to finish.
            This independent approach allows for better communication, realistic expectations, and
            results that grow out beautifully over time.
          </p>

          <p className="mb-2 font-medium">
            Hair services offered at Beauty Shohre Studio include:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Balayage and dimensional highlights</li>
            <li>Professional hair coloring and color correction</li>
            <li>Keratin and smoothing treatments</li>
            <li>Women’s haircuts and blowouts</li>
          </ul>

          <p>
            Clients looking for a trusted hair salon in North Burnaby often choose Beauty Shohre Studio
            for its calm environment, attention to detail, and focus on long-term hair health. Many
            clients travel from across Metro Vancouver for a more personalized and professional salon
            experience.
          </p>
        </div>
      </div>
    </section>
  );
}
