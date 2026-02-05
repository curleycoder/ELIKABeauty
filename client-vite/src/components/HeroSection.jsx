import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative isolate min-h-[70vh] sm:min-h-screen overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <picture>
          <source
            type="image/webp"
            srcSet="/assets/booking-800.webp 800w, /assets/booking-1200.webp 1200w, /assets/booking-1600.webp 1600w"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
          <img
            src="/assets/booking-1200.webp"
            alt="Elika Beauty salon"
            className="h-full w-full object-cover"
            width={1600}
            height={900}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable="false"
          />
        </picture>
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Foreground content: mobile bottom-center, desktop right */}
      <div
        className={[
          "relative pointer-events-auto w-[92%] max-w-xl rounded-2xl bg-black/20 backdrop-blur-sm px-4 py-5 sm:px-6 sm:py-8 md:px-10 text-center",
          // mobile: bottom-center
          "absolute left-1/2 -translate-x-1/2 top-24",
          // desktop+: normal flow on the right
          "sm:static sm:translate-x-0 sm:ml-auto sm:mr-12 lg:mr-14",
        ].join(" ")}
      >
        <h2 className="font-display text-white text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
          Book Your Appointment
        </h2>

        <p className="text-white/95 text-sm sm:text-base mb-1">
          Address: 102–3790 Canada Way, Burnaby, BC
        </p>
        <p className="text-white/95 text-sm sm:text-base mb-1">
          Phone: (778) 513-9006
        </p>
        <p className="text-white/95 text-sm sm:text-base mb-5">
          Choose your service and book online today.
        </p>

        <button
          type="button"
          onClick={() => navigate("/booking")}
          className="rounded-full bg-[#ceaa5b] px-8 py-4 font-bold text-[#200027] transition hover:bg-[#55203d] hover:text-white"
        >
          BOOK NOW
        </button>
      </div>
    </section>
  );
}
