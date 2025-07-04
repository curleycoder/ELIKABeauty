// server/routes/gallery.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (req, res) => {
  const galleryPath = path.join(__dirname,"..", "public","gallery");

  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      console.error("Error reading gallery folder:", err);
      return res.status(500).json({ error: "Unable to read directory" });
    }

    const imageUrls = files
      .filter((file) => /\.(jpg|jpeg|png|gif)$/.test(file))
      .map((file) => `/gallery/${file}`);

    res.json({ images: imageUrls });
  });
});




module.exports = router;
