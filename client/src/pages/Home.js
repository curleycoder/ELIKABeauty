import React from "react";
import ArticleCard from "../components/ArticleCard"
import article1 from "../assets/article1.jpg"
import article2 from "../assets/article2.jpg"
import article3 from "../assets/article3.jpg"
import BookingPreview from "../components/BookingPreview";



export default function Home(){
    return(
        <div className="px-7 py-5">

            <BookingPreview />

            <h2 className="text-xl font-bodonimoda font-bold mb-8 text-purplecolor">Hair & Health Articles</h2>

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

            
        </div>
    )
}

