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
  "https://www.google.com/maps/place/ELIKA+BEAUTY+(Tangles+Hair+Design)/";



export default function HairSalonBurnaby() {
  const pageTitle = `Hair Salon in Burnaby | ${SITE_NAME}`;
  const pageDescription =
    "Elika Beauty is a professional hair salon in Burnaby offering balayage, highlights, hair color, keratin treatments, perms and precision haircuts.";

  const pageUrl = `${SITE_ORIGIN}/hair-salon-burnaby`;

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
        <meta property="og:image" content={`${SITE_ORIGIN}/assets/salon.webp`} />
        <meta property="og:site_name" content={SITE_NAME} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={`${SITE_ORIGIN}/assets/salon.webp`} />

        <script type="application/ld+json">
          {JSON.stringify(localBusinessSchema)}
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

        {/* HERO */}
        <section className="rounded-3xl border border-[#572a31]/10 bg-[#fcfaf8] p-6 sm:p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-[#7b5b65]">
            Elika Beauty • Burnaby, BC
          </p>

          <h1 className="mt-3 text-3xl sm:text-4xl font-theseason font-bold text-[#440008]">
            Hair Salon in Burnaby
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-7 text-gray-700">
            Elika Beauty is a full service hair salon in Burnaby specializing
            in balayage, highlights, hair color, keratin treatments, perms,
            and precision haircuts. We focus on healthy-looking results,
            customized color work, and styles that fit real life.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/booking"
              className="rounded-xl px-6 py-3 bg-[#572a31] text-white hover:opacity-90 transition"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${PHONE_TEL}`}
              className="rounded-xl px-6 py-3 border border-[#572a31]/30 text-[#572a31] hover:bg-[#572a31]/5 transition"
            >
              Call {PHONE_DISPLAY}
            </a>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl px-6 py-3 border border-[#572a31]/30 text-[#572a31] hover:bg-[#572a31]/5 transition"
            >
              Get Directions
            </a>
          </div>
        </section>

        {/* HERO IMAGE */}
        <section className="mt-8">
          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            <img
              src="/images/pages/salon-hero.webp"
              alt="Elika Beauty hair salon in Burnaby"
              className="h-[260px] sm:h-[420px] w-full object-cover"
              loading="eager"
            />
          </div>
        </section>

        {/* LOCATION */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Location</div>
            <div className="mt-2 font-semibold text-[#440008]">
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
              className="mt-2 block underline text-[#440008]"
            >
              {ADDRESS_LINE}
            </a>
          </div>

          <div className="rounded-2xl border p-5 bg-white shadow-sm">
            <div className="text-sm text-gray-500">Parking</div>
            <div className="mt-2 text-gray-700">{PARKING_NOTE}</div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="mt-10">
          <h2 className="text-2xl font-theseason font-semibold text-[#440008]">
            Popular Hair Services
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/balayage-burnaby"
              className="rounded-2xl border p-5 hover:shadow-sm transition"
            >
              <div className="font-semibold">Balayage</div>
              <p className="text-sm mt-2 text-gray-700">
                Soft, blended color with a natural grow-out.
              </p>
            </Link>

            <Link
              to="/highlights-burnaby"
              className="rounded-2xl border p-5 hover:shadow-sm transition"
            >
              <div className="font-semibold">Highlights</div>
              <p className="text-sm mt-2 text-gray-700">
                Bright dimension with custom toning.
              </p>
            </Link>

            <Link
              to="/keratin-treatment-burnaby"
              className="rounded-2xl border p-5 hover:shadow-sm transition"
            >
              <div className="font-semibold">Keratin Treatment</div>
              <p className="text-sm mt-2 text-gray-700">
                Smoother hair with reduced frizz.
              </p>
            </Link>

            <Link
              to="/womens-haircut-burnaby"
              className="rounded-2xl border p-5 hover:shadow-sm transition"
            >
              <div className="font-semibold">Women’s Haircut</div>
            </Link>

            <Link
              to="/mens-haircut-burnaby"
              className="rounded-2xl border p-5 hover:shadow-sm transition"
            >
              <div className="font-semibold">Men’s Haircut</div>
            </Link>

            <Link
              to="/services"
              className="rounded-2xl border p-5 hover:shadow-sm transition"
            >
              <div className="font-semibold">All Services</div>
            </Link>
          </div>
        </section>

        {/* ABOUT */}
        <section className="mt-10 rounded-2xl border p-6">
          <h2 className="text-2xl font-theseason font-semibold text-[#440008]">
            About Elika Beauty
          </h2>

          <p className="mt-4 leading-relaxed text-gray-700">
            Elika Beauty focuses on personalized consultations and realistic
            hair goals. Every appointment starts with understanding your hair
            history, maintenance preference, and desired result.
          </p>

          <p className="mt-4 leading-relaxed text-gray-700">
            Whether you want subtle brightness, a smoother texture, or a
            precision haircut, the goal is a look that fits your lifestyle
            while keeping your hair healthy.
          </p>
        </section>

        {/* CTA */}
        <section className="mt-12 rounded-2xl border border-gray-200 bg-[#F8F7F1] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="font-semibold text-[#572a31]">
                Ready for your appointment?
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Book online or call the salon.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/booking"
                className="px-6 py-3 rounded-xl bg-[#572a31] text-white"
              >
                Book Now
              </Link>

              <a
                href={`tel:${PHONE_TEL}`}
                className="px-6 py-3 rounded-xl border border-[#572a31]/40 text-[#572a31]"
              >
                Call
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}