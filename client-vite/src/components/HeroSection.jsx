import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HERO_SLIDES = [
  { src: "/assets/salon.webp", alt: "Elika salon" },
  { src: "/assets/colour-hero.webp", alt: "Elika highlight" },
  { src: "/assets/balayage-hero.webp", alt: "Elika balayage" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  // Only preload slide 2 & 3 after first paint
  const [preloaded, setPreloaded] = useState(false);

  useEffect(() => {
    // Defer preloading non-hero slides until after first paint
    const raf = requestAnimationFrame(() => setPreloaded(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-[#E4E2DD] sm:min-h-[90vh]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {HERO_SLIDES.map((slide, i) => {
          // Always render slide 0; only render others after preload
          if (i > 0 && !preloaded) return null;
          return (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              width={1600}
              height={900}
              className={[
                "absolute inset-0 h-full w-full object-cover object-top sm:object-center transition-opacity duration-700",
                i === index ? "opacity-45" : "opacity-0",
              ].join(" ")}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding={i === 0 ? "sync" : "async"}
            />
          );
        })}
      </div>

      <div className="relative z-10 flex min-h-[70vh] items-center justify-center px-4 pt-20 text-center sm:min-h-[80vh]">
        <div className="mt-40 rounded-3xl sm:mt-48">
          <h1
            className="
              font-theseason
              text-5xl
              tracking-wide
              text-[#440008]
              drop-shadow-[0_2px_18px_rgba(0,0,0,0.3)]
              sm:text-7xl
              md:text-8xl
              lg:text-9xl
              xl:text-[10rem]
              2xl:text-[12rem]
            "
          >
            ELIKA
          </h1>

          <p
            className="
              mt-2
              text-xs
              uppercase
              tracking-[0.25em]
              text-[#440008]
              sm:text-sm
              sm:tracking-[0.6em]
              md:text-base
              lg:text-lg
              xl:text-xl
            "
          >
            Beauty Salon
          </p>

          <button
            onClick={() => navigate("/booking")}
            className="mt-8 rounded-xl bg-[#440008] px-8 py-4 text-sm font-semibold text-[#F9F7F4] transition hover:opacity-90"
          >
            BOOK AN APPOINTMENT
          </button>
        </div>
      </div>
    </section>
  );
}