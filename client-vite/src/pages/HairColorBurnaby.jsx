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

export default function HairColorBurnaby() {
  const pageTitle = `Hair Color in Burnaby | Balayage, Highlights, Root Color & More | ${SITE_NAME}`;
  const pageDescription =
    "Professional hair color in Burnaby at Elika Beauty including balayage, highlights, root touch-ups, and color refresh services. Customized tones, consultation-first service, and healthy-looking results.";

  const pageUrl = `${SITE_ORIGIN}/hair-color-burnaby`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
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
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Hair Color in Burnaby",
    serviceType: "Hair coloring",
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
  };

  const breadcrumbSchema = {
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
        name: "Hair Color in Burnaby",
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What’s the difference between balayage and highlights?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Highlights are more structured and can create brighter contrast. Balayage is hand-painted for a softer, blended look and usually grows out more naturally with lower maintenance.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a consultation before hair color?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A consultation is recommended if you want a major change, have box dye, previous color, or want color correction. It helps plan timing, tone, and the right service selection.",
        },
      },
      {
        "@type": "Question",
        name: "How long does hair color take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Timing depends on hair length, thickness, and goals. Many color services include consultation, application, processing, toning, and finishing, so extra time is often needed.",
        },
      },
      {
        "@type": "Question",
        name: "Why is base color sometimes recommended?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some looks may require a base color for better coverage, tone balancing, or correction. If needed, it will be discussed during your consultation based on your hair goals.",
        },
      },
    ],
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

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <section className="relative w-full overflow-hidden">
        <img
          src="/images/services/hair-color/hair-color-hero.webp"
          alt="Professional hair color service at Elika Beauty in Burnaby"
          className="h-[260px] w-full object-cover object-[center_30%] sm:h-[360px] sm:object-center lg:h-[520px]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/80 via-[#2e1118]/35 to-transparent" />

        <div className="absolute inset-x-0 bottom-6 mx-auto max-w-6xl px-4 pb-4 sm:bottom-0 sm:px-6 sm:pb-10">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/80 sm:text-xs">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-2 max-w-3xl text-2xl font-theseason font-bold leading-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
            Hair Color in Burnaby
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
            Customized hair color services including balayage, highlights, root
            touch-ups, toners, glossing, and color refresh with healthy-looking,
            wearable results.
          </p>

          <div className="mt-4 flex flex-row gap-2 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-3">
            <Link
              to="/booking"
              className="inline-flex min-h-[38px] items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-medium text-[#572a31] transition hover:bg-[#F8F7F1] sm:min-h-[46px] sm:px-6 sm:py-3"
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

      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12">
        <div className="mb-6 sm:mb-8">
          <Link
            to="/services"
            className="inline-block text-sm text-[#572a31] underline underline-offset-4 transition hover:text-[#3D0007]"
          >
            ← Back to services
          </Link>
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[24px] border border-[#572a31]/10 bg-[#fcfaf8] p-5 sm:p-6">
            <div className="text-sm text-gray-500">Starting price</div>
            <div className="mt-2 text-xl font-semibold text-[#3D0007] sm:text-2xl">
              From $120
            </div>
          </div>

          <div className="rounded-[24px] border border-[#572a31]/10 bg-[#fcfaf8] p-5 sm:p-6">
            <div className="text-sm text-gray-500">Appointment time</div>
            <div className="mt-2 text-xl font-semibold text-[#3D0007] sm:text-2xl">
              Varies
            </div>
          </div>

          <div className="rounded-[24px] border border-[#572a31]/10 bg-[#fcfaf8] p-5 sm:p-6 sm:col-span-2 lg:col-span-1">
            <div className="text-sm text-gray-500">Location</div>
            <div className="mt-2 text-base font-semibold text-[#3D0007] sm:text-lg">
              {LOCATION_NOTE}
            </div>
            <div className="mt-1 text-sm text-gray-600">Burnaby, BC</div>
          </div>
        </section>

        <section className="mt-14 rounded-[24px] bg-[#F8F7F1] p-5 sm:mt-16 sm:rounded-[28px] sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              Hair color services we offer
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              Hair color is not one service. Different goals need different
              techniques. Some clients want soft dimension and low maintenance.
              Others want brighter contrast, gray coverage, or a cleaner tone.
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
            <article className="rounded-xl border border-[#572a31]/10 bg-white p-4">
              <h3 className="font-semibold text-[#3D0007]">Balayage</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                Soft, blended color with a more natural grow-out and lower
                maintenance feel.
              </p>
              <Link
                className="mt-3 inline-block text-sm text-[#572a31] underline underline-offset-4"
                to="/balayage-burnaby"
              >
                Balayage in Burnaby →
              </Link>
            </article>

            <article className="rounded-xl border border-[#572a31]/10 bg-white p-4">
              <h3 className="font-semibold text-[#3D0007]">Highlights</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                Structured brightness with dimension, contrast, and custom
                toning.
              </p>
              <Link
                className="mt-3 inline-block text-sm text-[#572a31] underline underline-offset-4"
                to="/highlights-burnaby"
              >
                Highlights in Burnaby →
              </Link>
            </article>

            <article className="rounded-xl border border-[#572a31]/10 bg-white p-4">
              <h3 className="font-semibold text-[#3D0007]">
                Root Color & Gray Coverage
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                Root touch-ups and coverage support with tone matching and
                cleaner regrowth.
              </p>
              <Link
                className="mt-3 inline-block text-sm text-[#572a31] underline underline-offset-4"
                to="/services"
              >
                View services →
              </Link>
            </article>

            <article className="rounded-xl border border-[#572a31]/10 bg-white p-4">
              <h3 className="font-semibold text-[#3D0007]">
                Toners & Color Refresh
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">
                Refine brassiness, adjust tone, and keep your color looking
                fresh and polished.
              </p>
              <Link
                className="mt-3 inline-block text-sm text-[#572a31] underline underline-offset-4"
                to="/booking"
              >
                Book consultation →
              </Link>
            </article>
          </div>
        </section>

        <section className="mt-14 grid gap-6 lg:grid-cols-[1.4fr_0.9fr] sm:mt-16">
          <div className="rounded-[24px] border border-[#572a31]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
              Choosing the right hair color service
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              If you want lower maintenance, balayage is often the better fit
              because the grow-out is softer. If you want brighter contrast and
              clearer placement, highlights may make more sense. If your main goal
              is gray coverage or cleaner regrowth, root color is usually the right
              direction.
            </p>

            <p className="mt-4 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              The best result depends on your current hair, past color history, the
              amount of maintenance you want, and how bold or soft you want the
              final look to be.
            </p>
          </div>

          <aside className="rounded-[24px] border border-[#572a31]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-xl font-semibold text-[#3D0007]">
              What to expect
            </h2>

            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#572a31]" />
                <span>Consultation to confirm tone, goals, and upkeep level</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#572a31]" />
                <span>Customized placement and formula based on hair history</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#572a31]" />
                <span>Toning and refinement for a wearable final result</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#572a31]" />
                <span>Care guidance to help protect shine and longevity</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl border border-[#572a31]/10 bg-[#F8F7F1] p-4 text-sm leading-6 text-gray-700">
              Major color changes, previous dye, box color, and corrective work
              often need more time and planning. A consultation is the smart
              starting point.
            </div>

            <div className="mt-6 rounded-xl border border-[#572a31]/10 bg-[#fcfaf8] p-4 text-sm leading-6 text-gray-700">
              <div className="font-semibold text-[#3D0007]">Parking</div>
              <div className="mt-1">{PARKING_NOTE}</div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/booking"
                className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#440008] px-6 py-3 text-sm font-medium text-[#F8F7F1] transition hover:opacity-90"
              >
                Book Now
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#572a31]/25 bg-white px-6 py-3 text-sm font-medium text-[#572a31] transition hover:border-[#572a31]/45"
              >
                Call Salon
              </a>
            </div>
          </aside>
        </section>

        <section className="mt-14 sm:mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              Gallery
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Examples of hair color results at Elika Beauty.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group overflow-hidden rounded-[24px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                <img
                  src="/images/services/hair-color/hair-color-1.webp"
                  alt="Balayage and hair color result at Elika Beauty"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="group overflow-hidden rounded-[24px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                <img
                  src="/images/services/hair-color/hair-color-2.webp"
                  alt="Highlighted hair color service in Burnaby"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="group overflow-hidden rounded-[24px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                <img
                  src="/images/services/hair-color/hair-color-3.webp"
                  alt="Professional custom hair color by Elika Beauty"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            <details className="rounded-2xl border bg-white p-4 sm:p-5">
              <summary className="cursor-pointer pr-6 font-semibold leading-6">
                What’s the difference between balayage and highlights?
              </summary>
              <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                Highlights are more structured and can create brighter contrast.
                Balayage is hand-painted for a softer, blended look and usually
                grows out more naturally with lower maintenance.
              </p>
            </details>

            <details className="rounded-2xl border bg-white p-4 sm:p-5">
              <summary className="cursor-pointer pr-6 font-semibold leading-6">
                Do I need a consultation before hair color?
              </summary>
              <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                A consultation is recommended if you want a major change, have
                box dye or previous color, or want color correction. It helps
                plan the right service, timing, and tone.
              </p>
            </details>

            <details className="rounded-2xl border bg-white p-4 sm:p-5">
              <summary className="cursor-pointer pr-6 font-semibold leading-6">
                How long does hair color take?
              </summary>
              <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                Timing depends on hair length, thickness, and goals. Many color
                services include consultation, application, processing, toning,
                and finishing, so plan extra time.
              </p>
            </details>

            <details className="rounded-2xl border bg-white p-4 sm:p-5">
              <summary className="cursor-pointer pr-6 font-semibold leading-6">
                Why is base color sometimes recommended?
              </summary>
              <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                Some looks may require a base color for coverage, tone
                balancing, or correction. If needed, it will be explained during
                the consultation.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-14 rounded-[24px] bg-[#F8F7F1] p-5 sm:mt-16 sm:rounded-[28px] sm:p-8">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
            Related services
          </h2>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            <Link
              to="/balayage-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Balayage in Burnaby
            </Link>
            <Link
              to="/highlights-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Highlights in Burnaby
            </Link>
            <Link
              to="/services"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              View all services
            </Link>
          </div>
        </section>

        <section className="mt-14 rounded-[24px] border border-[#572a31]/15 bg-[#E7A45D]/20 p-5 text-center sm:mt-16 sm:rounded-[28px] sm:p-8">
          <h2 className="text-2xl font-theseason text-[#440008] sm:text-3xl">
            Ready to book?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#440008]/80 sm:text-base sm:leading-7">
            Book online, or contact us if you want help choosing the right hair color service.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              to="/booking"
              className="inline-flex min-h-[46px] items-center justify-center rounded-full bg-[#440008] px-6 py-3 text-sm font-medium text-[#F8F7F1] transition hover:opacity-90 sm:px-8"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex min-h-[46px] items-center justify-center rounded-full border border-[#572a31]/25 bg-white px-6 py-3 text-sm font-medium text-[#572a31] transition hover:border-[#572a31]/45 sm:px-8"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}