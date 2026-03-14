const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Service = require("../models/service");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    referredBy: { type: String, default: "", trim: true },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
      },
    ],
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true },
    note: { type: String, default: "", trim: true },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

// GET /api/bookings/booked?date=YYYY-MM-DD
router.get("/booked", async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Missing date" });
    }

    const bookings = await Booking.find({
      date,
      status: { $ne: "cancelled" },
    })
      .select("time -_id")
      .lean();

    const bookedSlots = bookings.map((b) => b.time);
    res.json(bookedSlots);
  } catch (error) {
    console.error("❌ Failed to fetch booked slots:", error);
    res.status(500).json({ error: "Failed to fetch booked slots" });
  }
});

// POST /api/bookings
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, referredBy, services, date, time, note } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Please select at least one service" });
    }

    const validServices = await Service.find({ _id: { $in: services } }).select("_id");
    if (validServices.length !== services.length) {
      return res.status(400).json({ error: "One or more selected services are invalid" });
    }

    const existing = await Booking.findOne({
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (existing) {
      return res.status(409).json({
        error: "This time is no longer available",
      });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      referredBy: referredBy || "",
      services,
      date,
      time,
      note: note || "",
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Failed to create booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

module.exports = router;