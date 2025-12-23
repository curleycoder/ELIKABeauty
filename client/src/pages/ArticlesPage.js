import React from "react";
import ArticleCard from "../components/ArticleCard";
import articles from "../data/articles";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-pinkcolor/5 text-gray-800 pt-12 px-4 sm:px-6 font-bodonimoda pb-16">
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl text-purplecolor mb-2">
          <span className="border-t border-b border-gray-300 px-4 sm:px-6">
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
