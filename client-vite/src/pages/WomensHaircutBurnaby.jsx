import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function WomensHaircutBurnaby() {
  return (
    <ServicePlaceholder
      slug="womens-haircut-burnaby"
      title="Women’s Haircut in Burnaby"
      intro="Looking for a women’s haircut in Burnaby? Elika Beauty offers personalized haircuts based on your face shape, hair texture, routine, and styling goals. Whether you want a trim, a fresh new shape, layers, or a full style update, we focus on creating a haircut that looks good and works in real life."
      priceText="From $45"
      durationText="About 45 minutes"
      extraNote="Final timing may vary depending on hair length, thickness, restyling needs, and whether extra styling is needed."
      benefits={[
        "Haircuts tailored to your face shape and hair texture",
        "Options for trims, layers, reshaping, or full style changes",
        "Practical styling guidance for easier day-to-day maintenance",
      ]}
      faq={[
        {
          q: "How much is a women’s haircut in Burnaby?",
          a: "Women’s haircuts at Elika Beauty start from $45. Final price may vary depending on hair length, thickness, and the level of restyling needed.",
        },
        {
          q: "How long does a women’s haircut take?",
          a: "Most women’s haircut appointments take about 45 minutes, but timing can vary based on your hair length, density, and whether you want a major change.",
        },
        {
          q: "Can I book a haircut if I want a completely new style?",
          a: "Yes. If you want a major change, bring reference photos if possible. This helps make the consultation more accurate and keeps expectations clear.",
        },
        {
          q: "Is this service good for trims and maintenance cuts too?",
          a: "Yes. You can book this service for regular trims, shape refreshes, layer maintenance, or a full haircut update.",
        },
      ]}
      heroImage={{
        src: "/images/services/haircutwoman/haircut-hero.jpg",
        alt: "Women’s haircut at Elika Beauty in Burnaby",
      }}
      galleryImages={[
        {
          src: "/images/services/haircutwoman/haircut-1.jpg",
          alt: "Layered women’s haircut result at Elika Beauty",
        },
        {
          src: "/images/services/haircutwoman/haircut-2.jpg",
          alt: "Styled women’s haircut in Burnaby",
        },
        {
          src: "/images/services/haircutwoman/haircut-3.jpg",
          alt: "Professional women’s haircut by Elika Beauty",
        },
      ]}
    />
  );
}