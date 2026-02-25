import { Link } from "react-router-dom";

export default function IntroSection() {
  return (
    <section className="bg-[#F8F7F1] px-4 sm:px-6 lg:px-20 py-12 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* outer card + thin border */}
        <div className="bg-[#F8F7F1] border border-[#572a31]">
          {/* inner border */}
          <div className="m-3 border border-[#572a31]">
            {/* padding inside the bordered area */}
            <div className="px-8 py-4 sm:px-8 sm:py-8">
              <div className="grid gap-4 md:grid-cols-2 md:gap-2">
                {/* LEFT */}
                <h2 className="font-theseason pt-7 pl-5 text-2xl sm:text-3xl md:text-5xl leading-[1.05] tracking-wide text-[#7a3b44]">
                  WE ARE A
                  <br />
                  FULL SERVICE
                  <br />
                  SALON.
                </h2>

                {/* RIGHT — your SEO content */}
                <div className="text-[#572a31]">
                  <p className="text-xs sm:text-sm tracking-widest uppercase">
                    Burnaby • Serving Metro Vancouver
                  </p>

                  <p className="mt-2 text-sm">
                    3790 Canada Way #102, Burnaby • Formerly Tangles Hair Design
                  </p>

                  <h3 className="mt-5 text-lg sm:text-xl font-theseason tracking-wide">
                    ELIKA BEAUTY
                  </h3>

                  <p className="mt-1 text-sm sm:text-base uppercase tracking-wider">
                    Hair Salon in Burnaby
                  </p>

                  <p className="mt-4 leading-relaxed">
                    Specializing in balayage, highlights, hair colour, colour correction, and keratin
                    treatments—with precision haircuts available. Focused on healthy, natural-looking
                    results delivered with experience and care.
                  </p>
                </div>
              </div>

<div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-4">

  <Link
    to="/booking"
    className="
      group relative text-center
      rounded-xl px-8 py-3
      bg-[#572a31] text-white
      tracking-wide
      transition-all duration-300
      shadow-[0_6px_18px_rgba(87,42,49,0.25)]
      hover:shadow-[0_10px_28px_rgba(87,42,49,0.35)]
      hover:-translate-y-[1px]
    "
  >
    Book Appointment
  </Link>

  <a
    href="tel:+16044383727"
    className="
      text-center rounded-xl px-8 py-3
      bg-transparent
      text-[#572a31]
      border border-[#572a31]/30
      tracking-wide
      transition-all duration-300
      hover:border-[#572a31]
      hover:bg-[#572a31]/5
    "
  >
    Call (604) 438-3727
  </a>

</div>
              {/* ✅ END CTA ROW */}
            </div>
          </div>
        </div>

        <div className="h-8" />
      </div>
    </section>
  );
}