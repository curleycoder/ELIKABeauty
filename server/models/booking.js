const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  // Client info
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
cancelledAt: { type: Date },
bufferMinutes: { type: Number, default: 0 },
referredBy: { type: String },


  // Services
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
  ],

  // Date & time (for display)
  date: { type: Date, required: true },      // e.g. 2025-07-09
  time: { type: String, required: true },    // e.g. "15:00"

  // 🔑 REAL booking time (for logic)
  start: { type: Date, required: true },     // exact start datetime
  end: { type: Date, required: true },       // exact end datetime (includes buffer)

  // Duration (service only, NOT buffer)
  duration: { type: Number, required: true }, // minutes

  // Google Calendar integration
  calendarEventId: { type: String },          // used for owner cancellation

  note: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 🔥 CRITICAL INDEX: prevents race-condition double booking
bookingSchema.index({ start: 1, end: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
