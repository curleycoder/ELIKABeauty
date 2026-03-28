const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Client = require("../models/client");
const { sendCancellationEmails } = require("../services/email");
const { deleteBookingEvent } = require("../services/calendar");
const { format, parseISO } = require("date-fns");

const ADMIN_KEY = process.env.ADMIN_KEY;

function auth(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (!key || key !== ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// GET /api/admin/bookings
router.get("/bookings", auth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("services", "name duration price")
      .sort({ date: 1, time: 1 })
      .lean();
    res.json(bookings);
  } catch (err) {
    console.error("❌ Admin fetch bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// DELETE /api/admin/bookings/:id  — cancel a booking
router.delete("/bookings/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("services", "name");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "cancelled") return res.status(400).json({ error: "Already cancelled" });

    const calendarEventId = booking.calendarEventId;
    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    if (calendarEventId) {
      deleteBookingEvent(calendarEventId).catch((err) => {
        console.error("❌ Calendar delete error:", err.message);
      });
    }

    // send cancellation emails (non-blocking)
    try {
      const servicesText = booking.services.map((s) => s.name).join(", ");
      const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(booking.date)
        ? parseISO(booking.date)
        : new Date(booking.date);
      const prettyDate = format(safeDate, "PPP");
      await sendCancellationEmails({
        booking,
        servicesText,
        prettyDate,
        prettyTime: booking.time,
      });
    } catch (emailErr) {
      console.error("❌ Cancellation email failed:", emailErr.message);
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Admin cancel booking:", err);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
});

// GET /api/admin/credits/lookup?code=BDAY-2025-XXXXXX
router.get("/credits/lookup", auth, async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Missing code" });

  const client = await Client.findOne({ birthdayCode: code.trim().toUpperCase() }).lean();
  if (!client) return res.status(404).json({ error: "Code not found" });

  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  res.json({
    name: client.name || "—",
    phone: client.phone || "—",
    birthdayMonth: client.birthdayMonth ? MONTHS[client.birthdayMonth - 1] : "—",
    birthdayCreditUsed: !!client.birthdayCreditUsed,
    birthdayCreditSentYear: client.birthdayCreditSentYear || null,
  });
});

// POST /api/admin/credits/redeem  { code }
router.post("/credits/redeem", auth, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing code" });

  const client = await Client.findOne({ birthdayCode: code.trim().toUpperCase() });
  if (!client) return res.status(404).json({ error: "Code not found" });
  if (client.birthdayCreditUsed) return res.status(409).json({ error: "Code already redeemed" });

  client.birthdayCreditUsed = true;
  await client.save();

  res.json({ success: true, name: client.name || "—" });
});

module.exports = router;
