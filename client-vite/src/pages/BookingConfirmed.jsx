import React, { useEffect } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { format, parseISO } from "date-fns";
import { trackBookingConfirmed } from "../utils/analytics";
import { FaCheckCircle, FaCalendarPlus } from "react-icons/fa";

function buildGoogleCalendarUrl({ name, date, time, services }) {
  try {
    // Parse date + time into a Date object (treat as Vancouver local time)
    const [year, month, day] = date.split("-").map(Number);
    const [timePart, period] = time.split(" ");
    let [h, m] = timePart.split(":").map(Number);
    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;
    const start = new Date(year, month - 1, day, h, m);
    const end = new Date(start.getTime() + 90 * 60 * 1000); // assume 90 min

    const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split(".")[0];
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Elika Beauty – ${services || "Appointment"}`,
      dates: `${fmt(start)}/${fmt(end)}`,
      details: `Your appointment at Elika Beauty. Call (604) 438-3727 to reschedule.`,
      location: "3790 Canada Way #102, Burnaby, BC V5G 1G4",
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  } catch {
    return null;
  }
}

export default function BookingConfirmed() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const booking = location.state?.booking;
  const bookingId = searchParams.get("bookingId");

  const servicesLabel = Array.isArray(booking?.services)
    ? booking.services.map((s) => s?.name || s).filter(Boolean).join(", ")
    : "";

  const calendarUrl = booking?.date && booking?.time
    ? buildGoogleCalendarUrl({ name: booking.name, date: booking.date, time: booking.time, services: servicesLabel })
    : null;

  useEffect(() => {
    if (!bookingId) return;

    const sessionKey = `booking_conversion_${bookingId}`;
    const alreadyTracked = sessionStorage.getItem(sessionKey);

    if (alreadyTracked) return;

    trackBookingConfirmed();
    sessionStorage.setItem(sessionKey, "true");
  }, [bookingId]);

  return (
    <>
    <Helmet>
      <title>Booking Confirmed | Elika Beauty</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div className="w-full min-h-screen bg-[#F8F7F1] px-4 sm:px-6 py-12 pt-24">
      <div className="max-w-2xl mx-auto bg-white rounded-[25px] shadow-xl p-6 sm:p-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#7a3b44] mb-4 flex items-center justify-center gap-2">
          <FaCheckCircle className="text-green-500" aria-hidden="true" /> Booking Confirmed
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
              {servicesLabel}
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
          {calendarUrl && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Add appointment to Google Calendar (opens in new tab)"
              className="px-5 py-3 rounded-full bg-white border border-[#7a3b44]/20 text-[#7a3b44] font-semibold hover:bg-[#7a3b44]/5 flex items-center justify-center gap-2"
            >
              <FaCalendarPlus aria-hidden="true" /> Add to Calendar
            </a>
          )}
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
    </>
  );
}