import { useNavigate } from "react-router-dom";
import Booking from "../assets/booking.jpg";


export default function HeroSection() {
  const navigate = useNavigate();
  const handleBooking = () => {
    navigate("/booking");
  };

  return (
    <section
      className="relative h-screen bg-fixed bg-center bg-cover bg-no-repeat flex flex-col justify-center items-center  "
      style={{
        backgroundImage: `url(${Booking})`,
      }}
    >
<div className="bg-black/10 backdrop-blur-sm p-6 md:p-10 rounded-full max-w-xl text-center transform -translate-y-10">
        <h2 className="text-4xl md:text-3xl font-bodonimoda text-white mb-4">
          Book Your Appointment
        </h2>
        <p className="text-white mb-2 font-bodonimoda text-lg">
          Phone Number: (778) 513-9006
        </p>
        <p className="text-white mb-4 font-bodonimoda text-lg">
          Choose your service and easily book online today!
        </p>
        <button
          onClick={handleBooking}
          className="bg-[#eabec5] font-bodonimoda text-[#55203d] px-6 py-2 rounded-full hover:bg-pink-700 hover:text-white transition"
        >
          BOOK NOW
        </button>
      </div>
    </section>
  );
}

