import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function MicrobladingBurnaby() {
  return (
    <ServicePlaceholder
      slug="microblading-burnaby"
      title="Microblading in Burnaby"
      priceText="From $350"
      durationText="~2 hours"
      intro="Professional PhiBrows microblading in Burnaby at Elika Beauty. Achieve fuller, natural-looking eyebrows with precise hair-like strokes designed for your face shape."

      heroImage={{
        src: "/images/services/microblading/microblading-hero.webp",
        alt: "PhiBrows microblading eyebrow service at Elika Beauty in Burnaby",
      }}

      benefits={[
        "PhiBrows technique for natural, symmetrical eyebrows",
        "Single-use sterile tools for maximum hygiene",
        "Precise hair-like strokes for realistic brow appearance",
        "Customized brow mapping based on your face shape",
        "Dry healing method — no water required during healing",
      ]}

      faq={[
        {
          q: "What is PhiBrows microblading?",
          a: "PhiBrows is a specialized microblading technique that focuses on symmetry, precision, and natural hair-like strokes. It uses measurements based on facial proportions to design the most balanced brow shape.",
        },
        {
          q: "Are the tools used for microblading sterile?",
          a: "Yes. At Elika Beauty we use single-use sterile tools for every client. Each tool is opened during the appointment and disposed of after the procedure.",
        },
        {
          q: "Does microblading require water during healing?",
          a: "No. With the dry healing method used for PhiBrows microblading, clients are usually advised to avoid water on the brows during the initial healing period for the best results.",
        },
        {
          q: "How long does microblading last?",
          a: "Microblading typically lasts between 12–24 months depending on skin type, lifestyle, and aftercare. Touch-ups may be recommended to maintain color and shape.",
        },
      ]}

    />
  );
}