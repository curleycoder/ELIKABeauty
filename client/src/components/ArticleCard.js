import React, { useState } from "react";

export default function ArticleCard({ title, text, image }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleText = () => setIsExpanded(!isExpanded);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md border border-pink-100 mx-auto">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4 text-purplecolor">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>

        <p className="text-sm text-gray-700 mb-2 line-clamp-3 sm:line-clamp-4">
          {isExpanded ? text : `${text.slice(0, 120)}...`}
        </p>

        <button
          onClick={toggleText}
          className="text-sm text-blue-600 font-semibold hover:underline focus:outline-none"
        >
          {isExpanded ? "Show Less" : "Read More"}
        </button>
      </div>
    </div>
  );
}
