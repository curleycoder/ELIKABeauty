import React, { useEffect, useMemo, useRef, useState } from "react";

const baseURL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/$/, "");

export default function GoogleReview() {
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const trackRef = useRef(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    fetch(`${baseURL}/api/google/reviews`)
      .then((r) => r.json())
      .then((data) => {
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setLoading(false);
      })
      .catch((e) => {
        console.error("❌ Failed to fetch reviews:", e);
        setLoading(false);
      });
  }, []);

  // estimate how many cards are visible per viewport (1 / 2 / 3 like Swiper breakpoints)
  const visible = useMemo(() => {
    if (typeof window === "undefined") return 1;
    const w = window.innerWidth;
    if (w >= 1024) return 3;
    if (w >= 768) return 2;
    return 1;
  }, [typeof window !== "undefined" ? window.innerWidth : 0]);

  const toggleExpanded = (i) => setExpanded((p) => ({ ...p, [i]: !p[i] }));

  // update active index on scroll
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const cardW = el.clientWidth / visible;
      const i = Math.round(el.scrollLeft / cardW);
      setIdx(Math.max(0, Math.min(i, Math.max(0, reviews.length - visible))));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [visible, reviews.length]);

  const scrollByCards = (n) => {
    const el = trackRef.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior = prefersReduced ? "auto" : "smooth";
    const delta = (el.clientWidth / visible) * n;
    el.scrollBy({ left: delta, behavior });
  };

  // keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") scrollByCards(1);
      if (e.key === "ArrowLeft") scrollByCards(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [visible]);

  return (
    <section className="bg-white p-3 rounded-lg max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-6">
          <span className="border-t border-b border-gray-300 px-6">What Our Clients Say</span>
        </h2>
      </div>

      <div className="mt-6 relative">
        {loading ? (
          <p className="text-center text-gray-500 mt-6">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500 mt-6">No reviews found.</p>
        ) : (
          <>
            {/* Track */}
            <div
              ref={trackRef}
              className="
                flex gap-6 overflow-x-auto overflow-y-hidden overscroll-x-contain scrollbar-hide
                snap-x snap-mandatory snap-always
                scroll-px-4
                px-4
              "
              role="list"
              aria-label="Client reviews carousel"
            >
              {reviews.map((review, i) => {
                const fullText = review.text || "";
                const showReadMore = fullText.length > 180;
                const isExpanded = !!expanded[i];
                const text = !isExpanded && showReadMore ? fullText.slice(0, 180) + "..." : fullText;

                return (
                  <article
                    key={i}
                    role="listitem"
                    className="
                      snap-start shrink-0
                      w-[85%] sm:w-[48%] lg:w-[32%]
                    "
                  >
                    <div className={
                        `flex flex-col bg-white border border-purplecolor rounded-xl shadow-md p-5 ` +
                        (isExpanded ? "h-auto" : "h-[220px] overflow-hidden")
                      }
                    >
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="h-10 w-10 rounded-full"
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="flex justify-between w-full">
                            <strong className="text-[#55203d] text-sm">{review.author_name}</strong>
                            <span className="text-sm">
                              {"⭐️".repeat(Math.max(0, Math.min(5, Number(review.rating) || 0)))}
                            </span>
                          </div>
                        </div>
                        {/* Clamp when collapsed; full text when expanded */}
                        <p
                          className={
                            `text-gray-700 text-sm leading-snug break-words ` +
                            (isExpanded ? "" : "line-clamp-4")
                          }
                          style={
                            isExpanded
                              ? undefined
                              : {
                                  display: "-webkit-box",
                                  WebkitLineClamp: 4,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }
                          }
                        >
                          {fullText}
                        </p>
                        {showReadMore && (
                          <button
                            onClick={() => toggleExpanded(i)}
                            className="text-pinkcolor text-xs underline mt-1"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 italic mt-2">
                        {review.relative_time_description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Arrows */}
            <button
              onClick={() => scrollByCards(-1)}
              className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Previous reviews"
            >
              ◀
            </button>
            <button
              onClick={() => scrollByCards(1)}
              className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Next reviews"
            >
              ▶
            </button>

            {/* Dots */}
            <div className="mt-6 flex justify-center gap-2">
              {Array.from({ length: Math.max(1, reviews.length - visible + 1) }).map((_, i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${i === idx ? "bg-purplecolor" : "bg-gray-300"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
