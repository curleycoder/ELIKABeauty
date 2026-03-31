// server/addMensHairColor.js
// Run once: node addMensHairColor.js
const mongoose = require("mongoose");
const Service = require("./models/service");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const existing = await Service.findOne({ name: "Men's Hair Color" });
    if (existing) {
      console.log("⚠️  Men's Hair Color already exists:", existing);
      return;
    }

    const service = await Service.create({
      name: "Men's Hair Color",
      price: 60,
      fromPrice: true,
      duration: 60,
      category: "men",
      description: "Professional hair color for men. Includes consultation, color application, and style finish.",
      serviceType: "chair",
      sortOrder: 5,
    });

    console.log("✅ Added:", service);
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  })
  .finally(() => mongoose.disconnect());