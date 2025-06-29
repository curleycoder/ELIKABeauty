import React from "react";
import ArticleCard from "../components/ArticleCard"
import article1 from "../assets/article1.jpg"
import article2 from "../assets/article2.jpg"
import article3 from "../assets/article3.jpg"
import BookingPreview from "../components/BookingPreview";
import Gallery  from "../components/Gallery";



export default function Home(){
    return(
        <div className="px-7 py-5">

            <BookingPreview />

            <Gallery />


            <section className="bg-gray-100 p-6 rounded-lg mx-6 mb-10">
                <h2 className="text-2xl font-semibold mb-4">What Clients Say</h2>
                {/* Widget embed */}
                <div dangerouslySetInnerHTML={{
                __html: `<div class="elfsight-widget" data-id="YOUR_WIDGET_ID"></div>`
                }} />
            </section>
            
            <h2 className='text-3xl font-bodonimoda text-[#55203d] mb-6'>
            <span className='border-t border-b border-gray-300 px-6'> Hair & Health </span>
            </h2>
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

