import React from "react";
import ServicePlaceholder from "./ServicePlaceholder";

export default function MensHaircutBurnaby() {
  return (
    <ServicePlaceholder
      slug="mens-haircut-burnaby"
      title="Men’s Haircut in Burnaby"
      intro="Looking for a men’s haircut in Burnaby? Elika Beauty offers clean, practical haircuts tailored to your style, hair type, and routine. Whether you want a simple refresh, a sharper shape, or a wash and cut, we focus on a polished result that is easy to maintain."
      priceText="$25 (Wash + Cut $35)"
      durationText="About 30–45 minutes"
      extraNote="Appointment timing may vary depending on hair length, thickness, and the level of reshaping needed."
      benefits={[
        "Clean, polished haircut tailored to your style and hair type",
        "Option to book a wash with your haircut for a cleaner finish",
        "Easy-to-maintain cuts designed for everyday wear",
      ]}
      faq={[
        {
          q: "How much is a men’s haircut in Burnaby?",
          a: "A men’s haircut at Elika Beauty is $25. Men’s wash and cut is $35.",
        },
        {
          q: "How long does a men’s haircut take?",
          a: "Most men’s haircut appointments take about 30 to 45 minutes, depending on hair length, thickness, and the haircut you want.",
        },
        {
          q: "Should I book men’s haircut or wash and cut?",
          a: "Book wash and cut if you want your hair washed before the haircut or want a cleaner start to the service. If your hair is already clean and you do not need a wash, the regular haircut is enough.",
        },
        {
          q: "Can I book this for a style refresh or shape-up?",
          a: "Yes. This service works for routine trims, shape-ups, and full haircut refreshes.",
        },
      ]}
      heroImage={{
        src: "/images/services/haircutmen/haircut-hero.jpg",
        alt: "Men’s haircut at Elika Beauty in Burnaby",
      }}
      galleryImages={[
        {
          src: "/images/services/haircutmen/haircut-1.jpg",
          alt: "Clean men’s haircut result at Elika Beauty",
        },
        {
          src: "/images/services/haircutmen/haircut-2.jpg",
          alt: "Professional men’s haircut in Burnaby",
        },
        {
          src: "/images/services/haircutmen/haircut-3.jpg",
          alt: "Men’s wash and haircut service at Elika Beauty",
        },
      ]}
    />
  );
}