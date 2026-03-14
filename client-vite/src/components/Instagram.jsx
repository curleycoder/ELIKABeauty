import { FaInstagram } from "react-icons/fa";

const IG_URL = "https://www.instagram.com/elikabeauty.ca/";
const IMAGES = Array.from({ length: 9 }, (_, i) => `/instagram/${i + 1}.webp`);

export default function InstagramMasonry() {
  return (
    <section className="py-5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-4xl font-theseason text-[#572a31]">
            Follow Us on Instagram
          </h2>
        </div>
        <div className="mt-3 sm:mt-10 text-center">
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-[#440008] hover:bg-[#572a31] px-7 py-3 text-sm sm:text-base font-semibold text-[#faeddd] transition"
          >
            <FaInstagram className="text-base" />
            @elikabeauty.ca
          </a>
        </div>

        <div
          className={[
            "mt-8 sm:mt-10",
            "columns-2 lg:columns-3",
            "gap-3 sm:gap-4 lg:gap-5",
            "[column-fill:_balance]",
          ].join(" ")}
        >
          {IMAGES.map((src, i) => (
            <a
              key={src}
              href={IG_URL}
              target="_blank"
              rel="noreferrer"
              className={[
                "group relative block",
                "mb-3 sm:mb-4 lg:mb-5",
                "break-inside-avoid overflow-hidden rounded-2xl",
                "bg-[#f0e8e8]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7a3b44]/50",
              ].join(" ")}
              aria-label="Open Instagram"
            >
              <img
                src={src}
                alt="Elika Beauty Instagram post"
                width={400}
                height={500}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover transition duration-500 group-hover:scale-[1.03] group-active:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-black/0 transition duration-300 group-hover:bg-black/25 group-active:bg-black/25 group-focus-visible:bg-black/25" />
              <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100 group-active:opacity-100 group-focus-visible:opacity-100">
                <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[#572a31] shadow">
                  <FaInstagram className="text-lg" />
                  <span className="text-xs font-bold tracking-widest">VIEW</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
