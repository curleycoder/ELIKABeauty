import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HERO_SLIDES = [
    { src: "/assets/salon.JPG", alt: "Elika salon" },
  { src: "/assets/colour-hero.jpg", alt: "Elika highlight" },
  { src: "/assets/hair-cut.jpg", alt: "Elika haircut" },
  { src: "/assets/treading-hero.jpg", alt: "Elika treading" },
  { src: "/assets/balayage-hero.jpg", alt: "Elika balayage" },
  { src: "/assets/light-hero.jpg", alt: "Elika balayage" },
  { src: "/assets/salonn.JPG", alt: "Elika salon" },
];

export default function HeroSection() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
  HERO_SLIDES.forEach(({ src }) => {
    const img = new Image();
    img.src = src;
  });
}, []);


  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[70vh] sm:min-h-[90vh] overflow-hidden bg-[#ffe3d6]">
      {/* IMAGE LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {HERO_SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className={[
  "absolute inset-0 h-full w-full object-cover object-top sm:object-center transition-opacity duration-600",
  i === index ? "opacity-45" : "opacity-0",
].join(" ")}

            loading="eager"
            fetchpriority={i === 0 ? "high" : "low"}
            decoding="async"

          />
        ))}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex min-h-[70vh] sm:min-h-[80vh] items-center justify-center px-4 pt-20 text-center">
        {/* pt-20 = space for fixed navbar */}
        <div className="rounded-3xl mt-48">
          <h1 className="
            font-theseason
            text-6xl
            sm:text-7xl
            md:text-8xl
            lg:text-9xl
            xl:text-[10rem]
            2xl:text-[12rem]
            tracking-wide
            text-[#572a31]
            drop-shadow-[0_2px_18px_rgba(0,0,0,0.3)]
          ">
            ELIKA
          </h1>

          <p
            className="
              mt-2
              text-sm
              sm:text-sm
              md:text-base
              lg:text-lg
              xl:text-xl
              2xl:text-2xl
              tracking-[0.35em]
              sm:tracking-[0.90em]
              xl:tracking-[0.6em]
              uppercase
              text-[#572a31]
            "
          >
            Beauty Salon
          </p>

          <button
            onClick={() => navigate("/booking")}
            className="mt-8 rounded-md bg-[#440008] hover:bg-[#572a31] px-7 py-3 text-sm font-semibold text-[#ffe3d6] hover:text-[#faeddd] transition"
          >
            BOOK AN APPOINTMENT
          </button>
        </div>
      </div>
    </section>
  );
}
