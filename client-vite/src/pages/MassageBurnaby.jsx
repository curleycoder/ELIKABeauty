import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function RelaxationMassageBurnaby() {
  return (
    <ServicePlaceholder
      slug="relaxation-body-massage-burnaby"
      title="Relaxation / Body Massage in Burnaby"
      intro="Looking for relaxation or body massage in Burnaby? Elika Beauty offers spa-style massage focused on stress relief, relaxation, and overall comfort. This service is designed to help you unwind, release tension, and enjoy a calmer body and mind."
      priceText="$90"
      durationText="~60 minutes"
      extraNote="Appointment length and pricing may vary depending on the session type and duration you choose."
      benefits={[
        "Relaxing spa-style massage for stress relief and comfort",
        "Helps reduce body tension and promote relaxation",
        "Calm, soothing experience designed for overall wellness",
        "Good option for clients wanting rest, reset, and self-care time",
      ]}
      faq={[
        {
          q: "What is relaxation or body massage?",
          a: "Relaxation massage is a gentle spa-style massage focused on helping the body relax, easing general tension, and creating a calm, soothing experience.",
        },
        {
          q: "Is this a deep tissue massage?",
          a: "No. This service is focused more on relaxation and light-to-moderate pressure rather than deep corrective bodywork.",
        },
        {
          q: "How long does a relaxation massage take?",
          a: "Session time depends on the service booked, but many appointments are around 60 minutes.",
        },
        {
          q: "Who is this massage best for?",
          a: "This service is a good fit for clients who want to relax, reduce everyday stress, and enjoy a calming wellness treatment.",
        },
      ]}
      heroImage={{
        src: "/images/services/massage/massage-hero.webp",
        alt: "Relaxation body massage service at Elika Beauty in Burnaby",
      }}
    //   galleryImages={[
    //     {
    //       src: "/images/services/massage/relaxation-massage-1.webp",
    //       alt: "Spa-style relaxation massage at Elika Beauty",
    //     },
    //     {
    //       src: "/images/services/relaxation-massage/relaxation-massage-2.webp",
    //       alt: "Relaxing body massage service in Burnaby",
    //     },
    //     {
    //       src: "/images/services/relaxation-massage/relaxation-massage-3.webp",
    //       alt: "Wellness and relaxation massage at Elika Beauty",
    //     },
    //   ]}
      relatedServices={[
        { to: "/services", label: "All Services" },
        { to: "/threading-burnaby", label: "Threading" },
        { to: "/microblading-burnaby", label: "Microblading" },
        { to: "/hair-color-burnaby", label: "Hair Color" },
      ]}
    />
  );
}