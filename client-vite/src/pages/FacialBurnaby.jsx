import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function FacialCareBurnaby() {
  return (
    <ServicePlaceholder
      slug="facial-care-burnaby"
      title="Facial Treatment in Burnaby"
      intro="Relaxing facial care at Elika Beauty in Burnaby designed to cleanse, refresh, and hydrate the skin. Our facial treatments include deep cleansing, steam, mask application, and skin-nourishing care to help your skin feel clean, smooth, and refreshed."
      priceText="$85"
      durationText="~45–60 minutes"
      extraNote="Treatment steps may vary depending on skin type and products used."

      benefits={[
        "Deep cleansing facial to remove impurities",
        "Steam treatment to open pores and prepare the skin",
        "Hydrating or purifying facial mask",
        "Helps skin feel smoother, cleaner, and refreshed",
        "Relaxing spa-style skincare experience",
      ]}

      faq={[
        {
          q: "What is included in a facial treatment?",
          a: "Facial treatments usually include cleansing, steam, mask application, and skin-nourishing products designed to help the skin feel refreshed and hydrated."
        },
        {
          q: "Is facial treatment good for all skin types?",
          a: "Yes. Facial care can be adjusted depending on your skin type, whether your skin is dry, oily, or combination."
        },
        {
          q: "How long does a facial treatment take?",
          a: "Most facial treatments take around 45–60 minutes depending on the treatment and products used."
        },
        {
          q: "How often should I get a facial?",
          a: "Many clients choose facial treatments every 4–6 weeks to help maintain healthy looking skin."
        }
      ]}

      heroImage={{
        src: "/images/services/facial/facial-hero.jpg",
        alt: "Facial treatment with steam and mask at Elika Beauty in Burnaby",
      }}

    //   galleryImages={[
    //     {
    //       src: "/images/services/facial/facial-1.webp",
    //       alt: "Relaxing facial skincare treatment"
    //     },
    //     {
    //       src: "/images/services/facial/facial-2.webp",
    //       alt: "Facial mask treatment at Elika Beauty"
    //     },
    //     {
    //       src: "/images/services/facial/facial-3.webp",
    //       alt: "Deep cleansing facial with steam"
    //     }
    //   ]}
    />
  );
}