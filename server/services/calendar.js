const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

function clean(v) {
  return String(v ?? "").trim();
}

async function createBookingEvent({
  name,
  email,
  phone,
  services = [],
  note,
  start,
  end,
}) {
  console.log("📅 CALENDAR_ID:", process.env.GOOGLE_CALENDAR_ID);
  console.log(
    "🤖 SERVICE ACCOUNT:",
    JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON).client_email
  );
  console.log("🕒 EVENT:", { name, email, phone, start, end });

  const safeName = clean(name) || "Client";
  const safeEmail = clean(email) || "—";
  const safePhone = clean(phone) || "—";
  const safeNote = clean(note) || "—";
  const safeServices = Array.isArray(services) ? services.filter(Boolean) : [];

  const descriptionLines = [
    `Client: ${safeName}`,
    `Phone: ${safePhone}`,
    `Email: ${safeEmail}`,
    "",
    "Services:",
    safeServices.length ? safeServices.map((s) => `- ${s}`).join("\n") : "- —",
    "",
    `Notes: ${safeNote}`,
  ];

  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary: `Booking – ${safeName}${safeServices.length ? ` – ${safeServices.join(", ")}` : ""}`,
      description: descriptionLines.join("\n"),
      start: { dateTime: start, timeZone: "America/Vancouver" },
      end: { dateTime: end, timeZone: "America/Vancouver" },
    },
  });

  return response.data.id;
}

async function deleteBookingEvent(eventId) {
  if (!eventId) return;

  await calendar.events.delete({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    eventId,
  });
}

async function updateBookingEvent({ eventId, start, end }) {
  if (!eventId) return;

  await calendar.events.patch({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    eventId,
    requestBody: {
      start: { dateTime: start, timeZone: "America/Vancouver" },
      end: { dateTime: end, timeZone: "America/Vancouver" },
    },
  });
}

module.exports = {
  createBookingEvent,
  deleteBookingEvent,
  updateBookingEvent,
};
