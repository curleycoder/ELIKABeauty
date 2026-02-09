import React from "react";
import ArticleCard from "../components/ArticleCard";
import articles from "../data/articles";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F1] text-gray-800 pt-24 px-4 sm:px-6 pb-16">
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-theseason text-[#7a3b44] mb-2">
          Hair Care Articles
        </h1>
        <p className="text-sm text-gray-600">
          Tips on colour, balayage, keratin, and healthy hair routines at Elika Beauty.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
