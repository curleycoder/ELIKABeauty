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


function generateNext30Days(startDate = new Date()){
  return eachDayOfInterval({
    start: startDate,
    end: addDays(startDate, 29),

  }).map((date)=>({
    date,
    number: format(date, "d"),
    full: format(date, "yyyy-MM-dd")
  }));
}

// Generate time slots
function generateTimeSlots(duration = 30, startHour = 11, endHour = 19) {
  const slots = [];
  let time = setHours(setMinutes(new Date(), 0), startHour);
  const end = setHours(setMinutes(new Date(), 0), endHour);

  while (isBefore(time, end)) {
    slots.push(format(time, "h:mm a"));
    time = addMinutes(time, duration);
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
    const bookingDateStr = format(new Date(b.date), "yyyy-MM-dd");
    const currentDateStr = format(date, "yyyy-MM-dd");
    if (bookingDateStr !== currentDateStr) return false;

    const bookedStart = parse(
      `${bookingDateStr} ${b.time}`,
      "yyyy-MM-dd h:mm a",
      new Date()
    );
    const bookedEnd = addMinutes(bookedStart, b.duration);

    return slotStart >= bookedStart && slotStart < bookedEnd;
  });
}

const baseURL = process.env.REACT_APP_API_URL || "";

export default function DateTimePicker({ onSelect, duration = 30 }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const timeRef = useRef(null);

  const today = new Date();
  const monthDates = generateNext30Days(today);
  const timeSlots = generateTimeSlots(30, 10, 21 - duration / 60);

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

  return (
    <div className="space-y-6 bg-white/60 backdrop-blur-md rounded-[30px] shadow-2xl p-6 sm:p-8 max-w-2xl w-full mx-auto mt-20 sm:mt-28">
      <h2 className="text-xl font-bold text-purplecolor tracking-wide text-center mb-2">
        Choose a Date
      </h2>

      {/* <h3 className="text-center text-lg font-bold text-purplecolor mt-4">
        {format(today, "MMMM yyyy")}
      </h3> */}

      {/* Calendar Grid */}
      <div className="py-4">
        {Object.entries(
          monthDates.reduce((groups, day) => {
            const month = format(day.date, "MMMM yyyy");
            if (!groups[month]) groups[month] = [];
            groups[month].push(day);
            return groups;
          }, {})
        ).map(([month, days]) => (
          <div key={month} className="mb-6">
            <h4 className="text-left text-md sm:text-lg font-bold text-purplecolor mb-2 mt-6">{month}</h4>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4">
              {days.map((d) => {
                const isToday = d.full === format(today, "yyyy-MM-dd");
                const isSelected = selectedDate?.toDateString() === d.date.toDateString();
                const isDisabled = isBefore(d.date, new Date().setHours(0, 0, 0, 0));

                return (
                  <button
                    key={d.full}
                    onClick={() => {
                      if (!isDisabled) {
                        setSelectedDate(d.date);
                        setTimeout(() => {
                          if (timeRef.current) {
                            timeRef.current.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }, 200);
                      }
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
        <div ref={timeRef}>
          <p className="text-center text-purplecolor font-semibold mb-3 mt-4">
            Select a time:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {timeSlots.map((time) => {
              const isToday =
                format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
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

      {/* Confirmation Modal */}
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
              <span className="font-medium text-purplecolor">
                {selectedTime}
              </span>
              .<br />
              Is this correct?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => {
                  onSelect({ date: selectedDate, time: selectedTime });
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
