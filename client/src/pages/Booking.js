import React, { useState } from "react";
import BookingForm from "../components/BookingForm";
import BackgroundPic from "../assets/hero.jpg";
import QuestionsForm from "../components/QuestionForm";
import DateTimePicker from "../components/DatePicker";
import services from "../data/services";
import { format } from "date-fns";

function getDurationStats(selected) {
  const durations = selected
    .map((name) => services.find((s) => s.name === name)?.duration || 60);
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

  const durationStats = getDurationStats(selection.selected);


  return (
    <div className="w-full min-h-screen relative font-bodonimoda bg-[#fff8fa]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-10"
        style={{ backgroundImage: `url(${BackgroundPic})` }}
      />

      {/* Foreground */}
      <div className="relative z-10 px-4 sm:px-6 py-10 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT: Service + Forms */}
          <div className="flex-1 rounded-[30px] p-5 sm:p-8 overflow-y-auto max-h-[calc(100vh-120px)]">
            {!showDateTime ? (
              <BookingForm 
              onSelectionChange={setSelection}
              averageDuration={durationStats.avg}
              onContinue={() => setShowDateTime(true)} />
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
              />
            )}
          </div>

          {/* RIGHT: Summary Menu */}
          {/* RIGHT: Summary Menu (Hidden on mobile) */}
          <div className="hidden sm:block w-full lg:w-[300px] bg-white rounded-[25px] shadow-xl p-6 sm:p-8 h-fit self-start sticky top-24">
            <h4 className="font-bold text-xl text-purplecolor mb-1">Beauty Shohre Studio</h4>
            <p className="text-sm text-gray-500 mb-4">275 Gilmore Ave, Burnaby</p>

            <p className="text-sm font-semibold mb-2">Selected Services:</p>
            {selection.selected.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No services selected</p>
            ) : (
              <ul className="text-sm space-y-1 mb-4 text-gray-700">
                {selection.selected.map((name) => (
                  <li key={name}>• {name}</li>
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
                <span>${selection.total}</span>
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
              <strong>Services:</strong> {bookingData.services.join(", ")}<br />
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
