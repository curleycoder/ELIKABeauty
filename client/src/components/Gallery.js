// import React, { useState, useEffect } from 'react';


// const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";



// export default function Gallery() {
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);



//   useEffect(() => {
//     fetch(`${baseURL}/api/gallery`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data.images) && data.images.length > 0) {
//           setGalleryImages(data.images);
//           setSelectedImage(`${baseURL}${data.images[0]}`);
//         }

//       })
//       .catch((err) => console.log("Failed to load gallery images:", err));
//   }, []);

//   useEffect(() => {
//     if (!isAutoPlaying || galleryImages.length === 0) return;

//     const interval = setInterval(() => {
//       const nextIndex = (currentIndex + 1) % galleryImages.length;
//       setSelectedImage(baseURL + galleryImages[nextIndex]);
//       setCurrentIndex(nextIndex);
//     }, 3000);

//     return () => clearInterval(interval);
//   }, [currentIndex, isAutoPlaying, galleryImages]);

//   const handleSelectImage = (img, index) => {
//     setSelectedImage(baseURL + img);
//     setCurrentIndex(index);
//     setIsAutoPlaying(false);
//   };

//   const handleNext = () => {
//     const nextIndex = (currentIndex + 1) % galleryImages.length;
//     setSelectedImage(baseURL + galleryImages[nextIndex]);
//     setCurrentIndex(nextIndex);
//     setIsAutoPlaying(false);
//   };

//   const handlePrev = () => {
//     const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
//     setSelectedImage(baseURL + galleryImages[prevIndex]);
//     setCurrentIndex(prevIndex);
//     setIsAutoPlaying(false);
//   };

//   return (
//     <section id="gallery-section" className="text-center px-4 py-10">
//       <div className="text-center">
//             <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-16">
//                 <span className="border-t border-b border-gray-300 px-6">
//                 Photo Gallery
//                 </span>
//             </h2>
//         </div>

//       {/* Main Image with Navigation */}
//       <div className="relative flex justify-center items-center mb-6 h-[500px]">
//         {/* Left Arrow */}
//         <button
//           onClick={handlePrev}
//           className="absolute left-2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 shadow"
//         >
//           ◀
//         </button>

//         {/* Blurry Previous Image */}
//         {galleryImages.length > 0 && (
//           <img
//             src={`${baseURL}${galleryImages[(currentIndex - 1 + galleryImages.length) % galleryImages.length]}`}
//             alt="Previous Preview"
//             className="absolute left-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
//           />
//         )}

//         {/* Main Image */}
//         <img
//           src={selectedImage}
//           alt="Selected"
//           className="h-full w-auto max-w-full object-contain rounded-xl shadow-lg z-10"
//         />

//         {/* Blurry Next Image */}
//         {galleryImages.length > 0 && (
//           <img
//             src={baseURL + galleryImages[(currentIndex + 1) % galleryImages.length]}
//             alt="Next Preview"
//             className="absolute right-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
//           />
//         )}

//         {/* Right Arrow */}
//         <button
//           onClick={handleNext}
//           className="absolute right-2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 shadow"
//         >
//           ▶
//         </button>
//       </div>

//       {/* Thumbnails */}
//       <div className="flex overflow-x-auto space-x-3 px-4 scrollbar-hide">
//         {galleryImages.map((img, idx) => (
//           <img
//             key={idx}
//             src={baseURL + img}
//             alt={`Gallery ${idx}`}
//             onClick={() => handleSelectImage(img, idx)}
//             className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
//               currentIndex === idx ? 'border-purplecolor' : 'border-transparent'
//             }`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }
import React, { useEffect, useMemo, useRef, useState } from "react";

const baseURL = (process.env.REACT_APP_API_URL || "http://localhost:3000").replace(/\/$/, "");

function joinURL(base, path) {
  if (!path) return "";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);      // e.g. ["/uploads/a.jpg", ...]
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");       // full URL
  const timerRef = useRef(null);

  // fetch images once
  useEffect(() => {
    let mounted = true;
    fetch(`${baseURL}/api/gallery`, { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!mounted) return;
        const imgs = Array.isArray(data.images) ? data.images : [];
        if (imgs.length) {
          setGalleryImages(imgs);
          const first = joinURL(baseURL, imgs[0]);
          setSelectedImage(first);
          setCurrentIndex(0);
        }
      })
      .catch((err) => console.log("Failed to load gallery images:", err));
    return () => { mounted = false; };
  }, []);

  // derived urls
  const prevUrl = useMemo(() => {
    if (!galleryImages.length) return "";
    const i = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    return joinURL(baseURL, galleryImages[i]);
  }, [galleryImages, currentIndex]);

  const nextUrl = useMemo(() => {
    if (!galleryImages.length) return "";
    const i = (currentIndex + 1) % galleryImages.length;
    return joinURL(baseURL, galleryImages[i]);
  }, [galleryImages, currentIndex]);

  // prefetch the *next* full image so the click feels instant
  useEffect(() => {
    if (!nextUrl) return;
    const img = new Image();
    img.decoding = "async";
    img.src = nextUrl;
  }, [nextUrl]);

  // single timer (no stacking) + pause on hidden tab and on hover
  useEffect(() => {
    if (!isAutoPlaying || !galleryImages.length) return;

    // respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const delay = prefersReduced ? 6000 : 3000;

    function tick() {
      setCurrentIndex((i) => {
        const next = (i + 1) % galleryImages.length;
        setSelectedImage(joinURL(baseURL, galleryImages[next]));
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
  }, [isAutoPlaying, galleryImages.length]);

  // handlers
  const handleSelectImage = (idx) => {
    if (!galleryImages.length) return;
    setCurrentIndex(idx);
    setSelectedImage(joinURL(baseURL, galleryImages[idx]));
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

  // pause on hover over the main stage
  const onMouseEnter = () => setIsAutoPlaying(false);

  return (
    <section id="gallery-section" className="text-center px-4 py-10">
      <div className="text-center">
        <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-16">
          <span className="border-t border-b border-gray-300 px-6">Photo Gallery</span>
        </h2>
      </div>

      {/* Stage */}
      <div
        className="relative flex justify-center items-center mb-6 h-[500px] select-none"
        onMouseEnter={onMouseEnter}
      >
        {/* Prev arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 bg-white/70 rounded-full p-2 hover:bg-white shadow"
          aria-label="Previous"
        >
          ◀
        </button>

        {/* Blurry previews (lazy, low priority) */}
        {prevUrl && (
          <img
            src={prevUrl}
            alt=""
            className="absolute left-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
            loading="lazy"
            decoding="async"
          />
        )}

        {/* Main image */}
        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected"
            className="h-full w-auto max-w-full object-contain rounded-xl shadow-lg z-10"
            width={1200}
            height={800}
            loading="eager"
            fetchPriority="high"
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

        {/* Next arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 bg-white/70 rounded-full p-2 hover:bg-white shadow"
          aria-label="Next"
        >
          ▶
        </button>
      </div>

      {/* Thumbnails (lazy) */}
      <div className="flex overflow-x-auto space-x-3 px-4 scrollbar-hide">
        {galleryImages.map((img, idx) => {
          const url = joinURL(baseURL, img);
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

