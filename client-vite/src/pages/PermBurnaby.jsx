import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function PermBurnaby() {
  return (
    <ServicePlaceholder
      slug="perm-burnaby"
      title="Perm in Burnaby"
      intro="Looking for a perm in Burnaby? Elika Beauty offers perm services for clients who want curls, waves, texture, or more body. We help choose the right shape and finish based on your hair type, condition, and styling goals."
      priceText="From $120"
      durationText="About 3 hours"
      extraNote="Final timing and pricing can vary based on hair length, density, and the type of perm result you want."
      benefits={[
        "Customized curl or wave pattern based on your hair and goals",
        "Consultation before starting to check suitability and hair condition",
        "Practical aftercare guidance to help maintain your result",
      ]}
      faq={[
        {
          q: "How much does a perm cost in Burnaby?",
          a: "Perm service at Elika Beauty starts at $120. Final price may vary depending on hair length, thickness, and the amount of work involved.",
        },
        {
          q: "How long does a perm appointment take?",
          a: "A perm appointment usually takes about 3 hours, depending on your hair type, length, and desired curl pattern.",
        },
      ]}
      heroImage={{
        src: "/images/services/perm/perm-hero.webp",
        alt: "Perm service at Elika Beauty in Burnaby",
      }}
      galleryImages={[
        {
          src: "/images/services/perm/perm-1.webp",
          alt: "Soft curls perm result at Elika Beauty",
        },
        {
          src: "/images/services/perm/perm-2.webp",
          alt: "Voluminous perm hairstyle in Burnaby",
        },
        {
          src: "/images/services/perm/perm-3.webp",
          alt: "Textured perm hair result by Elika Beauty",
        },
      ]}
    />
  );
}