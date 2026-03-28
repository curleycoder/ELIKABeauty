/**
 * One-time script: create Google Calendar events for all existing confirmed bookings
 * that don't already have a calendarEventId.
 *
 * Run from the server/ directory:
 *   node scripts/backfill-calendar.js
 *
 * Requires .env to be present with MONGODB_URI, GOOGLE_SERVICE_ACCOUNT_JSON, GOOGLE_CALENDAR_ID.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const { parse, format, addMinutes } = require("date-fns");
const { fromZonedTime } = require("date-fns-tz");
const Booking = require("../models/booking");
const { createBookingEvent } = require("../services/calendar");

const SHOP_TZ = "America/Vancouver";

function bookingToUtcRange(dateStr, time12h, duration) {
  const localParsed = parse(`${dateStr} ${time12h}`, "yyyy-MM-dd h:mm a", new Date());
  if (isNaN(localParsed.getTime())) return null;
  const wallClock = format(localParsed, "yyyy-MM-dd HH:mm:ss");
  const startUtc = fromZonedTime(wallClock, SHOP_TZ);
  const endUtc = addMinutes(startUtc, Number(duration) || 60);
  return { startUtc, endUtc };
}

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ Connected to MongoDB");

  const bookings = await Booking.find({
    status: { $ne: "cancelled" },
    $or: [
      { calendarEventId: { $exists: false } },
      { calendarEventId: null },
      { calendarEventId: "" },
    ],
  }).populate("services", "name").lean();

  console.log(`📅 Found ${bookings.length} booking(s) to backfill`);

  let success = 0;
  let failed = 0;
  let skipped = 0;

  for (const b of bookings) {
    const range = bookingToUtcRange(b.date, b.time, b.duration);
    if (!range) {
      console.warn(`⚠️  Skipping booking ${b._id} — invalid date/time: ${b.date} ${b.time}`);
      skipped++;
      continue;
    }

    const serviceNames =
      b.serviceNames?.length
        ? b.serviceNames
        : b.services?.map((s) => s?.name).filter(Boolean) || [];

    try {
      const eventId = await createBookingEvent({
        name: b.name,
        email: b.email,
        phone: b.phone,
        services: serviceNames,
        note: b.note || "",
        start: range.startUtc.toISOString(),
        end: range.endUtc.toISOString(),
      });

      if (eventId) {
        await Booking.findByIdAndUpdate(b._id, { calendarEventId: eventId });
        console.log(`✅ ${b.name} — ${b.date} ${b.time} → event ${eventId}`);
        success++;
      } else {
        console.warn(`⚠️  ${b.name} — ${b.date} ${b.time} → no event ID returned (calendar not configured?)`);
        skipped++;
      }
    } catch (err) {
      console.error(`❌ ${b.name} — ${b.date} ${b.time}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone — ✅ ${success} created, ⚠️  ${skipped} skipped, ❌ ${failed} failed`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
