// models/Service.js
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: String,
  price: Number,
  duration: Number,
  fromPrice: Boolean,
  category: String,
  description: String,
});

module.exports = mongoose.model("Service", serviceSchema);
