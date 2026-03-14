import React from "react";
import { Helmet } from "react-helmet-async";
import ArticleCard from "../components/ArticleCard";
import articles from "../data/articles";

const SITE_ORIGIN = "https://elikabeauty.ca";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F1] text-gray-800 pt-24 px-4 sm:px-6 pb-16">
      <Helmet>
        <title>Hair Care Articles & Tips | Elika Beauty Burnaby</title>
        <meta
          name="description"
          content="Expert hair care tips from Elika Beauty in Burnaby. Learn about balayage, colour correction, keratin treatments, and how to maintain healthy coloured hair."
        />
        <link rel="canonical" href={`${SITE_ORIGIN}/articles`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Hair Care Articles & Tips | Elika Beauty Burnaby" />
        <meta
          property="og:description"
          content="Expert hair care tips from Elika Beauty in Burnaby. Learn about balayage, colour correction, keratin treatments, and how to maintain healthy coloured hair."
        />
        <meta property="og:url" content={`${SITE_ORIGIN}/articles`} />
        <meta property="og:site_name" content="Elika Beauty" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Elika Beauty Hair Care Articles",
          url: `${SITE_ORIGIN}/articles`,
          description: "Expert hair care tips and guides from Elika Beauty salon in Burnaby, BC.",
          publisher: { "@type": "Organization", name: "Elika Beauty" },
        })}</script>
      </Helmet>
      <div className="text-center mb-10 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] mb-2">
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
