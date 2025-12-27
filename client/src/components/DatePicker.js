import React, { useState, useEffect, useRef, useMemo } from "react";
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

const DEFAULT_VISIBLE_TIMES = 8;

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

// Only show slots whose END <= closing
function generateTimeSlots(totalBlockedMinutes, startHour = OPEN_HOUR, closeHour = CLOSE_HOUR) {
  const slots = [];

  let time = setHours(setMinutes(new Date(), 0), startHour);
  const closingTime = setHours(setMinutes(new Date(), 0), closeHour);

  while (
    isBefore(addMinutes(time, totalBlockedMinutes), closingTime) ||
    +addMinutes(time, totalBlockedMinutes) === +closingTime
  ) {
    slots.push(format(time, "h:mm a"));
    time = addMinutes(time, SLOT_STEP_MINUTES);
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

  const [showAllTimes, setShowAllTimes] = useState(false);

  const scrollRef = useRef(null);
  const timeRef = useRef(null);

  const today = new Date();
  const monthDates = useMemo(() => generateNext30Days(today), [today]);

  const timeSlots = useMemo(() => {
    return generateTimeSlots(duration, OPEN_HOUR, CLOSE_HOUR);
  }, [duration]);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!selectedDate) return;
      try {
        const res = await fetch(
          `${baseURL}/api/bookings/booked?date=${format(selectedDate, "yyyy-MM-dd")}`
        );
        const data = await res.json();
        setBookedSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
        setBookedSlots([]);
      }
    };

    fetchBookedTimes();
  }, [selectedDate]);

  const scrollToTime = () => {
    if (!scrollRef.current || !timeRef.current) return;
    const container = scrollRef.current;
    const targetTop = timeRef.current.offsetTop - container.offsetTop - 12;
    container.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const clearTime = () => {
    setSelectedTime(null);
    setShowConfirm(false);
  };

  const pickDate = (d, isDisabled) => {
    if (isDisabled) return;
    setSelectedDate(d.date);
    setShowAllTimes(false); // reset the "show more" when date changes
    clearTime();
    setTimeout(scrollToTime, 120);
  };

  const pickTime = (time) => {
    setSelectedTime(time);
    setShowConfirm(true);
  };

  const confirm = () => {
    onSelect({ date: format(selectedDate, "yyyy-MM-dd"), time: selectedTime });
    setShowConfirm(false);
  };

  // ✅ Build "available times" list first, then show next 8 by default
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];

    const isSelectedDateToday =
      format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

    return timeSlots.filter((time) => {
      const slotDateTime = parse(
        `${format(selectedDate, "yyyy-MM-dd")} ${time}`,
        "yyyy-MM-dd h:mm a",
        new Date()
      );

      const isPast = isSelectedDateToday && isBefore(slotDateTime, new Date());
      const blocked = isBlocked(selectedDate, time, bookedSlots);

      return !isPast && !blocked;
    });
  }, [selectedDate, timeSlots, bookedSlots]);

  const visibleTimes = useMemo(() => {
    return showAllTimes ? availableTimes : availableTimes.slice(0, DEFAULT_VISIBLE_TIMES);
  }, [availableTimes, showAllTimes]);

  return (
    <div
      className="
        bg-white/70 backdrop-blur-md rounded-[30px] shadow-2xl
        max-w-2xl w-full mx-auto mt-10 sm:mt-16
        flex flex-col
        max-h-[82dvh]
        border border-purplecolor/10
      "
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 rounded-t-[30px] bg-white/80 backdrop-blur-md border-b border-purplecolor/10 px-5 sm:px-8 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-purplecolor tracking-wide">
              Book a time
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Step 2 of 3 • Choose date & time
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-gray-500">Hours</p>
            <p className="text-sm font-semibold text-purplecolor">
              {OPEN_HOUR}:00–{CLOSE_HOUR}:00
            </p>
          </div>
        </div>

        {selectedDate && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-600">Selected:</span>
            <span className="text-xs font-semibold text-purplecolor bg-purplecolor/10 px-3 py-1 rounded-full">
              {format(selectedDate, "EEE, MMM d")}
            </span>
            {selectedTime && (
              <span className="text-xs font-semibold text-purplecolor bg-purplecolor/10 px-3 py-1 rounded-full">
                {selectedTime}
              </span>
            )}
            <button
              onClick={() => {
                setSelectedDate(null);
                setShowAllTimes(false);
                clearTime();
              }}
              className="ml-auto text-xs font-semibold text-purplecolor underline underline-offset-4"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-8 pb-6 pt-4"
      >
        {/* Calendar */}
        <div className="space-y-6">
          {Object.entries(
            monthDates.reduce((groups, day) => {
              const month = format(day.date, "MMMM yyyy");
              if (!groups[month]) groups[month] = [];
              groups[month].push(day);
              return groups;
            }, {})
          ).map(([month, days]) => (
            <div key={month}>
              <div className="flex items-end justify-between">
                <h4 className="text-sm sm:text-base font-bold text-purplecolor">
                  {month}
                </h4>
                <p className="text-xs text-gray-500">Next 30 days</p>
              </div>

              <div className="mt-3 grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3">
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
                      onClick={() => pickDate(d, isDisabled)}
                      disabled={isDisabled}
                      className={`
                        relative rounded-2xl border px-2 py-2
                        transition active:scale-[0.98]
                        ${isSelected
                          ? "bg-purplecolor text-white border-transparent shadow-md"
                          : "bg-white text-purplecolor border-purplecolor/15 hover:border-purplecolor/40 hover:bg-purplecolor/5"}
                        ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
                      `}
                    >
                      {isToday && !isSelected && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purplecolor/60" />
                      )}

                      <div className="flex flex-col items-center leading-none">
                        <span className={`text-[10px] font-semibold ${isSelected ? "text-white/90" : "text-purplecolor/70"}`}>
                          {format(d.date, "EEE")}
                        </span>
                        <span className="mt-1 text-sm sm:text-base font-bold">
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

        {/* Time */}
        {selectedDate && (
          <div ref={timeRef} className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm sm:text-base font-bold text-purplecolor">
                Available times
              </p>
              <p className="text-xs text-gray-500">
                Ends by {CLOSE_HOUR}:00
              </p>
            </div>

            {availableTimes.length === 0 ? (
              <div className="rounded-2xl border border-purplecolor/10 bg-white p-4 text-center">
                <p className="text-sm font-semibold text-purplecolor">
                  No times available for this date
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Try another day.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {visibleTimes.map((time) => {
                    const active = selectedTime === time;

                    return (
                      <button
                        key={time}
                        onClick={() => pickTime(time)}
                        className={`
                          rounded-2xl border px-3 py-3 text-sm font-bold
                          transition active:scale-[0.98]
                          ${active
                            ? "bg-purplecolor text-white border-transparent shadow-md"
                            : "bg-white text-purplecolor border-purplecolor/15 hover:border-purplecolor/40 hover:bg-purplecolor/5"}
                        `}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>

                {/* Show more/less */}
                {availableTimes.length > DEFAULT_VISIBLE_TIMES && (
                  <button
                    type="button"
                    onClick={() => setShowAllTimes((v) => !v)}
                    className="
                      mt-4 w-full rounded-2xl border border-purplecolor/20
                      bg-white px-4 py-3 text-sm font-bold text-purplecolor
                      hover:bg-purplecolor/5 transition
                    "
                  >
                    {showAllTimes ? "Show fewer times" : `Show all times (${availableTimes.length})`}
                  </button>
                )}
              </>
            )}
          </div>
        )}

        <div className="h-6" />
      </div>

      {/* Mobile bottom-sheet confirm */}
      {showConfirm && selectedDate && selectedTime && (
        <div
          className="fixed inset-0 z-[99999] bg-black/35"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="
              absolute bottom-0 left-0 right-0
              bg-white rounded-t-3xl shadow-2xl
              p-5
              animate-[sheetUp_.18s_ease-out]
              sm:static sm:mx-auto sm:mt-24 sm:max-w-md sm:rounded-2xl sm:p-8
            "
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sm:hidden mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />

            <h3 className="text-lg font-bold text-center text-purplecolor">
              Confirm your selection
            </h3>

            <p className="text-sm text-gray-700 text-center mt-2">
              <span className="font-semibold text-purplecolor">
                {format(selectedDate, "EEE, MMM d")}
              </span>{" "}
              at{" "}
              <span className="font-semibold text-purplecolor">{selectedTime}</span>
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={confirm}
                className="py-3 rounded-2xl bg-purplecolor text-white font-bold shadow hover:brightness-110"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="py-3 rounded-2xl border border-purplecolor text-purplecolor font-bold hover:bg-purplecolor/5"
              >
                Change
              </button>
            </div>

            <style>{`
              @keyframes sheetUp {
                from { transform: translateY(14px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
            `}</style>
          </div>
        </div>
      )}
    </div>
  );
}
