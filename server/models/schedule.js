const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    // Day-of-week numbers that are closed by default (0=Sun, 1=Mon, ..., 6=Sat)
    closedWeekdays: { type: [Number], default: [0, 1] },

    // Specific date overrides — force a date open or closed regardless of weekday rule
    overrides: [
      {
        date: { type: String, required: true }, // "YYYY-MM-DD"
        open: { type: Boolean, required: true }, // true = open, false = closed
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
