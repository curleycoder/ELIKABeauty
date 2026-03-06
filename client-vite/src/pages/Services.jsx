import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("3790 Canada Way #102, Burnaby, BC V5G 1G4 Elika Beauty");

const BASE_COLOR_FROM = 70;

const services = [
  {
    title: "Hair Color",
    path: "/hair-color-burnaby",
    image: "/images/services/hair-color/hair-color-hero.jpg",
    desc: "Customized hair color services including balayage, highlights, root color, and color refresh.",
    price: "From $120",
  },
  {
    title: "Highlights",
    path: "/highlights-burnaby",
    image: "/images/services/highlights/highlights-hero.jpg",
    desc: "Lighter strands for dimension with custom toning.",
    price: "From $200",
    note: `Base color may be recommended (from $${BASE_COLOR_FROM}).`,
  },
  {
    title: "Balayage",
    path: "/balayage-burnaby",
    image: "/images/services/balayage/balayage-hero.jpg",
    desc: "Soft, blended color that grows out beautifully with low maintenance.",
    price: "From $220",
    note: `Base color may be recommended (from $${BASE_COLOR_FROM}).`,
  },
  {
    title: "Keratin Treatment",
    path: "/keratin-treatment-burnaby",
    image: "/images/services/keratin/keratin-hero.jpg",
    desc: "Smoother hair with reduced frizz and easier styling.",
    price: "From $250",
  },
  {
    title: "Perm",
    path: "/perm-burnaby",
    image: "/images/services/perm/perm-hero.jpg",
    desc: "Curls or waves tailored to your hair type and desired shape.",
    price: "$120",
  },
  {
    title: "Women’s Haircut",
    path: "/womens-haircut-burnaby",
    image: "/images/services/haircutwoman/haircut-hero.jpg",
    desc: "Professional haircut tailored to your face shape and lifestyle.",
    price: "From $45",
  },
  {
    title: "Men’s Haircut",
    path: "/mens-haircut-burnaby",
    image: "/images/services/haircutmen/haircut-hero.jpg",
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
    image: "/images/services/threading/threading-hero.jpg",
    desc: "Precise eyebrow shaping and facial hair removal.",
    price: "From $15",
  },
{
  title: "Relaxation, Body Massage",
  path: "/relaxation-body-massage-burnaby",
  image: "/images/services/massage/massage-hero.jpg",
  desc: "Spa-style massage focused on relaxation, comfort, and stress relief.",
  price: "$90",
},
{
  title: "Facial Treatment",
  path: "/facial-treatment-burnaby",
  image: "/images/services/facial/facial-hero.jpg",
  desc: "Deep cleansing facial with steam, mask, and hydrating skincare.",
  price: "$85",
}
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

      <section className="relative w-full overflow-hidden">
        <img
          src="/images/services/services-hero.jpg"
          alt="Beauty services at Elika Beauty in Burnaby"
          className="h-[320px] sm:h-[420px] lg:h-[520px] w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/75 via-[#2e1118]/25 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 max-w-6xl mx-auto px-4 sm:px-6 pb-10">
          <p className="text-xs uppercase tracking-[0.18em] text-white/80">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl sm:text-4xl lg:text-5xl font-theseason font-bold text-white">
            Beauty Services in Burnaby
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-7 text-white/90">
            Explore hair color, highlights, balayage, keratin treatments, perms,
            haircuts, microblading, and threading at Elika Beauty.
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
        <section>
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] font-semibold">
              Choose a service
            </h2>
            <p className="mt-2 text-gray-600 leading-7">
              Browse service pages for pricing guidance, photos, and booking information.
            </p>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.path}
                to={s.path}
                className="group overflow-hidden rounded-[28px] border border-[#572a31]/15 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={s.image}
                    alt={s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/80 via-[#2e1118]/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-2xl font-theseason text-white">
                      {s.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-6 text-[#572a31]/80">
                    {s.desc}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#3D0007]">
                      {s.price}
                    </p>

                    <span className="text-sm font-medium text-[#572a31] underline underline-offset-4">
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

        <section className="mt-16 rounded-[28px] bg-[#F8F7F1] p-6 sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] font-semibold">
              Not sure what to book?
            </h2>

            <p className="mt-3 text-gray-700 leading-7">
              The right service depends on your goals, maintenance level, and current hair or brow condition.
              If you are unsure, book the closest match or contact us for guidance.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/hair-color-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Hair Color
            </Link>
            <Link
              to="/balayage-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Balayage
            </Link>
            <Link
              to="/highlights-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Highlights
            </Link>
            <Link
              to="/keratin-treatment-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Keratin
            </Link>
            <Link
              to="/microblading-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Microblading
            </Link>
            <Link
              to="/threading-burnaby"
              className="rounded-full border border-[#572a31]/15 px-4 py-2 text-sm text-[#572a31] hover:border-[#572a31]/35 transition"
            >
              Threading
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-theseason text-[#3D0007] font-semibold">
            FAQ
          </h2>

          <div className="mt-5 space-y-4">
            <details className="rounded-2xl border p-5 bg-white">
              <summary className="font-semibold cursor-pointer">
                Highlights vs balayage — what’s the difference?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Highlights are more structured and can create brighter contrast.
                Balayage is hand-painted for a softer, blended grow-out.
              </p>
            </details>

            <details className="rounded-2xl border p-5 bg-white">
              <summary className="font-semibold cursor-pointer">
                Do you offer consultations?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Yes. If you are not sure what to book or want a major change,
                a consultation is recommended before the appointment.
              </p>
            </details>

            <details className="rounded-2xl border p-5 bg-white">
              <summary className="font-semibold cursor-pointer">
                Do prices vary?
              </summary>
              <p className="mt-2 text-gray-700 leading-7">
                Yes. Prices are starting points and may vary based on service
                complexity, hair length, thickness, previous work, and the final look you want.
              </p>
            </details>
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