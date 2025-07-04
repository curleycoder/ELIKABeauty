import React from "react";
import ArticleCard from "../components/ArticleCard"
import article1 from "../assets/article1.jpg"
import article2 from "../assets/article2.jpg"
import article3 from "../assets/article3.jpg"
import Gallery  from "../components/Gallery";
import Instagram from "../components/Instagram";
import GoogleReview from "../components/GoogleReview";
import HeroSection from "../components/HeroSection";
import AboutMe from "../components/AboutMe";



export default function Home(){
    return (
        <>
            <HeroSection /> 

            
            <div className="px-7 py-5">
                <GoogleReview/>
                <Gallery />

                <div className="text-center mt-20">
                    <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-10">
                        <span className="border-t border-b border-gray-300 px-6">
                            Healthy Hair
                        </span>
                    </h2>
                </div>

                <div className="font-bodonimoda grid grid-cols-1 md:grid-cols-3 gap-8">
                    <ArticleCard 
                        image={article1}
                        title="How to Keep Hair Healthy"
                        text="tips ..."
                    />
                    <ArticleCard 
                        image={article2}
                        title="Foods That Boost Hair Growth"
                        text="Eat ..."
                    />
                    <ArticleCard 
                        image={article3}
                        title="Things to Know About Your Hair"
                        text="Hair ..."
                    />
                </div>
  
            </div>
            <AboutMe/>
            <Instagram />
        </>
    )
}
