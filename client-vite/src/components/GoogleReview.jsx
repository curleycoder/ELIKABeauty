import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { FaStar } from "react-icons/fa";

const baseURL = (import.meta.env.VITE_API_URL || "https://api.elikabeauty.ca").replace(/\/$/, "");

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
  const cardWRef = useRef(0); // ✅ cached card width
  const draggingRef = useRef(false);
  const drag = useRef({ startX: 0, startScrollLeft: 0, pointerId: null });

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

  // Responsive visible count
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

  // ✅ Cache card width only when needed (not every scroll tick)
  useEffect(() => {
    const calcCardWidth = () => {
      const el = trackRef.current;
      if (!el) return;
      const first = el.querySelector("[data-card='first']");
      cardWRef.current = first ? first.getBoundingClientRect().width : 0;
    };

    // wait a frame so layout is ready
    const raf = requestAnimationFrame(calcCardWidth);
    window.addEventListener("resize", calcCardWidth);
    window.addEventListener("orientationchange", calcCardWidth);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", calcCardWidth);
      window.removeEventListener("orientationchange", calcCardWidth);
    };
  }, [reviews.length]);

  // ✅ Lightweight scroll listener (no layout reads)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        // Don’t fight while dragging
        if (draggingRef.current) return;

        const w = cardWRef.current || 1;
        const i = Math.round(el.scrollLeft / w);
        setIdx((prev) => {
          const next = clamp(i, 0, maxIdx);
          return prev === next ? prev : next; // ✅ avoid re-render spam
        });
      });
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => el.removeEventListener("scroll", onScroll);
  }, [maxIdx]);

  const scrollByCards = useCallback(
    (n) => {
      const el = trackRef.current;
      if (!el) return;

      const w = cardWRef.current || 0;
      if (!w) return;

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.matchMedia("(max-width: 640px)").matches;
      const behavior = prefersReduced || isMobile ? "auto" : "smooth";

      el.scrollBy({ left: w * n, behavior });
    },
    []
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

  // ✅ Pointer drag ONLY for desktop mouse (mobile uses native scroll now)
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse") return;

    const el = trackRef.current;
    if (!el) return;
    if (e.button !== 0) return;

    draggingRef.current = true;
    drag.current.startX = e.clientX;
    drag.current.startScrollLeft = el.scrollLeft;
    drag.current.pointerId = e.pointerId;

    el.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    const el = trackRef.current;
    if (!el) return;
    if (!draggingRef.current) return;
    if (drag.current.pointerId !== e.pointerId) return;

    const dx = e.clientX - drag.current.startX;
    el.scrollLeft = drag.current.startScrollLeft - dx;
  };

  const endDrag = (e) => {
    const el = trackRef.current;
    if (!el) return;

    if (drag.current.pointerId === e.pointerId) {
      draggingRef.current = false;
      drag.current.pointerId = null;
      el.releasePointerCapture?.(e.pointerId);
    }
  };

  return (
    <section className="px-3 py-8  sm:p-6 rounded-xl max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-theseason sm:text-3xl text-[#440008] mb-1 sm:mb-3">
          What Clients Say About Us
        </h2>
      </div>

      <div className="mt-3 sm:mt-6 relative">
        {loading ? (
          <p className="text-center text-[#440008]-500 mt-6">Loading reviews...</p>
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
                overscroll-x-contain
                [scrollbar-width:none] [-ms-overflow-style:none]
                sm:snap-x sm:snap-mandatory
              "
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-x",
              }}
              role="list"
              aria-label="Client reviews carousel"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
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
                    data-card={i === 0 ? "first" : undefined}
                    className="select-none shrink-0 w-[85%] sm:w-[48%] lg:w-[32%] sm:snap-start"
                    draggable={false}
                  >
                    <div
                      className={[
                        "flex flex-col bg-white border border-[#1A0003] rounded-xl shadow-md p-5",
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
                              draggable="false"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200" />
                          )}

                          <div className="flex justify-between w-full items-center">
                            <strong className="text-[#440008] text-sm">
                              {review?.author_name || "Client"}
                            </strong>
                            <span className="flex gap-0.5 text-amber-400" aria-label={`${review?.rating || 0} stars`}>
                              {Array.from({ length: clamp(Number(review?.rating) || 0, 0, 5) }).map((_, si) => (
                                <FaStar key={si} className="text-xs" />
                              ))}
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
                            className="text-[#1A0003] text-xs underline mt-1"
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
                  className={`h-2 w-2 rounded-full ${i === idx ? "bg-[#1A0003]" : "bg-gray-300"}`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <a
                href="https://www.google.com/search?q=Elika+Beauty+Burnaby+reviews"
                target="_blank"
                rel="noreferrer"
                className="text-sm underline text-[#440008] hover:opacity-80"
              >
                Leave a Google Review
              </a>
            </div>

          </>
        )}
      </div>
    </section>
  );
}
