import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function GoogleReview() {
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(1);
  const [idx, setIdx] = useState(0);

  const trackRef = useRef(null);

  // Fetch
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const r = await fetch(`${baseURL}/api/google/reviews`);
        const data = await r.json();
        if (!alive) return;

        setReviews(Array.isArray(data?.reviews) ? data.reviews : []);
      } catch (e) {
        console.error("❌ Failed to fetch reviews:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Responsive visible count (updates on resize/orientation)
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setVisible(w >= 1024 ? 3 : w >= 768 ? 2 : 1);
    };
    calc();
    window.addEventListener("resize", calc);
    window.addEventListener("orientationchange", calc);
    return () => {
      window.removeEventListener("resize", calc);
      window.removeEventListener("orientationchange", calc);
    };
  }, []);

  const maxIdx = useMemo(() => Math.max(0, reviews.length - visible), [reviews.length, visible]);

  const toggleExpanded = useCallback((i) => {
    setExpanded((p) => ({ ...p, [i]: !p[i] }));
  }, []);

  // Helper: get one card width (first child)
  const getCardWidth = useCallback(() => {
    const el = trackRef.current;
    if (!el) return 0;
    const first = el.querySelector("[data-card='1']");
    if (!first) return 0;
    return first.getBoundingClientRect().width;
  }, []);

  // Update active index on scroll (stable)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const cardW = getCardWidth();
        if (!cardW) return;
        const i = Math.round(el.scrollLeft / cardW);
        setIdx(clamp(i, 0, maxIdx));
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
  }, [getCardWidth, maxIdx]);

  const scrollByCards = useCallback(
    (n) => {
      const el = trackRef.current;
      if (!el) return;

      const cardW = getCardWidth();
      if (!cardW) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const behavior = prefersReduced ? "auto" : "smooth";

      el.scrollBy({ left: cardW * n, behavior });
    },
    [getCardWidth]
  );

  // Keyboard arrows (desktop convenience)
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") scrollByCards(1);
      if (e.key === "ArrowLeft") scrollByCards(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollByCards]);

  return (
    <section className="bg-white px-3 py-4 sm:p-6 rounded-xl max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl text-[#55203d] mb-3 sm:mb-6">
          <span className="border-t border-b py-2 font-display border-gray-300 px-6">
            What Our Clients Say
          </span>
        </h2>
      </div>

      <div className="mt-3 sm:mt-6 relative">
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
                relative z-10
                w-full flex gap-6
                overflow-x-auto overflow-y-hidden
                px-4
                touch-pan-x
                overscroll-x-contain
                [scrollbar-width:none] [-ms-overflow-style:none]
                sm:snap-x sm:snap-mandatory
              "
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-x",
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onPointerMove={(e) => e.stopPropagation()}
              role="list"
              aria-label="Client reviews carousel"
            >
              {reviews.map((review, i) => {
                const fullText = review?.text || "";
                const showReadMore = fullText.length > 180;
                const isExpanded = !!expanded[i];
                const shownText =
                  !isExpanded && showReadMore ? fullText.slice(0, 180) + "..." : fullText;

                return (
                  <article
                    key={`${review?.author_name || "review"}-${i}`}
                    role="listitem"
                    data-card="1"
                    className="select-none shrink-0 w-[85%] sm:w-[48%] lg:w-[32%] sm:snap-start"
                  >
                    <div
                      className={[
                        "flex flex-col bg-white border border-purplecolor rounded-xl shadow-md p-5",
                        isExpanded ? "h-auto" : "h-[220px] overflow-hidden",
                      ].join(" ")}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          {review?.profile_photo_url ? (
                            <img
                              src={review.profile_photo_url}
                              alt={review?.author_name || "Reviewer"}
                              className="h-10 w-10 rounded-full"
                              loading="lazy"
                              decoding="async"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200" />
                          )}

                          <div className="flex justify-between w-full items-center">
                            <strong className="text-[#55203d] text-sm">
                              {review?.author_name || "Client"}
                            </strong>
                            <span className="text-sm" aria-label={`${review?.rating || 0} stars`}>
                              {"⭐️".repeat(clamp(Number(review?.rating) || 0, 0, 5))}
                            </span>
                          </div>
                        </div>

                        <p
                          className={[
                            "text-gray-700 text-sm leading-snug break-words",
                            isExpanded ? "" : "line-clamp-4",
                          ].join(" ")}
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
                          {shownText}
                        </p>

                        {showReadMore && (
                          <button
                            type="button"
                            onClick={() => toggleExpanded(i)}
                            className="text-pinkcolor text-xs underline mt-1"
                          >
                            {isExpanded ? "Show less" : "Read more"}
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 italic mt-2">
                        {review?.relative_time_description || ""}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Arrows (sm+) */}
            <button
              type="button"
              onClick={() => scrollByCards(-1)}
              className="hidden sm:flex absolute -left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Previous reviews"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => scrollByCards(1)}
              className="hidden sm:flex absolute -right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 shadow hover:bg-white"
              aria-label="Next reviews"
            >
              ▶
            </button>

            {/* Dots */}
            <div className="mt-4 sm:mt-6 flex justify-center gap-2">
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
