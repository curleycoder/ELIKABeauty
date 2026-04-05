const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Client = require("../models/client");
const Schedule = require("../models/schedule");
const { sendCancellationEmails, sendRescheduleEmail } = require("../services/email");
const { deleteBookingEvent, updateBookingEvent } = require("../services/calendar");
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

    // Filter out null refs (deleted services) and backfill serviceNames from
    // populated data so the frontend always has names to display
    const result = bookings.map(b => {
      const populated = (b.services || []).filter(Boolean);
      const names = b.serviceNames?.length
        ? b.serviceNames
        : populated.map(s => s.name).filter(Boolean);
      return { ...b, services: populated, serviceNames: names };
    });

    res.json(result);
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

// PATCH /api/admin/bookings/:id/checkout  — save visit record & mark as paid
router.patch("/bookings/:id/checkout", auth, async (req, res) => {
  try {
    const { extraServices, amount, tip, paymentMethod, stylist, notes } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.checkout = {
      done: true,
      extraServices: Array.isArray(extraServices) ? extraServices : [],
      amount: amount != null ? Number(amount) : null,
      tip: tip != null ? Number(tip) : null,
      paymentMethod: paymentMethod || "",
      stylist: stylist || "",
      notes: notes || "",
      completedAt: new Date(),
    };
    await booking.save();
    res.json({ success: true, checkout: booking.checkout });
  } catch (err) {
    console.error("❌ Admin checkout:", err);
    res.status(500).json({ error: "Failed to save checkout" });
  }
});

// PATCH /api/admin/bookings/:id/noshow  — mark a booking as no-show
router.patch("/bookings/:id/noshow", auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "cancelled") return res.status(400).json({ error: "Cannot mark a cancelled booking as no-show" });
    booking.status = "noshow";
    await booking.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Admin mark no-show:", err);
    res.status(500).json({ error: "Failed to mark no-show" });
  }
});

// PATCH /api/admin/bookings/:id/reschedule  — update date/time, sync calendar, email client
router.patch("/bookings/:id/reschedule", auth, async (req, res) => {
  const { parse, format, addMinutes } = require("date-fns");
  const { fromZonedTime } = require("date-fns-tz");
  const SHOP_TZ = "America/Vancouver";

  const { date, time } = req.body; // date: "YYYY-MM-DD", time: "10:30 AM"
  if (!date || !time) return res.status(400).json({ error: "Missing date or time" });

  try {
    const booking = await Booking.findById(req.params.id).populate("services", "name");
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if (booking.status === "cancelled") return res.status(400).json({ error: "Cannot reschedule a cancelled booking" });

    const oldDate = booking.date;
    const oldTime = booking.time;

    // Convert new local time → UTC for calendar
    const localParsed = parse(`${date} ${time}`, "yyyy-MM-dd h:mm a", new Date());
    if (isNaN(localParsed.getTime())) return res.status(400).json({ error: "Invalid date or time format" });
    const wallClock = format(localParsed, "yyyy-MM-dd HH:mm:ss");
    const startUtc = fromZonedTime(wallClock, SHOP_TZ);
    const endUtc = addMinutes(startUtc, Number(booking.duration) || 60);

    booking.date = date;
    booking.time = time;
    await booking.save();

    // Update Google Calendar (non-blocking)
    if (booking.calendarEventId) {
      updateBookingEvent({
        eventId: booking.calendarEventId,
        start: startUtc.toISOString(),
        end: endUtc.toISOString(),
      }).catch(err => console.error("❌ Calendar update error:", err.message));
    }

    // Send reschedule email (non-blocking)
    try {
      const servicesText = booking.services.map(s => s.name).join(", ");
      const prettyOld = format(parse(oldDate, "yyyy-MM-dd", new Date()), "PPP");
      const prettyNew = format(parse(date, "yyyy-MM-dd", new Date()), "PPP");
      await sendRescheduleEmail({
        booking,
        name: booking.name,
        email: booking.email,
        servicesText,
        oldDate: prettyOld,
        oldTime,
        newDate: prettyNew,
        newTime: time,
      });
    } catch (emailErr) {
      console.error("❌ Reschedule email failed:", emailErr.message);
    }

    res.json({ success: true, date, time });
  } catch (err) {
    console.error("❌ Admin reschedule booking:", err);
    res.status(500).json({ error: "Failed to reschedule booking" });
  }
});

// POST /api/admin/backfill-calendar — one-time backfill of calendar events for existing bookings
router.post("/backfill-calendar", auth, async (req, res) => {
  const { parse, format, addMinutes } = require("date-fns");
  const { fromZonedTime } = require("date-fns-tz");
  const { createBookingEvent } = require("../services/calendar");
  const SHOP_TZ = "America/Vancouver";

  function toUtcRange(dateStr, time12h, duration) {
    const localParsed = parse(`${dateStr} ${time12h}`, "yyyy-MM-dd h:mm a", new Date());
    if (isNaN(localParsed.getTime())) return null;
    const wallClock = format(localParsed, "yyyy-MM-dd HH:mm:ss");
    const startUtc = fromZonedTime(wallClock, SHOP_TZ);
    const endUtc = addMinutes(startUtc, Number(duration) || 60);
    return { startUtc, endUtc };
  }

  const bookings = await Booking.find({
    status: { $ne: "cancelled" },
    $or: [
      { calendarEventId: { $exists: false } },
      { calendarEventId: null },
      { calendarEventId: "" },
    ],
  }).populate("services", "name").lean();

  let success = 0, failed = 0, skipped = 0;
  const errors = [];

  for (const b of bookings) {
    const range = toUtcRange(b.date, b.time, b.duration);
    if (!range) { skipped++; continue; }

    const serviceNames = b.serviceNames?.length
      ? b.serviceNames
      : b.services?.map((s) => s?.name).filter(Boolean) || [];

    try {
      const eventId = await createBookingEvent({
        name: b.name, email: b.email, phone: b.phone,
        services: serviceNames, note: b.note || "",
        start: range.startUtc.toISOString(),
        end: range.endUtc.toISOString(),
      });
      if (eventId) {
        await Booking.findByIdAndUpdate(b._id, { calendarEventId: eventId });
        success++;
      } else {
        skipped++;
      }
    } catch (err) {
      errors.push(`${b.name} (${b.date}): ${err.message}`);
      failed++;
    }
  }

  res.json({ total: bookings.length, success, skipped, failed, errors });
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

// GET /api/admin/clients
router.get("/clients", auth, async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 }).lean();
    res.json(clients);
  } catch (err) {
    console.error("❌ Admin fetch clients:", err);
    res.status(500).json({ error: "Failed to fetch clients" });
  }
});

// PATCH /api/admin/clients/:id — update birthday
router.patch("/clients/:id", auth, async (req, res) => {
  try {
    const { birthdayMonth, birthdayDay } = req.body;
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { birthdayMonth: birthdayMonth || null, birthdayDay: birthdayDay || null },
      { new: true }
    ).lean();
    if (!client) return res.status(404).json({ error: "Client not found" });
    res.json(client);
  } catch (err) {
    console.error("❌ Admin update client:", err);
    res.status(500).json({ error: "Failed to update client" });
  }
});

// GET /api/admin/schedule
router.get("/schedule", auth, async (req, res) => {
  try {
    const schedule = await Schedule.findOne().lean();
    res.json(schedule || { closedWeekdays: [0, 1], overrides: [] });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
});

// PUT /api/admin/schedule
router.put("/schedule", auth, async (req, res) => {
  try {
    const { closedWeekdays, overrides } = req.body;
    const schedule = await Schedule.findOneAndUpdate(
      {},
      { closedWeekdays, overrides },
      { upsert: true, new: true }
    ).lean();
    res.json({ success: true, schedule });
  } catch (err) {
    console.error("❌ Admin update schedule:", err);
    res.status(500).json({ error: "Failed to update schedule" });
  }
});

module.exports = router;
