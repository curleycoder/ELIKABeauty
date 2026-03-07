import { Link } from "react-router-dom";

export default function IntroSection() {
  return (
    <section className=" px-3 py-8 sm:px-6 sm:py-16 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <div className="border border-[#572a31] ">
          <div className="m-3 border border-[#572a31] bg-[#fcfaf8]">
            <div className="px-6 py-5 sm:px-8 sm:py-10">
              <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                <div>
                  <h2 className="pt-2 font-theseason text-2xl leading-[1.05] tracking-wide text-[#7a3b44] sm:text-3xl md:text-5xl">
                    WE ARE A
                    <br />
                    FULL SERVICE
                    <br />
                    SALON.
                  </h2>
                </div>

                <div className="text-[#572a31]">
                  <p className="text-xs uppercase tracking-widest sm:text-sm">
                    Burnaby • Metro Vancouver
                  </p>

                  <h3 className="mt-4 text-lg font-theseason tracking-wide sm:text-xl">
                    ELIKA BEAUTY
                  </h3>

                  <p className="mt-4 leading-relaxed">
                    Elika Beauty is a welcoming beauty salon in Burnaby offering
                    hair services and beauty care in one place. We focus on
                    polished results, professional service, and a comfortable
                    experience for every client.
                  </p>

                  <p className="mt-3 text-sm">
                    3790 Canada Way #102, Burnaby, BC
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/booking"
                  className="
                    group relative rounded-xl bg-[#572a31] px-8 py-3 text-center
                    tracking-wide text-white transition-all duration-300
                    shadow-[0_6px_18px_rgba(87,42,49,0.25)]
                    hover:-translate-y-[1px]
                    hover:shadow-[0_10px_28px_rgba(87,42,49,0.35)]
                  "
                >
                  Book Appointment
                </Link>

                <a
                  href="tel:+16044383727"
                  className="
                    rounded-xl border border-[#572a31]/30 bg-transparent px-8 py-3
                    text-center tracking-wide text-[#572a31] transition-all duration-300
                    hover:border-[#572a31] hover:bg-[#572a31]/5
                  "
                >
                  Call (604) 438-3727
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </section>
  );
}