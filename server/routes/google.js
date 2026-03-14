const express = require("express");
const router = express.Router();

// Uses the legacy Places Details API (maps.googleapis.com) — widely enabled by default.
// Requires "Places API" (not "Places API New") to be enabled in Google Cloud Console.
router.get("/reviews", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return res.status(500).json({ error: "Missing GOOGLE_API_KEY or GOOGLE_PLACE_ID" });
    }

    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=name,rating,user_ratings_total,reviews` +
      `&reviews_sort=newest` +
      `&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Google Places legacy error:", data.status, data.error_message);
      return res.status(502).json({
        error: "Failed to fetch Google reviews",
        status: data.status,
        message: data.error_message || "",
      });
    }

    const result = data.result || {};

    const reviews = Array.isArray(result.reviews)
      ? result.reviews.map((r) => ({
          author_name: r.author_name || "Google User",
          profile_photo_url: r.profile_photo_url || "",
          author_url: r.author_url || "",
          rating: r.rating || 0,
          text: r.text || "",
          relative_time_description: r.relative_time_description || "",
          publish_time: r.time ? new Date(r.time * 1000).toISOString() : "",
        }))
      : [];

    res.set("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    res.json({
      placeName: result.name || "",
      rating: result.rating || 0,
      userRatingCount: result.user_ratings_total || 0,
      reviews,
    });
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
