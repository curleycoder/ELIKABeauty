// server/routes/services.js
const express = require("express");
const router = express.Router();
const Service = require("../models/service");

router.get("/", async (req, res) => {
  try {
    const services = await Service.find(); // <-- pull from DB
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

module.exports = router;
