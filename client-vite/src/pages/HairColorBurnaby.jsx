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

      <main className="mt-10 max-w-5xl mx-auto">
        <nav aria-label="Breadcrumb" className="mb-6">
          <Link
            to="/"
            className="text-sm text-[#55203d] underline underline-offset-4"
          >
            ← Back to home
          </Link>
        </nav>

        <section className="rounded-3xl border border-[#572a31]/10 bg-[#fcfaf8] p-6 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7b5b65]">
            Elika Beauty • Burnaby, BC
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl font-theseason font-bold text-[#3D0007]">
            Hair Color in Burnaby
          </h1>

          <p className="mt-4 max-w-3xl text-base sm:text-lg leading-7 text-gray-700">
            Looking for professional hair color in Burnaby? Elika Beauty offers
            customized color services designed around your hair history, tone
            goals, lifestyle, and maintenance level. From balayage and
            highlights to root color and glossing, the goal is healthy-looking,
            wearable color that suits you.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-[#572a31] text-[#F8F7F1] hover:opacity-90 transition"
            >
              Book Hair Color
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-[#572a31]/20 text-[#572a31] bg-white hover:border-[#572a31] transition"
            >
              Call {PHONE_DISPLAY}
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 border border-[#572a31]/20 text-[#572a31] bg-white hover:border-[#572a31] transition"
            >
              Get Directions
            </a>
          </div>
        </section>

        <section className="mt-8">
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <img
              src="/images/services/hair-color/hair-color-hero.jpg"
              alt="Professional hair color service at Elika Beauty in Burnaby"
              className="h-[260px] sm:h-[420px] w-full object-cover"
              loading="eager"
            />
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Location</div>
            <div className="mt-2 text-base font-semibold text-[#3D0007]">
              Burnaby, BC
            </div>
            <div className="text-sm text-gray-600">{LOCATION_NOTE}</div>
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Address</div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-2 block text-base font-semibold text-[#3D0007] underline underline-offset-4"
            >
              {ADDRESS_LINE}
            </a>
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Parking</div>
            <div className="mt-2 text-base font-semibold text-[#3D0007]">
              Easy access
            </div>
            <div className="text-sm text-gray-600">{PARKING_NOTE}</div>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-2xl border p-6 bg-white shadow-sm">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
              Hair color services we offer
            </h2>

            <p className="mt-4 text-gray-700 leading-7">
              Hair color is not one service. Different goals need different
              techniques. Some clients want soft dimension and low maintenance.
              Others want brighter contrast, gray coverage, or a cleaner tone.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border p-5 bg-[#fcfaf8]">
                <h3 className="font-semibold text-[#3D0007]">Balayage</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Soft, blended color with a more natural grow-out and lower
                  maintenance feel.
                </p>
                <Link
                  className="mt-3 inline-block underline text-sm text-[#572a31]"
                  to="/balayage-burnaby"
                >
                  Balayage in Burnaby →
                </Link>
              </article>

              <article className="rounded-2xl border p-5 bg-[#fcfaf8]">
                <h3 className="font-semibold text-[#3D0007]">Highlights</h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Structured brightness with dimension, contrast, and custom
                  toning.
                </p>
                <Link
                  className="mt-3 inline-block underline text-sm text-[#572a31]"
                  to="/highlights-burnaby"
                >
                  Highlights in Burnaby →
                </Link>
              </article>

              <article className="rounded-2xl border p-5 bg-[#fcfaf8]">
                <h3 className="font-semibold text-[#3D0007]">
                  Root Color & Gray Coverage
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Root touch-ups and coverage support with tone matching and
                  cleaner regrowth.
                </p>
                <Link
                  className="mt-3 inline-block underline text-sm text-[#572a31]"
                  to="/services"
                >
                  View services →
                </Link>
              </article>

              <article className="rounded-2xl border p-5 bg-[#fcfaf8]">
                <h3 className="font-semibold text-[#3D0007]">
                  Toners & Color Refresh
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  Refine brassiness, adjust tone, and keep your color looking
                  fresh and polished.
                </p>
                <Link
                  className="mt-3 inline-block underline text-sm text-[#572a31]"
                  to="/booking"
                >
                  Book consultation →
                </Link>
              </article>
            </div>
          </div>

          <aside className="rounded-2xl border p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold text-[#3D0007]">
              What to expect
            </h2>

            <ul className="mt-4 space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#572a31]" />
                <span>Consultation to confirm tone, goals, and upkeep level</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#572a31]" />
                <span>Customized placement and formula based on hair history</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#572a31]" />
                <span>Toning and refinement for a wearable final result</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#572a31]" />
                <span>Care guidance to help protect shine and longevity</span>
              </li>
            </ul>

            <div className="mt-6 rounded-xl bg-[#F8F7F1] border border-[#572a31]/10 p-4 text-sm text-gray-700">
              Major color changes, previous dye, box color, and corrective work
              often need more time and planning. A consultation is the smart
              starting point.
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                to="/booking"
                className="text-center rounded-xl px-5 py-3 bg-[#572a31] text-white hover:opacity-90 transition"
              >
                Book Now
              </Link>
              <a
                href={`tel:${PHONE_TEL}`}
                className="text-center rounded-xl px-5 py-3 border border-[#572a31]/20 text-[#572a31] hover:border-[#572a31] transition"
              >
                Call Salon
              </a>
            </div>
          </aside>
        </section>

        <section className="mt-10 rounded-2xl border p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            Choosing the right hair color service
          </h2>

          <p className="mt-4 text-gray-700 leading-7">
            If you want lower maintenance, balayage is often the better fit
            because the grow-out is softer. If you want brighter contrast and
            clearer placement, highlights may make more sense. If your main goal
            is gray coverage or cleaner regrowth, root color is usually the right
            direction.
          </p>

          <p className="mt-4 text-gray-700 leading-7">
            The best result depends on your current hair, past color history, the
            amount of maintenance you want, and how bold or soft you want the
            final look to be.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            Gallery
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <img
                src="/images/services/hair-color/hair-color-1.jpg"
                alt="Balayage and hair color result at Elika Beauty"
                className="h-64 w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <img
                src="/images/services/hair-color/hair-color-2.jpg"
                alt="Highlighted hair color service in Burnaby"
                className="h-64 w-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <img
                src="/images/services/hair-color/hair-color-3.jpg"
                alt="Professional custom hair color by Elika Beauty"
                className="h-64 w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                What’s the difference between balayage and highlights?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Highlights are more structured and can create brighter contrast.
                Balayage is hand-painted for a softer, blended look and usually
                grows out more naturally with lower maintenance.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Do I need a consultation before hair color?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                A consultation is recommended if you want a major change, have
                box dye or previous color, or want color correction. It helps
                plan the right service, timing, and tone.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                How long does hair color take?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Timing depends on hair length, thickness, and goals. Many color
                services include consultation, application, processing, toning,
                and finishing, so plan extra time.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Why is base color sometimes recommended?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Some looks may require a base color for coverage, tone
                balancing, or correction. If needed, it will be explained during
                the consultation.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-[#F8F7F1] p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-[#572a31]">
                Explore related color pages
              </h2>

              <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#572a31]">
                <Link className="underline underline-offset-4" to="/balayage-burnaby">
                  Balayage in Burnaby
                </Link>
                <Link className="underline underline-offset-4" to="/highlights-burnaby">
                  Highlights in Burnaby
                </Link>
                <Link className="underline underline-offset-4" to="/hair-salon-burnaby">
                  Hair Salon in Burnaby
                </Link>
                <Link className="underline underline-offset-4" to="/services">
                  View all services
                </Link>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                to="/booking"
                className="text-center px-6 py-3 rounded-xl bg-[#572a31] text-white hover:bg-[#6d3640] transition-all duration-200 shadow-sm"
              >
                Book Appointment
              </Link>

              <a
                href={`tel:${PHONE_TEL}`}
                className="text-center px-6 py-3 rounded-xl border border-[#572a31]/40 text-[#572a31] hover:bg-[#572a31]/5 transition-all duration-200"
              >
                Call Now
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}