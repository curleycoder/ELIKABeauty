const express = require("express");
const router = express.Router();
const { addMinutes, format, parse, parseISO } = require("date-fns");
const { fromZonedTime } = require("date-fns-tz");
const Service = require("../models/service");
const Booking = require("../models/booking");
const { sendBookingEmails } = require("../services/email");

const SHOP_TZ = "America/Vancouver";

function bookingToUtcRange(dateStr, time12h, duration) {
  const localParsed = parse(`${dateStr} ${time12h}`, "yyyy-MM-dd h:mm a", new Date());
  if (isNaN(localParsed.getTime())) return null;
  const wallClock = format(localParsed, "yyyy-MM-dd HH:mm:ss");
  const startUtc = fromZonedTime(wallClock, SHOP_TZ);
  const endUtc = addMinutes(startUtc, Number(duration) || 60);
  return { startUtc, endUtc };
}

const ROOM_SERVICE_NAMES = new Set(["facial", "massage", "hot stone massage", "deep tissue massage"]);

function getServiceType(serviceNames) {
  const names = serviceNames.map((n) => String(n).toLowerCase().trim());
  return names.every((n) => ROOM_SERVICE_NAMES.has(n)) ? "room" : "chair";
}

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, referredBy, services, date, time, note, birthdayMonth, birthdayDay } = req.body;

    if (!name || !email || !phone || !date || !time)
      return res.status(400).json({ error: "Missing required fields" });
    if (!Array.isArray(services) || services.length === 0)
      return res.status(400).json({ error: "Please select at least one service" });

    const validServices = await Service.find({ _id: { $in: services } });
    if (validServices.length !== services.length)
      return res.status(400).json({ error: "One or more selected services are invalid" });

    const totalDuration = validServices.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
    if (totalDuration <= 0)
      return res.status(400).json({ error: "Invalid total duration" });

    const requestedRange = bookingToUtcRange(date, time, totalDuration);
    if (!requestedRange)
      return res.status(400).json({ error: "Invalid booking date/time" });

    const serviceNames = validServices.map((s) => s.name);
    const incomingType = getServiceType(serviceNames);

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
      const r = bookingToUtcRange(b.date, b.time, b.duration);
      if (!r) return false;
      return requestedRange.startUtc < r.endUtc && requestedRange.endUtc > r.startUtc;
    });

    if (hasOverlap)
      return res.status(409).json({ error: "This time is no longer available" });

    // Validate birthday fields if provided
    const bMonth = birthdayMonth ? Number(birthdayMonth) : null;
    const bDay = birthdayDay ? Number(birthdayDay) : null;
    if ((bMonth && (bMonth < 1 || bMonth > 12)) || (bDay && (bDay < 1 || bDay > 31)))
      return res.status(400).json({ error: "Invalid birthday" });

    const booking = await Booking.create({
      name, email, phone,
      referredBy: referredBy || "",
      services, date, time,
      duration: totalDuration,
      serviceType: incomingType,
      note: note || "",
      birthdayMonth: bMonth,
      birthdayDay: bDay,
    });

    const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date) ? parseISO(date) : new Date(date);
    const prettyDate = format(safeDate, "PPP");
    const servicesText = serviceNames.join(", ");

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
router.get("/booked", async (req, res) => {
  try {
    const { date, serviceType = "chair" } = req.query;
    if (!date) return res.status(400).json({ error: "Missing date" });

    const bookings = await Booking.find({
      date,
      status: { $ne: "cancelled" },
      $or: [
        { serviceType },
        ...(serviceType === "chair"
          ? [{ serviceType: { $exists: false } }, { serviceType: null }, { serviceType: "" }]
          : []),
      ],
    }).lean();

    const slots = bookings
      .map((b) => {
        const r = bookingToUtcRange(b.date, b.time, b.duration);
        if (!r) return null;
        return { start: r.startUtc.toISOString(), end: r.endUtc.toISOString() };
      })
      .filter(Boolean);

    res.json(slots);
  } catch (error) {
    console.error("❌ Failed to fetch booked slots:", error);
    res.status(500).json({ error: "Failed to fetch booked slots" });
  }
});

module.exports = router;
