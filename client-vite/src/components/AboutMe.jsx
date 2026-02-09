import React from "react";
import SherryImage from "../assets/sherry.jpg";

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
          alt="Shohreh, hairstylist and owner of Elika Beauty in Burnaby"
          className="w-40 h-40 sm:w-60 sm:h-60 rounded-full object-cover shadow-md mx-auto sm:mx-0"
        />

        <div className="text-gray-800 leading-relaxed">
          <p className="mb-4">
            I’m <strong>Amina</strong>, a professional hairstylist and the owner of
            <strong> Elika Beauty</strong> in Burnaby. With over{" "}
            <strong>30 years of experience</strong> in the beauty industry, I specialize in
            personalized hair services focused on healthy, natural-looking results.
          </p>

          <p className="mb-4">
            At Elika Beauty, I work one-on-one with each client from consultation to finish.
            This private studio setting allows for clear communication, realistic expectations,
            and results that grow out beautifully over time.
          </p>

          <p className="mb-3 font-medium">
            Hair services offered at Elika Beauty include:
          </p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Balayage and dimensional highlights</li>
            <li>Professional hair colouring and colour correction</li>
            <li>Keratin and smoothing treatments</li>
            <li>Women’s haircuts and blowouts</li>
          </ul>

          <p>
            Clients looking for a trusted hair salon in Burnaby choose Elika Beauty for its calm
            environment, attention to detail, and commitment to long-term hair health. Many clients
            visit from across Metro Vancouver for a more personalized salon experience.
          </p>
        </div>
      </div>
    </section>
  );
}
