// services/email.js  (Gmail SMTP using SMTP_USER + SMTP_PASS)
const nodemailer = require("nodemailer");

const SMTP_USER = process.env.SMTP_USER;     // yourgmail@gmail.com
const SMTP_PASS = process.env.SMTP_PASS;     // Gmail App Password (16 chars)
const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || SMTP_USER;

// Admin recipients: comma-separated list supported
const ADMIN_EMAIL_RAW = process.env.ADMIN_EMAIL || BUSINESS_EMAIL;
const ADMIN_EMAILS = ADMIN_EMAIL_RAW.split(",").map(s => s.trim()).filter(Boolean);

if (!SMTP_USER || !SMTP_PASS) {
  throw new Error("Missing SMTP_USER or SMTP_PASS");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  connectionTimeout: 20000,
  greetingTimeout: 20000,
  socketTimeout: 20000,
});


// Verify once at startup (Render logs)
transporter.verify((err) => {
  if (err) console.error("❌ Gmail SMTP verify failed:", err?.message || err);
  else console.log("✅ Gmail SMTP transporter ready:", SMTP_USER);
});

function safeEmail(v) {
  return String(v || "").trim();
}

async function sendBookingEmails({ booking, servicesText, prettyDate, prettyTime }) {
  const clientTo = safeEmail(booking?.email);
  if (!clientTo) throw new Error("Missing client email");

  const safeName = String(booking?.name || "Client").trim();

  const clientSubject = "Your ELIKA Beauty Booking Confirmation";
  const ownerSubject = `📅 New Booking — ${safeName} (${prettyDate} ${prettyTime})`;

  const clientText = `Hi ${safeName},

Your booking is confirmed with ELIKA Beauty.

Date: ${prettyDate}
Time: ${prettyTime}
Services: ${servicesText}

If you need to reschedule, reply to this email.

— ELIKA Beauty`;

  const clientHtml = `
    <p>Hi <strong>${safeName}</strong>,</p>
    <p>Your booking has been confirmed with <strong>ELIKA Beauty</strong>:</p>
    <ul>
      <li><strong>Date:</strong> ${prettyDate}</li>
      <li><strong>Time:</strong> ${prettyTime}</li>
      <li><strong>Services:</strong> ${servicesText}</li>
    </ul>
    <p>If you need to reschedule, reply to this email.</p>
    <p>— ELIKA Beauty</p>
  `;

  const ownerText = `NEW BOOKING

Name: ${safeName}
Date: ${prettyDate}
Time: ${prettyTime}
Services: ${servicesText}
Phone: ${booking?.phone || "—"}
Email: ${clientTo}
Note: ${booking?.note || "—"}`;

  const ownerHtml = `
    <p><strong>${safeName}</strong> just booked:</p>
    <ul>
      <li><strong>Date:</strong> ${prettyDate}</li>
      <li><strong>Time:</strong> ${prettyTime}</li>
      <li><strong>Services:</strong> ${servicesText}</li>
      <li><strong>Phone:</strong> ${booking?.phone || "—"}</li>
      <li><strong>Email:</strong> ${clientTo}</li>
      <li><strong>Note:</strong> ${
        booking?.note ? String(booking.note).replace(/\n/g, "<br/>") : "—"
      }</li>
    </ul>
  `;

  const replyToShop =
    BUSINESS_EMAIL && BUSINESS_EMAIL !== SMTP_USER ? BUSINESS_EMAIL : undefined;

  const clientMail = {
    from: `"ELIKA Beauty" <${SMTP_USER}>`,
    to: clientTo,
    subject: clientSubject,
    text: clientText,
    html: clientHtml,
    ...(replyToShop ? { replyTo: replyToShop } : {}),
  };

  const adminMail = {
    from: `"ELIKA Beauty Bookings" <${SMTP_USER}>`,
    to: ADMIN_EMAILS,
    subject: ownerSubject,
    text: ownerText,
    html: ownerHtml,
    replyTo: clientTo, // reply goes directly to client
  };

  const r1 = await transporter.sendMail(clientMail);
  console.log("✅ Client email sent:", r1.messageId);

  const r2 = await transporter.sendMail(adminMail);
  console.log("✅ Admin email sent:", r2.messageId);

  return { clientMessageId: r1.messageId, adminMessageId: r2.messageId };
}


async function sendCancellationEmail({ email, to, name, date, time }) {
  const recipient = safeEmail(email || to);
  if (!recipient) throw new Error("No recipient email provided");

  const safeName = String(name || "Client").trim();
  const replyToShop = BUSINESS_EMAIL && BUSINESS_EMAIL !== SMTP_USER ? BUSINESS_EMAIL : undefined;

  return transporter.sendMail({
    from: `"ELIKA Beauty" <${SMTP_USER}>`,
    to: recipient,
    subject: "Your Appointment Has Been Cancelled",
    text: `Hi ${safeName},

Your appointment scheduled for ${date} at ${time} has been cancelled.

If you'd like to reschedule, reply to this email.

— ELIKA Beauty`,
    ...(replyToShop ? { replyTo: replyToShop } : {}),
  });
}

module.exports = { sendBookingEmails, sendCancellationEmail };
