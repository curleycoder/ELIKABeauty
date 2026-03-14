const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { addMinutes, format, parse, parseISO } = require("date-fns");
const { fromZonedTime } = require("date-fns-tz");
const Service = require("../models/service");
const { sendBookingEmails } = require("../services/email");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    referredBy: { type: String, default: "", trim: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }],
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    // "chair" = blocks main stylist, "room" = separate room (facial/massage)
    serviceType: { type: String, default: "chair" },
    note: { type: String, default: "", trim: true },
    status: { type: String, default: "confirmed" },
    calendarEventId: { type: String, default: "" },
  },
  { timestamps: true }
);

const SHOP_TZ = "America/Vancouver";

function bookingToUtcRange(dateStr, time12h, duration) {
  const localParsed = parse(
    `${dateStr} ${time12h}`,
    "yyyy-MM-dd h:mm a",
    new Date()
  );
  if (isNaN(localParsed.getTime())) return null;

  const wallClock = format(localParsed, "yyyy-MM-dd HH:mm:ss");
  const startUtc = fromZonedTime(wallClock, SHOP_TZ);
  const endUtc = addMinutes(startUtc, Number(duration) || 60);
  return { startUtc, endUtc };
}

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// Determine if a set of services is "room-only" (facial, massage, etc.)
// Room services don't block the hair chair and vice versa.
const ROOM_SERVICE_NAMES = new Set([
  "facial",
  "massage",
  "hot stone massage",
  "deep tissue massage",
]);

function getServiceType(serviceNames) {
  const names = serviceNames.map((n) => String(n).toLowerCase().trim());
  const allRoom = names.every((n) => ROOM_SERVICE_NAMES.has(n));
  return allRoom ? "room" : "chair";
}

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, referredBy, services, date, time, note } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Please select at least one service" });
    }

    const validServices = await Service.find({ _id: { $in: services } });
    if (validServices.length !== services.length) {
      return res.status(400).json({ error: "One or more selected services are invalid" });
    }

    const totalDuration = validServices.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
    if (totalDuration <= 0) {
      return res.status(400).json({ error: "Invalid total duration" });
    }

    const requestedRange = bookingToUtcRange(date, time, totalDuration);
    if (!requestedRange) {
      return res.status(400).json({ error: "Invalid booking date/time" });
    }

    // Determine if this booking uses the chair or a room
    const serviceNames = validServices.map((s) => s.name);
    const incomingType = getServiceType(serviceNames);

    // Only check overlap against bookings of the same type
    // Legacy bookings without serviceType are treated as "chair"
    const sameDayBookings = await Booking.find({
      date,
      status: { $ne: "cancelled" },
      $or: [
        { serviceType: incomingType },
        ...(incomingType === "chair"
          ? [{ serviceType: { $exists: false } }, { serviceType: null }, { serviceType: "" }]
          : []),
      ],
    }).lean();

    const hasOverlap = sameDayBookings.some((b) => {
      const existingRange = bookingToUtcRange(b.date, b.time, b.duration);
      if (!existingRange) return false;
      return (
        requestedRange.startUtc < existingRange.endUtc &&
        requestedRange.endUtc > existingRange.startUtc
      );
    });

    if (hasOverlap) {
      return res.status(409).json({ error: "This time is no longer available" });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      referredBy: referredBy || "",
      services,
      date,
      time,
      duration: totalDuration,
      serviceType: incomingType,
      note: note || "",
    });

    const safeDate =
      typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? parseISO(date)
        : new Date(date);

    const prettyDate = format(safeDate, "PPP");
    const servicesText = serviceNames.join(", ");

    // Send emails via Resend (non-blocking — don't fail the booking if email fails)
    sendBookingEmails({ booking, servicesText, prettyDate, prettyTime: time }).catch((err) => {
      console.error("❌ Email send error:", err.message);
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Failed to create booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// GET /api/bookings/booked?date=YYYY-MM-DD&serviceType=chair|room
// Returns booked UTC ranges for the given date and service type.
// If serviceType is omitted, defaults to "chair".
router.get("/booked", async (req, res) => {
  try {
    const { date, serviceType = "chair" } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Missing date" });
    }

    const bookings = await Booking.find({
      date,
      status: { $ne: "cancelled" },
      // Match explicit serviceType OR legacy bookings (no serviceType = chair)
      $or: [
        { serviceType },
        ...(serviceType === "chair" ? [{ serviceType: { $exists: false } }, { serviceType: null }, { serviceType: "" }] : []),
      ],
    }).lean();

    const slots = bookings
      .map((b) => {
        const range = bookingToUtcRange(b.date, b.time, b.duration);
        if (!range) return null;
        return {
          start: range.startUtc.toISOString(),
          end: range.endUtc.toISOString(),
        };
      })
      .filter(Boolean);

    res.json(slots);
  } catch (error) {
    console.error("❌ Failed to fetch booked slots:", error);
    res.status(500).json({ error: "Failed to fetch booked slots" });
  }
});

module.exports = router;
