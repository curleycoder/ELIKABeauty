// server/seeServices.js
const mongoose = require("mongoose");
const Service = require("./models/service"); 
require("dotenv").config()

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const services = await Service.find({});
    console.log("Available services:", services);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error:", err);
  });
