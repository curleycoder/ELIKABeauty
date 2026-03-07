const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const GALLERY_DIR = path.join(__dirname, "../public/gallery");

const CATEGORY_LABELS = {
  balayage: "Balayage",
  highlights: "Highlights",
  haircolour: "Hair Colour",
  haircut: "Haircut",
  keratin: "Keratin",
  microblading: "Microblading",
  };

function isImageFile(filename) {
  return /\.(jpg|jpeg|png|webp)$/i.test(filename);
}

router.get("/", (req, res) => {
  try {
    if (!fs.existsSync(GALLERY_DIR)) {
      return res.status(200).json({ images: [] });
    }

    const folders = fs
      .readdirSync(GALLERY_DIR, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    const images = [];

    for (const folder of folders) {
      const folderPath = path.join(GALLERY_DIR, folder);

      const files = fs
        .readdirSync(folderPath)
        .filter(isImageFile)
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      for (const file of files) {
        const titleBase = path.parse(file).name;
        const categoryLabel = CATEGORY_LABELS[folder] || folder;

        images.push({
          id: `${folder}-${titleBase}`,
          category: categoryLabel,
          title: `${categoryLabel} Result ${titleBase}`,
          image: `/gallery/${folder}/${file}`,
          alt: `${categoryLabel} result at Elika Beauty in Burnaby`,
        });
      }
    }

    res.set("Cache-Control", "public, max-age=300");
    res.json({ images });
  } catch (error) {
    console.error("Gallery route error:", error);
    res.status(500).json({ error: "Unable to load gallery" });
  }
});

module.exports = router;