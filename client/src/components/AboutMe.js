import React from 'react';
import SherryImage from '../assets/sherry.jpg';

export default function AboutMe() {
  return (
    <section
      id="about-section"
      className="bg-white text-gray-800 px-4 sm:px-6 md:px-20 py-12 mt-10 font-bodonimoda max-w-5xl mx-auto"
    >
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl text-[#55203d] mb-10">
          <span className="border-t border-b border-gray-300 px-4 sm:px-6">About Me</span>
        </h2>
      </div>

      {/* Image and text container */}
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <img
          src={SherryImage}
          alt="Sherry - Hairstylist"
          className="w-40 h-40 sm:w-60 sm:h-60 rounded-full object-cover shadow-md mx-auto sm:mx-0"
        />

        <div className="mb-6 text-gray-800">
          <p className="mb-4">
            I’m <strong>Shohreh</strong> — a passionate and experienced hairstylist with over <strong>30 years</strong> of professional experience in the beauty industry. I proudly serve clients across <strong>Metro Vancouver</strong>, combining artistry, precision, and care to bring out your unique beauty.
          </p>

          <p className="mb-2">At Beauty Shohre Studio, my specialized services include:</p>

          <ul className="list-disc list-inside mb-4 space-y-1">
            <li>Balayage and hair highlights</li>
            <li>Hair coloring and damage repair</li>
            <li>Keratin treatments and hair smoothing</li>
            <li>Haircuts and blowouts</li>
            <li>Eyebrow and facial threading</li>
            <li>Bridal makeup and professional updos</li>
            <li>Facials (deep cleansing and rejuvenation)</li>
          </ul>

          <p>
            My focus is always on the health and natural beauty of your hair and skin — not just how it looks, but how it makes you feel. Every appointment is a step toward feeling more confident, radiant, and empowered.
          </p>
        </div>

      </div>
    </section>
  );
}
