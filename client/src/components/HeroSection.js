import { useNavigate } from "react-router-dom";
// import Booking from "../assets/booking.webp";

export default function HeroSection() {
  const navigate = useNavigate();
  const handleBooking = () => {
    navigate("/booking");
  };

  return (
    <section
      className="relative min-h-[80vh] sm:min-h-screen bg-center bg-cover bg-no-repeat flex flex-col justify-center items-center">
      <picture>
        <source
          type="image/webp"
          srcSet="/assets/booking-800.webp 800w, /assets/booking-1200.webp 1200w, /assets/booking-1600.webp 1600w"
          sizes="(max-width: 768px) 100vw, 90vw"
        />
        <img
          src="/assets/booking-1200.webp"
          alt="Beauty Shohre Studio"
          className="absolute inset-0 w-full h-full object-cover"
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="bg-black/10 backdrop-blur-sm px-4 py-6 sm:px-6 sm:py-8 md:px-10 rounded-2xl max-w-xl w-[90%] sm:w-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bodonimoda text-white mb-3 sm:mb-4">
          Book Your Appointment
        </h2>
        <p className="text-white font-bodonimoda text-base sm:text-lg mb-1">
          Phone Number: (778) 513-9006
        </p>
        <p className="text-white font-bodonimoda text-base sm:text-lg mb-4">
          Choose your service and easily book online today!
        </p>
        <button
          onClick={handleBooking}
          className="bg-[#eabec5] font-bodonimoda text-[#55203d] px-6 py-2 rounded-full hover:bg-purplecolor hover:text-white transition"
        >
          BOOK NOW
        </button>
      </div>
    </section>
  );
}
