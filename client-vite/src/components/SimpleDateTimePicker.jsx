import React, { useEffect, useMemo, useState } from "react";
import { format, addMinutes, parse, isBefore } from "date-fns";

const SHOP_TZ = "America/Vancouver";

// Match backend hours
const OPEN_HOUR = 10;
const CLOSE_HOUR = 19;

// Slot step
const SLOT_STEP_MINUTES = 30;

const CLOSED_WEEKDAYS = new Set([0, 1]); // Sun=0, Mon=1

// YYYY-MM-DD list of Mondays that are OPEN
const OPEN_MONDAYS = new Set([
  // "2026-02-16",
]);

function isShopClosed(dateObj) {
  const ymd = format(dateObj, "yyyy-MM-dd");
  const dow = dateObj.getDay();

  if (dow === 1 && OPEN_MONDAYS.has(ymd)) return false; // open special Monday
  return CLOSED_WEEKDAYS.has(dow);
}

// Generate start times where (start + totalBlockedMinutes) <= closing
function generateTimeSlots(totalBlockedMinutes) {
  const slots = [];
  if (!Number.isFinite(totalBlockedMinutes) || totalBlockedMinutes <= 0) return slots;

  const base = new Date();
  const opening = new Date(base);
  opening.setHours(OPEN_HOUR, 0, 0, 0);

  const closing = new Date(base);
  closing.setHours(CLOSE_HOUR, 0, 0, 0);

  let t = opening;
  while (addMinutes(t, totalBlockedMinutes) <= closing) {
    slots.push(format(t, "h:mm a")); // backend accepts this
    t = addMinutes(t, SLOT_STEP_MINUTES);
  }
  return slots;
}

// Proper overlap check (same as your DatePicker.jsx logic)
function isBlocked(dateObj, time12h, bookedSlots, totalBlockedMinutes) {
  const slotStart = parse(
    `${format(dateObj, "yyyy-MM-dd")} ${time12h}`,
    "yyyy-MM-dd h:mm a",
    new Date()
  );
  if (isNaN(slotStart.getTime())) return true;

  const slotEnd = addMinutes(slotStart, totalBlockedMinutes);

  return bookedSlots.some((b) => {
    const bookedStart = new Date(b.start);
    const bookedEnd = new Date(b.end);
    if (isNaN(bookedStart.getTime()) || isNaN(bookedEnd.getTime())) return false;

    // overlap: slotStart < bookedEnd && slotEnd > bookedStart
    return slotStart < bookedEnd && slotEnd > bookedStart;
  });
}

const baseURL = import.meta.env.VITE_API_URL || "";

export default function SimpleDateTimePicker({ onSelect, duration = 60 }) {
  const [dateStr, setDateStr] = useState(""); // YYYY-MM-DD
  const [time, setTime] = useState(""); // "h:mm a"
  const [bookedSlots, setBookedSlots] = useState([]);

  const totalBlockedMinutes = Number(duration) || 0;

  const selectedDateObj = useMemo(() => {
    if (!dateStr) return null;
    const d = new Date(`${dateStr}T00:00:00`);
    return isNaN(d.getTime()) ? null : d;
  }, [dateStr]);

  const isPastDate = useMemo(() => {
    if (!selectedDateObj) return false;
    const today0 = new Date();
    today0.setHours(0, 0, 0, 0);
    return isBefore(selectedDateObj, today0);
  }, [selectedDateObj]);

  const isClosed = useMemo(() => {
    if (!selectedDateObj) return false;
    return isShopClosed(selectedDateObj);
  }, [selectedDateObj]);

  const times = useMemo(
    () => generateTimeSlots(totalBlockedMinutes),
    [totalBlockedMinutes]
  );

  // Fetch booked times when date changes (only if date is valid and open)
  useEffect(() => {
    const fetchBooked = async () => {
      if (!dateStr) return;
      if (!selectedDateObj) return;
      if (isPastDate || isClosed) {
        setBookedSlots([]);
        return;
      }

      try {
        const res = await fetch(`${baseURL}/api/bookings/booked?date=${dateStr}`);
        const data = await res.json();
        setBookedSlots(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch booked slots:", err);
        setBookedSlots([]);
      }
    };

    fetchBooked();
  }, [dateStr, selectedDateObj, isPastDate, isClosed]);

  const canSelect = Boolean(dateStr && time && !isPastDate && !isClosed);

  return (
    <div className="bg-white rounded-2xl shadow p-5 border border-pink-100">
      <h3 className="text-lg font-bold text-[#7a3b44] mb-3">Pick a date & time</h3>

      <label className="block text-sm text-gray-600 mb-1">Date</label>
      <input
        type="date"
        value={dateStr}
        onChange={(e) => {
          setDateStr(e.target.value);
          setTime("");
        }}
        className="w-full border rounded-lg px-3 py-2 mb-2"
      />

      {dateStr && (isPastDate || isClosed) && (
        <div className="mt-2 mb-3 text-sm rounded-lg border px-3 py-2 bg-[#7a3b44]/5 text-[#7a3b44]">
          {isPastDate
            ? "Please choose a future date."
            : "Closed on Sundays & Mondays (unless a special Monday is open)."}
        </div>
      )}

      <label className="block text-sm text-gray-600 mb-1 mt-2">Time</label>
      <select
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
        disabled={!dateStr || !selectedDateObj || isPastDate || isClosed}
      >
        <option value="">Select a time</option>

        {selectedDateObj &&
          times.map((t) => {
            // Past-time filter (today only)
            const isToday =
              format(selectedDateObj, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

            const slotStart = parse(
              `${format(selectedDateObj, "yyyy-MM-dd")} ${t}`,
              "yyyy-MM-dd h:mm a",
              new Date()
            );

            const isPastTime = isToday && isBefore(slotStart, new Date());

            const blocked = isBlocked(selectedDateObj, t, bookedSlots, totalBlockedMinutes);

            if (isPastTime || blocked) return null;

            return (
              <option key={t} value={t}>
                {t}
              </option>
            );
          })}
      </select>

      <button
        type="button"
        disabled={!canSelect}
        onClick={() => {
          onSelect({ date: dateStr, time }); // backend accepts "h:mm a" too
        }}
        className={`mt-4 w-full px-4 py-2 rounded-full font-bold text-white ${
          canSelect ? "bg-[#55203d]" : "bg-[#7a3b44]/25 cursor-not-allowed"
        }`}
      >
        Confirm time
      </button>

      <p className="text-xs text-gray-500 mt-3">Times shown in {SHOP_TZ}.</p>
    </div>
  );
}
