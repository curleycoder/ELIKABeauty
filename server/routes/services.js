const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Service = require("../models/service");
require("dotenv").config();

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI);
}

router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ category: 1, sortOrder: 1, price: 1 });
    res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.json(services);
  } catch (error) {
    console.error("❌ Failed to fetch services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

module.exports = router;