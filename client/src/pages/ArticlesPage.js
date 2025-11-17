// src/pages/ArticlesPage.js
import React from "react";
import ArticleCard from "../components/ArticleCard";
import articles from "../data/articles";

export default function ArticlesPage() {
  return (
    <main className="w-full px-4 sm:px-6 md:px-8 lg:px-12 py-10 max-w-screen-xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl text-[#55203d] mb-10">
          <span className="border-t border-b border-gray-300 px-4 sm:px-6">
            Hair Care Articles
          </span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
