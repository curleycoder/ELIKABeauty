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

// Add-on info (from your DB seed)
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
  const pageTitle = `Services in Burnaby | ${SITE_NAME}`;
  const pageDescription =
    "Elika Beauty in Burnaby offers highlights, balayage, keratin treatments, perms, and haircuts for men and women. View services, starting prices, and book online.";
  const pageUrl = `${SITE_ORIGIN}/services`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
      { "@type": "ListItem", position: 2, name: "Services", item: pageUrl },
    ],
  };

  return (
    <div className="bg-white min-h-screen text-gray-800 pt-12 px-2 sm:px-2 pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="beauty salon Burnaby, hair salon Burnaby, balayage Burnaby, highlights Burnaby, keratin treatment Burnaby, perm Burnaby, women's haircut Burnaby, men's haircut Burnaby, Elika Beauty"
        />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />

        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <div className="mt-12 max-w-3xl mx-auto">
        {/* Optional: if you want a back link style like article pages */}
        <div className="text-center mb-10 max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-theseason text-[#3D0007] mb-2">
               Beauty,  Hair Services in Burnaby
            </h1>
            <p className="text-sm text-gray-600">
          Highlights, balayage, keratin treatments, perms, and haircuts for men & women.
            </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/booking"
            className="px-5 py-3 rounded-xl bg-[#572a31] text-[#F8F7F1] hover:opacity-90 transition"
          >
            Book Now
          </Link>

          <a
            href={`tel:${PHONE_TEL}`}
            className="px-5 py-3 rounded-xl border border-[#572a31]/30 hover:border-[#572a31] transition"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>

        {/* Phone + Address card (Article-style page, but keep your card UI) */}
        <div className="mt-6 rounded-xl border p-4 text-sm text-gray-700 space-y-1">
          <div>
            <a className="underline" href={`tel:${PHONE_TEL}`}>
              {PHONE_DISPLAY}
            </a>
          </div>

          <div>
            <a className="underline" href={MAPS_URL} target="_blank" rel="noreferrer">
              {ADDRESS_LINE}
            </a>
            <span className="text-gray-600"> • {LOCATION_NOTE}</span>
          </div>

          <div className="text-gray-600">{PARKING_NOTE}</div>
        </div>

        {/* SERVICES GRID */}
        <section className="mt-10">
          <h2 className="text-2xl font-theseason text-[#3D0007] font-semibold">Choose a service</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {services.map((s) => (
              <div key={s.path} className="rounded-2xl border p-5">
                <h3 className="text-lg font-theseason text-[#3D0007] font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{s.desc}</p>

                <p className="mt-3 text-sm font-semibold">{s.price}</p>
                {s.note && <p className="mt-2 text-xs text-gray-600">{s.note}</p>}

                <div className="mt-4 flex items-center gap-3">
                  <Link className="underline" to={s.path}>
                    View details
                  </Link>
                  <Link className="underline" to="/booking">
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Prices are starting points and may vary based on hair length, thickness, and previous color.
            For major changes or corrections, a consultation is recommended.
          </p>
        </section>

        {/* QUICK GUIDE */}
        <section className="mt-12 rounded-2xl border p-6">
          <h2 className="text-xl text-[#3D0007] font-semibold">Not sure what to book?</h2>
          <ul className="mt-4 space-y-2 text-gray-800">
            <li>
              New to color?{" "}
              <Link className="underline" to="/highlights-burnaby">
                Highlights
              </Link>{" "}
              <span className="text-gray-600">(base color may be recommended)</span>
            </li>
            <li>
              Want low-maintenance brightness?{" "}
              <Link className="underline" to="/balayage-burnaby">
                Balayage
              </Link>{" "}
              <span className="text-gray-600">(base color may be recommended)</span>
            </li>
            <li>
              Frizz control + smoother hair?{" "}
              <Link className="underline" to="/keratin-treatment-burnaby">
                Keratin
              </Link>
            </li>
            <li>
              Want curls or waves?{" "}
              <Link className="underline" to="/perm-burnaby">
                Perm
              </Link>
            </li>
            <li>
              Just need a cut?{" "}
              <Link className="underline" to="/womens-haircut-burnaby">
                Women’s
              </Link>{" "}
              /{" "}
              <Link className="underline" to="/mens-haircut-burnaby">
                Men’s
              </Link>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl text-[#3D0007] font-theseason font-semibold">FAQ</h2>

          <div className="mt-5 space-y-4">
            <details className="rounded-xl border p-4">
              <summary className="font-semibold cursor-pointer">
                Highlights vs balayage — what’s the difference?
              </summary>
              <p className="mt-2 text-gray-700">
                Highlights are more structured and can create brighter contrast. Balayage is hand-painted for a softer,
                blended grow-out. If you want lower maintenance, balayage is often the better fit.
              </p>
            </details>

            <details className="rounded-xl border p-4">
              <summary className="font-semibold cursor-pointer">
                Why do some color services have add-ons (like base color)?
              </summary>
              <p className="mt-2 text-gray-700">
                Some looks may require a base color for full coverage, tone balancing, or correction. If needed, we’ll
                explain it during the consultation. Base color starts at ${BASE_COLOR_FROM}.
              </p>
            </details>

            <details className="rounded-xl border p-4">
              <summary className="font-semibold cursor-pointer">
                Do you offer consultations?
              </summary>
              <p className="mt-2 text-gray-700">
                Yes. If you’re not sure what to book or you want a major change, start with a consultation so we can
                plan the right service and timing.
              </p>
            </details>

            <details className="rounded-xl border p-4">
              <summary className="font-semibold cursor-pointer">
                How long do appointments take?
              </summary>
              <p className="mt-2 text-gray-700">
                Timing depends on your hair length, thickness, and goals. Color services usually take longer because they
                include consultation, application, processing, and toning/finishing.
              </p>
            </details>

            <details className="rounded-xl border p-4">
              <summary className="font-semibold cursor-pointer">
                Should I book “Men’s haircut” or “Men’s haircut + wash”?
              </summary>
              <p className="mt-2 text-gray-700">
                Book “Men’s haircut + wash” if you want a wash included. If you’re coming with clean hair and don’t need a
                wash, book “Men’s haircut”.
              </p>
            </details>
          </div>
        </section>

        {/* LOCATION / CONTACT STRIP */}
        <section className="mt-12 rounded-2xl border border-gray-200 bg-[#F8F7F1] p-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    
    {/* LEFT SIDE */}
    <div>
      <div className="text-lg font-semibold text-[#572a31]">
        Call or visit us
      </div>

      <div className="mt-3 text-sm text-gray-700 space-y-1">
        <div>
          <a
            className="hover:underline"
            href={`tel:${PHONE_TEL}`}
          >
            {PHONE_DISPLAY}
          </a>
        </div>

        <div>
          <a
            className="hover:underline"
            href={MAPS_URL}
            target="_blank"
            rel="noreferrer"
          >
            {ADDRESS_LINE}
          </a>
          <span className="text-gray-500"> • {LOCATION_NOTE}</span>
        </div>

        <div className="text-gray-500">{PARKING_NOTE}</div>
      </div>
    </div>

    {/* RIGHT SIDE BUTTONS */}
    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

      <Link
        to="/booking"
        className="text-center px-6 py-3 rounded-xl bg-[#572a31] text-white 
                   hover:bg-[#6d3640] transition-all duration-200 shadow-sm"
      >
        Book Appointment
      </Link>

      <a
        href={`tel:${PHONE_TEL}`}
        className="text-center px-6 py-3 rounded-xl border border-[#572a31]/40 
                   text-[#572a31] hover:bg-[#572a31]/5 transition-all duration-200"
      >
        Call Now
      </a>

    </div>
  </div>
</section>
      </div>
    </div>
  );
}