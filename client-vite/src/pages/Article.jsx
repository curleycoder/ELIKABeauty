import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import  articles from "../data/articles";
const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

export default function ArticlePage() {
  const { slug } = useParams();
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          <Helmet>
            <title>Article Not Found | {SITE_NAME}</title>
            <meta
              name="description"
              content="The article you are looking for could not be found."
            />
            <link rel="canonical" href={`${SITE_ORIGIN}/articles`} />
          </Helmet>

          <Link to="/articles" className="text-[#55203d] underline">
            ← Back to articles
          </Link>
          <p className="mt-4">Article not found.</p>
        </div>
      </div>
    );
  }

  const pageTitle = `${article.title} | ${SITE_NAME}`;
  const pageDescription = article.intro || article.text?.[0] || "";
  const pageUrl = `${SITE_ORIGIN}/articles/${article.slug}`;
  const pageImage = article.image?.startsWith("http")
    ? article.image
    : `${SITE_ORIGIN}${article.image?.startsWith("/") ? "" : "/"}${article.image}`;

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: pageDescription,
  image: [pageImage],
  mainEntityOfPage: pageUrl,
  dateModified: article.updatedAt,
  author: { "@type": "Organization", name: SITE_NAME },
  publisher: { "@type": "Organization", name: SITE_NAME },
};


  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_ORIGIN}/articles` },
      { "@type": "ListItem", position: 3, name: article.title, item: pageUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="hair care, balayage, keratin, colour correction, hair salon Burnaby, Elika Beauty, hair colour tips"
        />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="max-w-3xl mx-auto">
        <Link to="/articles" className="text-[#55203d] underline">
          ← Back to articles
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-purplecolor">
          {article.title}
        </h1>

        <img
          src={article.image}
          alt={article.title}
          className="mt-6 w-full max-h-96 object-cover rounded-xl shadow-md"
          loading="lazy"
          decoding="async"
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
