const nodemailer = require("nodemailer");

const BUSINESS_EMAIL = process.env.BUSINESS_EMAIL || process.env.SMTP_USER;
const BUSINESS_EMAIL_APP_PASSWORD =
  process.env.BUSINESS_EMAIL_APP_PASSWORD || process.env.SMTP_PASS;

if (!BUSINESS_EMAIL || !BUSINESS_EMAIL_APP_PASSWORD) {
  console.warn("⚠️ Missing BUSINESS_EMAIL/APP_PASSWORD (or SMTP_USER/SMTP_PASS)");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: BUSINESS_EMAIL, pass: BUSINESS_EMAIL_APP_PASSWORD },
});

async function sendBookingEmails({ booking, servicesText, prettyDate, prettyTime }) {
  const ownerTo = process.env.ADMIN_EMAIL || "amina@elikabeauty.ca";

  const clientHtml = `
    <p>Dear <strong>${booking.name}</strong>,</p>
    <p>Your booking has been confirmed with <strong>ELIKA Beauty</strong>:</p>
    <ul>
      <li><strong>Date:</strong> ${prettyDate}</li>
      <li><strong>Time:</strong> ${prettyTime}</li>
      <li><strong>Services:</strong> ${servicesText}</li>
    </ul>
    <p>If you need to reschedule, reply to this email.</p>
    <p>— ELIKA Beauty</p>
  `;

  const ownerHtml = `
    <p><strong>${booking.name}</strong> just booked:</p>
    <ul>
      <li><strong>Date:</strong> ${prettyDate}</li>
      <li><strong>Time:</strong> ${prettyTime}</li>
      <li><strong>Services:</strong> ${servicesText}</li>
      <li><strong>Phone:</strong> ${booking.phone}</li>
      <li><strong>Email:</strong> ${booking.email}</li>
      <li><strong>Note:</strong> ${booking.note ? String(booking.note).replace(/\n/g, "<br/>") : "—"}</li>
    </ul>
  `;

  // client
  await transporter.sendMail({
    from: `"ELIKA Beauty" <${BUSINESS_EMAIL}>`,
    to: booking.email,
    subject: "Your ELIKA Beauty Booking Confirmation",
    html: clientHtml,
  });

  // owner
  await transporter.sendMail({
    from: `"ELIKA Beauty Bookings" <${BUSINESS_EMAIL}>`,
    to: ownerTo,
    subject: `📅 New Booking — ${booking.name} (${prettyDate} ${prettyTime})`,
    html: ownerHtml,
    replyTo: booking.email,
  });
}

async function sendCancellationEmail({ email, to, name, date, time }) {
  const recipient = String(email || to || "").trim();
  if (!recipient) throw new Error("No recipient email provided");

  return transporter.sendMail({
    from: `"ELIKA Beauty" <${BUSINESS_EMAIL}>`,
    to: recipient,
    subject: "Your Appointment Has Been Cancelled",
    text: `Hi ${name || "Client"},

Your appointment scheduled for ${date} at ${time} has been cancelled.

If you'd like to reschedule, reply to this email.

ELIKA Beauty`,
  });
}

module.exports = { sendBookingEmails, sendCancellationEmail };
