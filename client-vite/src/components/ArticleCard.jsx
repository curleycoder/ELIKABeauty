import React from "react";
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  const { image, title, text, slug, intro } = article;

  const preview =
    intro || (Array.isArray(text) && text.length > 0 ? text[0] : "");

  return (
    <Link
      to={`/articles/${slug}`}
      className="
        block bg-white rounded-xl overflow-hidden w-full max-w-md
        border border-purplecolor/30 mx-auto
        hover:-translate-y-1 transition-transform duration-200
      "
    >
      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover"
        loading="lazy"
        decoding="async"
        width="800"
        height="448"
        fetchPriority="low"
      />

      <div className="p-4 text-[#440008]">
        <h3 className="text-lg sm:text-xl font-theseason font-semibold mb-3">
          {title}
        </h3>

        <p className="text-sm text-gray-700 mb-3 line-clamp-4">
          {preview}
        </p>

        <span className="text-sm text-[#440008] font-semibold">
          Read More →
        </span>
      </div>
    </Link>
  );
}
