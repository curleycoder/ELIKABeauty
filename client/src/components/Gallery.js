import React, { useEffect, useMemo, useRef, useState } from "react";

const baseURL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/$/, "");

function joinURL(base, path) {
  if (!path) return "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function Gallery() {
  // galleryImages = [{ thumb, preview, full }, ...]
  const [galleryImages, setGalleryImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedImage, setSelectedImage] = useState(""); // full URL for the main image
  const timerRef = useRef(null);

  // fetch images once (ALLOW caching)
  useEffect(() => {
    let mounted = true;

    fetch(`${baseURL}/api/gallery`)
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;

        const imgs = Array.isArray(data.images) ? data.images : [];
        if (!imgs.length) return;

        setGalleryImages(imgs);

        // Start with preview (fast)
        setSelectedImage(joinURL(baseURL, imgs[0].preview || imgs[0].full || imgs[0].thumb));
        setCurrentIndex(0);
      })
      .catch((err) => console.log("Failed to load gallery images:", err));

    return () => {
      mounted = false;
    };
  }, []);

  // derived urls (use PREVIEW for stage side images)
  const prevUrl = useMemo(() => {
    if (!galleryImages.length) return "";
    const i = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    const item = galleryImages[i];
    return joinURL(baseURL, item.preview || item.full || item.thumb);
  }, [galleryImages, currentIndex]);

  const nextUrl = useMemo(() => {
    if (!galleryImages.length) return "";
    const i = (currentIndex + 1) % galleryImages.length;
    const item = galleryImages[i];
    return joinURL(baseURL, item.preview || item.full || item.thumb);
  }, [galleryImages, currentIndex]);

  // prefetch the next PREVIEW (not full)
  useEffect(() => {
    if (!nextUrl) return;
    const img = new Image();
    img.decoding = "async";
    img.src = nextUrl;
  }, [nextUrl]);

  // single timer (no stacking) + pause on hidden tab
  useEffect(() => {
    if (!isAutoPlaying || !galleryImages.length) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReduced ? 6000 : 3000;

    function tick() {
      setCurrentIndex((i) => {
        const next = (i + 1) % galleryImages.length;
        const item = galleryImages[next];
        setSelectedImage(joinURL(baseURL, item.preview || item.full || item.thumb));
        return next;
      });
    }

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
  }, [isAutoPlaying, galleryImages]); // use galleryImages, not galleryImages.length

  // handlers
  const handleSelectImage = (idx) => {
    if (!galleryImages.length) return;

    const item = galleryImages[idx];
    setCurrentIndex(idx);

    // show preview by default
    setSelectedImage(joinURL(baseURL, item.preview || item.full || item.thumb));

    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    if (!galleryImages.length) return;
    const next = (currentIndex + 1) % galleryImages.length;
    handleSelectImage(next);
  };

  const handlePrev = () => {
    if (!galleryImages.length) return;
    const prev = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    handleSelectImage(prev);
  };

  // keyboard nav
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === " ") setIsAutoPlaying((p) => !p);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentIndex, galleryImages.length]);

  const onMouseEnter = () => setIsAutoPlaying(false);

  return (
    <section id="gallery-section" className="text-center px-4 py-8">
      <div className="text-center">
        <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-6">
          <span className="border-t border-b border-gray-300 px-6">Photo Gallery</span>
        </h2>
      </div>

      {/* Stage */}
      <div className="relative flex justify-center items-center mb-6 h-[500px] select-none" onMouseEnter={onMouseEnter}>
        <button
          onClick={handlePrev}
          className="absolute left-2 bg-white/70 rounded-full p-2 hover:bg-white shadow"
          aria-label="Previous"
        >
          ◀
        </button>

        {/* Side previews (preview size) */}
        {prevUrl && (
          <img
            src={prevUrl}
            alt=""
            className="absolute left-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Main image (preview size) */}
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="h-full w-auto max-w-full object-contain rounded-xl shadow-lg z-10"
            width={1200}
            height={800}
            loading="eager"
            decoding="async"
          />
        )}

        {nextUrl && (
          <img
            src={nextUrl}
            alt=""
            className="absolute right-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
            loading="lazy"
            decoding="async"
          />
        )}

        <button
          onClick={handleNext}
          className="absolute right-2 bg-white/70 rounded-full p-2 hover:bg-white shadow"
          aria-label="Next"
        >
          ▶
        </button>
      </div>

      {/* Thumbnails (thumb size) */}
      <div className="flex overflow-x-auto space-x-3 px-4 scrollbar-hide">
        {galleryImages.map((img, idx) => {
          const url = joinURL(baseURL, img.thumb || img.preview || img.full);
          return (
            <img
              key={idx}
              src={url}
              alt={`Thumbnail ${idx + 1}`}
              onClick={() => handleSelectImage(idx)}
              className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
                currentIndex === idx ? "border-purplecolor" : "border-transparent"
              }`}
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
