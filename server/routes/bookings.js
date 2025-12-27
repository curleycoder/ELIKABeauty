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

// Helper: convert "3:05 PM" -> "15:05"
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

// ✅ Create booking
router.post("/", async (req, res) => {
  console.log("📥 POST /api/bookings HIT");

  try {
    const { services, name, email, phone, referredBy, date, time, note } = req.body;

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Please select at least one service." });
    }

    // Validate services
    const serviceIds = services.map((id) => new mongoose.Types.ObjectId(id));
    const servicesData = await Service.find({ _id: { $in: serviceIds } });

    if (servicesData.length !== serviceIds.length) {
      return res.status(400).json({ error: "Invalid service selection." });
    }

    // Duration (service only)
    const serviceDuration = servicesData.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalBlockedMinutes = serviceDuration + BUFFER_MINUTES;

    // Build start/end (your time is like "3:00 PM")
    const hhmm = to24h(time);
    if (!hhmm) {
      return res.status(400).json({ error: "Invalid time format. Use like '3:00 PM'." });
    }

    const start = new Date(`${date}T${hhmm}:00`);
    const end = new Date(start.getTime() + totalBlockedMinutes * 60000);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid date/time." });
    }

    // Double-booking check (overlap)
    const conflict = await Booking.findOne({
      $expr: {
        $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
      },
    });

    if (conflict) {
      return res.status(409).json({
        error: "This time slot is no longer available. Please choose another.",
      });
    }

    // Save booking first
    const booking = new Booking({
      name,
      email,
      phone,
      referredBy,
      services: serviceIds,
      date: new Date(date),
      time: hhmm,
      start,
      end,
      duration: serviceDuration,
      note,
    });

    await booking.save();

    // Create calendar event + save eventId
    try {
      const eventId = await createBookingEvent({
        name,
        services: servicesData.map((s) => s.name),
        start: start.toISOString(),
        end: end.toISOString(),
      });

      booking.calendarEventId = eventId;
      await booking.save();
    } catch (err) {
      console.error("🔥 Google Calendar insert failed:", err?.response?.data || err);
      // booking still exists even if calendar fails
    }

    console.log("✅ Booking saved");
    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Booking failed:", error);
    res.status(500).json({ error: "Booking failed. Please try again." });
  }
});
// ✅ Booked slots for a day (used by DatePicker/slots)
router.get("/booked", async (req, res) => {
  const { date } = req.query; // "YYYY-MM-DD"
  try {
    if (!date) return res.status(400).json({ error: "date is required" });

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59.999`);

    const bookings = await Booking.find({
      start: { $gte: dayStart, $lte: dayEnd },
    }).select("start end");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ List bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ start: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch bookings" });
  }
});

// ✅ Owner cancels booking
router.delete("/:id", async (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    // 1) Email client (log failures)
    try {
      await sendCancellationEmail({
        to: booking.email,
        name: booking.name,
        date: booking.start ? new Date(booking.start).toDateString() : new Date(booking.date).toDateString(),
        time: booking.time || "",
      });
      console.log("📧 Cancellation email sent to:", booking.email);
    } catch (err) {
      console.error("🔥 Cancellation email failed:", err);
    }

    // 2) Delete from Google Calendar (log failures)
    try {
      await deleteBookingEvent(booking.calendarEventId);
      console.log("📅 Calendar event deleted:", booking.calendarEventId);
    } catch (err) {
      console.error("🔥 Calendar delete failed:", err?.response?.data || err);
    }

    // 3) Delete from DB
    await booking.deleteOne();

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Cancellation failed:", error);
    res.status(500).json({ error: "Cancellation failed" });
  }
});


// ✅ Owner reschedules booking
router.put("/:id/reschedule", async (req, res) => {
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const { date, time } = req.body; // time should be "HH:MM" (24h) from admin prompt
    if (!date || !time) return res.status(400).json({ error: "date and time are required" });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    const start = new Date(`${date}T${time}:00`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ error: "Invalid date/time. Use YYYY-MM-DD and HH:MM (24h)." });
    }

    const totalBlockedMinutes = (booking.duration || 0) + BUFFER_MINUTES;
    const end = new Date(start.getTime() + totalBlockedMinutes * 60000);

    // Overlap check (exclude itself)
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      $expr: {
        $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
      },
    });

    if (conflict) {
      return res.status(409).json({ error: "This new time overlaps with another booking." });
    }

    // Update DB
    booking.date = new Date(date);
    booking.time = time; // now stored as 24h from admin tool (fine)
    booking.start = start;
    booking.end = end;
    await booking.save();

    // Update calendar event
    try {
      await updateBookingEvent({
        eventId: booking.calendarEventId,
        start: start.toISOString(),
        end: end.toISOString(),
      });
    } catch (err) {
      console.error("🔥 Google Calendar update failed:", err?.response?.data || err);
    }

    res.json(booking);
  } catch (err) {
    console.error("❌ Reschedule failed:", err);
    res.status(500).json({ error: "Reschedule failed" });
  }
});

module.exports = router;
