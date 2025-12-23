import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const { image, title, text, slug, intro } = article;

  const preview =
    intro || (Array.isArray(text) && text.length > 0 ? text[0] : "");

  // super light placeholder
  const fallback =
    "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="; // 1x1 pixel

  return (
    <Link
      to={`/articles/${slug}`}
      className="block bg-white rounded-xl shadow-sm overflow-hidden w-full max-w-md border border-pink-100 mx-auto hover:shadow-md hover:-translate-y-1 transition-transform duration-200"
    >
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover"
        loading="lazy"
        decoding="async"
        fetchpriority="low"
        width="640"
        height="360"
        onError={(e) => {
          e.currentTarget.src = fallback;
        }}
      />

      <div className="p-4 text-purplecolor">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">{title}</h3>

        <p className="text-sm text-gray-700 mb-3 line-clamp-4">{preview}</p>

        <span className="text-sm text-blue-600 font-semibold">Read More →</span>
      </div>
    </Link>
  );
}
