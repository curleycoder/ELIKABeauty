import React, { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import QuestionsForm from "../components/QuestionForm";
import DateTimePicker from "../components/DatePicker";
import services from "../data/services";
import { format } from "date-fns";

function getDurationStats(selected) {
  const durations = selected.map((s) => s?.duration || 60);
  const total = durations.reduce((sum, d) => sum + d, 0);
  const avg = durations.length ? Math.round(total / durations.length) : 0;
  return { total, avg };
}

export default function Booking() {
  const [selection, setSelection] = useState({ selected: [], total: 0 });
  const [showDateTime, setShowDateTime] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [bookingTime, setBookingTime] = useState(null);
  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);

  // NEW: collapsed info
  const [showInfo, setShowInfo] = useState(false);

  const durationStats = getDurationStats(selection.selected);

  // ✅ Title + meta (no extra libs)
  useEffect(() => {
    document.title = "Book Your Hair Appointment | Beauty Shohre Studio, Burnaby";
    const meta =
      document.querySelector('meta[name="description"]') ||
      (() => {
        const m = document.createElement("meta");
        m.setAttribute("name", "description");
        document.head.appendChild(m);
        return m;
      })();
    meta.setAttribute(
      "content",
      "Book your hair appointment at Beauty Shohre Studio in Burnaby. Highlights, balayage, keratin, haircuts near Brentwood. Easy online scheduling and clear policies."
    );
  }, []);

  return (
    <div className="w-full min-h-screen relative font-bodonimoda bg-[#fff8fa] pb-16 sm:pb-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-10 sm:hidden"
        style={{ backgroundImage: 'url(/assets/hero-800.webp)' }}
        aria-hidden="true"
      />
      <div
        className="hidden sm:block absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-10"
        style={{ backgroundImage: 'url(/assets/hero-1600.webp)' }}
        aria-hidden="true"
      />

      {/* Foreground */}
      <div className="relative z-10 px-4 sm:px-6 py-10 max-w-6xl mx-auto">
        {/* Minimal header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl text-purplecolor font-bold">
            <span className="border-t border-b border-gray-300 px-4 sm:px-6">
              Book Your Hair Appointment
            </span>
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            Burnaby • Near Brentwood • 31+ years experience
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setShowInfo((s) => !s)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white border border-purplecolor/30 text-purplecolor text-sm font-semibold shadow hover:bg-purplecolor/5"
              aria-expanded={showInfo}
              aria-controls="booking-info"
            >
              {showInfo ? "Hide details" : "Booking details"}
            </button>
          </div>
        </header>

        {/* Collapsible SEO copy — hidden on initial load */}
        <section
          id="booking-info"
          className={`bg-white/70 rounded-2xl shadow-sm border border-pink-100 text-gray-700 leading-relaxed transition-all duration-300 ${
            showInfo
              ? "p-5 sm:p-7 mb-6 opacity-100 max-h-[2000px]"
              : "p-0 mb-2 opacity-0 max-h-0 overflow-hidden"
          }`}
          aria-hidden={!showInfo}
        >
          <p>
            We’re excited to welcome you to <strong>Beauty Shohre Studio</strong> in{" "}
            <strong>Burnaby</strong>, near Brentwood. Whether you’re booking{" "}
            <em>highlights, balayage, a keratin treatment, or a precision haircut</em>,
            our goal is healthy, beautiful hair that fits your lifestyle.
          </p>

          <h2 className="text-xl font-semibold text-purplecolor mt-4">How Online Booking Works</h2>
          <p className="mt-1">
            1) <strong>Select your service(s)</strong>. 2) We estimate the{" "}
            <strong>time needed</strong>. 3) Pick a <strong>date & time</strong>. 4) Add a few
            details. You’ll receive instant confirmation.
          </p>

          <h2 className="text-xl font-semibold text-purplecolor mt-4">Pricing & Timing</h2>
          <p className="mt-1">
            Prices are starting points and may vary with <em>hair length, volume, thickness</em>.
            For big color changes (e.g., dark to blonde), mention it in notes so we can reserve
            enough time.
          </p>

          <h2 className="text-xl font-semibold text-purplecolor mt-4">Policies</h2>
          <p className="mt-1">
            Please give <strong>24 hours’ notice</strong> for cancellations/rescheduling. Running
            late? Text/call <strong>778-513-9006</strong> and we’ll do our best to help.
          </p>

          <h2 className="text-xl font-semibold text-purplecolor mt-4">Location</h2>
          <p className="mt-1">
            <strong>275 Gilmore Ave, Burnaby</strong>. Near Brentwood. Free street
            parking nearby.
          </p>
        </section>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: Service + Forms */}
          <div className="flex-1 rounded-[30px] p-5 sm:p-8 overflow-y-auto max-h-[calc(100vh-120px)] bg-transparent">
            {!showDateTime ? (
              <BookingForm
                onSelectionChange={setSelection}
                averageDuration={durationStats.avg}
                onContinue={() => setShowDateTime(true)}
              />
            ) : !showQuestions ? (
              <DateTimePicker
                duration={durationStats.total}
                onSelect={(value) => {
                  setBookingTime(value);
                  setShowQuestions(true);
                }}
              />
            ) : (
              <QuestionsForm
                selection={selection}
                bookingTime={bookingTime}
                onSubmit={(formData) => {
                  setBookingData(formData);
                  setShowFinalPopup(true);
                }}
                setLoading={setLoading}
              />
            )}
          </div>

          {/* RIGHT: Summary */}
          <div className="hidden sm:block w-full lg:w-[300px] bg-white rounded-[25px] shadow-xl p-6 sm:p-8 h-fit self-start sticky top-24">
            <h4 className="font-bold text-xl text-purplecolor mb-1">Beauty Shohre Studio</h4>
            <p className="text-sm text-gray-500 mb-4">275 Gilmore Ave, Burnaby</p>

            <p className="text-sm font-semibold mb-2">Selected Services:</p>
            {selection.selected.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No services selected</p>
            ) : (
              <ul className="text-sm space-y-1 mb-4 text-gray-700">
                {selection.selected.map((s) => (
                  <li key={s._id}>• {s.name}</li>
                ))}
              </ul>
            )}
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Time on Service</span>
              <span>{durationStats.avg} min</span>
            </div>

            <hr className="my-4 border-pink-100" />
            <div className="text-lg font-semibold text-purplecolor">
              <div className="flex justify-between mb-1">
                <span>Total</span>
                <span>{selection.total > 0 ? `+$${selection.total}` : `$0`}</span>
              </div>
              <p className="text-sm italic text-gray-400 mt-2 leading-tight">
                * Final pricing depends on hair length, volume, and thickness.
              </p>
            </div>

            <button
              className={`mt-6 w-full py-3 rounded-full text-white font-bold transition ${
                selection.selected.length === 0
                  ? "bg-purplecolor/20 cursor-not-allowed"
                  : "bg-purplecolor hover:brightness-110"
              }`}
              disabled={selection.selected.length === 0}
              onClick={() => setShowDateTime(true)}
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* ✅ FINAL POPUP */}
      {showFinalPopup && bookingData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-md space-y-4">
            <h3 className="text-xl font-semibold text-purplecolor">Booking Confirmed ✅</h3>

            <p className="text-sm text-gray-700">
              Dear <span className="font-semibold">{bookingData.name}</span>,<br />
              your booking has been confirmed.
            </p>

            <p className="text-sm text-gray-700">
              <strong>Services:</strong>{" "}
              {bookingData.services.map((s) => s.name).join(", ")}<br />
              <strong>Date:</strong> {format(bookingData.date, "PPP")}<br />
              <strong>Time:</strong> {bookingData.time}
            </p>

            <p className="text-sm text-gray-600 italic">
              You will receive a confirmation email shortly.<br />
              For changes, contact <strong>Shohre</strong> at <strong>778-513-9006</strong>.
            </p>

            <button
              onClick={() => {
                setShowFinalPopup(false);
                setShowQuestions(false);
                setShowDateTime(false);
                setBookingData(null);
                setBookingTime(null);
                setSelection({ selected: [], total: 0 });
              }}
              className="mt-2 px-5 py-2 bg-purplecolor text-white rounded-lg shadow hover:brightness-110"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
