const express = require("express");
const router = express.Router();
const Schedule = require("../models/schedule");

// GET /api/schedule — public, used by the booking page
router.get("/", async (req, res) => {
  try {
    const schedule = await Schedule.findOne().lean();
    if (!schedule) {
      return res.json({ closedWeekdays: [0, 1], overrides: [] });
    }
    res.set("Cache-Control", "public, max-age=60");
    res.json({ closedWeekdays: schedule.closedWeekdays, overrides: schedule.overrides });
  } catch (err) {
    console.error("❌ Failed to fetch schedule:", err);
    res.json({ closedWeekdays: [0, 1], overrides: [] });
  }
});

module.exports = router;
