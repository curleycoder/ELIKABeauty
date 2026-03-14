import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import {
  isShopClosed,
  isPastDay,
  generateTimeSlots,
  isOverlappingBookedSlot,
  isPastTimeToday,
} from "../lib/bookingSchedule";

const baseURL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/**
 * Scans the next 14 days and returns the first available slot.
 * Returns: { label: "Today · 2:00 PM" | "Tomorrow · 10:00 AM" | "Fri Mar 20 · 11:00 AM", loading, error }
 */
export function useNextAvailable({ duration = 60, serviceType = "chair" } = {}) {
  const [label, setLabel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!duration || duration <= 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function scan() {
      setLoading(true);
      setLabel(null);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < 14; i++) {
        if (cancelled) return;

        const day = addDays(today, i);

        if (isPastDay(day) || isShopClosed(day)) continue;

        const ymd = format(day, "yyyy-MM-dd");

        // fetch booked slots for this day
        let bookedSlots = [];
        try {
          const res = await fetch(
            `${baseURL}/api/bookings/booked?date=${ymd}&serviceType=${serviceType}`
          );
          if (res.ok) bookedSlots = await res.json();
        } catch {
          // network error — skip day
          continue;
        }

        if (cancelled) return;

        const slots = generateTimeSlots({ totalBlockedMinutes: duration, baseDate: day });

        const firstFree = slots.find((time) => {
          if (isPastTimeToday(day, time)) return false;
          return !isOverlappingBookedSlot({
            dateObj: day,
            time12h: time,
            bookedSlots,
            totalBlockedMinutes: duration,
          });
        });

        if (firstFree) {
          const todayStr = format(today, "yyyy-MM-dd");
          const tomorrowStr = format(addDays(today, 1), "yyyy-MM-dd");

          let dayLabel;
          if (ymd === todayStr) dayLabel = "Today";
          else if (ymd === tomorrowStr) dayLabel = "Tomorrow";
          else dayLabel = format(day, "EEE, MMM d");

          setLabel(`${dayLabel} · ${firstFree}`);
          setLoading(false);
          return;
        }
      }

      // nothing found in 14 days
      setLabel(null);
      setLoading(false);
    }

    scan();
    return () => { cancelled = true; };
  }, [duration, serviceType]);

  return { label, loading };
}
