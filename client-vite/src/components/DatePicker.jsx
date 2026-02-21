import React, { useEffect, useMemo, useRef, useState } from "react";
import { format, eachDayOfInterval, addDays } from "date-fns";

import {
  isShopClosed,
  generateTimeSlots,
  isOverlappingBookedSlot,
  isPastDay,
  isPastTimeToday,
} from "../lib/bookingSchedule";

const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

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

export default function DateTimePicker({ onSelect, duration = 30, refreshKey = 0 }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const scrollRef = useRef(null);
  const timeRef = useRef(null);

  const todayYMD = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const monthDates = useMemo(() => generateNext30Days(new Date()), []);

  const totalBlockedMinutes = Number(duration) || 0;

  const timeSlots = useMemo(
    () => generateTimeSlots({ totalBlockedMinutes }),
    [totalBlockedMinutes]
  );

  const groupedByMonth = useMemo(() => {
    return Object.entries(
      monthDates.reduce((groups, day) => {
        const month = format(day.date, "MMMM yyyy");
        if (!groups[month]) groups[month] = [];
        groups[month].push(day);
        return groups;
      }, {})
    );
  }, [monthDates]);

  const selectedDayStatus = useMemo(() => {
    if (!selectedDate) return null;
    return {
      past: isPastDay(selectedDate),
      closed: isShopClosed(selectedDate),
      ymd: format(selectedDate, "yyyy-MM-dd"),
    };
  }, [selectedDate]);

  // ✅ When refreshKey changes (booking succeeded), clear old selection/confirm
  useEffect(() => {
    setSelectedTime(null);
    setShowConfirm(false);
  }, [refreshKey]);

  // ✅ Fetch booked times when selectedDate changes OR refreshKey increments
  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!selectedDate) return;

      if (isPastDay(selectedDate) || isShopClosed(selectedDate)) {
        setBookedSlots([]);
        return;
      }

      setLoadingSlots(true);
      try {
        const ymd = format(selectedDate, "yyyy-MM-dd");
        const url = `${baseURL}/api/bookings/booked?date=${ymd}`;
        const res = await fetch(url, { cache: "no-store" });

        // ✅ handle HTML/404 so JSON parse doesn't crash
        if (!res.ok) {
          const text = await res.text();
          console.error("❌ booked slots fetch failed", {
            url,
            status: res.status,
            bodyPreview: text.slice(0, 200),
          });
          setBookedSlots([]);
          return;
        }

        const data = await res.json();
        setBookedSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("❌ Failed to fetch booked slots:", err);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedTimes();
  }, [selectedDate, refreshKey]);

  const scrollToTime = () => {
    if (!scrollRef.current || !timeRef.current) return;
    const container = scrollRef.current;
    const targetTop = timeRef.current.offsetTop - container.offsetTop - 12;
    container.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  const onPickDate = (d) => {
    setSelectedDate(d);
    setSelectedTime(null);
    setShowConfirm(false);
    setTimeout(scrollToTime, 150);
  };

  const onPickTime = (t) => {
    setSelectedTime(t);
    setShowConfirm(true);
  };

  const dayUnavailable = Boolean(selectedDayStatus?.past || selectedDayStatus?.closed);

  return (
    <div className="bg-white/60 font-display backdrop-blur-md rounded-[30px] shadow-2xl max-w-2xl w-full mx-auto mt-16 sm:mt-20 flex flex-col max-h-[80dvh]">
      <div className="p-6 sm:p-8 pb-3">
        <h2 className="text-xl font-theseason text-[#572a31] tracking-wide text-center">
          Choose a Date
        </h2>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 sm:px-8 pb-6">
        {/* Calendar */}
        <div className="py-2">
          {groupedByMonth.map(([month, days]) => (
            <div key={month} className="mb-6">
              <h4 className="text-left text-md sm:text-lg font-bold text-[#572a31] mb-2 mt-4">
                {month}
              </h4>

              <div className="grid font-display grid-cols-4 sm:grid-cols-7 gap-3 sm:gap-4">
                {days.map((d) => {
                  const isToday = d.full === todayYMD;
                  const isSelected = selectedDate?.toDateString() === d.date.toDateString();

                  const closedDay = isShopClosed(d.date);
                  const pastDay = isPastDay(d.date);
                  const isDisabled = pastDay || closedDay;

                  return (
                    <button
                      key={d.full}
                      onClick={() => {
                        if (isDisabled) return;
                        onPickDate(d.date);
                      }}
                      disabled={isDisabled}
                      className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full border font-semibold text-sm transition ${
                        isSelected
                          ? "bg-purplecolor text-white shadow-md scale-105"
                          : isToday
                          ? "border-purplecolor text-[#572a31]"
                          : "border-purplecolor/20 text-[#572a31]/70 hover:border-[#572a31] hover:bg-[#572a31]/10"
                      } ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] sm:text-xs font-medium">
                          {closedDay ? "Closed" : format(d.date, "EEE")}
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

        {/* Times */}
        {selectedDate && (
          <div ref={timeRef} className="pt-2">
            <p className="text-xl text-center text-[#572a31] font-theseason mb-3 mt-2">
              Select a time
            </p>

            {loadingSlots && (
              <p className="text-center text-sm text-gray-500 mb-3">
                Loading availability...
              </p>
            )}

            {dayUnavailable && (
              <div className="text-center text-sm rounded-2xl border bg-[#572a31]/5 text-[#572a31] px-4 py-3">
                This day is not available.
              </div>
            )}

            {!dayUnavailable && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                {timeSlots.map((t) => {
                  const pastTime = isPastTimeToday(selectedDate, t);

                  const blocked = isOverlappingBookedSlot({
                    dateObj: selectedDate,
                    time12h: t,
                    bookedSlots,
                    totalBlockedMinutes,
                  });

                  if (pastTime || blocked) return null;

                  return (
                    <button
                      key={t}
                      onClick={() => onPickTime(t)}
                      className={`w-full py-2 rounded-full border text-sm font-semibold transition duration-200 ${
                        selectedTime === t
                          ? "bg-[#572a31]/80 text-white border-transparent scale-105 shadow-lg"
                          : "bg-white text-[#572a31] border-[#572a31]/30 hover:bg-[#572a31] hover:text-white hover:translate-y-[-2px]"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirm */}
      {showConfirm && selectedDate && selectedTime && (
        <div className="fixed inset-0 rounded-3xl bg-[#572a31]/60 flex items-center justify-center px-4 sm:px-8 z-50">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-[90%] max-w-md shadow-xl text-center space-y-4">
            <h3 className="text-lg font-display text-[#572a31] font-semibold">
              Confirm Your Selection
            </h3>
            <p className="text-sm text-gray-700">
              You selected{" "}
              <span className="font-medium text-[#572a31]">
                {format(selectedDate, "PPP")}
              </span>{" "}
              at{" "}
              <span className="font-medium text-[#572a31]">{selectedTime}</span>.
            </p>

            <div className="flex justify-center font-display font-bold gap-4 mt-4">
              <button
                onClick={() => {
                  onSelect({
                    date: format(selectedDate, "yyyy-MM-dd"),
                    time: selectedTime,
                  });
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-[#572a31] text-white rounded-2xl shadow"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-[#572a31] text-[#572a31] rounded-2xl"
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
