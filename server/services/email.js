const nodemailer = require("nodemailer");

const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL;
const BUSINESS_EMAIL_APP_PASSWORD = process.env.BUSINESS_EMAIL_APP_PASSWORD;

// Admin recipients: comma-separated list supported
const ADMIN_EMAIL_RAW = process.env.ADMIN_EMAIL || "amina@elikabeauty.ca";
const ADMIN_EMAILS = ADMIN_EMAIL_RAW.split(",").map(s => s.trim()).filter(Boolean);

const EMAIL_ENABLED = Boolean(BUSINESS_EMAIL && BUSINESS_EMAIL_APP_PASSWORD);

if (!EMAIL_ENABLED) {
  console.warn("⚠️ Email disabled: Missing BUSINESS_EMAIL or BUSINESS_EMAIL_APP_PASSWORD");
}

const transporter = EMAIL_ENABLED
  ? nodemailer.createTransport({
      host: "smtp.ionos.com",
      port: 465,
      secure: true,
      auth: {
        user: BUSINESS_EMAIL,
        pass: BUSINESS_EMAIL_APP_PASSWORD,
      },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,

      // Turn these ON for debugging, OFF later
      logger: true,
      debug: true,
    })
  : null;

// Verify once at startup (Render logs)
if (transporter) {
  transporter.verify((err) => {
    if (err) console.error("❌ SMTP verify failed:", err);
    else console.log("✅ SMTP transporter ready:", BUSINESS_EMAIL);
  });
}

function safeEmail(v) {
  return String(v || "").trim();
}

async function sendBookingEmails({ booking, servicesText, prettyDate, prettyTime }) {
  if (!EMAIL_ENABLED) {
    console.warn("⚠️ sendBookingEmails skipped (email disabled)");
    return;
  }

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
      <li><strong>Note:</strong> ${booking?.note ? String(booking.note).replace(/\n/g, "<br/>") : "—"}</li>
    </ul>
  `;

  // 1) Send to client
  await transporter.sendMail({
    from: `"ELIKA Beauty" <${BUSINESS_EMAIL}>`,
    to: clientTo,
    subject: clientSubject,
    text: clientText,
    html: clientHtml,
  });

  // 2) Send to owner/admin(s)
  await transporter.sendMail({
    from: `"ELIKA Beauty Bookings" <${BUSINESS_EMAIL}>`,
    to: ADMIN_EMAILS,
    subject: ownerSubject,
    text: ownerText,
    html: ownerHtml,
    replyTo: clientTo,
  });
}

async function sendCancellationEmail({ email, to, name, date, time }) {
  if (!EMAIL_ENABLED) {
    console.warn("⚠️ sendCancellationEmail skipped (email disabled)");
    return;
  }

  const recipient = safeEmail(email || to);
  if (!recipient) throw new Error("No recipient email provided");

  const safeName = String(name || "Client").trim();

  return transporter.sendMail({
    from: `"ELIKA Beauty" <${BUSINESS_EMAIL}>`,
    to: recipient,
    subject: "Your Appointment Has Been Cancelled",
    text: `Hi ${safeName},

Your appointment scheduled for ${date} at ${time} has been cancelled.

If you'd like to reschedule, reply to this email.

— ELIKA Beauty`,
  });
}

module.exports = { sendBookingEmails, sendCancellationEmail };
