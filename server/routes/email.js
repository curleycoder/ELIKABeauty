const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { format, parseISO } = require("date-fns");

const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.BUSINESS_EMAIL_APP_PASSWORD,
  },
});

router.post("/send-confirmation", async (req, res) => {
  const { name, email, phone, services, date, time, note } = req.body;

  if (!name || !email || !phone || !date || !time) {
    return res.status(400).json({ success: false, error: "Missing required fields." });
  }

  const safeDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? parseISO(date)
      : new Date(date);

  if (isNaN(safeDate.getTime())) {
    return res.status(400).json({ success: false, error: "Invalid date." });
  }

  const servicesText =
    Array.isArray(services) && services.length
      ? services.join(", ")
      : "Not provided";

  const clientHtml = `
    <p>Dear <strong>${name}</strong>,</p>
    <p>Your booking has been confirmed with ELIKA Beauty:</p>
    <ul>
      <li><strong>Date:</strong> ${format(safeDate, "PPP")}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Services:</strong> ${servicesText}</li>
    </ul>
    <p>You will receive a reminder before your appointment.</p>
    <p>If you need to cancel or reschedule, contact Amina at <strong>778-513-9006</strong>.</p>
    <p>— ELIKA Beauty</p>
  `;

  const ownerHtml = `
    <p><strong>${name}</strong> just booked an appointment:</p>
    <ul>
      <li><strong>Date:</strong> ${format(safeDate, "PPP")}</li>
      <li><strong>Time:</strong> ${time}</li>
      <li><strong>Services:</strong> ${servicesText}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Note:</strong> ${note ? String(note).replace(/\n/g, "<br/>") : "—"}</li>
    </ul>
  `;

  try {
    await transporter.sendMail({
      from: `"ELIKA Beauty" <${process.env.BUSINESS_EMAIL}>`,
      to: email,
      subject: "Your ELIKA Beauty Booking Confirmation",
      html: clientHtml,
    });

    await transporter.sendMail({
      from: `"ELIKA Beauty Booking Notification" <${process.env.BUSINESS_EMAIL}>`,
      to: process.env.ADMIN_EMAIL || "amina@elikabeauty.ca",
      subject: `New Booking — ${name} (${format(safeDate, "MMM d")} ${time})`,
      html: ownerHtml,
      replyTo: email,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Email send error:", err.message, err.stack);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;