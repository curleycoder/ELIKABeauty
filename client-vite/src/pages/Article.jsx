import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import articles from "../data/articles";

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 font-bodonimoda pb-16">
        <div className="max-w-3xl mx-auto">
          <Helmet>
            <title>Article Not Found | Beauty Shohre Studio</title>
            <meta
              name="description"
              content="The article you are looking for could not be found."
            />
          </Helmet>

          <Link to="/articles" className="text-[#f098a6] font-display">
            ← Back to articles
          </Link>
          <p className="mt-4">Article not found.</p>
        </div>
      </div>
    );
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const pageTitle = `${article.title} | Beauty Shohre Studio`;
  const pageDescription = article.intro || article.text[0] || "";
  const pageUrl = origin
    ? `${origin}/articles/${article.slug}`
    : `/articles/${article.slug}`;
  // const pageImage =
  //   origin && article.image && !article.image.startsWith("http")
  //     ? origin + article.image
  //     : article.image;
  const pageImage = article.image;


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

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 font-bodonimoda pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="hair care, balayage, bleached hair repair, hair growth, hair salon Burnaby, Beauty Shohre Studio, hair colour tips"
        />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Beauty Shohre Studio" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        <script type="application/ld+json">
          {JSON.stringify(articleJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <Link to="/articles" className="text-[#f098a6] font-display">
          ← Back to articles
        </Link>

        <h2 className="mt-4 text-3xl font-bold text-purplecolor">
          {article.title}
        </h2>

        {/* THIS is the hero image – same data as card */}
        <img
          src={article.image}
          alt={article.title}
          className="mt-6 w-full max-h-96 object-cover rounded-xl shadow-md"
        />

        <div className="mt-6 space-y-4 text-base leading-relaxed">
          {article.text.map((para, idx) => (
            <p key={idx} className="whitespace-pre-line">
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
