const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
  scopes: ["https://www.googleapis.com/auth/calendar"],
});

const calendar = google.calendar({ version: "v3", auth });

async function createBookingEvent({ name, services, start, end }) {
  const response = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    requestBody: {
      summary: `${name} – ${services.join(", ")}`,
      description: `Client: ${name}`,
      start: { dateTime: start },
      end: { dateTime: end },
    },
  });

  return response.data.id; // ✅ IMPORTANT
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
      start: { dateTime: start },
      end: { dateTime: end },
    },
  });
}

module.exports = {
  createBookingEvent,
  deleteBookingEvent,
  updateBookingEvent,
};
