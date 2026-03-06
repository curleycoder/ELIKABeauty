import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function HighlightsBurnaby() {
  return (
    <ServicePlaceholder
      slug="highlights-burnaby"
      title="Highlights in Burnaby"
      intro="Looking for highlights in Burnaby? Elika Beauty offers customized highlight services to add brightness, dimension, and contrast based on your hair color, skin tone, and maintenance preference. Whether you want a softer natural look or a brighter more noticeable result, we tailor the placement and tone to fit your style."
      priceText="From $200"
      durationText="About 3.5 hours"
      extraNote="Base color may be recommended from $70 depending on gray coverage, tone balancing, previous color, and your overall hair goals."
      benefits={[
        "Customized highlight placement for brightness and dimension",
        "Toning selected to suit your skin tone and overall look",
        "Guidance on upkeep, glossing, and future appointments",
        "Options for softer natural highlights or brighter contrast",
      ]}
      faq={[
        {
          q: "How much do highlights cost in Burnaby?",
          a: "Highlights at Elika Beauty start from $200. Final pricing depends on hair length, thickness, previous color, the amount of lightening needed, and whether extra services like base color or toning are required.",
        },
        {
          q: "How long do highlights take?",
          a: "Highlight appointments usually take around 3.5 hours, but timing can vary depending on your hair, your target result, and whether toning or extra color work is needed.",
        },
        {
          q: "Will I need a base color with highlights?",
          a: "Sometimes, yes. A base color may be recommended for gray coverage, tone balancing, or to create the final result you want. Base color starts from $70.",
        },
        {
          q: "What is the difference between highlights and balayage?",
          a: "Highlights are usually more structured and can create brighter contrast throughout the hair. Balayage is softer and more blended with a more natural grow-out. The right choice depends on the look and maintenance level you want.",
        },
        {
          q: "Are highlights good for first-time color clients?",
          a: "Yes. Highlights can be a good option for first-time color clients because they add dimension and brightness without always requiring a full color change. A consultation helps choose the right approach.",
        },
      ]}
      heroImage={{
        src: "/images/services/highlights/highlights-hero.jpg",
        alt: "Highlights service at Elika Beauty in Burnaby",
      }}
      galleryImages={[
        {
          src: "/images/services/highlights/highlights-1.JPG",
          alt: "Dimensional highlights result at Elika Beauty",
        },
        {
          src: "/images/services/highlights/highlights-2.jpg",
          alt: "Bright blonde highlights in Burnaby",
        },
        {
          src: "/images/services/highlights/highlights-3.jpg",
          alt: "Professional highlights hair color by Elika Beauty",
        },
      ]}
    />
  );
}