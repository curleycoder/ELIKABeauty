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

const BASE_COLOR_FROM = 70;

const services = [
  {
    title: "Hair Color",
    path: "/hair-color-burnaby",
    desc: "Customized hair color services including balayage, highlights, root color, and color refresh.",
    price: "Consultation / Varies",
  },
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
    price: "$25 • Wash + Cut $35",
  },
  {
    title: "Microblading",
    path: "/microblading-burnaby",
    desc: "Semi-permanent brow enhancement for fuller, more defined eyebrows.",
    price: "Contact for pricing",
  },
];

export default function Services() {
  const pageTitle = `Beauty Services in Burnaby | ${SITE_NAME}`;
  const pageDescription =
    "Elika Beauty offers beauty services in Burnaby including hair color, highlights, balayage, keratin treatments, perms, haircuts, microblading, and threading. View services and book online.";
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
          text: "Yes. If you are not sure what to book or want a major change, a consultation is recommended so the service and timing can be planned properly.",
        },
      },
      {
        "@type": "Question",
        name: "Do prices vary?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Prices are starting points and may vary based on service complexity, hair length, thickness, previous color, and the work needed.",
        },
      },
    ],
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
          {JSON.stringify(breadcrumbJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(itemListJsonLd)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqJsonLd)}
        </script>
      </Helmet>

      <section className="w-full">
        <div className="overflow-hidden">
          <img
            src="/images/services/services-hero.jpg"
            alt="Beauty services at Elika Beauty in Burnaby"
            className="h-[280px] sm:h-[380px] lg:h-[460px] w-full object-cover"
            loading="eager"
          />
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <section className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7b5b65]">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-theseason font-bold text-[#3D0007]">
            Beauty Services in Burnaby
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-7 text-gray-700">
            Explore hair color, highlights, balayage, keratin treatments, perms,
            haircuts, microblading, and threading at Elika Beauty. Browse each
            service page for details, pricing guidance, and booking information.
          </p>

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

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border p-5 bg-[#fcfaf8]">
            <div className="text-sm text-gray-500">Phone</div>
            <a
              href={`tel:${PHONE_TEL}`}
              className="mt-2 block text-lg font-semibold text-[#3D0007] underline underline-offset-4"
            >
              {PHONE_DISPLAY}
            </a>
          </div>

          <div className="rounded-2xl border p-5 bg-[#fcfaf8]">
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

          <div className="rounded-2xl border p-5 bg-[#fcfaf8]">
            <div className="text-sm text-gray-500">Parking</div>
            <div className="mt-2 text-base font-semibold text-[#3D0007]">
              Easy access
            </div>
            <div className="text-sm text-gray-600">{PARKING_NOTE}</div>
          </div>
        </section>

        <section className="mt-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] font-semibold">
              Choose a service
            </h2>
            <p className="mt-2 text-gray-600">
              Click into each page for more details, photos, and booking help.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.path}
                className="rounded-2xl border p-5 bg-white hover:shadow-sm transition"
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
            Prices are starting points where listed and may vary based on hair
            length, thickness, previous work, and overall service complexity.
            For major changes or corrective work, a consultation is recommended.
          </p>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border p-6 bg-white">
            <h2 className="text-2xl font-theseason text-[#3D0007] font-semibold">
              Not sure what to book?
            </h2>

            <p className="mt-4 text-gray-700 leading-7">
              The right service depends on your goals, maintenance level, hair
              history, and the result you want. If you are unsure, start with
              the closest match and use a consultation to confirm the best plan.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-[#F8F7F1] p-4 border border-[#572a31]/10">
                <h3 className="font-semibold text-[#3D0007]">Hair and color</h3>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li>
                    Want full color guidance?{" "}
                    <Link className="underline" to="/hair-color-burnaby">
                      Hair Color
                    </Link>
                  </li>
                  <li>
                    Want softer grow-out?{" "}
                    <Link className="underline" to="/balayage-burnaby">
                      Balayage
                    </Link>
                  </li>
                  <li>
                    Want brighter contrast?{" "}
                    <Link className="underline" to="/highlights-burnaby">
                      Highlights
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
                <h3 className="font-semibold text-[#3D0007]">Cuts and beauty</h3>
                <ul className="mt-3 space-y-2 text-gray-700">
                  <li>
                    Want curls or waves?{" "}
                    <Link className="underline" to="/perm-burnaby">
                      Perm
                    </Link>
                  </li>
                  <li>
                    Need a haircut?{" "}
                    <Link className="underline" to="/womens-haircut-burnaby">
                      Women’s Haircut
                    </Link>{" "}
                    /{" "}
                    <Link className="underline" to="/mens-haircut-burnaby">
                      Men’s Haircut
                    </Link>
                  </li>
                  <li>
                    Want fuller brows?{" "}
                    <Link className="underline" to="/microblading-burnaby">
                      Microblading
                    </Link>
                  </li>
                  <li>
                    Need clean shaping?{" "}
                    <Link className="underline" to="/threading-burnaby">
                      Threading
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border p-6 bg-[#fcfaf8]">
            <h2 className="text-xl font-semibold text-[#3D0007]">
              Visit Elika Beauty
            </h2>

            <div className="mt-4 space-y-4 text-sm text-gray-700">
              <div>
                <div className="font-semibold text-gray-900">Phone</div>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="underline underline-offset-4"
                >
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
                to="/hair-salon-burnaby"
                className="text-center rounded-xl px-5 py-3 border border-[#572a31]/20 text-[#572a31] hover:border-[#572a31] transition"
              >
                View Salon Page
              </Link>
            </div>
          </aside>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-theseason text-[#3D0007] font-semibold">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            <details className="rounded-xl border p-4 bg-white">
              <summary className="font-semibold cursor-pointer">
                Highlights vs balayage — what’s the difference?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Highlights are more structured and can create brighter contrast.
                Balayage is hand-painted for a softer, blended grow-out. If you
                want lower maintenance, balayage is often the better fit.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white">
              <summary className="font-semibold cursor-pointer">
                Why do some color services have add-ons like base color?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Some looks may require a base color for coverage, tone
                balancing, or correction. If needed, this will be explained
                during the consultation. Base color starts at ${BASE_COLOR_FROM}.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white">
              <summary className="font-semibold cursor-pointer">
                Do you offer consultations?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Yes. If you are not sure what to book or want a major change,
                start with a consultation so the right service and timing can be
                planned properly.
              </p>
            </details>

            <details className="rounded-xl border p-4 bg-white">
              <summary className="font-semibold cursor-pointer">
                How long do appointments take?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Timing depends on the service, your hair, and the final result
                you want. Some services need more time because they include
                consultation, processing, toning, shaping, or finishing.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-gray-200 bg-[#F8F7F1] p-6">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            Explore related pages
          </h2>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link
              to="/hair-salon-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Hair Salon in Burnaby
            </Link>
            <Link
              to="/hair-color-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Hair Color in Burnaby
            </Link>
            <Link
              to="/balayage-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Balayage
            </Link>
            <Link
              to="/highlights-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Highlights
            </Link>
            <Link
              to="/booking"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Book Appointment
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}