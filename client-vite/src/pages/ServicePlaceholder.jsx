import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";

const ADDRESS_LINE = "3790 Canada Way #102, Burnaby, BC V5G 1G4";
const LOCATION_NOTE = "Edward Jones Plaza";
const PARKING_NOTE = "Plaza parking available • Pay parking on street";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${ADDRESS_LINE} Elika Beauty`);

export default function ServicePlaceholder({
  slug,
  title,
  intro,
  priceText,
  durationText,
  extraNote,
  benefits = [],
  faq = [],
    heroImage,
  galleryImages = [],
}) {
  const pageTitle = `${title} | Elika Beauty Burnaby`;
  const pageDescription =
    intro ||
    `${title} at Elika Beauty in Burnaby, BC. View starting price, appointment time, salon location, and book online or call ${PHONE_DISPLAY}.`;

  const pageUrl = `${SITE_ORIGIN}/${slug}`;

  const defaultBenefits = [
    "Personalized consultation based on your hair type and goals",
    "Professional service in a welcoming Burnaby salon",
    "Guidance on maintenance, timing, and aftercare",
  ];

  const finalBenefits = benefits.length ? benefits : defaultBenefits;

  const defaultFaq = [
    {
      q: `How much does ${title.toLowerCase()} cost?`,
      a: priceText
        ? `${title} starts at ${priceText}. Final price may vary depending on hair length, density, previous color, and the amount of work needed.`
        : `Pricing depends on hair length, thickness, and the work involved. Contact Elika Beauty for a personalized estimate.`,
    },
    {
      q: `How long does ${title.toLowerCase()} take?`,
      a: durationText
        ? `This service usually takes around ${durationText}. Timing can vary depending on your hair and your final goal.`
        : `Timing depends on your hair type, length, and desired result.`,
    },
    {
      q: `Do I need a consultation before booking?`,
      a: "If you are unsure which service to choose or want a major change, a consultation is strongly recommended.",
    },
  ];

  const finalFaq = faq.length ? faq : defaultFaq;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    serviceType: title,
    areaServed: {
      "@type": "City",
      name: "Burnaby",
    },
    provider: {
      "@type": "HairSalon",
      name: SITE_NAME,
      url: SITE_ORIGIN,
      telephone: PHONE_DISPLAY,
      address: {
        "@type": "PostalAddress",
        streetAddress: "3790 Canada Way #102",
        addressLocality: "Burnaby",
        addressRegion: "BC",
        postalCode: "V5G 1G4",
        addressCountry: "CA",
      },
    },
    url: pageUrl,
    description: pageDescription,
    offers: priceText
      ? {
          "@type": "Offer",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "CAD",
            description: `Starting price ${priceText}`,
          },
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${SITE_ORIGIN}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${SITE_ORIGIN}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: title,
        item: pageUrl,
      },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: finalFaq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 pb-16">
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

        <script type="application/ld+json">
          {JSON.stringify(serviceJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>

      <main className="mt-10 max-w-4xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            to="/services"
            className="text-sm text-[#55203d] underline underline-offset-4"
          >
            ← Back to services
          </Link>
        </nav>

        <section className="rounded-3xl border border-[#572a31]/10 bg-[#fcfaf8] p-6 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7b5b65]">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl font-theseason font-bold text-[#3D0007]">
            {title}
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-7 text-gray-700 max-w-3xl">
            {intro ||
              `${title} at Elika Beauty in Burnaby. We’re updating this page with full details, but you can already view starting price information, contact the salon, and book your appointment online.`}
          </p>
                  {heroImage && (
          <section className="mt-8">
            <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
              <img
                src={heroImage.src}
                alt={heroImage.alt || title}
                className="h-[260px] sm:h-[380px] w-full object-cover"
                loading="eager"
              />
            </div>
          </section>
        )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-[#572a31] text-[#F8F7F1] hover:opacity-90 transition"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-white text-[#572a31] border border-[#572a31]/20 hover:border-[#572a31] transition"
            >
              Call {PHONE_DISPLAY}
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-white text-[#572a31] border border-[#572a31]/20 hover:border-[#572a31] transition"
            >
              Get Directions
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Starting price</div>
            <div className="mt-2 text-xl font-semibold text-[#3D0007]">
              {priceText || "Contact us"}
            </div>
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Appointment time</div>
            <div className="mt-2 text-xl font-semibold text-[#3D0007]">
              {durationText || "Varies"}
            </div>
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Location</div>
            <div className="mt-2 text-base font-semibold text-[#3D0007]">
              Burnaby, BC
            </div>
            <div className="text-sm text-gray-600">{LOCATION_NOTE}</div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
              What to expect
            </h2>
                    {galleryImages.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
              Gallery
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-2xl border bg-white shadow-sm"
                >
                  <img
                    src={image.src}
                    alt={image.alt || `${title} at Elika Beauty`}
                    className="h-64 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

            <p className="mt-4 text-gray-700 leading-7">
              Every service starts with understanding your hair, your goals, and
              the result you want. We focus on a polished finish, practical
              maintenance advice, and a result that fits your lifestyle.
            </p>

            <ul className="mt-5 space-y-3 text-gray-700">
              {finalBenefits.map((item, index) => (
                <li key={index} className="flex gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#572a31]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {extraNote && (
              <div className="mt-5 rounded-xl bg-[#F8F7F1] border border-[#572a31]/10 p-4 text-sm text-gray-700">
                {extraNote}
              </div>
            )}
          </div>

          <aside className="rounded-2xl border p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-[#3D0007]">
              Visit Elika Beauty
            </h2>

            <div className="mt-4 space-y-3 text-sm text-gray-700">
              <div>
                <div className="font-semibold text-gray-900">Phone</div>
                <a href={`tel:${PHONE_TEL}`} className="underline underline-offset-4">
                  {PHONE_DISPLAY}
                </a>
              </div>

              <div>
                <div className="font-semibold text-gray-900">Address</div>
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  {ADDRESS_LINE}
                </a>
              </div>

              <div>
                <div className="font-semibold text-gray-900">Parking</div>
                <p>{PARKING_NOTE}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/booking"
                className="text-center rounded-xl px-5 py-3 bg-[#572a31] text-white hover:opacity-90 transition"
              >
                Book Online
              </Link>

              <Link
                to="/services"
                className="text-center rounded-xl px-5 py-3 border border-[#572a31]/20 text-[#572a31] hover:border-[#572a31] transition"
              >
                View All Services
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-2xl border p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            Frequently asked questions
          </h2>

          <div className="mt-5 space-y-4">
            {finalFaq.map((item, index) => (
              <details key={index} className="rounded-xl border p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  {item.q}
                </summary>
                <p className="mt-2 text-gray-700 leading-7">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-[#F8F7F1] p-6 shadow-sm">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            Related services
          </h2>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/highlights-burnaby" className="underline underline-offset-4">
              Highlights
            </Link>
            <Link to="/balayage-burnaby" className="underline underline-offset-4">
              Balayage
            </Link>
            <Link
              to="/keratin-treatment-burnaby"
              className="underline underline-offset-4"
            >
              Keratin Treatment
            </Link>
            <Link to="/womens-haircut-burnaby" className="underline underline-offset-4">
              Women’s Haircut
            </Link>
            <Link to="/mens-haircut-burnaby" className="underline underline-offset-4">
              Men’s Haircut
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}