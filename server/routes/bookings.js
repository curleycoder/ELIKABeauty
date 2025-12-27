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

const { sendCancellationEmail } = require("../services/email");

const BUFFER_MINUTES = 15;
const ADMIN_KEY = process.env.ADMIN_KEY;

const SHOP_TZ = "America/Vancouver";
const CLOSE_HOUR = 19; // 7pm

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

// ✅ Build a Date in Vancouver time, stored as UTC Date
function vancouverLocalToUtcDate(dateStrYYYYMMDD, hhmm24) {
  // dateStr: "2025-12-26", hhmm: "15:05"
  // This string represents LOCAL time in SHOP_TZ
  const local = `${dateStrYYYYMMDD} ${hhmm24}:00`;
  return zonedTimeToUtc(local, SHOP_TZ);
}

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

    const serviceIds = services.map((id) => new mongoose.Types.ObjectId(id));
    const servicesData = await Service.find({ _id: { $in: serviceIds } });
    if (servicesData.length !== serviceIds.length) {
      return res.status(400).json({ error: "Invalid service selection." });
    }

    const serviceDuration = servicesData.reduce((sum, s) => sum + (s.duration || 0), 0);

    const NO_BUFFER_SERVICE_NAMES = new Set(["Eyebrows Threading", "Full Threading"]);
    const buffers = servicesData.map((s) =>
      NO_BUFFER_SERVICE_NAMES.has(String(s.name || "").trim()) ? 0 : BUFFER_MINUTES
    );
    const bufferMinutes = Math.max(...buffers, 0);
    const totalBlockedMinutes = serviceDuration + bufferMinutes;

    // ✅ start/end in UTC, derived from Vancouver local time
    const start = vancouverLocalToUtcDate(dateStr, hhmm);
    const end = new Date(start.getTime() + totalBlockedMinutes * 60000);

    // ✅ closing time: 7pm Vancouver local time, converted to UTC
    const closingTimeUtc = vancouverLocalToUtcDate(dateStr, `${String(CLOSE_HOUR).padStart(2, "0")}:00`);
    if (end > closingTimeUtc) {
      return res.status(400).json({ error: "Selected service must finish by 7:00 PM." });
    }

    // ✅ conflict check (back-to-back allowed)
    const conflict = await Booking.findOne({
      $expr: {
        $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
      },
    });

    if (conflict) {
      return res.status(409).json({ error: "This time slot is no longer available." });
    }

    const booking = new Booking({
      name,
      email,
      phone,
      referredBy,
      services: serviceIds,
      date: new Date(`${dateStr}T00:00:00.000Z`), // optional; keep if you need it
      time: hhmm, // "HH:MM"
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
      console.error("🔥 Calendar insert failed:", err);
    }

    return res.status(201).json(booking);
  } catch (err) {
    console.error("❌ Booking failed:", err);
    return res.status(500).json({ error: "Booking failed. Please try again." });
  }
});

router.get("/booked", async (req, res) => {
  const { date } = req.query;
  const dateStr = normalizeDateYYYYMMDD(date);
  if (!dateStr) return res.status(400).json({ error: "date is required" });

  // ✅ Vancouver day boundaries converted to UTC
  const dayStartUtc = vancouverLocalToUtcDate(dateStr, "00:00");
  const dayEndUtc = vancouverLocalToUtcDate(dateStr, "23:59");

  const bookings = await Booking.find({
    start: { $gte: dayStartUtc, $lte: dayEndUtc },
  }).select("start end");

  res.json(bookings);
});

module.exports = router;
