import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Elika Beauty</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="min-h-screen bg-[#E4E2DD] flex flex-col items-center justify-center px-4 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-[#440008] mb-3">
          Elika Beauty · Burnaby
        </p>

        <h1 className="font-theseason text-5xl sm:text-7xl text-[#440008] mb-4">404</h1>

        <p className="text-lg text-gray-600 max-w-md mb-8">
          We couldn't find that page. It may have moved or no longer exists.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-[#440008] px-6 py-3 text-sm font-medium text-[#E4E2DD] transition hover:opacity-90"
          >
            Go to Home
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-full border border-[#440008]/25 bg-white px-6 py-3 text-sm font-medium text-[#440008] transition hover:border-[#440008]/45"
          >
            View Services
          </Link>
          <Link
            to="/booking"
            className="inline-flex items-center justify-center rounded-full border border-[#440008]/25 bg-white px-6 py-3 text-sm font-medium text-[#440008] transition hover:border-[#440008]/45"
          >
            Book Appointment
          </Link>
        </div>
      </main>
    </>
  );
}
