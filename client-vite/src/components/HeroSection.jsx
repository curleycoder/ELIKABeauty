import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative isolate min-h-[70vh] sm:min-h-screen overflow-hidden flex items-center justify-center">
      {/* Background (MUST NOT steal touches) */}
      <div className="absolute inset-0 pointer-events-none">
        <picture>
          <source
            type="image/webp"
            srcSet="/assets/booking-800.webp 800w, /assets/booking-1200.webp 1200w, /assets/booking-1600.webp 1600w"
            sizes="(max-width: 768px) 100vw, 90vw"
          />
          <img
            src="/assets/booking-1200.webp"
            alt="Beauty Shohre Studio"
            className="h-full w-full object-cover"
            width={1600}
            height={900}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable="false"
          />
        </picture>

        {/* Optional overlay */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Foreground content */}
      <div className="relative pointer-events-auto mx-auto w-[92%] max-w-xl rounded-2xl bg-black/20 backdrop-blur-sm px-4 py-5 sm:px-6 sm:py-8 md:px-10 text-center">
        <h2 className="font-display text-white text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">
          Book Your Appointment
        </h2>

        <p className="text-white/95 text-sm sm:text-base mb-1">
          Address: 3939 Hastings Street #105, Burnaby V5C 2H8
        </p>
        <p className="text-white/95 text-sm sm:text-base mb-1">
          Phone Number: (778) 513-9006
        </p>
        <p className="text-white/95 text-sm sm:text-base mb-5">
          Choose your service and easily book online today!
        </p>

        <button
          type="button"
          onClick={() => navigate("/booking")}
          className="rounded-full bg-[#eabec5] px-6 py-2 font-bold text-[#55203d] transition hover:bg-purplecolor hover:text-white"
        >
          BOOK NOW
        </button>
      </div>
    </section>
  );
}
