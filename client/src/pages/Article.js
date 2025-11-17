// src/pages/ArticlePage.js
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import articles from "../data/articles"; // adjust path if needed

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  // If slug doesn't match anything → 404-ish
  if (!article) {
    return (
      <main className="p-4 max-w-3xl mx-auto">
        <Helmet>
          <title>Article Not Found | Beauty Shohre Studio</title>
          <meta
            name="description"
            content="The article you are looking for could not be found."
          />
        </Helmet>
        <Link to="/" className="text-blue-500">
          ← Back
        </Link>
        <p>Article not found.</p>
      </main>
    );
  }

  // ---- SEO + JSON-LD (invisible) ----
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const pageTitle = `${article.title} | Beauty Shohre Studio`;
  const pageDescription = article.intro || article.text[0] || "";
  const pageUrl = origin
    ? `${origin}/articles/${article.slug}`
    : `/articles/${article.slug}`;
  const pageImage = origin ? origin + article.image : article.image;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: pageDescription,
    image: [pageImage],
    mainEntityOfPage: pageUrl,
    author: {
      "@type": "Organization",
      name: "Beauty Shohre Studio",
    },
    publisher: {
      "@type": "Organization",
      name: "Beauty Shohre Studio",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: origin + "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Articles",
        item: origin + "/articles",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: pageUrl,
      },
    ],
  };

  // ---- UI (same look as before) ----
  return (
    <main className="p-4 max-w-3xl mx-auto">
      <Helmet>
        {/* BASIC SEO */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="hair care, balayage, bleached hair repair, hair growth, hair salon Burnaby, Beauty Shohre Studio, hair colour tips"
        />

        {/* CANONICAL */}
        <link rel="canonical" href={pageUrl} />

        {/* OPEN GRAPH */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Beauty Shohre Studio" />

        {/* TWITTER CARD */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* JSON-LD SCHEMA */}
        <script type="application/ld+json">
          {JSON.stringify(articleJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>

      <Link to="/articles" className="text-blue-500">
        ← Back to articles
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{article.title}</h1>

      <img
        src={article.image}
        alt={article.title}
        className="mt-4 w-full max-h-96 object-cover rounded-lg"
      />

      <div className="mt-6 space-y-4">
        {article.text.map((para, idx) => (
          <p key={idx} className="leading-relaxed whitespace-pre-line">
            {para}
          </p>
        ))}
      </div>
    </main>
  );
}

// import { useParams, Link } from "react-router-dom";
// import { articles } from "../articles";

// export default function ArticlePage() {
//   const { slug } = useParams();
//   const article = articles.find((a) => a.slug === slug);

//   if (!article) {
//     return (
//       <main className="p-4">
//         <Link to="/" className="text-blue-500">← Back</Link>
//         <p>Article not found.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="p-4 max-w-3xl mx-auto">
//       <Link to="/" className="text-blue-500">← Back to articles</Link>

//       <h1 className="mt-4 text-3xl font-bold">{article.title}</h1>

//       <img
//         src={article.image}
//         alt={article.title}
//         className="mt-4 w-full max-h-96 object-cover rounded-lg"
//       />

//       <div className="mt-6 space-y-4">
//         {article.text.map((para, idx) => (
//           <p key={idx} className="leading-relaxed whitespace-pre-line">
//             {para}
//           </p>
//         ))}
//       </div>
//     </main>
//   );
// }
