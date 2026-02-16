const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const tz = require("date-fns-tz");

const zonedTimeToUtc = tz.zonedTimeToUtc || tz.fromZonedTime;
if (!zonedTimeToUtc) throw new Error("date-fns-tz: zonedTimeToUtc/fromZonedTime not available");

const utcToZonedTime = tz.utcToZonedTime || tz.toZonedTime;
if (!utcToZonedTime) throw new Error("date-fns-tz: utcToZonedTime/toZonedTime not available");

const Booking = require("../models/booking");
const Service = require("../models/service");

const { createBookingEvent } = require("../services/calendar");
const { sendBookingEmails } = require("../services/email");

const BUFFER_MINUTES = 15;
const SHOP_TZ = "America/Vancouver";
const CLOSE_HOUR = 19;
const OPEN_HOUR = 10;

const CLOSED_WEEKDAYS = new Set([0, 1]); // Sun, Mon
const OPEN_MONDAYS = new Set([
  // "2026-02-16",
]);

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

function normalizeDateYYYYMMDD(dateInput) {
  if (!dateInput) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) return dateInput;

  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return null;

  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function normalizeTimeToHHMM(input) {
  const s = String(input || "").trim();

  if (/^\d{1,2}:\d{2}$/.test(s)) {
    const [h, m] = s.split(":");
    const hh = parseInt(h, 10);
    const mm = parseInt(m, 10);
    if (hh >= 0 && hh <= 23 && mm >= 0 && mm <= 59) {
      return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
    }
  }
  return to24h(s);
}

function minutesToMs(mins) {
  return mins * 60000;
}

function vancouverLocalToUtcDate(dateStrYYYYMMDD, hhmm24) {
  const local = `${dateStrYYYYMMDD} ${hhmm24}:00`;
  return zonedTimeToUtc(local, SHOP_TZ);
}

function isShopClosedDate(dateStrYYYYMMDD) {
  const middayUtc = vancouverLocalToUtcDate(dateStrYYYYMMDD, "12:00");
  const vancouverDate = utcToZonedTime(middayUtc, SHOP_TZ);
  const dow = vancouverDate.getDay();
  if (dow === 1 && OPEN_MONDAYS.has(dateStrYYYYMMDD)) return false;
  return CLOSED_WEEKDAYS.has(dow);
}

function looksLikeEmail(x) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(x || "").trim());
}

/* ---------------- CREATE BOOKING ---------------- */
router.post("/", async (req, res) => {
  try {
    const { services, name, email, phone, referredBy, date, time, note } = req.body;

    // ✅ Hard validation
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ error: "Missing required fields (name, email, phone, date, time)." });
    }
    if (!looksLikeEmail(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Please select at least one service." });
    }

    const dateStr = normalizeDateYYYYMMDD(date);
    if (!dateStr) return res.status(400).json({ error: "Invalid date." });

    if (isShopClosedDate(dateStr)) {
      return res.status(400).json({ error: "We are closed on Sundays and Mondays." });
    }

    const hhmm = normalizeTimeToHHMM(time);
    if (!hhmm) return res.status(400).json({ error: "Invalid time format. Use like '3:00 PM'." });

    if (!services.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ error: "Invalid service id format." });
    }

    const serviceIds = services.map((id) => new mongoose.Types.ObjectId(id));
    const servicesData = await Service.find({ _id: { $in: serviceIds } });
    if (servicesData.length !== serviceIds.length) {
      return res.status(400).json({ error: "Invalid service selection." });
    }

    const serviceDuration = servicesData.reduce((sum, s) => sum + (s.duration || 0), 0);

    const NO_BUFFER_SERVICE_NAMES = new Set(["Eyebrows Threading", "Full Threading"]);
    const bufferMinutes = servicesData.some((s) => !NO_BUFFER_SERVICE_NAMES.has(String(s.name || "").trim()))
      ? BUFFER_MINUTES
      : 0;

    const totalBlockedMinutes = serviceDuration + bufferMinutes;

    const start = vancouverLocalToUtcDate(dateStr, hhmm);
    const end = new Date(start.getTime() + minutesToMs(totalBlockedMinutes));
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date/time." });
    }

    const openUtc = vancouverLocalToUtcDate(dateStr, `${String(OPEN_HOUR).padStart(2, "0")}:00`);
    if (start < openUtc) return res.status(400).json({ error: `We open at ${OPEN_HOUR}:00 AM.` });

    const closingUtc = vancouverLocalToUtcDate(dateStr, `${String(CLOSE_HOUR).padStart(2, "0")}:00`);
    if (end > closingUtc) return res.status(400).json({ error: "Selected service must finish by 7:00 PM." });

    const conflict = await Booking.findOne({
      status: { $ne: "cancelled" },
      $expr: { $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }] },
    }).select("_id start end");

    if (conflict) return res.status(409).json({ error: "This time slot is no longer available." });

    const booking = new Booking({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      referredBy: String(referredBy || "").trim(),
      services: serviceIds,
      date: new Date(`${dateStr}T00:00:00.000Z`),
      time: hhmm,
      start,
      end,
      duration: serviceDuration,
      bufferMinutes,
      note: String(note || "").trim(),
    });

    await booking.save();

    // Calendar (non-blocking)
    (async () => {
      try {
        const eventId = await createBookingEvent({
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          services: servicesData.map((s) => s.name),
          note: booking.note,
          start: start.toISOString(),
          end: end.toISOString(),
        });
        booking.calendarEventId = eventId;
        await booking.save();
      } catch (err) {
        console.error("🔥 Calendar insert failed:", err?.response?.data || err?.message || err);
      }
    })();

    // Email (non-blocking) ✅ sends to client + admin inside sendBookingEmails
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

        console.log("📧 Sending booking emails", {
          toClient: booking.email,
          admin: process.env.ADMIN_EMAIL,
          smtpUser: process.env.SMTP_USER,
        });

        await sendBookingEmails({ booking, servicesText, prettyDate, prettyTime });
        console.log("✅ Booking emails sent");
      } catch (err) {
        console.error("🔥 Booking email failed FULL:", err);
      }
    })();

    return res.status(201).json(booking);
  } catch (err) {
    console.error("❌ Booking failed FULL ERROR:", err);
    return res.status(500).json({ error: err?.message, name: err?.name });
  }
});

/* ---------------- GET BOOKED SLOTS ---------------- */
router.get("/booked", async (req, res) => {
  try {
    const dateStr = normalizeDateYYYYMMDD(req.query.date);
    if (!dateStr) return res.status(400).json({ error: "date is required (YYYY-MM-DD)" });

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
