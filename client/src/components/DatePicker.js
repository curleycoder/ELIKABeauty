import React, { useState, useEffect, useRef } from "react";
import {
  format,
  isBefore,
  addMinutes,
  setHours,
  setMinutes,
  eachDayOfInterval,
  addDays,
  parse,
} from "date-fns";

const OPEN_HOUR = 11; // 11 AM
const CLOSE_HOUR = 19; // 7 PM
const SLOT_STEP_MINUTES = 15;

function generateNext30Days(startDate = new Date()) {
  return eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 29),
  }).map((date) => ({
    date,
    number: format(date, "d"),
    full: format(date, "yyyy-MM-dd"),
  }));
}

// Generate time slots (only show slots whose END <= closing)
function generateTimeSlots(totalBlockedMinutes, startHour = 11, closeHour = 19) {
  const slots = [];

  let time = setHours(setMinutes(new Date(), 0), startHour);
  const closingTime = setHours(setMinutes(new Date(), 0), closeHour);

  while (
    isBefore(addMinutes(time, totalBlockedMinutes), closingTime) ||
    +addMinutes(time, totalBlockedMinutes) === +closingTime
  ) {
    slots.push(format(time, "h:mm a"));
    time = addMinutes(time, 15);
  }

  return slots;
}



// Check if a time is blocked
function isBlocked(date, time, bookedSlots) {
  const slotStart = parse(
    `${format(date, "yyyy-MM-dd")} ${time}`,
    "yyyy-MM-dd h:mm a",
    new Date()
  );

  return bookedSlots.some((b) => {
    // backend returns start/end
    const bookedStart = new Date(b.start);
    const bookedEnd = new Date(b.end);

    if (isNaN(bookedStart.getTime()) || isNaN(bookedEnd.getTime())) return false;

    return slotStart >= bookedStart && slotStart < bookedEnd;
  });
}


const baseURL = process.env.REACT_APP_API_URL || "";

export default function DateTimePicker({ onSelect, duration = 30 }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  const scrollRef = useRef(null); // the scroll container inside the card
  const timeRef = useRef(null);   // time section anchor

  const today = new Date();
  const monthDates = generateNext30Days(today);

  // IMPORTANT: closing hour is 21 (9pm). Last start must end by 9pm.
  // If you want last end at 6:30, set endHour=18.5 OR closing rule per service.
const timeSlots = generateTimeSlots(duration, 11, 19);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!selectedDate) return;
      try {
        const res = await fetch(
          `${baseURL}/api/bookings/booked?date=${format(selectedDate, "yyyy-MM-dd")}`
        );
        const data = await res.json();
        setBookedSlots(data);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
      }
    };

    fetchBookedTimes();
  }, [selectedDate]);

  // Smooth scroll INSIDE the card (not the whole page)
  const scrollToTime = () => {
    if (!scrollRef.current || !timeRef.current) return;
    const container = scrollRef.current;
    const targetTop =
      timeRef.current.offsetTop - container.offsetTop - 12; // small padding

    container.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  return (
    <div
      className="
        bg-white/60 backdrop-blur-md rounded-[30px] shadow-2xl
        max-w-2xl w-full mx-auto mt-20 sm:mt-28
        flex flex-col
        max-h-[80dvh]
      "
    >
      {/* Header (not scrollable) */}
      <div className="p-6 sm:p-8 pb-3">
        <h2 className="text-xl font-bold text-purplecolor tracking-wide text-center">
          Choose a Date
        </h2>
      </div>

      {/* Scrollable content area */}
      <div
        ref={scrollRef}
        className="
          flex-1 min-h-0
          overflow-y-auto overscroll-contain
          px-6 sm:px-8 pb-6
        "
      >
        {/* Calendar Grid */}
        <div className="py-2">
          {Object.entries(
            monthDates.reduce((groups, day) => {
              const month = format(day.date, "MMMM yyyy");
              if (!groups[month]) groups[month] = [];
              groups[month].push(day);
              return groups;
            }, {})
          ).map(([month, days]) => (
            <div key={month} className="mb-6">
              <h4 className="text-left text-md sm:text-lg font-bold text-purplecolor mb-2 mt-4">
                {month}
              </h4>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4">
                {days.map((d) => {
                  const isToday = d.full === format(today, "yyyy-MM-dd");
                  const isSelected =
                    selectedDate?.toDateString() === d.date.toDateString();
                  const isDisabled = isBefore(
                    d.date,
                    new Date(new Date().setHours(0, 0, 0, 0))
                  );

                  return (
                    <button
                      key={d.full}
                      onClick={() => {
                        if (isDisabled) return;
                        setSelectedDate(d.date);
                        setSelectedTime(null);
                        setShowConfirm(false);

                        // Scroll inside container to time section
                        setTimeout(scrollToTime, 150);
                      }}
                      disabled={isDisabled}
                      className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border font-semibold text-sm transition ${
                        isSelected
                          ? "bg-purplecolor text-white shadow-md scale-105"
                          : isToday
                          ? "border-purplecolor text-purplecolor"
                          : "border-purplecolor/20 text-purplecolor/70 hover:border-purplecolor hover:bg-purplecolor/10"
                      } ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs font-medium">
                          {format(d.date, "EEE")}
                        </span>
                        <span className="text-sm sm:text-base font-semibold">
                          {d.number}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Time Selection */}
        {selectedDate && (
          <div ref={timeRef} className="pt-2">
            <p className="text-center text-purplecolor font-semibold mb-3 mt-2">
              Select a time:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {timeSlots.map((time) => {
                const isToday =
                  format(selectedDate, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");

                const slotDateTime = parse(
                  `${format(selectedDate, "yyyy-MM-dd")} ${time}`,
                  "yyyy-MM-dd h:mm a",
                  new Date()
                );

                const isPast = isToday && isBefore(slotDateTime, new Date());
                const blocked = isBlocked(selectedDate, time, bookedSlots);

                if (isPast || blocked) return null;

                return (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setShowConfirm(true);
                    }}
                    className={`w-full py-2 rounded-full border text-sm font-semibold transition duration-200 ${
                      selectedTime === time
                        ? "bg-purplecolor/80 text-white border-transparent scale-105 shadow-lg"
                        : "bg-white text-purplecolor border-purplecolor/30 hover:bg-purplecolor hover:text-white hover:translate-y-[-2px]"
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal (unchanged) */}
      {showConfirm && selectedDate && selectedTime && (
        <div className="fixed inset-0 rounded-3xl bg-purplecolor/60 flex items-center justify-center px-4 sm:px-8 z-50 transition-opacity duration-300 animate-fadeIn">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-[90%] max-w-md shadow-xl text-center space-y-4">
            <h3 className="text-lg font-semibold">Confirm Your Selection</h3>
            <p className="text-sm text-gray-700">
              You selected{" "}
              <span className="font-medium text-purplecolor">
                {format(selectedDate, "PPP")}
              </span>{" "}
              at{" "}
              <span className="font-medium text-purplecolor">{selectedTime}</span>.
              <br />
              Is this correct?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                onSelect({ date: format(selectedDate, "yyyy-MM-dd"), time: selectedTime });
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-purplecolor text-white rounded-2xl shadow hover:translate-y-[-2px] transition"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-purplecolor text-purplecolor rounded-2xl hover:translate-y-[-2px] transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
