import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams, Link } from "react-router-dom";

const GALLERY_HERO = "/images/gallery-hero.webp";

const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

/* ---------------- helpers ---------------- */

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

function normalizeGalleryItems(data) {
  const rawItems = Array.isArray(data)
    ? data
    : Array.isArray(data?.images)
    ? data.images
    : [];

  return rawItems.map((item, index) => {
    const category = normalizeCategory(item);
    const image = item?.image || "";

    return {
      _cat: category,
      _single: image ? joinURL(baseURL, image) : "",
      _id: item?.id || `${category}-${index}`,
    };
  });
}

/* ---------------- gallery card ---------------- */

function GalleryCard({ item, onOpen }) {
  return (
    <article className="overflow-hidden rounded-[26px] bg-white shadow-sm transition hover:shadow-lg">
      <button onClick={() => onOpen(item)} className="block w-full">
        <div className="relative aspect-[9/16] overflow-hidden">
          <img
            src={item._single}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </button>
    </article>
  );
}

/* ---------------- lightbox ---------------- */

function GalleryLightbox({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4">
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-20 rounded-full bg-white px-4 py-2 text-sm font-medium"
      >
        Close
      </button>

      <img
        src={item._single}
        alt=""
        className="max-h-[92vh] w-auto object-contain"
      />
    </div>
  );
}

/* ---------------- main gallery ---------------- */

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("cat") || "All";

  const [allImages, setAllImages] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState("loading");
  const [selectedItem, setSelectedItem] = useState(null);

  /* load gallery */

  useEffect(() => {
    let mounted = true;

    async function loadGallery() {
      try {
        const res = await fetch(`${baseURL}/api/gallery`);
        const data = await res.json();

        if (!mounted) return;

        const normalized = normalizeGalleryItems(data);
        setAllImages(normalized);
        setStatus("success");
      } catch (err) {
        if (!mounted) return;
        setStatus("error");
      }
    }

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  /* categories */

  const categories = useMemo(() => {
    const set = new Set(allImages.map((img) => img._cat));
    return ["All", ...Array.from(set)];
  }, [allImages]);

  const filteredImages = useMemo(() => {
    if (category === "All") return allImages;
    return allImages.filter((img) => img._cat === category);
  }, [allImages, category]);

  /* SEO */

  const pageTitle =
    category === "All"
      ? `Gallery | ${SITE_NAME}`
      : `${category} Gallery | ${SITE_NAME}`;

  const pageDescription =
    "Explore real client results and beauty services at Elika Beauty in Burnaby.";

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

  /* ---------------- render ---------------- */

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:image" content={`${SITE_ORIGIN}${GALLERY_HERO}`} />

        <script type="application/ld+json">
          {JSON.stringify(itemListJsonLd)}
        </script>
      </Helmet>

      {/* hero */}

      <section className="relative w-full overflow-hidden">
  <img
    src={GALLERY_HERO}
    alt="Elika Beauty gallery results in Burnaby"
    className="h-[260px] w-full object-cover sm:h-[360px] lg:h-[520px]"
    loading="eager"
  />

  <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/80 via-[#2e1118]/35 to-transparent" />

  <div className="absolute inset-x-0 bottom-6 mx-auto max-w-6xl px-4 sm:bottom-0 sm:px-6 sm:pb-4">
    <p className="text-[11px] uppercase tracking-[0.18em] text-white/80 sm:text-xs">
      Elika Beauty • Burnaby
    </p>

    <h1 className="max-w-3xl pb-8 text-2xl font-theseason font-bold leading-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
      Beauty Gallery
    </h1>

    <div className="mt-6 flex flex-row gap-1 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-3">
      <Link
        to="/booking"
        className="inline-flex min-h-[46px] items-center justify-center rounded-xl bg-[#572a31] px-3 py-1 text-sm font-medium text-white transition hover:bg-[#F8F7F1] sm:px-2"
      >
        Book Appointment
      </Link>

      <a
        href={`tel:${PHONE_TEL}`}
        className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/40 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/10 sm:px-6"
      >
        {PHONE_DISPLAY}
      </a>

      <a
        href={MAPS_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-[46px] items-center justify-center rounded-xl border border-white/40 px-3 py-1 text-sm font-medium text-white transition hover:bg-white/10 sm:px-6"
      >
        Direction
      </a>
    </div>

    <p className="max-w-2xl pt-2 text-sm leading-5 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
      Explore real client results at Elika Beauty in Burnaby. Browse balayage,
      highlights, hair colour, keratin treatments, microblading, threading,
      massage, and facial services.
    </p>
  </div>
</section>

      {/* gallery */}

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        {/* categories */}

        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => pickCategory(cat)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                cat === category
                  ? "border-[#572a31] bg-[#572a31] text-white"
                  : "border-[#572a31]/20 text-[#572a31]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* grid */}

        {status === "loading" && <p>Loading...</p>}

        {status === "error" && <p>Gallery could not load.</p>}

        {status === "success" && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {filteredImages.map((item) => (
              <GalleryCard
                key={item._id}
                item={item}
                onOpen={setSelectedItem}
              />
            ))}
          </div>
        )}
      </section>

      {/* lightbox */}

      <GalleryLightbox
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </>
  );
}