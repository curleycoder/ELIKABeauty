import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const SITE_NAME = "Elika Beauty";
const EMAIL = "elkaeiamina@gmail.com";
const PHONE_TEL = "+16044383727";
const PHONE_DISPLAY = "(604) 438-3727";
const ADDRESS_LINE = "3790 Canada Way #102, Burnaby, BC V5G 1G4";
const LOCATION_NOTE = "Edward Jones Plaza";
const PARKING_NOTE = "Plaza parking available • Pay parking on street";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(`${ADDRESS_LINE} Elika Beauty`);

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pb-14 pt-14 text-gray-800 sm:pb-16">
      <Helmet>
        <title>About Elika Beauty | Hair Salon in Burnaby BC</title>
        <meta
          name="description"
          content="About Elika Beauty, a professional beauty salon in Burnaby BC offering hair services, a welcoming salon environment, and opportunities for beauty professionals to connect."
        />
        <link rel="canonical" href="https://elikabeauty.ca/about" />
      </Helmet>

      <section className="relative w-full overflow-hidden">
        <img
          src="/images/pages/salon-ext.webp"
          alt="Inside Elika Beauty salon in Burnaby"
          className="h-[220px] w-full object-cover object-center sm:h-[360px] lg:h-[520px]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2e1118]/90 via-[#2e1118]/40 to-transparent" />

        <div className="absolute inset-x-0 bottom-4 mx-auto max-w-6xl px-4 sm:bottom-0 sm:px-6 sm:pb-10">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/80 sm:text-xs">
            Elika Beauty • Burnaby
          </p>

          <h1 className="mt-1 max-w-3xl text-[28px] font-theseason font-bold leading-[1.05] text-white sm:mt-3 sm:text-4xl lg:text-5xl">
            About Elika Beauty
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] leading-5 text-white/90 sm:mt-4 sm:text-base sm:leading-7">
            A welcoming beauty salon in Burnaby focused on quality work, a calm
            atmosphere, and services that help clients feel polished and confident.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12">
        <section>
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              A beauty space designed for comfort and quality
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              Elika Beauty is a Burnaby salon created to offer a clean, welcoming,
              and professional experience. Clients come for hair services and can
              also access beauty services in one place through our growing team.
            </p>

            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              The goal is simple: a calm salon environment, detailed work, and
              results that feel polished in real life.
            </p>
          </div>
        </section>

        <section className="mt-10 sm:mt-16">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              Inside the salon
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              A look at the Elika Beauty space in Burnaby.
            </p>
          </div>

          <div className="mt-4 grid gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
            <div className="group overflow-hidden rounded-[20px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px]">
              <div className="relative h-44 overflow-hidden sm:h-64 lg:h-72">
                <img
                  src="/images/pages/salon-4.webp"
                  alt="Salon interior at Elika Beauty"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="group overflow-hidden rounded-[20px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px]">
              <div className="relative h-44 overflow-hidden sm:h-64 lg:h-72">
                <img
                  src="/images/pages/salon-1.webp"
                  alt="Hair station inside Elika Beauty"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="group overflow-hidden rounded-[20px] border border-[#572a31]/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-[24px]">
              <div className="relative h-44 overflow-hidden sm:h-64 lg:h-72">
                <img
                  src="/images/pages/salon-2.webp"
                  alt="Beauty area at Elika Beauty in Burnaby"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3 sm:mt-16">
          <div className="rounded-[20px] border border-[#572a31]/10 bg-[#fcfaf8] p-4 sm:rounded-[24px] sm:p-6">
            <div className="text-xs text-gray-500 sm:text-sm">Location</div>
            <div className="mt-1 text-sm font-semibold text-[#3D0007] sm:mt-2 sm:text-lg">
              {LOCATION_NOTE}
            </div>
            <div className="mt-1 text-sm text-gray-600">Burnaby, BC</div>
          </div>

          <div className="rounded-[20px] border border-[#572a31]/10 bg-[#fcfaf8] p-4 sm:rounded-[24px] sm:p-6">
            <div className="text-xs text-gray-500 sm:text-sm">Address</div>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block text-sm font-semibold text-[#3D0007] underline underline-offset-4 sm:mt-2 sm:text-lg"
            >
              {ADDRESS_LINE}
            </a>
          </div>

          <div className="rounded-[20px] border border-[#572a31]/10 bg-[#fcfaf8] p-4 sm:rounded-[24px] sm:p-6 md:col-span-2 lg:col-span-1">
            <div className="text-xs text-gray-500 sm:text-sm">Parking</div>
            <div className="mt-1 text-sm font-semibold text-[#3D0007] sm:mt-2 sm:text-lg">
              Easy access
            </div>
            <div className="mt-1 text-sm text-gray-600">{PARKING_NOTE}</div>
          </div>
        </section>

        <section className="mt-14 rounded-[24px] bg-[#F8F7F1] p-5 sm:mt-16 sm:rounded-[28px] sm:p-8">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007] sm:text-3xl">
              What we offer
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              Elika Beauty is a full-service beauty space where clients can book
              professional hair services and access other beauty services in one
              location.
            </p>
          </div>

          <ul className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
            <li className="rounded-xl border border-[#572a31]/10 bg-white px-4 py-3 text-sm leading-6 text-gray-700 sm:text-base">
              Hair color, balayage, highlights, and root touch-ups
            </li>
            <li className="rounded-xl border border-[#572a31]/10 bg-white px-4 py-3 text-sm leading-6 text-gray-700 sm:text-base">
              Keratin and smoothing treatments
            </li>
            <li className="rounded-xl border border-[#572a31]/10 bg-white px-4 py-3 text-sm leading-6 text-gray-700 sm:text-base">
              Women’s and men’s haircuts, styling, and blowouts
            </li>
            <li className="rounded-xl border border-[#572a31]/10 bg-white px-4 py-3 text-sm leading-6 text-gray-700 sm:text-base">
              Facials, Relaxing Massage, threading, Makeup, updo, and microblading through our team
            </li>
          </ul>
        </section>

        <section className="mt-14 grid gap-4 lg:grid-cols-2 sm:mt-16">
          <div className="rounded-[24px] border border-[#572a31]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
              Feedback or general questions
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              For feedback, questions, or salon inquiries, email us directly.
            </p>

            <a
              href={`mailto:${EMAIL}`}
              className="mt-5 inline-flex items-center justify-center rounded-full border border-[#572a31]/25 bg-[#F8F7F1] px-6 py-3 text-sm font-medium text-[#572a31] transition hover:border-[#572a31]/45"
            >
              {EMAIL}
            </a>
          </div>

          <div className="rounded-[24px] border border-[#572a31]/10 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-theseason font-semibold text-[#3D0007]">
              Want to work with us?
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-700 sm:text-base sm:leading-7">
              If you are interested in chair rental, commission-based work, or
              joining the salon team, send an email with your experience and the
              type of setup you are looking for.
            </p>

            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("Elika Beauty Chair Rental / Commission Inquiry")}`}
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#440008] px-6 py-3 text-sm font-medium text-[#F8F7F1] transition hover:opacity-90"
            >
              Email inquiry
            </a>
          </div>
        </section>

        <section className="mt-8 border-t pt-5 text-center sm:mt-16 sm:rounded-[28px] sm:p-8">
          <h2 className="text-2xl font-theseason text-[#440008] sm:text-3xl">
            Ready to visit ELIKA BEAUTY?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#440008]/80 sm:text-base sm:leading-7">
            Book your appointment online, call the salon, or get directions to the Burnaby location.
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