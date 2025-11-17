// src/pages/ArticlePage.js
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import articles from "../data/articles";

function ArticlePage() {
  const { slug } = useParams();

  // find article by slug
  const article = articles.find((a) => a.slug === slug);

  // fallback for invalid slug
  if (!article) {
    return (
      <main style={{ padding: "1rem" }}>
        <Helmet>
          <title>Article Not Found | Beauty Shohre Studio</title>
        </Helmet>
        <Link to="/">← Back</Link>
        <p>Sorry, the article you are looking for does not exist.</p>
      </main>
    );
  }

  // dynamic values for SEO
  const pageTitle = `${article.title} | Beauty Shohre Studio`;
  const pageDescription = article.intro;
  const pageImage = window.location.origin + article.image;
  const pageUrl = window.location.origin + `/articles/${article.slug}`;

  return (
    <main style={{ padding: "1rem", maxWidth: "800px", margin: "0 auto" }}>
      <Helmet>
        {/* BASIC SEO */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="hair care, balayage, bleached hair repair, hair growth, hair salon Canada, Burnaby hair stylist, Beauty Shohre Studio, hair colour tips"
        />

        {/* CANONICAL */}
        <link rel="canonical" href={pageUrl} />

        {/* OPEN GRAPH (Facebook, Instagram, LinkedIn) */}
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
      </Helmet>

      <Link to="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
        ← Back to Articles
      </Link>

      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{article.title}</h1>

      <img
        src={article.image}
        alt={article.title}
        style={{
          width: "100%",
          maxHeight: "400px",
          objectFit: "cover",
          borderRadius: "10px",
          marginBottom: "1.5rem",
        }}
      />

      {article.text.map((paragraph, index) => (
        <p
          key={index}
          style={{
            marginBottom: "1rem",
            lineHeight: "1.6",
            whiteSpace: "pre-line",
          }}
        >
          {paragraph}
        </p>
      ))}
    </main>
  );
}

export default ArticlePage;


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
