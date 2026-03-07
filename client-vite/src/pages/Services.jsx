import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";

const MAPS_URL =
  "https://www.google.com/maps/place/ELIKA+BEAUTY+(Tangles+Hair+Design)/";



const BASE_COLOR_FROM = 70;

const services = [
  {
    title: "Hair Color",
    path: "/hair-color-burnaby",
    image: "/images/services/hair-color/hair-color-hero.webp",
    desc: "Customized hair color services including balayage, highlights, root color, and color refresh.",
    price: "From $120",
  },
  {
    title: "Highlights",
    path: "/highlights-burnaby",
    image: "/images/services/highlights/highlights-hero.webp",
    desc: "Lighter strands for dimension with custom toning.",
    price: "From $200",
    note: `Base color may be recommended (from $${BASE_COLOR_FROM}).`,
  },
  {
    title: "Balayage",
    path: "/balayage-burnaby",
    image: "/images/services/balayage/balayage-hero.webp",
    desc: "Soft, blended color that grows out beautifully with low maintenance.",
    price: "From $220",
    note: `Base color may be recommended (from $${BASE_COLOR_FROM}).`,
  },
  {
    title: "Keratin Treatment",
    path: "/keratin-treatment-burnaby",
    image: "/images/services/keratin/keratin-hero.webp",
    desc: "Smoother hair with reduced frizz and easier styling.",
    price: "From $250",
  },
  {
    title: "Perm",
    path: "/perm-burnaby",
    image: "/images/services/perm/perm-hero.webp",
    desc: "Curls or waves tailored to your hair type and desired shape.",
    price: "$120",
  },
  {
    title: "Women’s Haircut",
    path: "/womens-haircut-burnaby",
    image: "/images/services/haircutwoman/haircut-hero.webp",
    desc: "Professional haircut tailored to your face shape and lifestyle.",
    price: "From $45",
  },
  {
    title: "Men’s Haircut",
    path: "/mens-haircut-burnaby",
    image: "/images/services/haircutmen/haircut-hero.webp",
    desc: "Clean haircut with optional wash add-on.",
    price: "$25 • Wash + Cut $35",
  },
  {
    title: "Microblading",
    path: "/microblading-burnaby",
    image: "/images/services/microblading/microblading-hero.webp",
    desc: "PhiBrows microblading for fuller, natural-looking brows.",
    price: "From $350",
  },
  {
    title: "Threading",
    path: "/threading-burnaby",
    image: "/images/services/threading/threading-hero.webp",
    desc: "Precise eyebrow shaping and facial hair removal.",
    price: "From $15",
  },
  {
    title: "Relaxation, Body Massage",
    path: "/relaxation-body-massage-burnaby",
    image: "/images/services/massage/massage-hero.webp",
    desc: "Spa-style massage focused on relaxation, comfort, and stress relief.",
    price: "$90",
  },
  {
    title: "Facial Treatment",
    path: "/facial-treatment-burnaby",
    image: "/images/services/facial/facial-hero.webp",
    desc: "Deep cleansing facial with steam, mask, and hydrating skincare.",
    price: "$85",
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
    <div className="min-h-screen bg-white pb-14 text-gray-800 sm:pb-16 pt-14">
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

      <section className="relative w-full overflow-hidden">
        <img
          src="/images/services/services-hero.webp"
          alt="Beauty services at Elika Beauty in Burnaby"
          className="h-[260px] w-full object-cover sm:h-[360px] lg:h-[520px]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/80 via-[#2e1118]/35 to-transparent" />

<div className="absolute inset-x-0 bottom-6 mx-auto max-w-6xl px-4 sm:bottom-0 sm:px-6 sm:pb-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/80 sm:text-xs">
            Elika Beauty • Burnaby
          </p>

          <h1 className=" max-w-3xl text-2xl pb-8 font-theseason font-bold leading-tight text-white sm:mt-3 sm:text-4xl lg:text-5xl">
            Beauty Services in Burnaby
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
          <p className="pt-2 max-w-2xl text-sm leading-5 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
            Explore hair color, highlights, balayage, keratin treatments, perms,
            haircuts, microblading, threading, massage, and facial treatments at Elika Beauty.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12">
        <section>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              Choose a service
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              Browse service pages for pricing guidance, photos, and booking information.
            </p>
          </div>

          <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="group overflow-hidden rounded-[24px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-56 overflow-hidden sm:h-64 lg:h-72">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/80 via-[#2e1118]/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                    <h3 className="text-xl font-theseason leading-tight text-white sm:text-2xl">
                      {s.title}
                    </h3>
                  </div>
                </div>

                <div className="flex min-h-[168px] flex-col p-4 sm:min-h-[180px] sm:p-5">
                  <p className="text-sm leading-6 text-[#572a31]/80">
                    {s.desc}
                  </p>

                  <div className="mt-4 flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-[#3D0007]">
                      {s.price}
                    </p>

                    <span className="shrink-0 text-sm font-medium text-[#572a31] underline underline-offset-4">
                      View details
                    </span>
                  </div>

                  {s.note && (
                    <p className="mt-3 text-xs leading-5 text-gray-600">
                      {s.note}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-600">
            Prices are starting points where listed and may vary based on service complexity,
            hair length, thickness, previous work, and final goals.
          </p>
        </section>

        <section className="mt-14 rounded-[24px] bg-[#F8F7F1] p-5 sm:mt-16 sm:rounded-[28px] sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              Not sure what to book?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              The right service depends on your goals, maintenance level, and current hair or brow condition.
              If you are unsure, book the closest match or contact us for guidance.
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            <Link
              to="/hair-color-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Hair Color
            </Link>
            <Link
              to="/balayage-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Balayage
            </Link>
            <Link
              to="/highlights-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Highlights
            </Link>
            <Link
              to="/keratin-treatment-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Keratin
            </Link>
            <Link
              to="/microblading-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Microblading
            </Link>
            <Link
              to="/threading-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] transition hover:border-[#572a31]/35"
            >
              Threading
            </Link>
          </div>
        </section>

        <section className="mt-14 sm:mt-16">
          <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            <details className="rounded-2xl border bg-white p-4 sm:p-5">
              <summary className="cursor-pointer pr-6 font-semibold leading-6">
                Highlights vs balayage — what’s the difference?
              </summary>
              <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                Highlights are more structured and can create brighter contrast.
                Balayage is hand-painted for a softer, blended grow-out.
              </p>
            </details>

            <details className="rounded-2xl border bg-white p-4 sm:p-5">
              <summary className="cursor-pointer pr-6 font-semibold leading-6">
                Do you offer consultations?
              </summary>
              <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                Yes. If you are not sure what to book or want a major change,
                a consultation is recommended before the appointment.
              </p>
            </details>

            <details className="rounded-2xl border bg-white p-4 sm:p-5">
              <summary className="cursor-pointer pr-6 font-semibold leading-6">
                Do prices vary?
              </summary>
              <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
                Yes. Prices are starting points and may vary based on service
                complexity, hair length, thickness, previous work, and the final look you want.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-14 rounded-[24px] border border-[#572a31]/15 bg-[#E7A45D]/20 p-5 text-center sm:mt-16 sm:rounded-[28px] sm:p-8">
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