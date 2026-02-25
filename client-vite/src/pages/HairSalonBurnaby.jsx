import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Elika Beauty";
const SITE_ORIGIN = "https://elikabeauty.ca";

export default function HairSalonBurnaby() {
  const pageTitle = `Hair Salon in Burnaby | ${SITE_NAME}`;
  const pageDescription =
    "Elika Beauty is a full service hair salon in Burnaby specializing in balayage, highlights, keratin treatments, hair color and precision haircuts.";

  const pageUrl = `${SITE_ORIGIN}/hair-salon-burnaby`;

  return (
    <div className="min-h-screen bg-white text-gray-800 pt-12 px-4 sm:px-6 pb-16">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={pageUrl} />
      </Helmet>

      <div className="mt-12 max-w-3xl mx-auto">
        <Link to="/" className="text-[#55203d] underline">
          ← Back to home
        </Link>

        <h1 className="mt-4 text-3xl font-theseason font-bold text-[#440008]">
          Hair Salon in Burnaby
        </h1>

        <p className="mt-6 leading-relaxed">
          Elika Beauty is a full service hair salon located in Burnaby,
          offering balayage, highlights, hair colour, keratin treatments,
          perms and precision haircuts for men and women.
        </p>

        <p className="mt-4 leading-relaxed">
          Located at 3790 Canada Way #102 (Edward Jones Plaza),
          we serve clients across Metro Vancouver looking for natural,
          healthy-looking results and professional service.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            to="/services"
            className="rounded-full px-6 py-3 bg-[#572a31] text-white hover:opacity-90 transition"
          >
            View Services
          </Link>

          <Link
            to="/booking"
            className="rounded-full px-6 py-3 border border-[#572a31]/30 text-[#572a31] hover:bg-[#572a31]/5 transition"
          >
            Book Appointment
          </Link>
        </div>
        <div className="mt-8 flex gap-4">
  <Link
    to="/services"
    className="rounded-full px-6 py-3 bg-[#572a31] text-white"
  >
    View All Services
  </Link>
</div>
      </div>
    </div>
  );
}