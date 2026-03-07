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

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[70vh] overflow-hidden bg-[#ffe3d6] sm:min-h-[90vh]">
      <div className="absolute inset-0 z-0 pointer-events-none">
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={[
              "absolute inset-0 h-full w-full object-cover object-top sm:object-center transition-opacity duration-700",
              i === index ? "opacity-45" : "opacity-0",
            ].join(" ")}
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
          />
        ))}
      </div>

      <div className="relative z-10 flex min-h-[70vh] items-center justify-center px-4 pt-20 text-center sm:min-h-[80vh]">
        <div className="mt-40 rounded-3xl sm:mt-48">
          <h1
            className="
              font-theseason
              text-5xl
              tracking-wide
              text-[#572a31]
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
              text-[#572a31]
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
            className="mt-8 rounded-md bg-[#440008] px-7 py-3 text-sm font-semibold text-[#fcfaf8] transition hover:bg-[#572a31]"
          >
            BOOK AN APPOINTMENT
          </button>
        </div>
      </div>
    </section>
  );
}