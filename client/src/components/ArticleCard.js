import React, {useState} from "react";

export default function ArticleCard({ title, text, image }){
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleText = () => setIsExpanded(!isExpanded)

    return(
        <div className="bg-white rounded-xl shadow-md overflow-hidden max-w-sm border border-pink-100">
            <img src={image} alt={title} className="w-full h-48 object-cover" />

            <div className="p-4 text-purplecolor">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>

                <p className={`test-sm text-gray-700 ${isExpanded ? '' : 'truncate'}`}>{text}</p>

                <button onClick={toggleText} className="text-blue-500 font-sans-serif hover:text-blue-400 transition colors duration-200 focus:underline-none">
                    {isExpanded ? "Show Less": "Read more"}
                </button>
            </div>
        </div>
    )
}