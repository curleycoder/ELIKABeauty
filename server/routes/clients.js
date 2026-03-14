const express = require("express");
const router = express.Router();
const Client = require("../models/client");

// Normalize phone — strip everything except digits and leading +
function normalizePhone(p) {
  return String(p || "").replace(/[^\d+]/g, "");
}

// GET /api/clients/lookup?phone=6045551234
// Returns { found: true, name, email, hasBirthday } or { found: false }
// Never returns the actual birthday values to the client (privacy)
router.get("/lookup", async (req, res) => {
  const phone = normalizePhone(req.query.phone);
  if (!phone || phone.length < 7) return res.json({ found: false });

  try {
    const client = await Client.findOne({ phone }).lean();
    if (!client) return res.json({ found: false });

    res.json({
      found: true,
      name: client.name,
      email: client.email,
      referredBy: client.referredBy,
      // tell the frontend whether birthday is already locked
      hasBirthday: !!(client.birthdayMonth && client.birthdayDay),
    });
  } catch (err) {
    console.error("❌ Client lookup error:", err);
    res.status(500).json({ error: "Lookup failed" });
  }
});

// POST /api/clients/upsert
// Called on booking submit — creates or updates client profile
// Birthday is only written if not already set (one-time)
router.post("/upsert", async (req, res) => {
  const { phone, name, email, referredBy, birthdayMonth, birthdayDay } = req.body;
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return res.status(400).json({ error: "Phone required" });

  try {
    const existing = await Client.findOne({ phone: normalizedPhone });

    if (!existing) {
      // New client — save everything including birthday
      await Client.create({
        phone: normalizedPhone,
        name: name || "",
        email: email || "",
        referredBy: referredBy || "",
        birthdayMonth: birthdayMonth || null,
        birthdayDay: birthdayDay || null,
      });
    } else {
      // Returning client — update name/email/referredBy, but NEVER overwrite birthday
      existing.name = name || existing.name;
      existing.email = email || existing.email;
      if (referredBy) existing.referredBy = referredBy;

      // Only set birthday if not already saved
      if (!existing.birthdayMonth && !existing.birthdayDay) {
        existing.birthdayMonth = birthdayMonth || null;
        existing.birthdayDay = birthdayDay || null;
      }

      await existing.save();
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Client upsert error:", err);
    res.status(500).json({ error: "Upsert failed" });
  }
});

module.exports = router;
