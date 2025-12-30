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

const {
  createBookingEvent,
  deleteBookingEvent,
} = require("../services/calendar");

const { sendCancellationEmail } = require("../services/email");

const BUFFER_MINUTES = 15;
const ADMIN_KEY = process.env.ADMIN_KEY;

const SHOP_TZ = "America/Vancouver";
const CLOSE_HOUR = 19;
const OPEN_HOUR = 11;

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

// YYYY-MM-DD + N day → YYYY-MM-DD
function addDaysYYYYMMDD(dateStr, days = 1) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (isNaN(d.getTime())) return null;
  d.setUTCDate(d.getUTCDate() + days);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
}

// Vancouver local time → UTC Date
function vancouverLocalToUtcDate(dateStrYYYYMMDD, hhmm24) {
  // "2025-12-26 15:05:00" as Vancouver local
  const local = `${dateStrYYYYMMDD} ${hhmm24}:00`;
  return zonedTimeToUtc(local, SHOP_TZ);
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
      date: new Date(`${dateStr}T00:00:00.000Z`), // optional
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
      console.error("🔥 Calendar insert failed:");
      console.error(err?.response?.data || err?.message || err);
    }


    return res.status(201).json(booking);
  } catch (err) {
    console.error("❌ Booking failed:", err);
    return res.status(500).json({ error: "Booking failed. Please try again." });
  }
});

/* ---------------- GET BOOKED SLOTS ---------------- */
// returns [{start,end}] for that Vancouver date
router.get("/booked", async (req, res) => {
  try {
    const dateStr = normalizeDateYYYYMMDD(req.query.date);
    if (!dateStr) return res.status(400).json({ error: "date is required" });

    const dayStartUtc = vancouverLocalToUtcDate(dateStr, "00:00");
    const nextDayStr = addDaysYYYYMMDD(dateStr, 1);
    const nextDayStartUtc = vancouverLocalToUtcDate(nextDayStr, "00:00");

    const bookings = await Booking.find({
      status: { $ne: "cancelled" },
      start: { $gte: dayStartUtc, $lt: nextDayStartUtc },
    }).select("start end");

    res.json(bookings);
  } catch (err) {
    console.error("❌ /api/bookings/booked failed:", err);
    res.status(500).json({
      error: err?.message || "Internal error",
      name: err?.name,
    });
  }
});

/* ---------------- ADMIN: LIST ALL BOOKINGS ---------------- */
router.get("/", async (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const bookings = await Booking.find({})
      .sort({ start: 1 })
      .populate("services", "name duration price category");
    res.json(bookings);
  } catch (err) {
    console.error("❌ Failed to fetch bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/* ---------------- ADMIN: CANCEL ---------------- */
router.delete("/:id", async (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const booking = await Booking.findById(req.params.id).populate("services", "name");
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // Calendar delete (non-blocking)
    try {
      if (booking.calendarEventId) {
        await deleteBookingEvent(booking.calendarEventId);
      }
    } catch (err) {
      console.error("🔥 Calendar insert failed:");
      console.error(err?.response?.data || err?.message || err);
    }


    const startDate = booking.start ? new Date(booking.start) : null;

    const prettyDate = startDate
      ? startDate.toLocaleDateString("en-CA", { timeZone: "America/Vancouver" })
      : (booking.date
          ? new Date(booking.date).toLocaleDateString("en-CA", { timeZone: "America/Vancouver" })
          : "");

    const prettyTime = startDate
      ? startDate.toLocaleTimeString("en-US", {
          timeZone: "America/Vancouver",
          hour: "numeric",
          minute: "2-digit",
        })
      : booking.time;

    let emailSent = false;
    try {
      const info = await sendCancellationEmail({
        email: booking.email,
        name: booking.name,
        date: prettyDate,
        time: prettyTime,
      });
      console.log("✅ Cancellation email sent:", info?.messageId || info);
      emailSent = true;
    } catch (err) {
      console.error("🔥 Cancellation email failed:", err?.stack || err);
    }


    // NOTE: You should eventually switch to status="cancelled" instead of delete
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({ success: true, emailSent });
  } catch (err) {
    console.error("❌ Cancel booking failed:", err);
    res.status(500).json({ error: "Cancel booking failed" });
  }
});
