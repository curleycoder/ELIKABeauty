import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function KeratinTreatmentBurnaby() {
  return (
    <ServicePlaceholder
      slug="keratin-treatment-burnaby"
      title="Keratin Treatment in Burnaby"
      intro="Looking for a keratin treatment in Burnaby? At Elika Beauty we offer professional keratin smoothing treatments designed to reduce frizz, improve manageability, and make daily styling easier. This treatment helps smooth the hair cuticle while maintaining natural movement and shine."
      priceText="From $250"
      durationText="About 4 hours"
      extraNote="Final price and timing depend on hair length, thickness, previous chemical treatments, and the amount of product required."
      benefits={[
        "Reduces frizz and humidity effects",
        "Makes hair smoother and easier to style",
        "Adds shine while maintaining natural movement",
        "Helps reduce styling time for everyday routines",
      ]}
      faq={[
        {
          q: "How much does a keratin treatment cost in Burnaby?",
          a: "Keratin treatments at Elika Beauty start from $250. Final pricing depends on hair length, thickness, and the amount of product required.",
        },
        {
          q: "How long does a keratin treatment take?",
          a: "A keratin treatment usually takes around 4 hours depending on hair length, density, and the preparation needed.",
        },
        {
          q: "Will keratin make my hair completely straight?",
          a: "Keratin treatments primarily reduce frizz and smooth the hair. Some hair types may become straighter, while others simply become smoother and easier to manage.",
        },
        {
          q: "How long does a keratin treatment last?",
          a: "Results usually last several months depending on hair type, aftercare, and how frequently the hair is washed.",
        },
        {
          q: "Is keratin good for frizzy or damaged hair?",
          a: "Keratin treatments are commonly used to help manage frizz and improve smoothness. A consultation helps determine if the treatment is suitable for your hair condition.",
        },
      ]}
      heroImage={{
        src: "/images/services/keratin/keratin-hero.jpg",
        alt: "Keratin treatment smoothing service at Elika Beauty in Burnaby",
      }}
      galleryImages={[
        {
          src: "/images/services/keratin/keratin-1.JPG",
          alt: "Smooth keratin treatment result at Elika Beauty",
        },
        {
          src: "/images/services/keratin/keratin-2.jpg",
          alt: "Shiny smooth hair after keratin treatment in Burnaby",
        },
        {
          src: "/images/services/keratin/keratin-3.jpg",
          alt: "Keratin smoothing treatment result by Elika Beauty",
        },
      ]}
    />
  );
}