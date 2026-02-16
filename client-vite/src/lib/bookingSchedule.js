// src/lib/bookingSchedule.js
import { addMinutes, format, parse } from "date-fns";
import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";

export const SHOP_TZ = "America/Vancouver";

export const DEFAULT_OPEN_HOUR = 10;
export const DEFAULT_CLOSE_HOUR = 19;
export const DEFAULT_STEP_MINUTES = 15;

// Closed by default: Sunday + Monday
export const CLOSED_WEEKDAYS = new Set([0, 1]); // Sun=0, Mon=1

// Special Mondays that are OPEN (YYYY-MM-DD)
export const OPEN_MONDAYS = new Set([
  // "2026-02-16",
]);

function ymd(dateObj) {
  return format(dateObj, "yyyy-MM-dd");
}

/**
 * Convert a Vancouver-local wall-clock (YYYY-MM-DD + h:mm a) into a UTC Date.
 * This makes comparisons correct regardless of user device timezone.
 */
function vancouverSlotToUtcDate(dateObj, time12h) {
  const dateStr = ymd(dateObj);
  const local = parse(`${dateStr} ${time12h}`, "yyyy-MM-dd h:mm a", new Date());
  if (isNaN(local.getTime())) return null;

  // Convert the wall-clock components to a Vancouver-zoned instant (UTC Date)
  const wallClock = format(local, "yyyy-MM-dd HH:mm:ss");
  return zonedTimeToUtc(wallClock, SHOP_TZ);
}

export function isShopClosed(dateObj) {
  const dateStr = ymd(dateObj);

  // Determine weekday *in Vancouver*, not user device timezone
  const noonUtc = zonedTimeToUtc(`${dateStr} 12:00:00`, SHOP_TZ);
  const vanNoon = utcToZonedTime(noonUtc, SHOP_TZ);
  const dow = vanNoon.getDay();

  if (dow === 1 && OPEN_MONDAYS.has(dateStr)) return false;
  return CLOSED_WEEKDAYS.has(dow);
}

/**
 * Generate start times where (start + totalBlockedMinutes) <= closing,
 * using Vancouver time for correctness.
 */
export function generateTimeSlots({
  totalBlockedMinutes,
  openHour = DEFAULT_OPEN_HOUR,
  closeHour = DEFAULT_CLOSE_HOUR,
  stepMinutes = DEFAULT_STEP_MINUTES,
  baseDate = new Date(),
}) {
  const slots = [];
  if (!Number.isFinite(totalBlockedMinutes) || totalBlockedMinutes <= 0) return slots;

  const dateStr = ymd(baseDate);

  // Build Vancouver opening/closing instants (UTC Dates)
  const openingUtc = zonedTimeToUtc(
    `${dateStr} ${String(openHour).padStart(2, "0")}:00:00`,
    SHOP_TZ
  );
  const closingUtc = zonedTimeToUtc(
    `${dateStr} ${String(closeHour).padStart(2, "0")}:00:00`,
    SHOP_TZ
  );

  let tUtc = openingUtc;
  while (addMinutes(tUtc, totalBlockedMinutes) <= closingUtc) {
    // Convert to Vancouver local for display text
    const tVan = utcToZonedTime(tUtc, SHOP_TZ);
    slots.push(format(tVan, "h:mm a"));
    tUtc = addMinutes(tUtc, stepMinutes);
  }

  return slots;
}

/**
 * Overlap check against booked slots returned from backend (UTC ISO strings).
 */
export function isOverlappingBookedSlot({
  dateObj,
  time12h,
  bookedSlots,
  totalBlockedMinutes,
}) {
  const slotStartUtc = vancouverSlotToUtcDate(dateObj, time12h);
  if (!slotStartUtc) return true;

  const slotEndUtc = addMinutes(slotStartUtc, totalBlockedMinutes);

  return (bookedSlots || []).some((b) => {
    const bookedStart = new Date(b.start);
    const bookedEnd = new Date(b.end);
    if (isNaN(bookedStart.getTime()) || isNaN(bookedEnd.getTime())) return false;

    return slotStartUtc < bookedEnd && slotEndUtc > bookedStart;
  });
}

export function isPastDay(dateObj) {
  // Compare based on local calendar day; good enough for UI selection gating
  const today0 = new Date();
  today0.setHours(0, 0, 0, 0);
  return dateObj < today0;
}

export function isPastTimeToday(dateObj, time12h) {
  const todayStr = format(new Date(), "yyyy-MM-dd");
  const selectedStr = ymd(dateObj);
  if (selectedStr !== todayStr) return false;

  const slotStartUtc = vancouverSlotToUtcDate(dateObj, time12h);
  if (!slotStartUtc) return true;

  return slotStartUtc < new Date();
}
