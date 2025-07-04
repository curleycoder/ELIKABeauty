const express = require("express")


require("dotenv").config();

const router = express.Router();

const Google_API = process.env.GOOGLE_API_KEY;
const Place_ID = "ChIJsURdrhp3hlQRst2pKagNm3A"

router.get("/reviews", async (req, res) => {
  try {
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${Place_ID}&fields=reviews&key=${Google_API}`
    );
    const data = await response.json();

    res.json({ reviews: data.result.reviews || [] });
  } catch (err) {
    console.error("❌ Error:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});


module.exports = router;