const express = require("express");
const router = express.Router();

router.get("/reviews", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return res.status(500).json({
        error: "Missing GOOGLE_API_KEY or GOOGLE_PLACE_ID",
      });
    }

    const response = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places error:", data);
      return res.status(response.status).json({
        error: "Failed to fetch Google reviews",
        details: data,
      });
    }

    const reviews = Array.isArray(data.reviews)
      ? data.reviews.map((r) => ({
          author_name: r.authorAttribution?.displayName || "Google User",
          profile_photo_url: r.authorAttribution?.photoUri || "",
          author_url: r.authorAttribution?.uri || "",
          rating: r.rating || 0,
          text: r.text?.text || "",
          relative_time_description: r.relativePublishTimeDescription || "",
          publish_time: r.publishTime || "",
        }))
      : [];

    res.set("Cache-Control", "public, max-age=1800, stale-while-revalidate=3600");
    res.json({
      placeName: data.displayName?.text || "",
      rating: data.rating || 0,
      userRatingCount: data.userRatingCount || 0,
      reviews,
    });
  } catch (error) {
    console.error("Failed to fetch Google reviews:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/place-id", async (req, res) => {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const query = req.query.q || "Elika Beauty Burnaby";

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });
    }

    const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery: query,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Place ID lookup error:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Failed to search place ID:", error);
    res.status(500).json({ error: "Failed to search place ID" });
  }
});

module.exports = router;