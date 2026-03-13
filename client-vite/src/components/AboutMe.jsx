import React from "react";
import { Link } from "react-router-dom";
import SherryImage from "../assets/amina.jpg";

export default function AboutMe() {
  return (
    <section
      id="about-section"
      className="mx-auto max-w-6xl px-4 text-gray-800 sm:px-6 sm:py-10"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6b73] sm:text-xs">
          Elika Beauty • Burnaby
        </p>

        <h2 className="mt-2 text-2xl font-theseason text-[#572a31] sm:text-3xl">
          Meet Amina
        </h2>
      </div>

      <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-10">
        <div className="flex flex-col items-center sm:items-start">
          <img
            src={SherryImage}
            alt="Amina, hairstylist and owner of Elika Beauty in Burnaby"
            className="h-40 w-40 rounded-full object-cover shadow-md sm:h-56 sm:w-56"
          />

          <div className="mt-5 flex w-full max-w-[300px] flex-row gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl bg-[#572a31] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
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

        <div className="max-w-3xl text-sm leading-7 text-gray-700 sm:text-base">
          <p>
            Hi, I’m <strong>Amina</strong>, the owner of{" "}
            <strong className="font-theseason text-[#3D0007]">
              Elika Beauty
            </strong>{" "}
            in Burnaby.
          </p>

          <p className="mt-4">
            I have more than <strong>30 years of experience</strong> in the hair
            and beauty industry, including over{" "}
            <strong>24 years working in Iran</strong> and{" "}
            <strong>8 years in Canada</strong>.
          </p>

          <p className="mt-4">
            Over the years I’ve worked with many different hair types, styles,
            and techniques. My focus is always the same: helping clients feel
            confident and happy with their hair.
          </p>

          <p className="mt-4">
            At Elika Beauty, I take time to understand what you want and create
            results that suit your hair, your lifestyle, and your personal
            style.
          </p>
        </div>
      </div>
    </section>
  );
}