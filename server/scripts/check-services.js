// Run: node server/scripts/check-services.js
require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Service = require("../models/service");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const services = await Service.find({}, "name category sortOrder").sort({ category: 1, sortOrder: 1, price: 1 });
  services.forEach(s => console.log(`[${s.category}] ${s.name} (sortOrder: ${s.sortOrder})`));
  await mongoose.disconnect();
}
run().catch(e => { console.error(e); process.exit(1); });
