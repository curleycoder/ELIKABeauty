const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  fromPrice: { type: Boolean, default: false },
  duration: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
});

module.exports = mongoose.model("Service", serviceSchema);