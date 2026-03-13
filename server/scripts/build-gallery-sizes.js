const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const srcDir = path.join(ROOT, "public", "gallery", "original");
const outThumb = path.join(ROOT, "public", "gallery", "thumb");
const outPreview = path.join(ROOT, "public", "gallery", "preview");
const outFull = path.join(ROOT, "public", "gallery", "full");

for (const dir of [outThumb, outPreview, outFull]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const isImage = (f) => /\.(jpe?g|png)$/i.test(f);

(async () => {
  const files = fs.readdirSync(srcDir).filter(isImage);

  for (const file of files) {
    const input = path.join(srcDir, file);
    const outName = file.replace(/\.(png|jpe?g)$/i, ".jpg");

    // THUMB (160w)
    await sharp(input)
      .rotate() // ✅ FIXES sideways images (applies EXIF orientation)
      .resize({ width: 160, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(path.join(outThumb, outName));

    // PREVIEW (900w)
    await sharp(input)
      .rotate() // ✅
      .resize({ width: 900, withoutEnlargement: true })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(path.join(outPreview, outName));

    // FULL (1800w)
    await sharp(input)
      .rotate() // ✅
      .resize({ width: 1800, withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toFile(path.join(outFull, outName));

    console.log("done:", file);
  }

  console.log("✅ Gallery sizes built");
})();
