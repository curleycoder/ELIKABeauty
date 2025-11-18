import React from "react";
import ArticleCard from "../components/ArticleCard";
import Gallery from "../components/Gallery";
import Instagram from "../components/Instagram";
import GoogleReview from "../components/GoogleReview";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";
import articles from "../data/articles";
import FAQ from "../components/FQA"

export default function Home() {
  return (
    <>
      <HeroSection />

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 max-w-screen-xl mx-auto space-y-20">
        <Gallery />
        <AboutMe />
        <GoogleReview />
        <FAQ/>
      </div>
      <Instagram />
    </>
  );
}
