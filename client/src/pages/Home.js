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
        
        <GoogleReview />
        <Gallery />

        {/* Article Section */}
        <section>
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bodonimoda text-[#55203d] mb-10">
              <span className="border-t border-b border-gray-300 px-4 sm:px-6">
                Healthy Hair
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 font-bodonimoda">
            {articles.map((article, index) => (
              <ArticleCard
                key={index}
                image={article.image}
                title={article.title}
                text={article.text}
              />
            ))}
          </div>
        </section>

        <AboutMe />
        <FAQ/>
        <Instagram />
      </div>
    </>
  );
}
