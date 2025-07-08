const express = require("express");
const router = express.Router();
const Booking = require("../models/booking")
const Service = require("../models/service")


const mongoose = require("mongoose");


router.post("/", async (req, res) => {
  console.log("📥 POST /api/bookings HIT!");

  try {
    console.log("📦 Incoming body:", req.body);

    const { services, name, email, phone, referredBy, date, time, note } = req.body;

    const serviceIds = services.map((id) => new mongoose.Types.ObjectId(id));

    const servicesData = await Service.find({ _id: { $in: serviceIds } });

    if (servicesData.length !== serviceIds.length) {
      console.log("❌ Some service IDs are invalid");
      return res.status(400).json({ error: "One or more service IDs are invalid." });
    }

    const totalDuration = servicesData.reduce((sum, s) => sum + (s.duration || 0), 0);

    console.log("🧮 Total duration calculated:", totalDuration);

    const booking = new Booking({
      name,
      email,
      phone,
      referredBy,
      services: serviceIds,
      date,
      time,
      duration: totalDuration,
      note,
    });

    await booking.save();
    console.log("✅ Booking saved:", booking);

    res.status(201).json(booking);

  } catch (error) {
    console.error("❌ Booking creation failed:", error);
    res.status(400).json({ error: error.message });
  }
});




router.get("/", async (req, res) =>{
    try{
        const bookings = await Booking.find().sort({ date: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({error: " Could not fetch booking "})
    }
})

router.get("/booked", async (req, res) => {
  const { date } = req.query;
  try {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);

    const bookings = await Booking.find({
      date: { $gte: start, $lt: end }
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;