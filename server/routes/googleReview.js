const express = require("express");
require("dotenv").config();

const router = express.Router();

const Google_API = process.env.GOOGLE_API_KEY;
const Place_ID = "ChIJsURdrhp3hlQRst2pKagNm3A";

router.get("/reviews", async (req, res) => {
  try {
    console.log("📥 /api/google/reviews called");
    console.log("🔑 API Key:", Google_API ? "[OK]" : "[MISSING]");

    const fetch = (await import("node-fetch")).default;

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${Place_ID}&fields=reviews&key=${Google_API}`;
    console.log("🌐 Fetching from:", url);

    const response = await fetch(url);
    const data = await response.json();


    const reviews = data.result?.reviews || [];

    res.json({ reviews });
  } catch (err) {
    console.error("❌ Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch Google reviews" });
  }
});

module.exports = router;
       