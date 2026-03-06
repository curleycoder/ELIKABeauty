const mongoose = require("mongoose");
const GalleryItem = require("./models/gallery");
require("dotenv").config();

const galleryItems = [
  {
    category: "Balayage",
    title: "Soft balayage refresh",
    description: "Soft blended balayage with brighter face frame.",
    alt: "Soft balayage before and after at Elika Beauty in Burnaby",
    beforeImage: "/gallery/balayage-1-before.jpg",
    afterImage: "/gallery/balayage-1-after.jpg",
    image: "",
    featured: true,
    sortOrder: 1,
  },
  {
    category: "Highlights",
    title: "Dimensional blonde highlights",
    description: "Bright highlights with custom toning.",
    alt: "Highlights before and after at Elika Beauty in Burnaby",
    beforeImage: "/gallery/highlights-1-before.jpg",
    afterImage: "/gallery/highlights-1-after.jpg",
    image: "",
    featured: true,
    sortOrder: 1,
  },
  {
    category: "Keratin",
    title: "Smooth keratin finish",
    description: "Frizz-reducing smoothing result.",
    alt: "Keratin treatment result at Elika Beauty in Burnaby",
    beforeImage: "",
    afterImage: "",
    image: "/gallery/keratin-1.jpg",
    featured: true,
    sortOrder: 1,
  },
  {
    category: "Microblading",
    title: "Natural PhiBrows result",
    description: "Natural-looking brow enhancement.",
    alt: "Microblading result at Elika Beauty in Burnaby",
    beforeImage: "",
    afterImage: "",
    image: "/gallery/microblading-1.jpg",
    featured: true,
    sortOrder: 1,
  },
  {
    category: "Threading",
    title: "Clean eyebrow shaping",
    description: "Precise brow shape with threading.",
    alt: "Eyebrow threading result at Elika Beauty in Burnaby",
    beforeImage: "",
    afterImage: "",
    image: "/gallery/threading-1.jpg",
    featured: false,
    sortOrder: 1,
  },
  {
    category: "Facial Treatment",
    title: "Fresh glow facial",
    description: "Hydrating facial care with steam and mask.",
    alt: "Facial treatment result at Elika Beauty in Burnaby",
    beforeImage: "",
    afterImage: "",
    image: "/gallery/facial-1.jpg",
    featured: false,
    sortOrder: 1,
  },
];

async function seedGallery() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const item of galleryItems) {
      await GalleryItem.updateOne(
        { category: item.category, title: item.title },
        { $set: item },
        { upsert: true }
      );
      console.log(`Seeded: ${item.category} - ${item.title}`);
    }

    console.log("✅ Gallery seeded");
  } catch (error) {
    console.error("❌ Gallery seed failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seedGallery();