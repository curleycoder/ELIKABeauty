const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const tz = require("date-fns-tz");
const zonedTimeToUtc = tz.zonedTimeToUtc || tz.fromZonedTime;

if (!zonedTimeToUtc) {
  throw new Error("date-fns-tz: zonedTimeToUtc/fromZonedTime not available");
}

const Booking = require("../models/booking");
const Service = require("../models/service");

const { createBookingEvent, deleteBookingEvent } = require("../services/calendar");
const { sendBookingEmails, sendCancellationEmail } = require("../services/email");

const BUFFER_MINUTES = 15;
const ADMIN_KEY = process.env.ADMIN_KEY;

const SHOP_TZ = "America/Vancouver";
const CLOSE_HOUR = 19;
const OPEN_HOUR = 10;

function to24h(time12h) {
  const m = String(time12h).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;

  let hh = parseInt(m[1], 10);
  const mm = m[2];
  const ap = m[3].toUpperCase();

  if (ap === "AM") hh = hh === 12 ? 0 : hh;
  if (ap === "PM") hh = hh === 12 ? 12 : hh + 12;

  return `${String(hh).padStart(2, "0")}:${mm}`;
}

// Accept Date | ISO | YYYY-MM-DD → YYYY-MM-DD
function normalizeDateYYYYMMDD(dateInput) {
  if (!dateInput) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) return dateInput;

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

// accepts "HH:MM" OR "3:00 PM"
function normalizeTimeToHHMM(input) {
  const s = String(input || "").trim();

  // 24h "HH:MM"
  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [h, m] = s.split(":");
    const hh = parseInt(h, 10);
    const mm = parseInt(m, 10);
    if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    }
  }

  // 12h
  return to24h(s);
}

function minutesToMs(mins) {
  return mins * 60000;
}

// Vancouver local time → UTC Date
function vancouverLocalToUtcDate(dateStrYYYYMMDD, hhmm24) {
  const local = `${dateStrYYYYMMDD} ${hhmm24}:00`;
  return zonedTimeToUtc(local, SHOP_TZ);
}


/* ---------------- CREATE BOOKING ---------------- */
router.post("/", async (req, res) => {
  try {
    const { services, name, email, phone, referredBy, date, time, note } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Please select at least one service." });
    }

    const dateStr = normalizeDateYYYYMMDD(date);
    if (!dateStr) return res.status(400).json({ error: "Invalid date." });

    const hhmm = normalizeTimeToHHMM(time);
    if (!hhmm) {
      return res.status(400).json({ error: "Invalid time format. Use like '3:00 PM'." });
    }

    // Validate services
if (!services.every((id) => mongoose.Types.ObjectId.isValid(id))) {
  return res.status(400).json({ error: "Invalid service id format." });
}

const serviceIds = services.map((id) => new mongoose.Types.ObjectId(id));
    const servicesData = await Service.find({ _id: { $in: serviceIds } });

    if (servicesData.length !== serviceIds.length) {
      return res.status(400).json({ error: "Invalid service selection." });
    }

    // Total service duration
    const serviceDuration = servicesData.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Buffer rules
    const NO_BUFFER_SERVICE_NAMES = new Set(["Eyebrows Threading", "Full Threading"]);
    const bufferMinutes = Math.max(
      ...servicesData.map((s) =>
        NO_BUFFER_SERVICE_NAMES.has(String(s.name || "").trim()) ? 0 : BUFFER_MINUTES
      ),
      0
    );

    const totalBlockedMinutes = serviceDuration + bufferMinutes;

    // start/end in UTC based on Vancouver local
    const start = vancouverLocalToUtcDate(dateStr, hhmm);
    const end = new Date(start.getTime() + minutesToMs(totalBlockedMinutes));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date/time." });
    }

    // Opening hour enforcement
    const openUtc = vancouverLocalToUtcDate(dateStr, `${String(OPEN_HOUR).padStart(2, "0")}:00`);
    if (start < openUtc) {
      return res.status(400).json({ error: `We open at ${OPEN_HOUR}:00 AM.` });
    }

    // Closing: must finish by 7PM Vancouver time
    const closingUtc = vancouverLocalToUtcDate(
      dateStr,
      `${String(CLOSE_HOUR).padStart(2, "0")}:00`
    );
    if (end > closingUtc) {
      return res.status(400).json({ error: "Selected service must finish by 7:00 PM." });
    }

    // Conflict check (true overlap only; back-to-back allowed)
    const conflict = await Booking.findOne({
      status: { $ne: "cancelled" },
      $expr: { $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }] },
    }).select("_id start end");

    if (conflict) {
      return res.status(409).json({ error: "This time slot is no longer available." });
    }

    const booking = new Booking({
      name,
      email,
      phone,
      referredBy,
      services: serviceIds,
      date: new Date(`${dateStr}T00:00:00.000Z`),
      time: hhmm,
      start,
      end,
      duration: serviceDuration,
      bufferMinutes,
      note,
    });

    await booking.save();

    // Calendar (non-blocking)
    (async () => {
      try {
        const eventId = await createBookingEvent({
          name,
          email,
          phone,
          services: servicesData.map((s) => s.name),
          note,
          start: start.toISOString(),
          end: end.toISOString(),
        });
        booking.calendarEventId = eventId;
        await booking.save();
      } catch (err) {
        console.error("🔥 Calendar insert failed:", err?.response?.data || err?.message || err);
      }
    })();

    // Email (non-blocking) — SINGLE source of truth
    (async () => {
      try {
        const startDate = new Date(start);

        const prettyDate = startDate.toLocaleDateString("en-CA", { timeZone: SHOP_TZ });
        const prettyTime = startDate.toLocaleTimeString("en-US", {
          timeZone: SHOP_TZ,
          hour: "numeric",
          minute: "2-digit",
        });

        const servicesText = servicesData.map((s) => s.name).join(", ");

        await sendBookingEmails({
          booking,
          servicesText,
          prettyDate,
          prettyTime,
        });

        console.log("✅ Booking emails sent");
      } catch (err) {
        console.error("🔥 Booking email failed:", err?.stack || err);
      }
    })();

    return res.status(201).json(booking);
  } catch (err) {
  console.error("❌ Booking failed FULL ERROR:", err);

  return res.status(500).json({
    error: err?.message,
    name: err?.name,
  });
}

});
/* ---------------- GET BOOKED SLOTS ---------------- */
// GET /api/bookings/booked?date=YYYY-MM-DD
router.get("/booked", async (req, res) => {
  try {
    const dateStr = normalizeDateYYYYMMDD(req.query.date);
    if (!dateStr) return res.status(400).json({ error: "date is required" });

    const dayStartUtc = vancouverLocalToUtcDate(dateStr, "00:00");
    const nextDayUtc = new Date(dayStartUtc.getTime() + 24 * 60 * 60 * 1000);

    const bookings = await Booking.find({
      status: { $ne: "cancelled" },
      start: { $gte: dayStartUtc, $lt: nextDayUtc },
    }).select("start end");

    return res.json(bookings);
  } catch (err) {
    console.error("❌ /api/bookings/booked failed:", err);
    return res.status(500).json({ error: "Internal error" });
  }
});

module.exports = router;
