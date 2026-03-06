import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";

const ADDRESS_LINE = "3790 Canada Way #102, Burnaby, BC V5G 1G4";
const LOCATION_NOTE = "Edward Jones Plaza";

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
  relatedServices = [],
}) {
  const pageTitle = `${title} | Elika Beauty Burnaby`;
  const pageDescription =
    intro ||
    `${title} at Elika Beauty in Burnaby, BC. View pricing, appointment time, and book online or call ${PHONE_DISPLAY}.`;

  const pageUrl = `${SITE_ORIGIN}/${slug}`;

  const defaultBenefits = [
    "Personalized consultation based on your goals",
    "Professional service in a welcoming Burnaby salon",
    "Guidance on maintenance, timing, and aftercare",
  ];

  const finalBenefits = benefits.length ? benefits : defaultBenefits;

  const defaultFaq = [
    {
      q: `How much does ${title.toLowerCase()} cost?`,
      a: priceText
        ? `${title} starts at ${priceText}. Final price may vary depending on the work involved and your specific service needs.`
        : `Pricing depends on the work involved. Contact Elika Beauty for a personalized estimate.`,
    },
    {
      q: `How long does ${title.toLowerCase()} take?`,
      a: durationText
        ? `This service usually takes around ${durationText}. Timing can vary depending on your needs and final goal.`
        : `Timing depends on the service and the final result you want.`,
    },
    {
      q: "Do I need a consultation before booking?",
      a: "If you are unsure which service to choose or want a major change, a consultation is recommended before the appointment.",
    },
  ];

  const finalFaq = faq.length ? faq : defaultFaq;

  const defaultRelatedServices = [
    { to: "/services", label: "All Services" },
    { to: "/hair-color-burnaby", label: "Hair Color" },
    { to: "/balayage-burnaby", label: "Balayage" },
    { to: "/highlights-burnaby", label: "Highlights" },
    { to: "/keratin-treatment-burnaby", label: "Keratin" },
    { to: "/microblading-burnaby", label: "Microblading" },
    { to: "/threading-burnaby", label: "Threading" },
  ];

  const finalRelatedServices = relatedServices.length
    ? relatedServices
    : defaultRelatedServices;

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
    <div className="min-h-screen bg-white text-gray-800 pb-16">
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

      <section className="relative w-full overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage.src}
            alt={heroImage.alt || title}
            className="h-[320px] sm:h-[420px] lg:h-[520px] w-full object-cover"
            loading="eager"
          />
        ) : (
          <div className="h-[320px] sm:h-[420px] lg:h-[520px] w-full bg-[#d8c6b5]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/75 via-[#2e1118]/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <Link
            to="/services"
            className="inline-block text-sm text-white/85 underline underline-offset-4 hover:text-white transition"
          >
            ← Back to services
          </Link>

          <p className="mt-5 text-xs uppercase tracking-[0.18em] text-white/80">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-theseason font-bold text-white">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-white/90">
            {intro ||
              `${title} at Elika Beauty in Burnaby. View pricing details, timing, and booking information.`}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-white text-[#572a31] hover:bg-[#F8F7F1] transition"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-white/40 text-white hover:bg-white/10 transition"
            >
              Call {PHONE_DISPLAY}
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-white/40 text-white hover:bg-white/10 transition"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border p-5 bg-[#fcfaf8]">
            <div className="text-sm text-gray-500">Starting price</div>
            <div className="mt-2 text-xl font-semibold text-[#3D0007]">
              {priceText || "Contact us"}
            </div>
          </div>

          <div className="rounded-2xl border p-5 bg-[#fcfaf8]">
            <div className="text-sm text-gray-500">Appointment time</div>
            <div className="mt-2 text-xl font-semibold text-[#3D0007]">
              {durationText || "Varies"}
            </div>
          </div>

          <div className="rounded-2xl border p-5 bg-[#fcfaf8]">
            <div className="text-sm text-gray-500">Location</div>
            <div className="mt-2 text-base font-semibold text-[#3D0007]">
              {LOCATION_NOTE}
            </div>
            <div className="text-sm text-gray-600">Burnaby, BC</div>
          </div>
        </section>

        {galleryImages.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] font-semibold">
              Gallery
            </h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-[28px] border border-[#572a31]/15 bg-white shadow-sm"
                >
                  <img
                    src={image.src}
                    alt={image.alt || `${title} at Elika Beauty`}
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 rounded-[28px] bg-[#F8F7F1] p-6 sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] font-semibold">
              What to expect
            </h2>

            <p className="mt-3 text-gray-700 leading-7">
              Every appointment starts with understanding your goals, service
              history, and the final result you want. We focus on clean
              execution, a polished finish, and guidance that helps you maintain
              your result.
            </p>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {finalBenefits.map((item, index) => (
              <li
                key={index}
                className="rounded-xl border border-[#572a31]/10 bg-white px-4 py-3 text-gray-700"
              >
                {item}
              </li>
            ))}
          </ul>

          {extraNote && (
            <div className="mt-6 rounded-xl border border-[#572a31]/10 bg-white p-4 text-sm text-gray-700">
              {extraNote}
            </div>
          )}
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-theseason text-[#3D0007] font-semibold">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            {finalFaq.map((item, index) => (
              <details key={index} className="rounded-2xl border p-5 bg-white">
                <summary className="font-semibold cursor-pointer">
                  {item.q}
                </summary>
                <p className="mt-2 text-gray-700 leading-7">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[28px] bg-[#F8F7F1] p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] font-semibold">
            Related services
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {finalRelatedServices.map((service) => (
              <Link
                key={service.to}
                to={service.to}
                className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
              >
                {service.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[28px] border border-[#572a31]/15 bg-[#E7A45D]/20 p-6 sm:p-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-theseason text-[#440008]">
            Ready to book?
          </h2>

          <p className="mt-3 max-w-2xl mx-auto text-[#440008]/80 leading-7">
            Book online, or contact us if you want help choosing the right service.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/booking"
              className="rounded-full px-8 py-3 bg-[#440008] text-[#F8F7F1] hover:opacity-90 transition"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-full px-8 py-3 bg-white text-[#572a31] border border-[#572a31]/25 hover:border-[#572a31]/45 transition"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}