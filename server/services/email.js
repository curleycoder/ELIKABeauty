const { Resend } = require("resend");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM;
const ADMIN_EMAIL_RAW = process.env.ADMIN_EMAIL || EMAIL_FROM;
const ADMIN_EMAILS = String(ADMIN_EMAIL_RAW || "").split(",").map((s) => s.trim()).filter(Boolean);
const EMAIL_REPLY_TO = process.env.EMAIL_REPLY_TO || EMAIL_FROM;

let _resend = null;
function getResend() {
  if (!RESEND_API_KEY) throw new Error("Missing RESEND_API_KEY");
  if (!EMAIL_FROM) throw new Error("Missing EMAIL_FROM");
  if (!_resend) _resend = new Resend(RESEND_API_KEY);
  return _resend;
}

function safeStr(v) { return String(v || "").trim(); }

// ─── Booking confirmation ──────────────────────────────────────────
async function sendBookingEmails({ booking, servicesText, prettyDate, prettyTime }) {
  const r = getResend();
  const clientTo = safeStr(booking?.email);
  if (!clientTo) throw new Error("Missing client email");

  const name = safeStr(booking?.name) || "Client";
  const from = `ELIKA Beauty <${EMAIL_FROM}>`;
  const adminUrl = `https://elikabeauty.ca/admin-bookings-secret?id=${booking?._id}`;

  const clientHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your booking is confirmed with <strong>ELIKA Beauty</strong>:</p>
      <ul>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
      </ul>
      <p>We're at <strong>3790 Canada Way #102, Burnaby</strong>.</p>
      <p>To cancel or reschedule, please call us at <strong>(604) 438-3727</strong> or email <a href="mailto:elikaeiamina@gmail.com">elikaeiamina@gmail.com</a> at least <strong>24 hours</strong> before your appointment.</p>
      <p style="color:#888;font-size:13px;">Please do not reply to this email — it is not monitored.</p>
      <p>— ELIKA Beauty</p>
    </div>`;

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <p><strong>${name}</strong> just booked:</p>
      <ul>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
        <li><strong>Phone:</strong> ${booking?.phone || "—"}</li>
        <li><strong>Email:</strong> ${clientTo}</li>
        <li><strong>Note:</strong> ${booking?.note ? String(booking.note).replace(/\n/g, "<br/>") : "—"}</li>
        <li><strong>Referred by:</strong> ${booking?.referredBy ? `<span style="color:#572a31;font-weight:bold">${booking.referredBy}</span>` : "—"}</li>
      </ul>
      <p><a href="${adminUrl}" style="display:inline-block;padding:10px 18px;background:#55203d;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold">View & Manage Booking</a></p>
    </div>`;

  const r1 = await r.emails.send({
    from,
    to: clientTo,
    subject: "Your ELIKA Beauty Booking Confirmation",
    html: clientHtml,
    replyTo: EMAIL_REPLY_TO,
  });
  console.log("✅ Client confirmation sent:", r1?.data?.id || JSON.stringify(r1));

  const r2 = await r.emails.send({
    from: `ELIKA Beauty Bookings <${EMAIL_FROM}>`,
    to: ADMIN_EMAILS,
    subject: `New Booking — ${name} (${prettyDate} ${prettyTime})`,
    html: ownerHtml,
    replyTo: clientTo,
  });
  console.log("✅ Admin notification sent:", r2?.data?.id || JSON.stringify(r2));
}

// ─── Cancellation ─────────────────────────────────────────────────
async function sendCancellationEmails({ booking, servicesText, prettyDate, prettyTime }) {
  const r = getResend();
  const clientTo = safeStr(booking?.email);
  if (!clientTo) throw new Error("Missing client email");

  const name = safeStr(booking?.name) || "Client";
  const from = `ELIKA Beauty <${EMAIL_FROM}>`;
  const adminUrl = `https://elikabeauty.ca/admin-bookings-secret?id=${booking?._id}`;

  const clientHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your appointment has been <strong>cancelled</strong>.</p>
      <ul>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
      </ul>
      <p>To rebook: <a href="https://elikabeauty.ca/booking" style="color:#55203d;font-weight:bold">elikabeauty.ca/booking</a></p>
      <p>— ELIKA Beauty</p>
    </div>`;

  const ownerHtml = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <p><strong>BOOKING CANCELLED</strong></p>
      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
        <li><strong>Phone:</strong> ${booking?.phone || "—"}</li>
        <li><strong>Email:</strong> ${clientTo}</li>
      </ul>
      <p><a href="${adminUrl}" style="display:inline-block;padding:10px 18px;background:#55203d;color:#fff;text-decoration:none;border-radius:4px;font-weight:bold">View & Manage Booking</a></p>
    </div>`;

  const r1 = await r.emails.send({ from, to: clientTo, subject: "Your ELIKA Beauty appointment has been cancelled", html: clientHtml, replyTo: EMAIL_REPLY_TO });
  console.log("✅ Cancellation client sent:", r1?.data?.id || JSON.stringify(r1));

  const r2 = await r.emails.send({ from: `ELIKA Beauty Bookings <${EMAIL_FROM}>`, to: ADMIN_EMAILS, subject: `Cancelled — ${name} (${prettyDate} ${prettyTime})`, html: ownerHtml, replyTo: clientTo });
  console.log("✅ Cancellation admin sent:", r2?.data?.id || JSON.stringify(r2));
}

// ─── Birthday credit ───────────────────────────────────────────────
async function sendBirthdayEmail({ name, email, code }) {
  const r = getResend();
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:520px;margin:0 auto">
      <h2 style="color:#572a31">Happy Birthday, ${name}!</h2>
      <p>Wishing you a wonderful birthday from everyone at <strong>ELIKA Beauty</strong>.</p>
      <p>As a birthday gift, enjoy a <strong>$20 credit</strong> on any service over $100 — on us!</p>
      <div style="margin:24px 0;padding:16px 24px;background:#f8f0f1;border-radius:12px;text-align:center">
        <p style="margin:0;font-size:13px;color:#888">Your personal birthday credit code</p>
        <p style="margin:8px 0 0;font-size:26px;font-weight:bold;letter-spacing:3px;color:#572a31">${code}</p>
        <p style="margin:8px 0 0;font-size:12px;color:#aaa">Valid for services over $100 before tax &nbsp;•&nbsp; One-time use &nbsp;•&nbsp; Valid this month only &nbsp;•&nbsp; Valid ID required</p>
      </div>
      <p><a href="https://elikabeauty.ca/booking" style="display:inline-block;padding:12px 24px;background:#572a31;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Book Your Appointment</a></p>
      <p style="font-size:12px;color:#aaa">Show this code when you arrive. Valid photo ID required to redeem. Cannot be combined with other offers. One use per person per year.</p>
      <p>— ELIKA Beauty</p>
    </div>`;

  const result = await r.emails.send({ from: `ELIKA Beauty <${EMAIL_FROM}>`, to: email, subject: `Happy Birthday ${name}! 🎂 A gift from ELIKA Beauty`, html, replyTo: EMAIL_REPLY_TO });
  console.log("✅ Birthday email sent:", result?.data?.id || JSON.stringify(result));
}

// ─── Appointment reminder ──────────────────────────────────────────
async function sendReminderEmail({ name, email, prettyDate, prettyTime, servicesText }) {
  const r = getResend();
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:520px;margin:0 auto">
      <h2 style="color:#572a31">Appointment Reminder</h2>
      <p>Hi <strong>${name}</strong>, just a friendly reminder about your appointment tomorrow:</p>
      <ul>
        <li><strong>Date:</strong> ${prettyDate}</li>
        <li><strong>Time:</strong> ${prettyTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
      </ul>
      <p>We're at <strong>3790 Canada Way #102, Burnaby</strong>.</p>
      <p>To cancel or reschedule, please call us at <strong>(604) 438-3727</strong> or email <a href="mailto:elikaeiamina@gmail.com">elikaeiamina@gmail.com</a> at least <strong>24 hours</strong> before your appointment.</p>
      <p style="color:#888;font-size:13px;">Please do not reply to this email — it is not monitored.</p>
      <p>See you tomorrow!</p>
      <p>— ELIKA Beauty</p>
    </div>`;

  const result = await r.emails.send({ from: `ELIKA Beauty <${EMAIL_FROM}>`, to: email, subject: `Reminder: Your ELIKA Beauty appointment tomorrow at ${prettyTime}`, html, replyTo: EMAIL_REPLY_TO });
  console.log("✅ Reminder email sent:", result?.data?.id || JSON.stringify(result));
}

// ─── Reschedule ────────────────────────────────────────────────────
async function sendRescheduleEmail({ name, email, servicesText, oldDate, oldTime, newDate, newTime }) {
  const r = getResend();
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;max-width:520px;margin:0 auto">
      <p>Hi <strong>${name}</strong>,</p>
      <p>Your appointment has been <strong>rescheduled</strong>. Here are your updated details:</p>
      <ul>
        <li><strong>New Date:</strong> ${newDate}</li>
        <li><strong>New Time:</strong> ${newTime}</li>
        <li><strong>Services:</strong> ${servicesText}</li>
      </ul>
      <p style="color:#888;font-size:13px;">Previous appointment was on ${oldDate} at ${oldTime}.</p>
      <p>We're at <strong>3790 Canada Way #102, Burnaby</strong>.</p>
      <p>To cancel or reschedule, please call us at <strong>(604) 438-3727</strong> or email <a href="mailto:elikaeiamina@gmail.com">elikaeiamina@gmail.com</a> at least <strong>24 hours</strong> before your appointment.</p>
      <p style="color:#888;font-size:13px;">Please do not reply to this email — it is not monitored.</p>
      <p>— ELIKA Beauty</p>
    </div>`;

  const result = await r.emails.send({ from: `ELIKA Beauty <${EMAIL_FROM}>`, to: email, subject: `Your ELIKA Beauty appointment has been rescheduled`, html, replyTo: EMAIL_REPLY_TO });
  console.log("✅ Reschedule email sent:", result?.data?.id || JSON.stringify(result));
}

module.exports = { sendBookingEmails, sendCancellationEmails, sendBirthdayEmail, sendReminderEmail, sendRescheduleEmail };
