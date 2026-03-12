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

  // Date & time (display)
  date: { type: Date, required: true },
  time: { type: String, required: true },

  // Actual booking time
  start: { type: Date, required: true },
  end: { type: Date, required: true },

  duration: { type: Number, required: true },

  calendarEventId: { type: String },

  note: { type: String },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});


/* ============================= */
/*           INDEXES             */
/* ============================= */

// used by conflict check
bookingSchema.index({ start: 1, end: 1 });

// used by availability API
bookingSchema.index({ status: 1, start: 1 });

// useful for admin panels / sorting
bookingSchema.index({ createdAt: -1 });


module.exports = mongoose.model("Booking", bookingSchema);