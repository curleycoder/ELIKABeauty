const express = require("express");
const router = express.Router();

router.get("/reviews", async (req, res) => {
  try {
    res.json({
      reviews: [
        {
          author_name: "Client Review",
          rating: 5,
          text: "Very professional service and great results. Highly recommended.",
          relative_time_description: "recently",
          profile_photo_url: "",
        },
        {
          author_name: "Client Review",
          rating: 5,
          text: "Friendly service and beautiful results. I was very happy with my hair.",
          relative_time_description: "recently",
          profile_photo_url: "",
        },
        {
          author_name: "Client Review",
          rating: 5,
          text: "Clean salon, experienced stylist, and great attention to detail.",
          relative_time_description: "recently",
          profile_photo_url: "",
        },
      ],
    });
  } catch (error) {
    console.error("❌ Failed to fetch reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

module.exports = router;