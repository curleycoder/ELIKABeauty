const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
router.post("/send-confirmation", async (req, res) => {
  const { name, email, services, date, time } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
         
  // ✅ Email to the client
  const clientHtml = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Your booking has been confirmed with Beauty Shohre Studio:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Services:</strong> ${Array.isArray(services) ? services.join(", ") : "Not provided"}</li>

    </ul>
    <p>You will receive a reminder before your appointment.</p>
    <p>If you need to cancel or reschedule, contact Shohre at <strong>778-513-9006</strong>.</p>
    <p>— Beauty Shohre Studio</p>
  `;

  // ✅ Email to the business owner
  const ownerHtml = `
    <p><strong>${name}</strong> just booked an appointment:</p>
    <ul>
      <li><strong>Date:</strong> ${date}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Services:</strong> ${Array.isArray(services) ? services.join(", ") : "Not provided"}</li>
      <li><strong>Email:</strong> ${email}</li>
    </ul>
  `;

  try {
    // Send to client
    await transporter.sendMail({
      from: `"Beauty Shohre Studio" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Your Beauty Shohre Booking Confirmation",
      html: clientHtml,
    });

    // Send to owner
    await transporter.sendMail({
      from: `"Beauty Shohre Booking Notification" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Booking from ${name}`,
      html: ownerHtml,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Email send error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;