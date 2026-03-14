const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const GALLERY_DIR = path.join(__dirname, "../public/gallery");

// Map folder names to display category names
const CATEGORY_MAP = {
  balayage: "Balayage",
  highlights: "Highlights",
  haircolour: "Hair Colour",
  haircut: "Haircut",
};

// GET /api/gallery — returns all images as { category, image } objects
router.get("/", (req, res) => {
  try {
    const items = [];

    const folders = fs.readdirSync(GALLERY_DIR).filter((f) => {
      return fs.statSync(path.join(GALLERY_DIR, f)).isDirectory();
    });

    for (const folder of folders) {
      const category = CATEGORY_MAP[folder] || folder;
      const folderPath = path.join(GALLERY_DIR, folder);
      const files = fs.readdirSync(folderPath).filter((f) =>
        /\.(webp|jpg|jpeg|png)$/i.test(f)
      );

      for (const file of files) {
        items.push({
          category,
          image: `/gallery/${folder}/${file}`,
        });
      }
    }

    res.json(items);
  } catch (err) {
    console.error("Gallery route error:", err);
    res.status(500).json({ error: "Failed to load gallery" });
  }
});

module.exports = router;
