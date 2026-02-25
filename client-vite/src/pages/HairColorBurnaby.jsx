import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";

const ADDRESS_LINE = "3790 Canada Way #102, Burnaby, BC V5G 1G4";
const LOCATION_NOTE = "Edward Jones Plaza";

export default function HairColorBurnaby() {
  const pageTitle = `Hair Color in Burnaby | Balayage, Highlights, Root Color & More | ${SITE_NAME}`;
  const pageDescription =
    "Professional hair color in Burnaby at Elika Beauty — balayage, highlights, root touch-ups and full color. Customized tones, healthy results, and consultation-first service.";

  const pageUrl = `${SITE_ORIGIN}/hair-color-burnaby`;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "Elika Beauty",
    url: pageUrl,
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
    name: "Hair Color",
    areaServed: "Burnaby, BC",
    provider: {
      "@type": "LocalBusiness",
      name: "Elika Beauty",
      url: SITE_ORIGIN,
      telephone: PHONE_TEL,
    },
    url: pageUrl,
    description: pageDescription,
    serviceType: "Hair coloring",
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
          text:
            "Highlights are more structured and can create brighter contrast. Balayage is hand-painted for a softer, blended look and typically grows out more naturally with lower maintenance.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a consultation before hair color?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "A consultation is recommended if you want a major change, have box dye, previous color, or want color correction. It helps plan timing, tone, and the right service selection.",
        },
      },
      {
        "@type": "Question",
        name: "How long does hair color take?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Timing depends on your hair length, thickness, and goals. Many color services include consultation, application, processing, toning, and finishing — so plan extra time for best results.",
        },
      },
      {
        "@type": "Question",
        name: "Why is base color sometimes recommended?",
        acceptedAnswer: {
          "@type": "Answer",
          text:
            "Some looks may require a base color for better coverage, tone balancing, or correction. If needed, it will be discussed during your consultation based on your hair goals.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content="hair color Burnaby, hair colouring Burnaby, balayage Burnaby, highlights Burnaby, root color Burnaby, toner Burnaby, Elika Beauty"
        />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE_NAME} />

        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
        </script>
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className=" mt-12 max-w-3xl mx-auto">
        <Link to="/" className="text-[#55203d] underline">
          ← Back to home
        </Link>

        <h1 className="mt-4 text-3xl font-theseason font-bold text-[#3D0007]">
          Hair Color in Burnaby
        </h1>

        <p className="mt-6 leading-relaxed">
          If you’re searching for professional hair color in Burnaby, Elika Beauty
          offers customized color services designed around your hair history,
          tone goals, and maintenance level. From dimensional balayage to
          classic highlights, we focus on healthy-looking, wearable results.
        </p>

        <p className="mt-4 leading-relaxed">
          We’re located at {ADDRESS_LINE} ({LOCATION_NOTE}) and welcome clients
          from Brentwood, Metrotown, Burnaby Heights, Deer Lake, and across Metro Vancouver.
        </p>

        <h2 className="mt-10 text-2xl font-semibold">
          Hair Color Services We Offer
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-5">
            <div className="font-semibold">Balayage</div>
            <p className="mt-2 text-sm text-gray-700">
              Soft, blended color with a natural grow-out and low-maintenance finish.
            </p>
            <Link className="mt-3 inline-block underline text-sm" to="/balayage-burnaby">
              Balayage in Burnaby →
            </Link>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="font-semibold">Highlights</div>
            <p className="mt-2 text-sm text-gray-700">
              Structured brightness with dimension and custom toning.
            </p>
            <Link className="mt-3 inline-block underline text-sm" to="/highlights-burnaby">
              Highlights in Burnaby →
            </Link>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="font-semibold">Root Color & Gray Coverage</div>
            <p className="mt-2 text-sm text-gray-700">
              Root touch-ups and coverage support with tone-matching and clean regrowth.
            </p>
            <Link className="mt-3 inline-block underline text-sm" to="/services">
              See starting prices →
            </Link>
          </div>

          <div className="rounded-2xl border p-5">
            <div className="font-semibold">Toners & Color Refresh</div>
            <p className="mt-2 text-sm text-gray-700">
              Balance warmth, refine tone, and keep your color looking fresh and glossy.
            </p>
            <Link className="mt-3 inline-block underline text-sm" to="/booking">
              Book a consultation →
            </Link>
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-semibold">
          What to Expect at Your Appointment
        </h2>

        <ul className="mt-4 space-y-3 leading-relaxed">
          <li>• Quick consultation to confirm goals, tone, and maintenance level</li>
          <li>• Customized placement and formulation based on hair history</li>
          <li>• Toning/refining for a wearable finish</li>
          <li>• Styling and care guidance to protect your color</li>
        </ul>

        <h2 className="mt-10 text-2xl font-semibold">
          Best Hair Color for Your Lifestyle
        </h2>

        <p className="mt-4 leading-relaxed">
          If you want lower maintenance, balayage is often a better fit because it grows out softly.
          If you want brighter contrast, structured highlights can deliver stronger dimension.
          For coverage and consistency, root color services keep things clean and even.
        </p>

        {/* CTA */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            to="/booking"
            className="rounded-full px-8 py-3 bg-[#572a31] text-white shadow-sm hover:opacity-90 transition text-center"
          >
            Book Hair Color Appointment
          </Link>

          <a
            href={`tel:${PHONE_TEL}`}
            className="rounded-full px-8 py-3 border border-[#572a31]/30 text-[#572a31] hover:bg-[#572a31]/5 transition text-center"
          >
            Call {PHONE_DISPLAY}
          </a>
        </div>

        {/* FAQ */}
        <h2 className="mt-12 text-2xl font-semibold">FAQ</h2>
        <div className="mt-5 space-y-4">
          <details className="rounded-xl border p-4">
            <summary className="font-semibold cursor-pointer">
              What’s the difference between balayage and highlights?
            </summary>
            <p className="mt-2 text-gray-700">
              Highlights are more structured and can create brighter contrast. Balayage is hand-painted for a softer,
              blended look and usually grows out more naturally with lower maintenance.
            </p>
          </details>

          <details className="rounded-xl border p-4">
            <summary className="font-semibold cursor-pointer">
              Do I need a consultation before hair color?
            </summary>
            <p className="mt-2 text-gray-700">
              A consultation is recommended if you want a major change, have box dye or previous color, or want color
              correction. It helps plan the right service, timing, and tone.
            </p>
          </details>

          <details className="rounded-xl border p-4">
            <summary className="font-semibold cursor-pointer">
              How long does hair color take?
            </summary>
            <p className="mt-2 text-gray-700">
              Timing depends on hair length, thickness, and goals. Many color services include consultation, application,
              processing, toning, and finishing — so plan extra time for best results.
            </p>
          </details>

          <details className="rounded-xl border p-4">
            <summary className="font-semibold cursor-pointer">
              Why is base color sometimes recommended?
            </summary>
            <p className="mt-2 text-gray-700">
              Some looks may require a base color for better coverage, tone balancing, or correction. If needed, we’ll
              discuss it during your consultation based on your hair goals.
            </p>
          </details>
        </div>

        {/* INTERNAL LINKS BOOST */}
        <div className="mt-12 rounded-2xl border p-6">
          <div className="font-semibold">Explore related pages</div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link className="underline" to="/hair-salon-burnaby">
              Hair Salon in Burnaby
            </Link>
            <span className="text-gray-400">•</span>
            <Link className="underline" to="/balayage-burnaby">
              Balayage in Burnaby
            </Link>
            <span className="text-gray-400">•</span>
            <Link className="underline" to="/highlights-burnaby">
              Highlights in Burnaby
            </Link>
            <span className="text-gray-400">•</span>
            <Link className="underline" to="/services">
              View all services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}