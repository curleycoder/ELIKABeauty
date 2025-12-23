// server/routes/gallery.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const dir = path.join(__dirname, "..", "public", "gallery", "thumb");

  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to read directory" });

    const images = files
      .filter((f) => /\.jpg$/i.test(f))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => ({
        thumb: `/gallery/thumb/${file}`,
        preview: `/gallery/preview/${file}`,
        full: `/gallery/full/${file}`,
      }));

    res.set("Cache-Control", "public, max-age=300"); // 5 min
    res.json({ images });
  });
});


module.exports = router;