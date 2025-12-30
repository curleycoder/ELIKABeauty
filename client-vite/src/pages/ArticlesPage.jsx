import React from "react";
import ArticleCard from "../components/ArticleCard";
import articles from "../data/articles";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 font-bodonimoda pb-16">
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-display text-[#55203d] mb-2">
          <span className="border-t border-b py-2 border-gray-300 px-4 sm:px-6">
            Hair Care Articles
          </span>
        </h1>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
