import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";

const ADDRESS_LINE = "3790 Canada Way #102, Burnaby, BC V5G 1G4";

const MAPS_URL =
  "https://www.google.com/maps/place/ELIKA+BEAUTY+(Tangles+Hair+Design)/";

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
      telephone: PHONE_TEL,
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
    <div className="min-h-screen bg-white pb-14 pt-14 text-gray-800 sm:pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={heroImage ? `${SITE_ORIGIN}${heroImage.src}` : `${SITE_ORIGIN}/assets/salon.webp`} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={heroImage ? `${SITE_ORIGIN}${heroImage.src}` : `${SITE_ORIGIN}/assets/salon.webp`} />

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
            className="h-[260px] w-full object-cover object-[center_30%] sm:h-[360px] sm:object-center lg:h-[520px]"
            loading="eager"
          />
        ) : (
          <div className="h-[260px] w-full bg-[#d8c6b5] sm:h-[360px] lg:h-[520px]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-[#2e1118]/45 via-[#2e1118]/50 to-transparent" />

        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-6xl px-4   sm:bottom-0 sm:px-6 sm:pb-10">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/80 sm:text-xs">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-2 pb-16 max-w-3xl text-2xl font-theseason font-bold leading-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] leading-5 text-white/90 line-clamp-2 sm:mt-4 sm:line-clamp-none sm:text-base sm:leading-7">
            {intro ||
              `${title} at Elika Beauty in Burnaby. View pricing details, timing, and booking information.`}
          </p>

          <div className="mt-4 flex flex-row gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              to="/booking"
              className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-[#572a31] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#F8F7F1] sm:min-h-[46px] sm:px-6 sm:py-3"
            >
              Book
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex min-h-[38px] items-center justify-center rounded-xl border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:min-h-[46px] sm:px-6 sm:py-3"
            >
              Call
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[38px] items-center justify-center rounded-xl border border-white/40 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 sm:min-h-[46px] sm:px-6 sm:py-3"
            >
              Address
            </a>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-12">
        <div className="mb-6 sm:mb-8">
          <Link
            to="/services"
            className="inline-block text-sm text-[#572a31] underline underline-offset-4 transition hover:text-[#3D0007]"
          >
            ← Back to services
          </Link>
        </div>

        

        {galleryImages.length > 0 && (
          <section className="mt-8 sm:mt-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
                Gallery
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
                Examples of this service and finished results at Elika Beauty.
              </p>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className="group overflow-hidden rounded-[24px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                    <img
                      src={image.src}
                      alt={image.alt || `${title} at Elika Beauty`}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-2">
          <div className="rounded-[20px] border border-[#572a31]/10 bg-[#fcfaf8] p-2 sm:rounded-[24px] sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500">Starting price</div>
            <div className="mt-1 text-md text-[#3D0007] sm:mt-2 sm:text-2xl">
              {priceText || "Contact us"}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#572a31]/10 bg-[#fcfaf8] p-4 sm:rounded-[24px] sm:p-6">
            <div className="text-xs sm:text-sm text-gray-500">Appointment time</div>
            <div className="mt-1 text-md text-[#3D0007] sm:mt-2 sm:text-2xl">
              {durationText || "Varies"}
            </div>
          </div>

        </section>

        <section className="mt-6 rounded-[24px] bg-[#F8F7F1] p-5 sm:mt-16 sm:rounded-[28px] sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              What to expect
            </h2>

            <p className="mt-2 text-sm leading-5 text-gray-700 sm:text-base sm:leading-5">
              Every appointment starts with understanding your goals, service
              history, and the final result you want. We focus on clean
              execution, a polished finish, and guidance that helps you maintain
              your result.
            </p>
          </div>

          <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
            {finalBenefits.map((item, index) => (
              <li
                key={index}
                className="rounded-xl border border-[#572a31]/10 bg-white px-4 py-3 text-sm leading-6 text-gray-700 sm:text-base"
              >
                {item}
              </li>
            ))}
          </ul>

          {extraNote && (
            <div className="mt-5 rounded-xl border border-[#572a31]/10 bg-white p-4 text-sm leading-6 text-gray-700 sm:mt-6">
              {extraNote}
            </div>
          )}
        </section>

        <section className="mt-14 sm:mt-16">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            {finalFaq.map((item, index) => (
              <details
                key={index}
                className="rounded-2xl border bg-white p-4 sm:p-5"
              >
                <summary className="cursor-pointer pr-6 font-semibold leading-6">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[24px] bg-[#F8F7F1] p-5 sm:mt-16 sm:rounded-[28px] sm:p-8">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
            Related services
          </h2>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            {finalRelatedServices.map((service) => (
              <Link
                key={service.to}
                to={service.to}
                className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
              >
                {service.label}
              </Link>
            ))}
          </div>
        </section>

        {/* <section className="mt-14 rounded-[24px] border border-[#572a31]/15 bg-[#E7A45D]/20 p-5 text-center sm:mt-16 sm:rounded-[28px] sm:p-8">
          <h2 className="text-2xl font-theseason text-[#440008] sm:text-3xl">
            Ready to book?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#440008]/80 sm:text-base sm:leading-7">
            Book online, or contact us if you want help choosing the right service.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/booking"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#440008] px-6 py-3 text-sm font-medium text-[#F8F7F1] transition hover:opacity-90 sm:px-8"
            >
              ntment
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#572a31]/25 bg-white px-6 py-3 text-sm font-medium text-[#572a31] transition hover:border-[#572a31]/45 sm:px-8"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </section> */}
      </main>
    </div>
  );
}