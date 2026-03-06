// server/routes/gallery.js
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const GALLERY_BASE = path.join(__dirname, "..", "public", "gallery");
const THUMB_DIR = path.join(GALLERY_BASE, "thumb");

function toTitleCase(str) {
  return String(str)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
}

function buildImagePath(size, file) {
  return `/gallery/${size}/${file}`;
}

function parseFilename(file) {
  // Example:
  // balayage-soft-refresh__before__1.jpg
  // microblading-natural-brows__single__1.jpg

  const ext = path.extname(file);
  const base = path.basename(file, ext);

  const parts = base.split("__");
  if (parts.length < 3) return null;

  const [slugPart, variant, groupId] = parts;

  const slugPieces = slugPart.split("-");
  const rawCategory = slugPieces[0] || "other";
  const rawTitle = slugPieces.slice(1).join("-") || rawCategory;

  const categoryMap = {
    balayage: "Balayage",
    highlights: "Highlights",
    highlight: "Highlights",
    keratin: "Keratin",
    perm: "Perm",
    haircut: "Haircut",
    womens: "Women’s Haircut",
    mens: "Men’s Haircut",
    microblading: "Microblading",
    threading: "Threading",
    facial: "Facial Treatment",
    massage: "Relaxation Massage",
    haircolor: "Hair Color",
    color: "Hair Color",
  };

  const category = categoryMap[rawCategory.toLowerCase()] || toTitleCase(rawCategory);
  const title = toTitleCase(rawTitle);

  return {
    file,
    slug: slugPart,
    category,
    title,
    variant: variant.toLowerCase(), // before | after | single
    groupId: String(groupId),
  };
}

router.get("/", (req, res) => {
  fs.readdir(THUMB_DIR, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read gallery directory" });
    }

    const imageFiles = files.filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

    const parsed = imageFiles
      .map(parseFilename)
      .filter(Boolean);

    const grouped = new Map();

    for (const item of parsed) {
      const key = `${item.slug}__${item.groupId}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          _id: key,
          category: item.category,
          title: item.title,
          slug: item.slug,
          description: `${item.title} at Elika Beauty in Burnaby`,
          alt: `${item.title} ${item.category} result at Elika Beauty in Burnaby`,
          beforeImage: "",
          afterImage: "",
          image: "",
          thumb: "",
          preview: "",
          full: "",
        });
      }

      const record = grouped.get(key);

      if (item.variant === "before") {
        record.beforeImage = buildImagePath("full", item.file);
      } else if (item.variant === "after") {
        record.afterImage = buildImagePath("full", item.file);
        record.image = buildImagePath("full", item.file);
        record.thumb = buildImagePath("thumb", item.file);
        record.preview = buildImagePath("preview", item.file);
        record.full = buildImagePath("full", item.file);
      } else if (item.variant === "single") {
        record.image = buildImagePath("full", item.file);
        record.thumb = buildImagePath("thumb", item.file);
        record.preview = buildImagePath("preview", item.file);
        record.full = buildImagePath("full", item.file);
      }
    }

    const images = Array.from(grouped.values()).sort((a, b) => {
      const catCompare = a.category.localeCompare(b.category);
      if (catCompare !== 0) return catCompare;
      return a.title.localeCompare(b.title);
    });

    res.set("Cache-Control", "public, max-age=300");
    res.json({ images });
  });
});

module.exports = router;