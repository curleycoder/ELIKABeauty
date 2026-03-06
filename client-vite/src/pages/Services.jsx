import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";

const ADDRESS_LINE = "3790 Canada Way #102, Burnaby, BC V5G 1G4";
const LOCATION_NOTE = "Edward Jones Plaza";
const PARKING_NOTE = "Plaza parking available. Pay parking on street.";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("3790 Canada Way #102, Burnaby, BC V5G 1G4 Elika Beauty");

const BASE_COLOR_FROM = 70;

const services = [
  {
    title: "Highlights",
    path: "/highlights-burnaby",
    desc: "Lighter strands for dimension with custom toning.",
    price: "From $200",
    note: `Base color may be recommended (from $${BASE_COLOR_FROM}).`,
  },
  {
    title: "Balayage",
    path: "/balayage-burnaby",
    desc: "Soft, blended color that grows out beautifully with low maintenance.",
    price: "From $220",
    note: `Base color may be recommended (from $${BASE_COLOR_FROM}).`,
  },
  {
    title: "Keratin Treatment",
    path: "/keratin-treatment-burnaby",
    desc: "Smoother hair with reduced frizz and easier styling.",
    price: "From $250",
  },
  {
    title: "Perm",
    path: "/perm-burnaby",
    desc: "Curls or waves tailored to your hair type and desired shape.",
    price: "$120",
  },
  {
    title: "Women’s Haircut",
    path: "/womens-haircut-burnaby",
    desc: "Professional haircut tailored to your face shape and lifestyle.",
    price: "From $45",
  },
  {
    title: "Men’s Haircut",
    path: "/mens-haircut-burnaby",
    desc: "Clean haircut with optional wash add-on.",
    price: "$25 (Wash + Cut $35)",
  },
];

export default function Services() {
  const pageTitle = `Hair Services in Burnaby | ${SITE_NAME}`;
  const pageDescription =
    "Elika Beauty offers hair services in Burnaby including highlights, balayage, keratin treatments, perms, and haircuts for men and women. View starting prices and book online.";
  const pageUrl = `${SITE_ORIGIN}/services`;

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
        item: pageUrl,
      },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_ORIGIN}${service.path}`,
      name: service.title,
    })),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Highlights vs balayage — what’s the difference?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Highlights are more structured and can create brighter contrast. Balayage is hand-painted for a softer, blended result with lower maintenance grow-out.",
        },
      },
      {
        "@type": "Question",
        name: "Do you offer consultations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. If you are not sure what to book or you want a major change, a consultation is recommended so the service and timing can be planned properly.",
        },
      },
      {
        "@type": "Question",
        name: "Do prices vary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Prices are starting points and may vary based on hair length, thickness, previous color, and the amount of work needed.",
        },
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 pt-12 px-4 sm:px-6 pb-16">
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
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(itemListJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>

      <main className="mt-10 max-w-6xl mx-auto">
        <section className="rounded-3xl border border-[#572a31]/10 bg-[#fcfaf8] p-6 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7b5b65]">
            Elika Beauty • Burnaby, BC
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl font-theseason text-[#3D0007] font-bold">
            Hair Services in Burnaby
          </h1>

          <p className="mt-4 max-w-3xl text-base sm:text-lg leading-7 text-gray-700">
            Explore highlights, balayage, keratin treatments, perms, and
            haircuts for men and women at Elika Beauty. Prices below are starting
            points. Book online or call for help choosing the right service.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="px-6 py-3 rounded-xl bg-[#572a31] text-[#F8F7F1] hover:opacity-90 transition"
            >
              Book Now
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="px-6 py-3 rounded-xl border border-[#572a31]/30 text-[#572a31] hover:border-[#572a31] transition"
            >
              Call {PHONE_DISPLAY}
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-xl border border-[#572a31]/30 text-[#572a31] hover:border-[#572a31] transition"
            >
              Get Directions
            </a>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Phone</div>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-2 block text-lg font-semibold text-[#3D0007] underline underline-offset-4"
            >
              {PHONE_DISPLAY}
            </a>
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
            <div className="text-sm text-gray-600">{LOCATION_NOTE}</div>
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Parking</div>
            <div className="mt-2 text-base font-semibold text-[#3D0007]">
              Easy access
            </div>
            <div className="text-sm text-gray-600">{PARKING_NOTE}</div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] font-semibold">
                Choose a service
              </h2>
              <p className="mt-2 text-gray-600">
                Click into each service page for more details and booking help.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.path}
                className="rounded-2xl border p-5 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-theseason text-[#3D0007] font-semibold">
                  <Link to={s.path} className="hover:underline underline-offset-4">
                    {s.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-700">{s.desc}</p>

                <p className="mt-4 text-sm font-semibold text-[#3D0007]">
                  {s.price}
                </p>

                {s.note && (
                  <p className="mt-2 text-xs leading-5 text-gray-600">{s.note}</p>
                )}

                <div className="mt-5 flex items-center gap-4 text-sm">
                  <Link
                    className="underline underline-offset-4 text-[#572a31]"
                    to={s.path}
                  >
                    View details
                  </Link>
                  <Link
                    className="underline underline-offset-4 text-[#572a31]"
                    to="/booking"
                  >
                    Book
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            Prices are starting points and may vary based on hair length,
            thickness, previous color, and overall service complexity. For major
            changes or corrections, a consultation is recommended.
          </p>
        </section>

        <section className="mt-12 rounded-2xl border p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-theseason text-[#3D0007] font-semibold">
            Not sure what to book?
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-[#F8F7F1] p-4 border border-[#572a31]/10">
              <h3 className="font-semibold text-[#3D0007]">Color services</h3>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li>
                  New to color?{" "}
                  <Link className="underline" to="/highlights-burnaby">
                    Highlights
                  </Link>
                </li>
                <li>
                  Want softer grow-out?{" "}
                  <Link className="underline" to="/balayage-burnaby">
                    Balayage
                  </Link>
                </li>
                <li>
                  Need smoother hair?{" "}
                  <Link className="underline" to="/keratin-treatment-burnaby">
                    Keratin Treatment
                  </Link>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-[#F8F7F1] p-4 border border-[#572a31]/10">
              <h3 className="font-semibold text-[#3D0007]">Texture and cuts</h3>
              <ul className="mt-3 space-y-2 text-gray-700">
                <li>
                  Want curls or waves?{" "}
                  <Link className="underline" to="/perm-burnaby">
                    Perm
                  </Link>
                </li>
                <li>
                  Need a refresh?{" "}
                  <Link className="underline" to="/womens-haircut-burnaby">
                    Women’s Haircut
                  </Link>{" "}
                  /{" "}
                  <Link className="underline" to="/mens-haircut-burnaby">
                    Men’s Haircut
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl text-[#3D0007] font-theseason font-semibold">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Highlights vs balayage — what’s the difference?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Highlights are more structured and can create brighter contrast.
                Balayage is hand-painted for a softer, blended grow-out. If you
                want lower maintenance, balayage is often the better fit.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Why do some color services have add-ons like base color?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Some looks may require a base color for full coverage, tone
                balancing, or correction. If needed, this will be explained during
                the consultation. Base color starts at ${BASE_COLOR_FROM}.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                Do you offer consultations?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Yes. If you are not sure what to book or want a major change,
                start with a consultation so the right service and timing can be
                planned properly.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white shadow-sm">
              <summary className="font-semibold cursor-pointer">
                How long do appointments take?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Timing depends on your hair length, thickness, and goals. Color
                services usually take longer because they may include consultation,
                application, processing, toning, and finishing.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-gray-200 bg-[#F8F7F1] p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-[#572a31]">
                Looking for a hair salon in Burnaby?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-700 max-w-2xl">
                Elika Beauty offers personalized hair services in Burnaby,
                including color, texture, and haircut services for different hair
                types and goals.
              </p>

              <div className="mt-4 text-sm text-gray-700">
                <Link to="/hair-salon-burnaby" className="underline">
                  Full service hair salon in Burnaby
                </Link>{" "}
                •{" "}
                <Link to="/hair-color-burnaby" className="underline">
                  Hair color in Burnaby
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