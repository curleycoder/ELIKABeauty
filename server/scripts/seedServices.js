// scripts/seedServices.js
const mongoose = require("mongoose");
const Service = require("../models/service");
const services = require("../data/services"); // your list above

mongoose.connect(process.env.Mongo_URI).then(async () => {
  await Service.deleteMany();
  await Service.insertMany(services);
  console.log("✅ Services seeded");
  process.exit();
});
