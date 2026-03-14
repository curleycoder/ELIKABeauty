const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const { format, parseISO } = require("date-fns");
const Service = require("../models/service");

const bookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    referredBy: { type: String, default: "", trim: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }],
    date: { type: String, required: true },
    time: { type: String, required: true },
    note: { type: String, default: "", trim: true },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

const Booking =
  mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

const transporter = nodemailer.createTransport({
  host: "smtp.ionos.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.BUSINESS_EMAIL_APP_PASSWORD,
  },
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, referredBy, services, date, time, note } = req.body;

    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ error: "Please select at least one service" });
    }

    const validServices = await Service.find({ _id: { $in: services } });

    if (validServices.length !== services.length) {
      return res.status(400).json({ error: "One or more selected services are invalid" });
    }

    const existing = await Booking.findOne({
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (existing) {
      return res.status(409).json({ error: "This time is no longer available" });
    }

    const booking = await Booking.create({
      name,
      email,
      phone,
      referredBy: referredBy || "",
      services,
      date,
      time,
      note: note || "",
    });

    const safeDate =
      typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? parseISO(date)
        : new Date(date);

    const servicesText = validServices.map((s) => s.name).join(", ");

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
        <li><strong>Referred By:</strong> ${referredBy || "—"}</li>
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
        to: process.env.ADMIN_EMAIL || process.env.BUSINESS_EMAIL,
        subject: `New Booking — ${name} (${format(safeDate, "MMM d")} ${time})`,
        html: ownerHtml,
        replyTo: email,
      });
    } catch (mailError) {
      console.error("❌ Email send error:", mailError.message, mailError.stack);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Failed to create booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

module.exports = router;