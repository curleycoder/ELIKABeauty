import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";
const CONTACT_EMAIL = "beautyshohrestudio@gmail.com"; // change to your Elika email when ready

export default function Product() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    document.title = `Professional Hair Care | ${SITE_NAME} (Burnaby)`;

    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();

    meta.setAttribute(
      "content",
      `Curated, stylist-approved professional hair care at ${SITE_NAME} in Burnaby. Online shop launching soon. Get notified when items restock.`
    );
  }, []);

  useEffect(() => {
    axios
      .get("/products.json")
      .then((res) => setProducts(res.data || []))
      .catch((err) => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  const allUnavailable = useMemo(() => {
    if (!products || products.length === 0) return true;
    return products.every((p) => p?.available === false || p?.stock === 0);
  }, [products]);

  const jsonLd = useMemo(() => {
    const items = (products || []).slice(0, 12).map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_ORIGIN}/product`,
      name: p?.name || "Hair Product",
    }));

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: items,
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 mb-16 pb-16">
      <div className="text-center mb-6 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl text-purplecolor mb-2">
            Professional Hair Care
        </h1>

        <p className="text-sm text-gray-600">
          Curated, stylist-approved products. Online shop launching soon.
        </p>

        <div className="mt-4 flex items-center justify-center gap-3 flex-wrap">
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Notify%20me%20when%20products%20are%20in%20stock&body=Hi%20Elika%20Beauty%2C%0A%0APlease%20notify%20me%20when%20products%20are%20available.%0A%0AName%3A%0APhone%3A%0AInterested%20in%3A%20(anti-yellow%20shampoo%2C%20keratin-safe%2C%20moisture%20treatments%2C%20...)`}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-purplecolor text-white text-sm font-semibold shadow hover:brightness-110"
          >
            Get Notified
          </a>

          <button
            onClick={() => setShowInfo((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white border border-purplecolor/30 text-purplecolor text-sm font-semibold shadow hover:bg-purplecolor/5"
            aria-expanded={showInfo}
          >
            {showInfo ? "Hide details" : "Learn more"}
          </button>
        </div>
      </div>

      <section
        className={`max-w-4xl mx-auto transition-all duration-300 ${
          showInfo ? "mb-8 opacity-100 max-h-[2000px]" : "mb-2 opacity-0 max-h-0 overflow-hidden"
        }`}
        aria-hidden={!showInfo}
      >
        <div className="space-y-6 text-gray-700 leading-relaxed bg-white/70 rounded-2xl p-5 sm:p-7 shadow-sm border border-purplecolor/10">
          <p>
            At <strong>{SITE_NAME}</strong> in Burnaby, we hand-pick{" "}
            <em>professional hair care</em> that helps maintain colour, supports blonding services,
            and protects keratin results. Each item is stylist-tested and chosen for performance and
            hair health.
          </p>

          <h2 className="text-xl font-semibold text-purplecolor">Why Salon-Quality?</h2>
          <p>
            Pro formulas are concentrated and targeted, so you use less and see better results—especially
            for <em>highlights, balayage,</em> or <em>keratin</em>. They help maintain tone, reduce damage,
            and keep hair shiny between visits.
          </p>

          <h2 className="text-xl font-semibold text-purplecolor">Client Favorites</h2>
          <p>
            Our most-requested picks include <strong>Argan Oil</strong> for dry hair,{" "}
            <strong>colour-safe shampoo and conditioner</strong> to help colour last longer, and{" "}
            <strong>deep moisture masks</strong> for colour-treated hair. Not sure what you need?
            Ask at your appointment—we’ll match products to your hair.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-purplecolor/10 shadow overflow-hidden"
              >
                <div className="w-full h-48 bg-gray-200 animate-pulse rounded-xl mb-4" />
                <div className="h-4 w-2/3 bg-gray-200 animate-pulse rounded mb-2" />
                <div className="h-3 w-full bg-gray-200 animate-pulse rounded mb-1" />
                <div className="h-3 w-5/6 bg-gray-200 animate-pulse rounded mb-3" />
                <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : allUnavailable ? (
          <div className="text-center bg-white/70 border border-purplecolor/10 rounded-2xl p-10 shadow">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-purplecolor/10 flex items-center justify-center">
              <span className="text-purplecolor text-2xl">🛍️</span>
            </div>
            <h3 className="text-xl font-semibold text-purplecolor mb-2">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Our online shelves are getting ready. Products will appear here as soon as they’re in stock.
              Tap <span className="font-semibold">Get Notified</span> above and we’ll email you when they arrive.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((product) => {
              const unavailable = product?.available === false || product?.stock === 0;

              return (
                <div
                  key={product._id}
                  className="group bg-white rounded-2xl shadow transition duration-300 p-4 border border-purplecolor/20 relative overflow-hidden"
                >
                  {unavailable && (
                    <span className="absolute top-3 right-3 text-[11px] uppercase tracking-wide bg-gray-900/80 text-white px-2 py-1 rounded-full">
                      Out of stock
                    </span>
                  )}

                  <div className="h-56 sm:h-64 flex items-center justify-center bg-white rounded-xl mb-4 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="max-h-full max-w-full object-contain object-center"
                    />
                  </div>

                  <h2 className="text-lg font-semibold text-purplecolor line-clamp-2">
                    {product.name}
                  </h2>

                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold">
                      {typeof product.price === "number" ? `$${product.price}` : ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
