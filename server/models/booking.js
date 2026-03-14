const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    referredBy: { type: String, default: "", trim: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }],
    date: { type: String, required: true },
    time: { type: String, required: true },
    duration: { type: Number, required: true },
    serviceType: { type: String, default: "chair" },
    note: { type: String, default: "", trim: true },
    status: { type: String, default: "confirmed" },
    calendarEventId: { type: String, default: "" },

    // Birthday (month 1-12, day 1-31) — optional
    birthdayMonth: { type: Number, default: null },
    birthdayDay: { type: Number, default: null },

    // Track which year we already sent the birthday credit so we don't double-send
    birthdayCreditSentYear: { type: Number, default: null },

    // Track if appointment reminder was sent
    reminderSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
