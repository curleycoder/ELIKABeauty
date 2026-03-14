import React from "react";
import { Link } from "react-router-dom";

export default function AboutMe() {
  return (
    <section
      id="about-section"
      className="mx-auto max-w-6xl px-8 text-gray-800 sm:px-16 pb-12"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6b73] sm:text-xs">
          Elika Beauty • Burnaby
        </p>
        <h2 className="mt-2 text-2xl font-theseason text-[#572a31] sm:text-3xl">
          Meet Amina
        </h2>
      </div>

      <div className="mt-10 grid gap-10 items-start sm:grid-cols-[0.6fr_1fr]">
        <div className="flex flex-col items-center sm:items-start">
          <img
            src="/amina.webp"
            alt="Amina, hairstylist and owner of Elika Beauty in Burnaby"
            width={320}
            height={320}
            className="w-70 h-70 rounded-full object-cover shadow-lg sm:w-80 sm:h-80"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="max-w-xl text-sm leading-7 text-gray-700 sm:text-base">
          <p>
            Hi, I'm <strong>Amina</strong>, the owner of{" "}
            <strong className="font-theseason text-[#3D0007]">Elika Beauty</strong>{" "}
            in Burnaby.
          </p>
          <p className="mt-4">
            I have more than <strong>30 years of experience</strong> in the hair
            and beauty industry, including over{" "}
            <strong>24 years working in Iran</strong> and{" "}
            <strong>8 years in Canada</strong>.
          </p>
          <p className="mt-4">
            Over the years I've worked with many different hair types, styles,
            and techniques. My focus is always the same: helping clients feel
            confident and happy with their hair.
          </p>
          <p className="mt-4">
            At Elika Beauty, I take time to understand what you want and create
            results that suit your hair, your lifestyle, and your personal style.
          </p>
          <div className="mt-5 flex w-full max-w-[700px] flex-row gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl bg-[#572a31] px-3 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Book Appointment
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-xl border border-[#572a31]/25 px-5 py-3 text-sm font-medium text-[#572a31] transition hover:border-[#572a31]"
            >
              View Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
