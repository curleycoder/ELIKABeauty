const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Service = require("../models/service");
const mongoose = require("mongoose");
const { createBookingEvent } = require("../services/calendar");
const { deleteBookingEvent } = require("../services/calendar");
const { sendCancellationEmail } = require("../services/email");
const { updateBookingEvent } = require("../services/calendar");

const BUFFER_MINUTES = 15;
const ADMIN_KEY = process.env.ADMIN_KEY;


router.post("/", async (req, res) => {
  console.log("📥 POST /api/bookings HIT");

  try {
    const {
      services,
      name,
      email,
      phone,
      referredBy,
      date,
      time,
      note,
    } = req.body;

    // 1️⃣ Validate services
    const serviceIds = services.map(id => new mongoose.Types.ObjectId(id));
    const servicesData = await Service.find({ _id: { $in: serviceIds } });

    if (servicesData.length !== serviceIds.length) {
      return res.status(400).json({ error: "Invalid service selection." });
    }

    // 2️⃣ Calculate duration
    const serviceDuration = servicesData.reduce(
      (sum, s) => sum + (s.duration || 0),
      0
    );

    const totalBlockedMinutes = serviceDuration + BUFFER_MINUTES;

    // 3️⃣ Build start & end datetime
    const start = new Date(`${date}T${time}`);
    const end = new Date(start.getTime() + totalBlockedMinutes * 60000);

    // 4️⃣ 🔴 DOUBLE BOOKING CHECK (THIS IS THE KEY)
    const conflict = await Booking.findOne({
      $expr: {
        $and: [
          { $lt: ["$start", end] },
          { $gt: ["$end", start] },
        ],
      },
    });

    if (conflict) {
      return res.status(409).json({
        error: "This time slot is no longer available. Please choose another.",
      });
    }

    // 5️⃣ Save booking
    const booking = new Booking({
      name,
      email,
      phone,
      referredBy,
      services: serviceIds,
      date,
      time,
      start,
      end,
      duration: serviceDuration,
      note,
    });

    await booking.save();

    // 6️⃣ Add to Google Calendar
    await createBookingEvent({
      name,
      services: servicesData.map(s => s.name),
      start: start.toISOString(),
      end: end.toISOString(),
    });

    console.log("✅ Booking saved + calendar event created");
    res.status(201).json(booking);

  } catch (error) {
    console.error("❌ Booking failed:", error);
    res.status(500).json({ error: "Booking failed. Please try again." });
  }
});

await sendCancellationEmail({
  to: booking.email,
  name: booking.name,
  date: booking.date.toDateString(),
  time: booking.time,
});


router.delete("/:id", async (req, res) => {
  // 🔐 ADMIN KEY CHECK
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // remove from Google Calendar
    await deleteBookingEvent(booking.calendarEventId);

    // remove from DB
    await booking.deleteOne();

    res.json({ success: true });

  } catch (error) {
    console.error("❌ Cancellation failed:", error);
    res.status(500).json({ error: "Cancellation failed" });
  }
});
router.put("/:id/reschedule", async (req, res) => {
  // 🔐 ADMIN KEY CHECK
  if (req.headers["x-admin-key"] !== ADMIN_KEY) {
    return res.status(403).json({ error: "Forbidden" });
  }

  try {
    const { date, time } = req.body; // date: "YYYY-MM-DD", time: "HH:MM"
    if (!date || !time) {
      return res.status(400).json({ error: "date and time are required" });
    }

    const booking = await Booking.findById(req.params.id).populate("services");
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    // Build new start/end
    const start = new Date(`${date}T${time}`);
    if (isNaN(start.getTime())) {
      return res.status(400).json({ error: "Invalid date/time format. Use YYYY-MM-DD and HH:MM (24h)." });
    }

    const totalBlockedMinutes = (booking.duration || 0) + BUFFER_MINUTES;
    const end = new Date(start.getTime() + totalBlockedMinutes * 60000);

    // 🔴 Overlap check (exclude itself)
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id },
      $expr: {
        $and: [{ $lt: ["$start", end] }, { $gt: ["$end", start] }],
      },
    });

    if (conflict) {
      return res.status(409).json({
        error: "This new time overlaps with another booking. Choose another.",
      });
    }

    // Update DB
    booking.date = new Date(date);
    booking.time = time;
    booking.start = start;
    booking.end = end;
    await booking.save();

    // Update Google Calendar event
    await updateBookingEvent({
      eventId: booking.calendarEventId,
      start: start.toISOString(),
      end: end.toISOString(),
    });

    res.json(booking);
  } catch (err) {
    console.error("❌ Reschedule failed:", err);
    res.status(500).json({ error: "Reschedule failed" });
  }
});
