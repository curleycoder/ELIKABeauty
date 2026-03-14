import React from "react";
import { Helmet } from "react-helmet-async";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";
import GoogleReview from "../components/GoogleReview";
import FAQ from "../components/FAQ";
import Instagram from "../components/Instagram";
import IntroSection from "../components/Intro";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  name: "Elika Beauty",
  url: "https://elikabeauty.ca",
  telephone: "+16044383727",
  image: "https://elikabeauty.ca/assets/salon.webp",
  description: "Elika Beauty is a professional hair salon in Burnaby, BC specializing in balayage, highlights, hair colour, keratin treatments, perms, haircuts, microblading, threading, massage, and facial treatments.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "3790 Canada Way #102",
    addressLocality: "Burnaby",
    addressRegion: "BC",
    postalCode: "V5G 1G4",
    addressCountry: "CA",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 49.2488,
    longitude: -122.9897,
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday","Wednesday","Thursday","Friday", "Saturday"], opens: "10:00", closes: "19:00" },
    // { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "10:00", closes: "18:00" },
  ],
  priceRange: "$$",
  servesCuisine: undefined,
  hasMap: "https://www.google.com/maps/place/ELIKA+BEAUTY+(Tangles+Hair+Design)/",
  sameAs: ["https://www.instagram.com/elikabeauty.ca/"],
};

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Elika Beauty | Hair Salon in Burnaby (Metro Vancouver)</title>
        <meta name="description" content="Elika Beauty is a hair salon in Burnaby specializing in balayage, highlights, hair colour, and keratin treatments. Book online at 3790 Canada Way #102." />
        <link rel="canonical" href="https://elikabeauty.ca/" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Elika Beauty | Hair Salon in Burnaby" />
        <meta property="og:description" content="Professional hair salon in Burnaby. Balayage, highlights, hair colour, keratin, haircuts, microblading and more. Book online." />
        <meta property="og:url" content="https://elikabeauty.ca/" />
        <meta property="og:image" content="https://elikabeauty.ca/assets/salon.webp" />
        <meta property="og:site_name" content="Elika Beauty" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://elikabeauty.ca/assets/salon.webp" />
        <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      </Helmet>

      <HeroSection />
      <IntroSection />
      <AboutMe />
      <GoogleReview />

      <section className="mt-10 sm:mt-16">
        <Instagram />
      </section>

      <section className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12">
        <FAQ />
      </section>
    </>
  );
}
