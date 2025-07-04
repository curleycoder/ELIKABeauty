import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:3000";


export default function GoogleReview() {
  const [reviews, setReviews] = useState([]);
  const [expanded, setExpanded] = useState({});

  const fetchReviews = () => {
    fetch(`${baseURL}/api/google/reviews`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          setReviews([]);
        }
      })
      .catch((err) => console.error("Failed to fetch reviews", err));
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const toggleExpanded = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section className="bg-white p-6 rounded-lg max-w-6xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl pt-10 font-bodonimoda text-[#55203d] mb-4">
          <span className="border-t border-b border-gray-300 px-6">
            What Our Clients Say
          </span>
        </h2>
        
      </div>

      <div className="mt-10">
        {reviews.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={30}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {reviews.map((review, index) => {
              const isExpanded = expanded[index];
              const fullText = review.text || "";
              const showReadMore = fullText.length > 180;
              const text = !isExpanded && showReadMore
                ? fullText.slice(0, 180) + "..."
                : fullText;

              return (
                <SwiperSlide key={index}>
                  <div className="h-[200px] flex flex-col justify-between bg-white border border-purplecolor rounded-xl shadow-md p-5">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={review.profile_photo_url}
                          alt={review.author_name}
                          className="h-10 w-10 rounded-full"
                        />
                        <div className="flex justify-between w-full">
                          <strong className="text-[#55203d] text-sm">
                            {review.author_name}
                          </strong>
                          <span className="text-sm">
                            {"⭐️".repeat(review.rating)}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm leading-snug">{text}</p>
                      {showReadMore && (
                        <button
                          onClick={() => toggleExpanded(index)}
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
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : (
          <p className="text-center text-gray-500 mt-6">No reviews found.</p>
        )}
      </div>
    </section>
  );
}
