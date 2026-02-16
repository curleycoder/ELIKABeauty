// services/email.js (Resend - works on Render)
const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM; // bookings@elikabeauty.ca
const ADMIN_EMAIL_RAW = process.env.ADMIN_EMAIL || EMAIL_FROM;
const ADMIN_EMAILS = String(ADMIN_EMAIL_RAW)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || EMAIL_FROM;

if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
if (!EMAIL_FROM) throw new Error("Missing EMAIL_FROM");

const resend = new Resend(RESEND_API_KEY);

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

  // 1) client email
  const r1 = await resend.emails.send({
    from: `ELIKA Beauty <${EMAIL_FROM}>`,
    to: clientTo,
    subject: clientSubject,
    text: clientText,
    html: clientHtml,
    reply_to: EMAIL_REPLY_TO,
  });
  console.log("✅ Resend client email:", r1?.data?.id || r1);

  // 2) admin email(s)
  const r2 = await resend.emails.send({
    from: `ELIKA Beauty Bookings <${EMAIL_FROM}>`,
    to: ADMIN_EMAILS,
    subject: ownerSubject,
    text: ownerText,
    html: ownerHtml,
    reply_to: clientTo, // reply goes to client
  });
  console.log("✅ Resend admin email:", r2?.data?.id || r2);
}

async function sendCancellationEmail({ email, to, name, date, time }) {
  const recipient = safeEmail(email || to);
  if (!recipient) throw new Error("No recipient email provided");

  const safeName = String(name || "Client").trim();

  const r = await resend.emails.send({
    from: `ELIKA Beauty <${EMAIL_FROM}>`,
    to: recipient,
    subject: "Your Appointment Has Been Cancelled",
    text: `Hi ${safeName},

Your appointment scheduled for ${date} at ${time} has been cancelled.

If you'd like to reschedule, reply to this email.

— ELIKA Beauty`,
    reply_to: EMAIL_REPLY_TO,
  });

  console.log("✅ Resend cancellation email:", r?.data?.id || r);
  return r;
}

module.exports = { sendBookingEmails, sendCancellationEmail };
