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
    const services = await Service.find().sort({ category: 1, price: 1 });
    res.json(services);
  } catch (error) {
    console.error("❌ Failed to fetch services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

module.exports = router;