import React, { useState, useEffect } from 'react';


const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";



export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);



  useEffect(() => {
    fetch(`${baseURL}/api/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.images) && data.images.length > 0) {
          setGalleryImages(data.images);
          setSelectedImage(baseURL + data.images[0]);
        }

      })
      .catch((err) => console.log("Failed to load gallery images:", err));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || galleryImages.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % galleryImages.length;
      setSelectedImage(baseURL + galleryImages[nextIndex]);
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, galleryImages]);

  const handleSelectImage = (img, index) => {
    setSelectedImage(baseURL + img);
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % galleryImages.length;
    setSelectedImage(baseURL + galleryImages[nextIndex]);
    setCurrentIndex(nextIndex);
    setIsAutoPlaying(false);
  };

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    setSelectedImage(baseURL + galleryImages[prevIndex]);
    setCurrentIndex(prevIndex);
    setIsAutoPlaying(false);
  };

  return (
    <section id="gallery-section" className="text-center px-4 py-10">
      <div className="text-center">
            <h2 className="text-3xl font-bodonimoda text-[#55203d] mb-16">
                <span className="border-t border-b border-gray-300 px-6">
                Photo Gallery
                </span>
            </h2>
        </div>

      {/* Main Image with Navigation */}
      <div className="relative flex justify-center items-center mb-6 h-[500px]">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 shadow"
        >
          ◀
        </button>

        {/* Blurry Previous Image */}
        {galleryImages.length > 0 && (
          <img
            src={baseURL + galleryImages[(currentIndex - 1 + galleryImages.length) % galleryImages.length]}
            alt="Previous Preview"
            className="absolute left-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
          />
        )}

        {/* Main Image */}
        <img
          src={selectedImage}
          alt="Selected"
          className="h-full w-auto max-w-full object-contain rounded-xl shadow-lg z-10"
        />

        {/* Blurry Next Image */}
        {galleryImages.length > 0 && (
          <img
            src={baseURL + galleryImages[(currentIndex + 1) % galleryImages.length]}
            alt="Next Preview"
            className="absolute right-14 h-[300px] w-auto object-contain opacity-30 blur-sm"
          />
        )}

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-2 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 shadow"
        >
          ▶
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex overflow-x-auto space-x-3 px-4 scrollbar-hide">
        {galleryImages.map((img, idx) => (
          <img
            key={idx}
            src={baseURL + img}
            alt={`Gallery ${idx}`}
            onClick={() => handleSelectImage(img, idx)}
            className={`h-20 w-20 object-cover rounded cursor-pointer border-2 ${
              currentIndex === idx ? 'border-purplecolor' : 'border-transparent'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

