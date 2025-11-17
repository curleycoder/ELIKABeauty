// src/components/ArticleCard.js
import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const { image, title, text, slug } = article;

  // short preview: first paragraph only
  const preview =
    Array.isArray(text) && text.length > 0 ? text[0] : "";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md border border-pink-100 mx-auto">
      <img src={image} alt={title} className="w-full h-48 object-cover" />

      <div className="p-4 text-purplecolor">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">{title}</h3>

        <p className="text-sm text-gray-700 mb-3">
          {preview}
        </p>

        <Link
          to={`/articles/${slug}`}
          className="text-sm text-blue-600 font-semibold hover:underline"
        >
          Read More →
        </Link>
      </div>
    </div>
  );
}
