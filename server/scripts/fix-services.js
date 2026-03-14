// Run: node server/scripts/fix-services.js
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Service = require("../models/service");

const UPDATES = [
  // Move Facial Treatment to Spa
  { _id: "69abc550a987cdd97a17ad11", category: "Spa" },
  // Move Hair Styling to Add ons
  { _id: "69abc550a987cdd97a17ad0c", category: "Add ons" },
];

// Hair tab display order (lower = first)
const HAIR_ORDER = [
  "69abc550a987cdd97a17ad05", // Highlights
  "69abc550a987cdd97a17ad02", // Balayage
  "69abc550a987cdd97a17ad03", // Women's Haircut
  "69abc550a987cdd97a17ad07", // Hair Colour
  "69abc550a987cdd97a17ad06", // Root Colour
  "69abc550a987cdd97a17ad04", // Keratin
  "69abc550a987cdd97a17ad08", // Perm
];

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected");

  // Apply category changes
  for (const { _id, category } of UPDATES) {
    const r = await Service.updateOne({ _id }, { $set: { category } });
    console.log(`Updated ${_id} → category: ${category} (matched: ${r.matchedCount})`);
  }

  // Apply sort order to hair services
  for (let i = 0; i < HAIR_ORDER.length; i++) {
    const r = await Service.updateOne({ _id: HAIR_ORDER[i] }, { $set: { sortOrder: i } });
    console.log(`Set sortOrder ${i} on ${HAIR_ORDER[i]} (matched: ${r.matchedCount})`);
  }

  await mongoose.disconnect();
  console.log("✅ Done");
}

run().catch((e) => { console.error(e); process.exit(1); });
