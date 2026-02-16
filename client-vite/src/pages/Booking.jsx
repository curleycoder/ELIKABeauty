import React, { useEffect, useMemo, useState } from "react";
import BookingForm from "../components/BookingForm";
import QuestionsForm from "../components/QuestionForm";
import DateTimePicker from "../components/DatePicker";
// import SimpleDateTimePicker from "../components/SimpleDateTimePicker";

import { format, parseISO } from "date-fns";

const NO_BUFFER_SERVICE_NAMES = new Set(["Eyebrows Threading", "Full Threading"]);
const DEFAULT_BUFFER_MINUTES = 15;

function getDurationStats(selected) {
  const durations = selected.map((s) => s?.duration || 60);
  const total = durations.reduce((sum, d) => sum + d, 0);
  const avg = durations.length ? Math.round(total / durations.length) : 0;
  return { total, avg };
}

const STEPS = [
  { key: "services", title: "Choose services" },
  { key: "datetime", title: "Pick a time" },
  { key: "details", title: "Your details" },
];

export default function Booking() {
  const [selection, setSelection] = useState({ selected: [], total: 0 });

  // ✅ Stepper (replaces showDateTime/showQuestions)
  const [step, setStep] = useState(0);

  const [bookingTime, setBookingTime] = useState(null);

  const [showFinalPopup, setShowFinalPopup] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  // Used to trigger QuestionsForm submission from the bottom CTA (no ref hacks)
  const [submitTick, setSubmitTick] = useState(0);

  useEffect(() => {
    document.title =
      "Book Your Hair Appointment | ELIKA Beauty, North Burnaby";

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
      "Book your hair appointment at ELIKA Beauty Salon. Highlights, balayage, keratin, haircuts near Brentwood. Easy online scheduling and clear policies."
    );
  }, []);

  const durationStats = useMemo(
    () => getDurationStats(selection.selected),
    [selection.selected]
  );

  const bufferMinutes = useMemo(() => {
    if (!selection.selected.length) return 0;

    const needsBuffer = selection.selected.some(
      (s) => !NO_BUFFER_SERVICE_NAMES.has(String(s?.name || "").trim())
    );

    return needsBuffer ? DEFAULT_BUFFER_MINUTES : 0;
  }, [selection.selected]);

  const totalBlockedMinutes = durationStats.total + bufferMinutes;

  const canContinue = useMemo(() => {
    if (step === 0) return selection.selected.length > 0;
    if (step === 1) return !!bookingTime;
    if (step === 2) return true;
    return false;
  }, [step, selection.selected.length, bookingTime]);

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(STEPS.length - 1, s + 1));

  // If they change services after picking a time, time might no longer fit -> reset
  useEffect(() => {
  setBookingTime(null);
}, [selection.selected]);


  // Scroll to top on step change (feels premium)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="w-full min-h-screen relative font-sans bg-[#F8F7F1]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-10 sm:hidden"
        style={{ backgroundImage: "url(/assets/hero-800.webp)" }}
        aria-hidden="true"
      />
      <div
        className="hidden sm:block absolute inset-0 bg-cover bg-center bg-no-repeat z-0 opacity-10"
        style={{ backgroundImage: "url(/assets/hero-1600.webp)" }}
        aria-hidden="true"
      />

      {/* ✅ Sticky stepper header (Apple vibe) */}
      <div className="sticky top-0 z-30 bg-[#F8F7F1]/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 0}
              className={`text-sm font-semibold font-display ${
                step === 0 ? "opacity-30 cursor-not-allowed" : "text-[#7a3b44]"
              }`}
            >
              Back
            </button>

            <div className="text-center">
              <div className="text-xs text-gray-500">
                Step {step + 1} of {STEPS.length}
              </div>
              <h2 className="text-lg sm:text-xl font-display font-bold text-[#7a3b44]">
                {STEPS[step].title}
              </h2>
            </div>

            <button
              onClick={() => {
                // reset everything
                setStep(0);
                setBookingTime(null);
                setSelection({ selected: [], total: 0 });
                setShowInfo(false);
              }}
              className="text-sm font-semibold font-display text-[#55203d]/70 hover:text-[#7a3b44]"
            >
              Reset
            </button>
          </div>

          <div className="mt-3 h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7a3b44] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Foreground */}
      <div className="relative z-10 px-4 sm:px-6 py-8 max-w-6xl mx-auto">
        {/* Header (kept, but not huge) */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl text-[#7a3b44] font-theseason font-bold">
            <span className=" py-2 px-4 sm:px-6">
              Book Your Appointment
            </span>
          </h1>
          <p className="text-gray-600 text-sm mt-2">
            3790 Canada Way #102, Burnaby
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setShowInfo((s) => !s)}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-white border border-[#55203d]/30 text-[#7a3b44] text-sm font-semibold font-display shadow hover:bg-[#55203d]/5"
              aria-expanded={showInfo}
              aria-controls="booking-info"
            >
              {showInfo ? "Hide details" : "Booking details"}
            </button>
          </div>
        </header>

        {/* Optional info */}
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
    We’re excited to welcome you to{" "}
    <strong className="font-theseason text-[#7a3b44]">
      ELIKA BEAUTY
    </strong>{" "}
    at <strong className=" text-[#7a3b44]">3790 Canada Way #102, Burnaby</strong>.  
    We offer a full range of professional beauty services, including{" "}
    <em>
      hair color, highlights, balayage, precision haircuts, keratin treatments,
      brow shaping, and select aesthetic services
    </em>
    —all focused on quality, comfort, and results that fit your lifestyle.
  </p>

  <h2 className="text-xl font-semibold text-[#7a3b44] mt-4">
    How Online Booking Works
  </h2>

  <p className="mt-1">
    1) <strong>Select your service(s)</strong>.  
    2) We calculate the <strong>required time</strong>.  
    3) Choose a <strong>date & time</strong>.  
    4) Add your details and confirm.  
    You’ll receive instant confirmation once your booking is complete.
  </p>
</section>


        {/* Main row */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT: step content (NO internal scroll!) */}
          <div className="flex-1">
            {step === 0 && (
              <BookingForm
                onSelectionChange={setSelection}
              />
            )}

            {step === 1 && (
              <DateTimePicker
                duration={totalBlockedMinutes}
                onSelect={setBookingTime}

              />
            )}
            {step === 2 && (
              <QuestionsForm
                selection={selection}
                bookingTime={bookingTime}
                onSubmit={(formData) => {
                  setBookingData(formData);
                  setShowFinalPopup(true);
                }}
                setLoading={setLoading}
                loading={loading}
                submitSignal={submitTick} // ✅ add this prop in QuestionsForm
              />
            )}
          </div>

          {/* RIGHT: Summary (desktop only, sticky) */}
          <div className="hidden sm:block w-full lg:w-[300px] bg-white rounded-[25px] shadow-xl p-6 sm:p-8 h-fit self-start sticky top-28">
            <h4 className="font-bold text-xl font-theseason text-[#7a3b44] mb-1">
              ELIKA BEAUTY
            </h4>
            <p className="text-sm text-gray-500">
              3790 Canada Way #102, Burnaby
            </p>
            <p className="text-sm text-gray-500 mb-4">
              V5G 1G4
            </p>

            <p className="text-med font-bold mb-2">Selected Services:</p>
            {selection.selected.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No services selected</p>
            ) : (
              <ul className="text-sm space-y-1 font-display mb-4 text-gray-700">
                {selection.selected.map((s) => (
                  <li key={s._id}>• {s.name}</li>
                ))}
              </ul>
            )}

            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Time on Service</span>
              <span>{durationStats.avg} min</span>
            </div>
            {/* <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Buffer</span>
              <span>{bufferMinutes} min</span>
            </div> */}

            <hr className="my-4 border-pink-100" />

            <div className="text-lg font-semibold text-[#7a3b44]">
              <div className="flex font-display justify-between mb-1">
                <span>Total</span>
                <span>{selection.total > 0 ? `+$${selection.total}` : `$0`}</span>
              </div>
              <p className="text-sm italic text-[#7a3b44] mt-2 leading-tight">
                * Final pricing depends on hair length, volume, and thickness.
              </p>
            </div>
            {/* Desktop CTA */}
<div className="mt-6">
  <button
    disabled={!canContinue || loading}
    onClick={() => {
      if (step < 2) return goNext();
      setSubmitTick((t) => t + 1);
    }}
    className={`w-full px-5 py-3 rounded-full font-bold text-white transition ${
      !canContinue || loading
        ? "bg-[#7a3b44]/25 cursor-not-allowed"
        : "bg-[#55203d] hover:brightness-110"
    }`}
  >
    {step === 2 ? (loading ? "Submitting..." : "Confirm") : "Continue"}
  </button>

  {step > 0 && (
    <button
      type="button"
      onClick={goBack}
      className="w-full mt-3 px-5 py-3 rounded-full font-semibold border border-[#55203d]/20 text-[#55203d] hover:bg-[#55203d]/5"
    >
      Back
    </button>
  )}
</div>

          </div>
        </div>
      </div>

      {/* ✅ Sticky bottom action bar (ONE CTA) */}
      <div className="sm:hidden sticky bottom-0 z-30 bg-white/90 backdrop-blur border-t border-[#55203d]/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-theseason font-bold text-[#7a3b44]">
              {selection.selected.length} service(s) • ${selection.total}
            </div>
            <div className="text-xs text-gray-500">
              Est. {totalBlockedMinutes} min
              {bookingTime ? " • time selected" : ""}
            </div>
          </div>

          <button
            disabled={!canContinue || loading}
            onClick={() => {
              if (step < 2) return goNext();
              // step === 2 => submit QuestionsForm
              setSubmitTick((t) => t + 1);
            }}
            className={`px-5 py-2.5 rounded-full font-bold text-white transition whitespace-nowrap ${
              !canContinue || loading
                ? "bg-[#7a3b44]/25 cursor-not-allowed"
                : "bg-[#55203d] hover:brightness-110"
            }`}
          >
            {step === 2 ? (loading ? "Submitting..." : "Confirm") : "Continue"}
          </button>
        </div>
      </div>

      {/* FINAL POPUP */}
      {showFinalPopup && bookingData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-md space-y-4">
            <h3 className="text-xl font-display font-semibold text-[#7a3b44]">
              Booking Confirmed ✅
            </h3>

            <p className="text-sm text-gray-700">
              Dear <span className="font-display">{bookingData.name}</span>,
              <br />
              your booking has been confirmed.
            </p>

            <p className="text-sm text-gray-700">
              <strong>Services:</strong>{" "}
              {Array.isArray(bookingData.services)
  ? bookingData.services.map((s) => s?.name).filter(Boolean).join(", ")
  : ""}

              <br />
              <strong>Date:</strong> {format(parseISO(bookingData.date), "PPP")}
              <br />
              <strong>Time:</strong> {bookingData.time}
            </p>

            <p className="text-sm font-display text-gray-600">
              You will receive a confirmation email shortly.
              <br />
              For changes, contact <strong>Amina</strong> at{" "}
              <strong>778-513-9006</strong>.
            </p>

            <button
              onClick={() => {
                setShowFinalPopup(false);
                setBookingData(null);
                setBookingTime(null);
                setSelection({ selected: [], total: 0 });
                setStep(0);
                setShowInfo(false);
              }}
              className="mt-2 px-5 py-2 font-display bg-[#7a3b44] text-white rounded-lg shadow hover:brightness-110"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}