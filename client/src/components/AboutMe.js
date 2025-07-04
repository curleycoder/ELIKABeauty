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

        <div className="text-base sm:text-lg leading-relaxed">
          <p className="mb-4">
            I’m <strong>Sherry</strong> — a passionate and experienced hairstylist proudly serving clients in <strong>Metro Vancouver</strong>. With over <strong>40 years of experience</strong> in the beauty industry — <strong>34 years in Iran</strong> and <strong>6 years in Canada</strong> — I blend traditional artistry with modern techniques to help each client feel beautiful and confident.
          </p>

          <p>
            At <strong>Beauty Shohre Studio</strong>, I specialize in haircuts, balayage, keratin, makeup, and more. My top priority is the <strong>health of your hair</strong> — not just its appearance. Every appointment is a step toward looking and feeling amazing.
          </p>
        </div>
      </div>
    </section>
  );
}
