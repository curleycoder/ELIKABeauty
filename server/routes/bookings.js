const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { zonedTimeToUtc } = require("date-fns-tz");

const Booking = require("../models/booking");
const Service = require("../models/service");

const {
  createBookingEvent,
  deleteBookingEvent,
  updateBookingEvent,
} = require("../services/calendar");

const BUFFER_MINUTES = 15;
const ADMIN_KEY = process.env.ADMIN_KEY;

const SHOP_TZ = "America/Vancouver";
const CLOSE_HOUR = 19; // 7pm Vancouver local

/* ---------------- HELPERS ---------------- */

// "3:05 PM" → "15:05"
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

// Build UTC Date from Vancouver local date/time
function vanLocalToUtc(dateStrYYYYMMDD, hhmm24) {
  // Example: "2025-12-26 15:05:00" interpreted in Vancouver → UTC Date
  const local = `${dateStrYYYYMMDD} ${hhmm24}:00`;
  return zonedTimeToUtc(local, SHOP_TZ);
}

function minutesToMs(m) {
  return (m || 0) * 60 * 1000;
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

    const hhmm = to24h(time);
    if (!hhmm) {
      return res.status(400).json({ error: "Invalid time format. Use like '3:00 PM'." });
    }

    // Validate services
    const serviceIds = services.map((id) => new mongoose.Types.ObjectId(id));
    const servicesData = await Service.find({ _id: { $in: serviceIds } });

    if (servicesData.length !== serviceIds.length) {
      return res.status(400).json({ error: "Invalid service selection." });
    }

    // Duration (service only)
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

    // Vancouver-local start/end, stored as UTC Date objects
    const start = vanLocalToUtc(dateStr, hhmm);
    const end = new Date(start.getTime() + minutesToMs(totalBlockedMinutes));

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date/time." });
    }

    // Must finish by 7pm Vancouver local
    const closingUtc = vanLocalToUtc(dateStr, `${String(CLOSE_HOUR).padStart(2, "0")}:00`);
    if (end > closingUtc) {
      return res.status(400).json({ error: "Selected service must finish by 7:00 PM." });
    }

    // Overlap check (back-to-back allowed)
    const conflict = await Booking.findOne({
      $expr: {
        $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
      },
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
      date: new Date(`${dateStr}T00:00:00.000Z`), // optional legacy field
      time: hhmm, // store as "HH:MM"
      start,
      end,
      duration: serviceDuration,
      bufferMinutes,
      note,
    });

    await booking.save();

    // Calendar (non-blocking)
    try {
      const eventId = await createBookingEvent({
        name,
        services: servicesData.map((s) => s.name),
        start: start.toISOString(),
        end: end.toISOString(),
        // Add your extra data into description inside calendar service if you want
        // (recommended)
      });

      booking.calendarEventId = eventId;
      await booking.save();
    } catch (err) {
      console.error("🔥 Calendar insert failed:", err);
    }

    return res.status(201).json(booking);
  } catch (err) {
    console.error("❌ Booking failed:", err);
    return res.status(500).json({ error: "Booking failed. Please try again." });
  }
});

/* ---------------- GET BOOKED SLOTS ---------------- */

router.get("/booked", async (req, res) => {
  const dateStr = normalizeDateYYYYMMDD(req.query.date);
  if (!dateStr) return res.status(400).json({ error: "date is required" });

  // Vancouver day boundaries (converted to UTC)
  const dayStartUtc = vanLocalToUtc(dateStr, "00:00");
  const dayEndUtc = zonedTimeToUtc(`${dateStr} 23:59:59`, SHOP_TZ);

  const bookings = await Booking.find({
    start: { $gte: dayStartUtc, $lte: dayEndUtc },
  }).select("start end");

  return res.json(bookings);
});

/* ---------------- RESCHEDULE (owner) ---------------- */

router.put("/:id/reschedule", async (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const dateStr = normalizeDateYYYYMMDD(req.body.date);
  const time24 = String(req.body.time || "").trim(); // expects "HH:MM"
  if (!dateStr || !/^\d{2}:\d{2}$/.test(time24)) {
    return res.status(400).json({ error: "Invalid date or time." });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const start = vanLocalToUtc(dateStr, time24);
  const totalBlockedMinutes = (booking.duration || 0) + (booking.bufferMinutes || 0);
  const end = new Date(start.getTime() + minutesToMs(totalBlockedMinutes));

  const closingUtc = vanLocalToUtc(dateStr, `${String(CLOSE_HOUR).padStart(2, "0")}:00`);
  if (end > closingUtc) {
    return res.status(400).json({ error: "Selected service must finish by 7:00 PM." });
  }

  const conflict = await Booking.findOne({
    _id: { $ne: booking._id },
    $expr: {
      $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
    },
  });

  if (conflict) {
    return res.status(409).json({ error: "This new time overlaps another booking." });
  }

  booking.date = new Date(`${dateStr}T00:00:00.000Z`);
  booking.start = start;
  booking.end = end;
  booking.time = time24;

  await booking.save();

  try {
    await updateBookingEvent({
      eventId: booking.calendarEventId,
      start: start.toISOString(),
      end: end.toISOString(),
    });
  } catch (err) {
    console.error("🔥 Calendar update failed:", err);
  }

  return res.json(booking);
});

module.exports = router;
