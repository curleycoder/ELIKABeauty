import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

function joinURL(base, path) {
  if (!path) return "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function normalizeCategory(item) {
  const raw =
    item?.category ||
    item?.service ||
    item?.type ||
    item?.tag ||
    item?.tags?.[0] ||
    "Other";

  return String(raw).trim() || "Other";
}

function normalizeTitle(item, fallbackCategory, index) {
  return (
    item?.title ||
    item?.name ||
    item?.caption ||
    `${fallbackCategory} Result ${index + 1}`
  );
}

function normalizeAlt(item, title, category) {
  return (
    item?.alt ||
    item?.seoAlt ||
    `${title} - ${category} result at Elika Beauty in Burnaby`
  );
}

function normalizeGalleryItems(data) {
  const rawItems = Array.isArray(data) ? data : Array.isArray(data?.images) ? data.images : [];

  return rawItems.map((item, index) => {
    const category = normalizeCategory(item);
    const title = normalizeTitle(item, category, index);

    const beforeImage =
      item?.beforeImage ||
      item?.before ||
      item?.images?.before ||
      item?.beforeUrl ||
      "";

    const afterImage =
      item?.afterImage ||
      item?.after ||
      item?.image ||
      item?.full ||
      item?.preview ||
      item?.images?.after ||
      item?.afterUrl ||
      item?.thumb ||
      "";

    const singleImage =
      item?.image ||
      item?.full ||
      item?.preview ||
      item?.thumb ||
      afterImage ||
      "";

    return {
      ...item,
      _cat: category,
      _title: title,
      _alt: normalizeAlt(item, title, category),
      _before: beforeImage ? joinURL(baseURL, beforeImage) : "",
      _after: afterImage ? joinURL(baseURL, afterImage) : "",
      _single: singleImage ? joinURL(baseURL, singleImage) : "",
      _id: item?._id || item?.id || `${category}-${index}`,
    };
  });
}

function GalleryCard({ item, onOpen }) {
  const hasBeforeAfter = !!item._before && !!item._after;
  const displayImage = hasBeforeAfter ? item._after : item._single;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-[#572a31]/12 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
      <button
        type="button"
        onClick={() => onOpen(item)}
        className="block w-full text-left"
      >
        <div className="relative">
          {hasBeforeAfter ? (
            <div className="grid grid-cols-2">
              <div className="relative h-64 sm:h-72 overflow-hidden border-r border-white/20">
                <img
                  src={item._before}
                  alt={`Before - ${item._alt}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#572a31]">
                  Before
                </div>
              </div>

              <div className="relative h-64 sm:h-72 overflow-hidden">
                <img
                  src={item._after}
                  alt={`After - ${item._alt}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute right-3 top-3 rounded-full bg-[#572a31]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white">
                  After
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-64 sm:h-72 overflow-hidden">
              <img
                src={displayImage}
                alt={item._alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#572a31]">
                Result
              </div>
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="text-[11px] uppercase tracking-[0.18em] text-[#572a31]/55">
            {item._cat}
          </div>

          <h3 className="mt-2 text-xl font-theseason text-[#3D0007]">
            {item._title}
          </h3>

          {item?.description && (
            <p className="mt-2 text-sm leading-6 text-[#572a31]/75">
              {item.description}
            </p>
          )}

          <div className="mt-4 inline-flex items-center text-sm font-medium text-[#572a31] underline underline-offset-4">
            View larger
          </div>
        </div>
      </button>
    </article>
  );
}

function GalleryLightbox({ item, onClose }) {
  if (!item) return null;

  const hasBeforeAfter = !!item._before && !!item._after;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-6">
      <div className="relative w-full max-w-6xl rounded-[28px] bg-white shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#572a31] shadow"
        >
          Close
        </button>

        <div className="p-6 sm:p-8">
          <div className="text-xs uppercase tracking-[0.18em] text-[#572a31]/60">
            {item._cat}
          </div>
          <h3 className="mt-2 text-2xl sm:text-3xl font-theseason text-[#3D0007]">
            {item._title}
          </h3>

          {item?.description && (
            <p className="mt-3 max-w-3xl text-sm sm:text-base leading-7 text-gray-700">
              {item.description}
            </p>
          )}

          <div className="mt-6">
            {hasBeforeAfter ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="overflow-hidden rounded-[22px] border">
                  <div className="px-4 py-3 text-sm font-semibold text-[#572a31] border-b bg-[#F8F7F1]">
                    Before
                  </div>
                  <img
                    src={item._before}
                    alt={`Before - ${item._alt}`}
                    className="w-full h-[320px] sm:h-[460px] object-cover"
                  />
                </div>

                <div className="overflow-hidden rounded-[22px] border">
                  <div className="px-4 py-3 text-sm font-semibold text-[#572a31] border-b bg-[#F8F7F1]">
                    After
                  </div>
                  <img
                    src={item._after}
                    alt={`After - ${item._alt}`}
                    className="w-full h-[320px] sm:h-[460px] object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[22px] border">
                <img
                  src={item._single}
                  alt={item._alt}
                  className="w-full h-[320px] sm:h-[520px] object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All";

  const [allImages, setAllImages] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState("loading");
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadGallery() {
      try {
        setStatus("loading");
        const res = await fetch(`${baseURL}/api/gallery`, { cache: "no-store" });
        const data = await res.json();

        if (!mounted) return;

        const normalized = normalizeGalleryItems(data);
        setAllImages(normalized);
        setStatus("success");
      } catch (err) {
        if (!mounted) return;
        console.error("Failed to load gallery images:", err);
        setStatus("error");
      }
    }

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(allImages.map((img) => img._cat));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allImages]);

  const filteredImages = useMemo(() => {
    if (category === "All") return allImages;
    return allImages.filter((img) => img._cat === category);
  }, [allImages, category]);

  const featuredImage = filteredImages[0]?._after || filteredImages[0]?._single || "/images/gallery/gallery-hero.jpg";

  const pageTitle =
    category === "All"
      ? `Before and After Gallery in Burnaby | ${SITE_NAME}`
      : `${category} Before and After Gallery in Burnaby | ${SITE_NAME}`;

  const pageDescription =
    category === "All"
      ? "Explore before and after beauty results at Elika Beauty in Burnaby. Browse hair color, balayage, highlights, keratin, microblading, threading, and more."
      : `Explore ${category.toLowerCase()} before and after results at Elika Beauty in Burnaby. Browse real client work and service results.`;

  const pageUrl =
    category === "All"
      ? `${SITE_ORIGIN}/gallery`
      : `${SITE_ORIGIN}/gallery?cat=${encodeURIComponent(category)}`;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageTitle,
    description: pageDescription,
    url: pageUrl,
  };

  const pickCategory = useCallback(
    (cat) => {
      setCategory(cat);
      setSearchParams(cat === "All" ? {} : { cat });
      setSelectedItem(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setSearchParams]
  );

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {featuredImage && <meta property="og:image" content={featuredImage} />}

        <script type="application/ld+json">
          {JSON.stringify(itemListJsonLd)}
        </script>
      </Helmet>

      <section className="relative w-full overflow-hidden">
        <img
          src={featuredImage}
          alt="Elika Beauty gallery hero"
          className="h-[300px] sm:h-[420px] lg:h-[520px] w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/75 via-[#2e1118]/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-white/80">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-theseason font-bold text-white">
            Before & After Gallery
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-white/90">
            Browse real service results by category. Explore before and after transformations,
            or single result photos where before images are not available.
          </p>
        </div>
      </section>

      <section id="gallery-page" className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => pickCategory(cat)}
              type="button"
              className={[
                "rounded-full px-4 py-2 text-sm transition border",
                cat === category
                  ? "bg-[#572a31] text-white border-[#572a31]"
                  : "bg-white text-[#572a31] border-[#572a31]/15 hover:border-[#572a31]/35",
              ].join(" ")}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {status === "loading" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[28px] border border-[#572a31]/10 bg-white animate-pulse"
                >
                  <div className="h-64 bg-[#f3ece7]" />
                  <div className="p-5">
                    <div className="h-3 w-20 bg-[#f3ece7] rounded" />
                    <div className="mt-3 h-6 w-2/3 bg-[#f3ece7] rounded" />
                    <div className="mt-3 h-4 w-full bg-[#f3ece7] rounded" />
                    <div className="mt-2 h-4 w-4/5 bg-[#f3ece7] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {status === "error" && (
            <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700">
              Gallery images could not be loaded right now.
            </div>
          )}

          {status === "success" && filteredImages.length === 0 && (
            <div className="rounded-[28px] border border-[#572a31]/10 bg-[#F8F7F1] p-8 text-center">
              <h2 className="text-2xl font-theseason text-[#3D0007]">
                No images found
              </h2>
              <p className="mt-3 text-gray-600">
                There are no gallery items in this category yet.
              </p>
            </div>
          )}

          {status === "success" && filteredImages.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredImages.map((item) => (
                <GalleryCard
                  key={item._id}
                  item={item}
                  onOpen={setSelectedItem}
                />
              ))}
            </div>
          )}
        </div>

        <section className="mt-16 rounded-[28px] border border-[#572a31]/12 bg-[#F8F7F1] p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007]">
            Looking for a specific service?
          </h2>

          <p className="mt-3 max-w-3xl text-gray-700 leading-7">
            Explore more details, pricing guidance, and booking information on our service pages.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/services"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              All Services
            </Link>
            <Link
              to="/balayage-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Balayage
            </Link>
            <Link
              to="/highlights-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Highlights
            </Link>
            <Link
              to="/keratin-treatment-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Keratin
            </Link>
            <Link
              to="/microblading-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Microblading
            </Link>
            <Link
              to="/booking"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Book Appointment
            </Link>
          </div>
        </section>
      </section>

      <GalleryLightbox item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
}