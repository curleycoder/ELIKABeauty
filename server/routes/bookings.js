const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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

/* ---------------- CREATE BOOKING ---------------- */

router.post("/", async (req, res) => {
  console.log("📥 POST /api/bookings");

  try {
    const { services, name, email, phone, referredBy, date, time, note } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Please select at least one service." });
    }

    // Normalize date FIRST
    const dateStr = normalizeDateYYYYMMDD(date);
    if (!dateStr) {
      return res.status(400).json({ error: "Invalid date." });
    }

    // Validate services
    const serviceIds = services.map((id) => new mongoose.Types.ObjectId(id));
    const servicesData = await Service.find({ _id: { $in: serviceIds } });

    if (servicesData.length !== serviceIds.length) {
      return res.status(400).json({ error: "Invalid service selection." });
    }

    // Total service duration
    const serviceDuration = servicesData.reduce(
      (sum, s) => sum + (s.duration || 0),
      0
    );

    // Buffer rules
    const NO_BUFFER_SERVICE_NAMES = new Set([
      "Eyebrows Threading",
      "Full Threading",
    ]);

    const buffers = servicesData.map((s) =>
      NO_BUFFER_SERVICE_NAMES.has(String(s.name || "").trim())
        ? 0
        : BUFFER_MINUTES
    );

    const bufferMinutes = Math.max(...buffers, 0);
    const totalBlockedMinutes = serviceDuration + bufferMinutes;

    // Time parsing
    const hhmm = to24h(time);
    if (!hhmm) {
      return res.status(400).json({ error: "Invalid time format. Use like '3:00 PM'." });
    }

    const start = new Date(`${dateStr}T${hhmm}:00`);
    const end = new Date(start.getTime() + totalBlockedMinutes * 60000);
    const closingTime = new Date(`${dateStr}T19:00:00`); // 7:00 PM

    if (end > closingTime) {
      return res.status(400).json({
        error: "Selected service must finish by 7:00 PM.",
      });
    }


    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date/time." });
    }

    // Conflict check (back-to-back allowed)
    const conflict = await Booking.findOne({
      $expr: {
        $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
      },
    });

    if (conflict) {
      return res.status(409).json({
        error: "This time slot is no longer available.",
      });
    }

    // Save booking
    const booking = new Booking({
      name,
      email,
      phone,
      referredBy,
      services: serviceIds,
      date: new Date(dateStr),
      time: hhmm,
      start,
      end,
      duration: serviceDuration,
      bufferMinutes,
      note,
    });

    await booking.save();

    // Google Calendar (non-blocking)
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

    res.status(201).json(booking);
  } catch (err) {
    console.error("❌ Booking failed:", err);
    res.status(500).json({ error: "Booking failed. Please try again." });
  }
});

/* ---------------- GET BOOKED SLOTS ---------------- */

router.get("/booked", async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: "date is required" });

  const dayStart = new Date(`${date}T00:00:00`);
  const dayEnd = new Date(`${date}T23:59:59.999`);

  const bookings = await Booking.find({
    start: { $gte: dayStart, $lte: dayEnd },
  }).select("start end");

  res.json(bookings);
});

/* ---------------- RESCHEDULE ---------------- */

router.put("/:id/reschedule", async (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const { date, time } = req.body;
  const dateStr = normalizeDateYYYYMMDD(date);
  if (!dateStr || !time) {
    return res.status(400).json({ error: "Invalid date or time." });
  }

  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ error: "Booking not found" });

  const start = new Date(`${dateStr}T${time}:00`);
  if (isNaN(start.getTime())) {
    return res.status(400).json({ error: "Invalid date/time." });
  }

  const totalBlockedMinutes =
    (booking.duration || 0) + (booking.bufferMinutes || 0);

  const end = new Date(start.getTime() + totalBlockedMinutes * 60000);

  const conflict = await Booking.findOne({
    _id: { $ne: booking._id },
    $expr: {
      $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
    },
  });

  if (conflict) {
    return res.status(409).json({ error: "This new time overlaps another booking." });
  }

  booking.date = new Date(dateStr);
  booking.start = start;
  booking.end = end;
  booking.time = time;

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

  res.json(booking);
});

module.exports = router;
