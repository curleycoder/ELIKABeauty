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

export default function DateTimePicker({
  onSelect,
  duration = 30,
  refreshKey = 0,
  serviceType = "chair",
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const scrollRef = useRef(null);
  const timeRef = useRef(null);
  const bookedSlotsCacheRef = useRef({});

  const todayYMD = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const monthDates = useMemo(() => generateNext30Days(new Date()), []);

  const totalBlockedMinutes = Number(duration) || 0;

  const timeSlots = useMemo(() => {
    return generateTimeSlots({ totalBlockedMinutes });
  }, [totalBlockedMinutes]);

  const groupedByMonth = useMemo(() => {
    const grouped = monthDates.reduce((groups, day) => {
      const month = format(day.date, "MMMM yyyy");
      if (!groups[month]) groups[month] = [];
      groups[month].push(day);
      return groups;
    }, {});

    return Object.entries(grouped);
  }, [monthDates]);

  const selectedDayStatus = useMemo(() => {
    if (!selectedDate) return null;

    return {
      past: isPastDay(selectedDate),
      closed: isShopClosed(selectedDate),
      ymd: format(selectedDate, "yyyy-MM-dd"),
    };
  }, [selectedDate]);

  const dayUnavailable = Boolean(
    selectedDayStatus?.past || selectedDayStatus?.closed
  );

  const visibleTimeSlots = useMemo(() => {
    if (!selectedDate || dayUnavailable) return [];

    return timeSlots.filter((time) => {
      const pastTime = isPastTimeToday(selectedDate, time);

      const blocked = isOverlappingBookedSlot({
        dateObj: selectedDate,
        time12h: time,
        bookedSlots,
        totalBlockedMinutes,
      });

      return !pastTime && !blocked;
    });
  }, [
    selectedDate,
    dayUnavailable,
    timeSlots,
    bookedSlots,
    totalBlockedMinutes,
  ]);

  useEffect(() => {
    setSelectedTime(null);
    setShowConfirm(false);

    // clear cache after booking refresh so fresh availability is fetched
    bookedSlotsCacheRef.current = {};
  }, [refreshKey]);

  useEffect(() => {
    if (selectedDate) return;

    const firstAvailable = monthDates.find(
      (d) => !isPastDay(d.date) && !isShopClosed(d.date)
    );

    if (firstAvailable) {
      setSelectedDate(firstAvailable.date);
    }
  }, [monthDates, selectedDate]);

  useEffect(() => {
    if (!selectedDate) return;

    if (dayUnavailable) {
      setBookedSlots([]);
      setLoadingSlots(false);
      return;
    }

    const controller = new AbortController();
    const ymd = format(selectedDate, "yyyy-MM-dd");

    const fetchBookedTimes = async () => {
      // serve from cache first
      if (Object.prototype.hasOwnProperty.call(bookedSlotsCacheRef.current, ymd)) {
        setBookedSlots(bookedSlotsCacheRef.current[ymd]);
        setLoadingSlots(false);
        return;
      }

      setLoadingSlots(true);

      try {
        const url = `${baseURL}/api/bookings/booked?date=${ymd}&serviceType=${serviceType}`;
        const res = await fetch(url, {
          signal: controller.signal,
        });

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
        const normalizedData = Array.isArray(data) ? data : [];

        bookedSlotsCacheRef.current[ymd] = normalizedData;
        setBookedSlots(normalizedData);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("❌ Failed to fetch booked slots:", err);
          setBookedSlots([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSlots(false);
        }
      }
    };

    fetchBookedTimes();

    return () => controller.abort();
  }, [selectedDate, dayUnavailable, refreshKey, serviceType]);

  const scrollToTime = () => {
    if (!scrollRef.current || !timeRef.current) return;

    const container = scrollRef.current;
    const targetTop = timeRef.current.offsetTop - container.offsetTop - 8;

    container.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  };

  const onPickDate = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    setShowConfirm(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTime();
      });
    });
  };

  const onPickTime = (time) => {
    setSelectedTime(time);
    setShowConfirm(true);
  };

  return (
    <div className="bg-white/60 font-display backdrop-blur-md rounded-[24px] sm:rounded-[30px] shadow-2xl max-w-2xl w-full mx-auto flex flex-col h-[85dvh] sm:max-h-[80dvh] overflow-hidden">
      <div className="p-3 sm:p-4 pb-2">
        <h2 className="text-xl font-theseason text-[#440008] tracking-wide text-center">
          Choose a Date
        </h2>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain px-4 sm:px-8 pb-24 touch-pan-y"
      >
        <div className="py-2">
          {groupedByMonth.map(([month, days]) => (
            <div key={month} className="mb-6">
              <h4 className="text-left text-md sm:text-lg font-bold text-[#440008] mb-2 mt-4">
                {month}
              </h4>

              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5 sm:gap-4">
                {days.map((d) => {
                  const isToday = d.full === todayYMD;
                  const isSelected =
                    selectedDate?.toDateString() === d.date.toDateString();

                  const closedDay = isShopClosed(d.date);
                  const pastDay = isPastDay(d.date);
                  const isDisabled = pastDay || closedDay;

                  return (
                    <button
                      key={d.full}
                      type="button"
                      onClick={() => {
                        if (isDisabled) return;
                        onPickDate(d.date);
                      }}
                      disabled={isDisabled}
                      className={`flex items-center justify-center w-full aspect-square max-w-[56px] mx-auto rounded-full border font-semibold text-sm transition ${
                        isSelected
                          ? "bg-[#440008] text-white shadow-md scale-105"
                          : isToday
                          ? "border-[#440008] text-[#440008]"
                          : "border-[#440008]/20 text-[#440008]/70 hover:border-[#440008] hover:bg-[#440008]/10"
                      } ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}`}
                    >
                      <div className="flex flex-col items-center leading-tight">
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

        {selectedDate && (
          <div ref={timeRef} className="pt-2">
            <p className="text-xl text-center text-[#440008] font-theseason mb-3 mt-2">
              Select a time
            </p>

            {loadingSlots && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 rounded-full border border-[#440008]/10 bg-[#440008]/5 animate-pulse"
                  />
                ))}
              </div>
            )}

            {dayUnavailable && (
              <div className="text-center text-sm rounded-2xl border bg-[#440008]/5 text-[#440008] px-4 py-3">
                This day is not available.
              </div>
            )}

            {!dayUnavailable && !loadingSlots && (
              <>
                {visibleTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {visibleTimeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => onPickTime(time)}
                        className={`w-full py-2.5 sm:py-2 rounded-full border text-sm font-semibold transition duration-200 ${
                          selectedTime === time
                            ? "bg-[#440008]/80 text-white border-transparent scale-105 shadow-lg"
                            : "bg-white text-[#440008] border-[#440008]/30 hover:bg-[#440008] hover:text-white"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm rounded-2xl border bg-[#440008]/5 text-[#440008] px-4 py-3">
                    No online times are currently available for this day.
                  </div>
                )}

                <div className="mt-5 rounded-2xl border border-[#440008]/10 bg-[#440008]/[0.04] px-4 py-3 text-center">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Don’t see a time that works for you?{" "}
                    <a
                      href="tel:+16044383727"
                      className="font-semibold text-[#440008] underline underline-offset-2"
                    >
                      Call us
                    </a>{" "}
                    — we’ll do our best to fit you in.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showConfirm && selectedDate && selectedTime && (
        <div className="fixed inset-0 bg-[#440008]/60 flex items-center justify-center px-4 sm:px-8 z-50">
          <div className="bg-white rounded-2xl p-5 sm:p-8 w-[90%] max-w-md shadow-xl text-center space-y-4">
            <h3 className="text-lg font-display text-[#440008] font-semibold">
              Confirm Your Selection
            </h3>

            <p className="text-sm text-gray-700">
              You selected{" "}
              <span className="font-medium text-[#440008]">
                {format(selectedDate, "PPP")}
              </span>{" "}
              at{" "}
              <span className="font-medium text-[#440008]">
                {selectedTime}
              </span>
              .
            </p>

            <div className="flex justify-center font-display font-bold gap-4 mt-4">
              <button
                type="button"
                onClick={() => {
                  onSelect({
                    date: format(selectedDate, "yyyy-MM-dd"),
                    time: selectedTime,
                  });
                  setShowConfirm(false);
                }}
                className="px-4 py-2 bg-[#440008] text-white rounded-2xl shadow"
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 border border-[#440008] text-[#440008] rounded-2xl"
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