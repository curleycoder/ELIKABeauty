import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function ThreadingBurnaby() {
  return (
    <ServicePlaceholder
      slug="threading-burnaby"
      title="Eyebrow Threading in Burnaby"
      priceText="From $15"
      durationText="~10–15 minutes"
      intro="Professional eyebrow threading in Burnaby at Elika Beauty. Threading is a precise hair removal technique that shapes eyebrows cleanly without waxing or chemicals."

      heroImage={{
        src: "/images/services/threading/threading-hero.jpg",
        alt: "Eyebrow threading service at Elika Beauty in Burnaby",
      }}

      benefits={[
        "Precise eyebrow shaping using traditional threading technique",
        "No wax or chemicals used on the skin",
        "Great for sensitive skin types",
        "Fast service with clean, defined results",
        "Can remove even very fine hairs for a sharp brow shape",
      ]}

      faq={[
        {
          q: "What is eyebrow threading?",
          a: "Threading is a traditional hair removal technique using a thin cotton thread to remove hair from the follicle. It allows for precise shaping and clean eyebrow lines.",
        },
        {
          q: "Is threading better than waxing?",
          a: "Threading is often preferred for eyebrow shaping because it allows more precision and does not use heat or chemicals. It can also be better for sensitive skin.",
        },
        {
          q: "How long does threading take?",
          a: "Most eyebrow threading appointments take about 10–15 minutes depending on the amount of shaping needed.",
        },
        {
          q: "How often should I get threading done?",
          a: "Most clients return every 3–4 weeks to maintain a clean eyebrow shape.",
        },
      ]}

    //   galleryImages={[
    //     {
    //       src: "/images/services/threading/threading-1.webp",
    //       alt: "Eyebrow threading result at Elika Beauty",
    //     },
    //     {
    //       src: "/images/services/threading/threading-2.webp",
    //       alt: "Precise eyebrow shaping with threading",
    //     },
    //   ]}
    />
  );
}