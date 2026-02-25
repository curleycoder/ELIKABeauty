import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

export default function ServicePlaceholder({
  slug,
  title,
  intro,
  priceText,
  durationText,
  extraNote,
}) {
  const pageTitle = `${title} | ${SITE_NAME}`;
  const pageDescription =
    intro ||
    `${title} in Burnaby at Elika Beauty. View details and book online or call (604) 438-3727.`;

  const pageUrl = `${SITE_ORIGIN}/${slug}`;

  // Basic Service schema (safe even as a placeholder)
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    areaServed: "Burnaby, BC",
    provider: { "@type": "LocalBusiness", name: SITE_NAME, url: SITE_ORIGIN },
    url: pageUrl,
    description: pageDescription,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE_ORIGIN}/services` },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={`${title}, Burnaby, Elika Beauty, hair salon Burnaby, beauty salon Burnaby`}
        />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />

        <script type="application/ld+json">{JSON.stringify(serviceJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="mt-12 max-w-3xl mx-auto">
        <Link to="/services" className="text-[#55203d] underline">
          ← Back to services
        </Link>

        <h1 className="mt-4 text-3xl text-center font-theseason font-bold text-[#3D0007]">{title}</h1>

        <div className="mt-5 rounded-xl border p-5 space-y-2">
          {priceText && (
            <div className="text-base">
              <span className="font-semibold">Starting price:</span> {priceText}
            </div>
          )}
          {durationText && (
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Approx. time:</span> {durationText}
            </div>
          )}
          {extraNote && <div className="text-sm text-gray-700">{extraNote}</div>}
        </div>

        <p className="mt-6 text-base leading-relaxed">
          {intro ||
            "This page is being updated with full details, pricing guidance, and before/after examples. For now, you can book online or call us for a quick consultation."}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/booking"
            className="inline-block rounded-lg px-6 py-3 bg-[#572a31] text-[#F8F7F1] hover:opacity-90 transition"
          >
            Book Appointment
          </Link>

          <a
            href="tel:+16044383727"
            className="inline-block rounded-lg px-6 py-3 bg-[#F8F7F1] text-[#572a31] border border-[#572a31]/30 hover:border-[#572a31] transition"
          >
            Call (604) 438-3727
          </a>
        </div>

        <div className="mt-10 rounded-xl border p-5">
          <div className="font-semibold">Location</div>
          <div className="mt-2 text-gray-700">
            3790 Canada Way #102, Burnaby, BC V5G 1G4 (Edward Jones Plaza)
          </div>
          <div className="text-gray-600 mt-1">
            Plaza parking available • Pay parking on street
          </div>
        </div>
      </div>
    </div>
  );
}