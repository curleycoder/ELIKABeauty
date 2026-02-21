// server/routes/services.js
const express = require("express");
const router = express.Router();
const Service = require("../models/service");

let cache = null;
let cacheAt = 0;
const TTL_MS = 60 * 1000; // 60 seconds

router.get("/", async (req, res) => {
  try {
    // Serve fresh cache
    if (cache && Date.now() - cacheAt < TTL_MS) {
      res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
      return res.json(cache);
    }

    const services = await Service.find({})
      .sort({ name: 1 })
      .lean(); // faster, smaller payload

    cache = services;
    cacheAt = Date.now();

    res.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return res.json(services);
  } catch (err) {
    console.error("❌ GET /services failed:", err);

    // If DB fails but we have old cache, serve it
    if (cache) return res.json(cache);

    return res.status(500).json({ error: "Failed to fetch services" });
  }
});

module.exports = router;