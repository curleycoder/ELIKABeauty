import { useNavigate } from "react-router-dom";
import Booking from "../assets/booking.jpg"

function BookingPreview() {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate("/booking");
  };

  return (
    <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden shadow-md mb-8">

      <img
        src={Booking}
        alt="Hair tools"
        className="relative inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex flex-col justify-center items-start px-6 md:px-20">
        <h2 className="text-3xl font-bodonimoda text-white mb-4">
          Book Your Appointment
        </h2>
        <p className="text-white mb-2 font-bodonimoda">
          Phone Number: (778) 513-9006
        </p>
        <p className="text-white mb-4 font-bodonimoda">
          Choose your service and easily book online today!
        </p>
        <button
          onClick={handleBooking}
          className="bg-[#eabec5] text-[#55203d] px-6 py-2 rounded-full hover:bg-pink-700 hover:text-white transition"
        >
          Go to Booking
        </button>
      </div>
    </section>
  );
}

export default BookingPreview;
