// src/pages/BookingConfirmed.jsx
import React, { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { trackBookingConfirmed } from "../utils/analytics";

export default function BookingConfirmed() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const booking = location.state?.booking;
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    if (!bookingId) return;

    const sessionKey = `booking_conversion_${bookingId}`;
    const alreadyTracked = sessionStorage.getItem(sessionKey);

    if (alreadyTracked) return;

    trackBookingConfirmed();

    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-CONVERSION_ID/CONVERSION_LABEL",
        value: 1.0,
        currency: "CAD",
      });
    }

    sessionStorage.setItem(sessionKey, "true");
  }, [bookingId]);

  return (
    <div className="w-full min-h-screen bg-[#F8F7F1] px-4 sm:px-6 py-12 pt-20">
      <div className="max-w-2xl mx-auto bg-white rounded-[25px] shadow-xl p-6 sm:p-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#7a3b44] mb-4">
          Booking Confirmed ✅
        </h1>

        <p className="text-gray-700 mb-6">
          Your appointment has been confirmed.
        </p>

        {booking ? (
          <div className="bg-[#F8F7F1] rounded-2xl p-5 text-left max-w-md mx-auto mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>Name:</strong> {booking.name}
            </p>

            <p className="text-sm text-gray-700 mb-2">
              <strong>Services:</strong>{" "}
              {Array.isArray(booking.services)
                ? booking.services.map((s) => s?.name || s).filter(Boolean).join(", ")
                : ""}
            </p>

            <p className="text-sm text-gray-700 mb-2">
              <strong>Date:</strong>{" "}
              {booking.date ? format(parseISO(booking.date), "PPP") : ""}
            </p>

            <p className="text-sm text-gray-700">
              <strong>Time:</strong> {booking.time}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-600 mb-6">
            Your booking was submitted successfully.
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-3 rounded-full bg-[#7a3b44] text-white font-semibold hover:brightness-110"
          >
            Back to Home
          </Link>

          <Link
            to="/services"
            className="px-5 py-3 rounded-full border border-[#7a3b44]/20 text-[#7a3b44] font-semibold hover:bg-[#7a3b44]/5"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}