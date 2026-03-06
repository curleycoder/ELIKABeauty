import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function BalayageBurnaby() {
  return (
    <ServicePlaceholder
      slug="balayage-burnaby"
      title="Balayage in Burnaby"
      intro="Looking for balayage in Burnaby? Elika Beauty offers customized balayage services for clients who want soft, blended brightness with a more natural grow-out. This service is ideal if you want dimension and movement without the stronger, more structured look of traditional highlights."
      priceText="From $220"
      durationText="About 4 hours"
      extraNote="Base color may be recommended from $70 depending on gray coverage, previous color, tone balancing, and your final hair goal."
      benefits={[
        "Soft, blended color placement for a natural-looking result",
        "Lower-maintenance grow-out compared with more structured color services",
        "Customized tone and brightness based on your skin tone and style goals",
        "Consultation to plan upkeep, toning, and future appointments",
      ]}
      faq={[
        {
          q: "How much does balayage cost in Burnaby?",
          a: "Balayage at Elika Beauty starts from $220. Final pricing depends on hair length, thickness, previous color, the amount of lightening needed, and whether extra services like base color or toning are required.",
        },
        {
          q: "How long does balayage take?",
          a: "A balayage appointment usually takes about 4 hours, but timing can vary depending on your hair, your target result, and whether extra color work is needed.",
        },
        {
          q: "What is the difference between balayage and highlights?",
          a: "Balayage is usually hand-painted for a softer, more blended effect with a gentler grow-out. Highlights are often more structured and can create brighter contrast throughout the hair. The better choice depends on the look and maintenance level you want.",
        },
        {
          q: "Will I need a base color with balayage?",
          a: "Sometimes. A base color may be recommended for gray coverage, tone balancing, or to create the final result you want. Base color starts from $70.",
        },
        {
          q: "Is balayage low maintenance?",
          a: "Balayage is often considered lower maintenance because the grow-out tends to look softer and less defined than traditional highlights. Exact upkeep still depends on your tone, contrast, and hair goals.",
        },
      ]}
      heroImage={{
        src: "/images/services/balayage/balayage-hero.jpg",
        alt: "Balayage service at Elika Beauty in Burnaby",
      }}
      galleryImages={[
        {
          src: "/images/services/balayage/balayage-1.JPG",
          alt: "Soft blended balayage result at Elika Beauty",
        },
        {
          src: "/images/services/balayage/balayage-2.jpg",
          alt: "Natural-looking balayage hair color in Burnaby",
        },
        {
          src: "/images/services/balayage/balayage-3.jpg",
          alt: "Professional balayage color by Elika Beauty",
        },
      ]}
    />
  );
}