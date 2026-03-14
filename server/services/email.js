// services/email.js (Resend - works on Render)
const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM; // bookings@elikabeauty.ca
const ADMIN_EMAIL_RAW = process.env.ADMIN_EMAIL || EMAIL_FROM;
const ADMIN_EMAILS = String(ADMIN_EMAIL_RAW || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || EMAIL_FROM;

// Lazy init — don't crash at startup if env vars are missing locally
let resend = null;
function getResend() {
  if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
  if (!EMAIL_FROM) throw new Error("Missing EMAIL_FROM");
  if (!resend) resend = new Resend(RESEND_API_KEY);
  return resend;
}

function safeEmail(v) {
  return String(v || "").trim();
}

async function sendBookingEmails({ booking, servicesText, prettyDate, prettyTime }) {
  const clientTo = safeEmail(booking?.email);
  if (!clientTo) throw new Error("Missing client email");

  const safeName = String(booking?.name || "Client").trim();

  const from = `ELIKA Beauty <${EMAIL_FROM}>`;
  const replyToShop = EMAIL_REPLY_TO;

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
    <div style="font-family:Arial,sans-serif; line-height:1.5">
      <p>Hi <strong>${safeName}</strong>,</p>
      <p>Your booking has been confirmed with <strong>ELIKA Beauty</strong>:</p>
      <ul>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
      </ul>
      <p>If you need to reschedule, reply to this email.</p>
      <p>— ELIKA Beauty</p>
    </div>
  `;

  // 1) client
  const r1 = await resend.emails.send({
    from,
    to: clientTo,
    subject: clientSubject,
    text: clientText,
    html: clientHtml,
    replyTo: replyToShop,
    reply_to: replyToShop,
  });

  console.log("✅ Resend client email result:", JSON.stringify(r1, null, 2));

  const adminUrl = `https://elikabeauty.ca/admin-bookings-secret?id=${booking?._id}`;


  // 2) admin(s)
  const ownerText = `NEW BOOKING

Name: ${safeName}
Date: ${prettyDate}
Time: ${prettyTime}
Services: ${servicesText}
Phone: ${booking?.phone || "—"}
Email: ${clientTo}
Note: ${booking?.note || "—"}

View & manage:
${adminUrl}
`;

    const ownerHtml = `
    <div style="font-family:Arial,sans-serif; line-height:1.5">
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

      <p style="margin-top:20px;">
        <a href="${adminUrl}"
          style="
            display:inline-block;
            padding:10px 18px;
            background-color:#55203d;
            color:#ffffff;
            text-decoration:none;
            border-radius:4px;
            font-weight:bold;
          ">
          View & Manage Booking
        </a>
      </p>
    </div>
  `;


  const r2 = await resend.emails.send({
    from: `ELIKA Beauty Bookings <${EMAIL_FROM}>`,
    to: ADMIN_EMAILS,
    subject: ownerSubject,
    text: ownerText,
    html: ownerHtml,
    replyTo: clientTo,
    reply_to: clientTo,
  });

  console.log("✅ Resend admin email result:", JSON.stringify(r2, null, 2));
}


async function sendCancellationEmails({ booking, servicesText, prettyDate, prettyTime }) {
  const clientTo = safeEmail(booking?.email);
  if (!clientTo) throw new Error("Missing client email");

  const safeName = String(booking?.name || "Client").trim();
  const from = `ELIKA Beauty <${EMAIL_FROM}>`;
  const replyToShop = EMAIL_REPLY_TO;

  // CLIENT
  const clientSubject = "Your ELIKA Beauty appointment has been cancelled";

  const clientText = `Hi ${safeName},

Your appointment has been cancelled.

Date: ${prettyDate}
Time: ${prettyTime}
Services: ${servicesText}

If you'd like to reschedule, reply to this email or book again on elikabeauty.ca.

— ELIKA Beauty`;

  const clientHtml = `
    <div style="font-family:Arial,sans-serif; line-height:1.5">
      <p>Hi <strong>${safeName}</strong>,</p>
      <p>Your appointment has been <strong>cancelled</strong>.</p>
      <ul>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
      </ul>
      <p>
        If you'd like to reschedule, reply to this email or 
        <a href="https://elikabeauty.ca/booking" 
          style="color:#55203d; text-decoration:underline; font-weight:bold;">
          click here to book your appointment
        </a>.
      </p>
      <p>— ELIKA Beauty</p>
    </div>
  `;

  const r1 = await resend.emails.send({
    from,
    to: clientTo,
    subject: clientSubject,
    text: clientText,
    html: clientHtml,
    replyTo: replyToShop,
    reply_to: replyToShop,
  });

  console.log("✅ Resend client cancellation result:", JSON.stringify(r1, null, 2));

  // ADMIN(S)

  const adminUrl = `https://elikabeauty.ca/admin-bookings-secret?id=${booking?._id}`;

  const ownerSubject = `❌ Cancelled — ${safeName} (${prettyDate} ${prettyTime})`;

  const ownerText = `BOOKING CANCELLED

Name: ${safeName}
Date: ${prettyDate}
Time: ${prettyTime}
Services: ${servicesText}
Phone: ${booking?.phone || "—"}
Email: ${clientTo}
CancelledAt: ${booking?.cancelledAt ? new Date(booking.cancelledAt).toISOString() : "—"}
ID: ${booking?._id || "—"}

View & manage:
${adminUrl}
`;

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif; line-height:1.5">
      <p><strong>BOOKING CANCELLED</strong></p>
      <ul>
        <li><strong>Name:</strong> ${safeName}</li>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
        <li><strong>Phone:</strong> ${booking?.phone || "—"}</li>
        <li><strong>Email:</strong> ${clientTo}</li>
        <li><strong>Cancelled At:</strong> ${
          booking?.cancelledAt ? new Date(booking.cancelledAt).toLocaleString("en-CA") : "—"
        }</li>
        <li><strong>ID:</strong> ${booking?._id || "—"}</li>
      </ul>
      <p style="margin-top:20px;">
      <a href="${adminUrl}"
         style="
           display:inline-block;
           padding:10px 18px;
           background-color:#55203d;
           color:#ffffff;
           text-decoration:none;
           border-radius:4px;
           font-weight:bold;
         ">
        View & Manage Booking
      </a>
    </p>
    </div>
  `;

  const r2 = await resend.emails.send({
    from: `ELIKA Beauty Bookings <${EMAIL_FROM}>`,
    to: ADMIN_EMAILS,
    subject: ownerSubject,
    text: ownerText,
    html: ownerHtml,
    replyTo: clientTo,
    reply_to: clientTo,
  });

  console.log("✅ Resend admin cancellation result:", JSON.stringify(r2, null, 2));
}


module.exports = { sendBookingEmails, sendCancellationEmails, sendBirthdayEmail, sendReminderEmail };
async function sendBirthdayEmail({ name, email }) {
  const r = getResend();
  const from = `ELIKA Beauty <${EMAIL_FROM}>`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:520px;margin:0 auto">
      <h2 style="color:#572a31">🎂 Happy Birthday, ${name}!</h2>
      <p>Wishing you a wonderful birthday from everyone at <strong>ELIKA Beauty</strong>.</p>
      <p>As a birthday gift, enjoy a <strong>$20 credit</strong> on any service over $80 — on us!</p>
      <div style="margin:24px 0;padding:16px 24px;background:#f8f0f1;border-radius:12px;text-align:center">
        <p style="margin:0;font-size:13px;color:#888">Your birthday credit code</p>
        <p style="margin:8px 0 0;font-size:28px;font-weight:bold;letter-spacing:4px;color:#572a31">BDAY20</p>
        <p style="margin:8px 0 0;font-size:12px;color:#aaa">Valid for services over $80 • One-time use • Expires in 30 days</p>
      </div>
      <p>
        <a href="https://elikabeauty.ca/booking"
          style="display:inline-block;padding:12px 24px;background:#572a31;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">
          Book Your Appointment
        </a>
      </p>
      <p style="font-size:12px;color:#aaa">Just mention this code when you arrive. Cannot be combined with other offers.</p>
      <p>— ELIKA Beauty</p>
    </div>
  `;

  const result = await r.emails.send({
    from,
    to: email,
    subject: `🎂 Happy Birthday ${name}! A gift from ELIKA Beauty`,
    html,
    replyTo: EMAIL_REPLY_TO,
  });

  console.log("✅ Birthday email sent:", result?.data?.id || result?.id);
}

async function sendReminderEmail({ name, email, prettyDate, prettyTime, servicesText }) {
  const r = getResend();
  const from = `ELIKA Beauty <${EMAIL_FROM}>`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:520px;margin:0 auto">
      <h2 style="color:#572a31">📅 Appointment Reminder</h2>
      <p>Hi <strong>${name}</strong>, just a friendly reminder about your appointment tomorrow:</p>
      <ul>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
      </ul>
      <p>We're located at <strong>3790 Canada Way #102, Burnaby</strong>.</p>
      <p>If you need to reschedule, please reply to this email or call us at <strong>(604) 438-3727</strong>.</p>
      <p>See you tomorrow!</p>
      <p>— ELIKA Beauty</p>
    </div>
  `;

  const result = await r.emails.send({
    from,
    to: email,
    subject: `Reminder: Your ELIKA Beauty appointment tomorrow at ${prettyTime}`,
    html,
    replyTo: EMAIL_REPLY_TO,
  });

  console.log("✅ Reminder email sent:", result?.data?.id || result?.id);
}

module.exports = { sendBookingEmails, sendCancellationEmails, sendBirthdayEmail, sendReminderEmail };
