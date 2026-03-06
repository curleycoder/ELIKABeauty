const express = require("express");
const GalleryItem = require("../models/gallery");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const images = await GalleryItem.find({})
      .sort({ category: 1, sortOrder: 1, createdAt: -1 })
      .lean();

    res.set("Cache-Control", "public, max-age=300");
    res.json({ images });
  } catch (error) {
    console.error("Gallery route error:", error);
    res.status(500).json({ error: "Unable to load gallery" });
  }
});

module.exports = router;