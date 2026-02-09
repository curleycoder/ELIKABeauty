import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const baseURL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(
  /\/$/,
  ""
);

function joinURL(base, path) {
  if (!path) return "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function normalizeCategory(img) {
  // Support a few possible API shapes
  const raw =
    img?.category ||
    img?.service ||
    img?.type ||
    img?.tag ||
    img?.tags?.[0] ||
    "Other";

  return String(raw).trim() || "Other";
}

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("cat") || "All";

  const [allImages, setAllImages] = useState([]);
  const [category, setCategory] = useState(initialCategory);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const timerRef = useRef(null);

  // Fetch once
  useEffect(() => {
    let mounted = true;

    fetch(`${baseURL}/api/gallery`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;

        const imgs = Array.isArray(data)
          ? data
          : Array.isArray(data.images)
          ? data.images
          : [];

        if (!imgs.length) return;

        // Ensure each item has a normalized category for filtering
        const normalized = imgs.map((img) => ({
          ...img,
          _cat: normalizeCategory(img),
        }));

        setAllImages(normalized);
      })
      .catch((err) => console.log("Failed to load gallery images:", err));

    return () => {
      mounted = false;
    };
  }, []);

  // Categories list (derived)
  const categories = useMemo(() => {
    const set = new Set(allImages.map((img) => img._cat));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [allImages]);

  // Filtered images
  const images = useMemo(() => {
    if (category === "All") return allImages;
    return allImages.filter((img) => img._cat === category);
  }, [allImages, category]);

  // When category changes: reset selection to first item
  useEffect(() => {
    if (!images.length) {
      setSelectedImage("");
      setCurrentIndex(0);
      return;
    }
    setCurrentIndex(0);
    const first = images[0];
    setSelectedImage(joinURL(baseURL, first.preview || first.full || first.thumb));
  }, [images]);

  // Helper: select an index (within filtered list)
  const selectIndex = useCallback(
    (idx, { stopAuto = true } = {}) => {
      if (!images.length) return;

      const safe = ((idx % images.length) + images.length) % images.length;
      const item = images[safe];

      setCurrentIndex(safe);
      setSelectedImage(joinURL(baseURL, item.preview || item.full || item.thumb));

      if (stopAuto) setIsAutoPlaying(false);
    },
    [images]
  );

  const handleNext = useCallback(() => {
    selectIndex(currentIndex + 1);
  }, [currentIndex, selectIndex]);

  const handlePrev = useCallback(() => {
    selectIndex(currentIndex - 1);
  }, [currentIndex, selectIndex]);

  // Derived prev/next URLs (based on filtered list)
  const prevUrl = useMemo(() => {
    if (!images.length) return "";
    const i = (currentIndex - 1 + images.length) % images.length;
    const item = images[i];
    return joinURL(baseURL, item.preview || item.full || item.thumb);
  }, [images, currentIndex]);

  const nextUrl = useMemo(() => {
    if (!images.length) return "";
    const i = (currentIndex + 1) % images.length;
    const item = images[i];
    return joinURL(baseURL, item.preview || item.full || item.thumb);
  }, [images, currentIndex]);

  // Prefetch next preview
  useEffect(() => {
    if (!nextUrl) return;
    const img = new Image();
    img.decoding = "async";
    img.src = nextUrl;
  }, [nextUrl]);

  // Single timer + pause on hidden tab (uses filtered list)
  useEffect(() => {
    if (!isAutoPlaying || !images.length) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const delay = prefersReduced ? 6000 : 3000;

    const tick = () => {
      setCurrentIndex((i) => {
        const next = (i + 1) % images.length;
        const item = images[next];
        setSelectedImage(joinURL(baseURL, item.preview || item.full || item.thumb));
        return next;
      });
    };

    timerRef.current = window.setInterval(tick, delay);

    const onVisibility = () => {
      if (document.hidden && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      } else if (!document.hidden && !timerRef.current && isAutoPlaying) {
        timerRef.current = window.setInterval(tick, delay);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [isAutoPlaying, images]);

  // Keyboard nav (stable)
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.code === "Space") {
        e.preventDefault();
        setIsAutoPlaying((p) => !p);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev]);

  // Category click (also updates URL like /gallery?cat=Hair)
  const pickCategory = (cat) => {
    setCategory(cat);
    setSearchParams(cat === "All" ? {} : { cat });
    setIsAutoPlaying(false);
  };

  return (
    <section id="gallery-page" className="text-center px-4 py-10">
      <div className="text-center">
        <h1 className="text-3xl text-[#55203d] mb-2">Gallery</h1>
        <p className="text-sm text-gray-600 mb-6">
          Browse by service. Click any thumbnail to pause autoplay.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => pickCategory(cat)}
            className={[
              "px-4 py-2 rounded-full border text-sm transition",
              cat === category
                ? "bg-[#55203d] text-white border-[#55203d]"
                : "bg-white/70 text-gray-700 border-pink-100 hover:bg-white",
            ].join(" ")}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Stage */}
      <div
        className="relative flex justify-center items-center mb-6 h-[340px] sm:h-[500px] select-none"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onTouchStart={() => setIsAutoPlaying(false)}
      >
        <button
          onClick={handlePrev}
          className="absolute left-2 bg-white/70 rounded-full p-2 hover:bg-white shadow z-20"
          aria-label="Previous"
          type="button"
        >
          ◀
        </button>

        {/* Side previews (hide on mobile) */}
        {prevUrl && (
          <img
            src={prevUrl}
            alt=""
            className="hidden sm:block absolute left-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Main image */}
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={`Elika Beauty ${category} gallery image`}
            className="h-full w-auto max-w-full object-contain rounded-xl shadow-lg z-10"
            width={1200}
            height={800}
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full max-w-3xl rounded-xl border border-pink-100 bg-white/70 flex items-center justify-center text-gray-500">
            No images found in “{category}”
          </div>
        )}

        {nextUrl && (
          <img
            src={nextUrl}
            alt=""
            className="hidden sm:block absolute right-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
            loading="lazy"
            decoding="async"
          />
        )}

        <button
          onClick={handleNext}
          className="absolute right-2 bg-white/70 rounded-full p-2 hover:bg-white shadow z-20"
          aria-label="Next"
          type="button"
        >
          ▶
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto space-x-3 px-4 scrollbar-hide justify-center">
        {images.map((img, idx) => {
          const url = joinURL(baseURL, img.thumb || img.preview || img.full);
          return (
            <img
              key={`${img._cat}-${idx}`}
              src={url}
              alt={`${img._cat} thumbnail ${idx + 1}`}
              onClick={() => selectIndex(idx)}
              className={[
                "h-20 w-20 object-cover rounded cursor-pointer border-2",
                currentIndex === idx ? "border-[#55203d]" : "border-transparent",
              ].join(" ")}
              loading="lazy"
              decoding="async"
              width={80}
              height={80}
            />
          );
        })}
      </div>
    </section>
  );
}
