const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, default: "", trim: true },
    email: { type: String, default: "", trim: true },
    referredBy: { type: String, default: "", trim: true },

    // Birthday — set once, never overwritten
    birthdayMonth: { type: Number, default: null },
    birthdayDay: { type: Number, default: null },

    // Track which year we already sent the birthday credit
    birthdayCreditSentYear: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Client || mongoose.model("Client", clientSchema);
