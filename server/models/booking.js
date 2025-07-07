const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  Service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  date: { type: Date, required: true },         // e.g. 2025-07-09
  time: { type: String, required: true },        // e.g. "3:00 PM"
  duration: { type: Number, required: true },    // e.g. 240 (in minutes)
  note: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("booking", bookingSchema);
