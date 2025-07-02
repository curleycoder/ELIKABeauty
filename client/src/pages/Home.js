import React from "react";
import ArticleCard from "../components/ArticleCard"
import article1 from "../assets/article1.jpg"
import article2 from "../assets/article2.jpg"
import article3 from "../assets/article3.jpg"
import BookingPreview from "../components/BookingPreview";
import Gallery  from "../components/Gallery";
import ReviewsSection from "../components/Review";
import { ErrorBoundary } from "../components/ErrorBoundary";



export default function Home(){
    return(
        <div className="px-7 py-5">

            <BookingPreview />

            <Gallery />
            <ErrorBoundary/>
                <ReviewsSection/>
            <ErrorBoundary/>
            
            
            <div className="text-center">
            <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-6">
                <span className="border-t border-b border-gray-300 px-6">
                Healthy Hair
                </span>
            </h2>
        </div>
            <div className=" font-bodonimoda grid grid-cols-1 md:grid-cols-3 gap-8">

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
            <footer ></footer>

            
        </div>
    )
}

