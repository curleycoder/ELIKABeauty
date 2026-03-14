const cron = require("node-cron");
const { format, addDays, parseISO } = require("date-fns");
const { toZonedTime } = require("date-fns-tz");
const Booking = require("../models/booking");
const Client = require("../models/client");
const { sendBirthdayEmail, sendReminderEmail } = require("./email");

const SHOP_TZ = "America/Vancouver";

// ─── Birthday emails ───────────────────────────────────────────────
// Runs every day at 9:00 AM Vancouver time
// Finds all clients whose birthday is today, sends $20 credit email once per year
async function runBirthdayJob() {
  const nowVan = toZonedTime(new Date(), SHOP_TZ);
  const month = nowVan.getMonth() + 1;
  const day = nowVan.getDate();
  const year = nowVan.getFullYear();

  console.log(`Birthday job running for ${month}/${day}/${year}`);

  // Read from Client model — one record per person, birthday set once
  const clients = await Client.find({
    birthdayMonth: month,
    birthdayDay: day,
    $or: [
      { birthdayCreditSentYear: { $ne: year } },
      { birthdayCreditSentYear: null },
      { birthdayCreditSentYear: { $exists: false } },
    ],
  }).lean();

  console.log(`Found ${clients.length} birthday(s) to send`);

  for (const c of clients) {
    if (!c.email) continue;
    try {
      await sendBirthdayEmail({ name: c.name || "there", email: c.email });
      await Client.updateOne({ _id: c._id }, { $set: { birthdayCreditSentYear: year } });
      console.log(`Birthday email sent to ${c.email}`);
    } catch (err) {
      console.error(`Birthday email failed for ${c.email}:`, err.message);
    }
  }
}

// ─── Appointment reminders ─────────────────────────────────────────
// Runs every day at 9:00 AM Vancouver time
// Finds all confirmed bookings for tomorrow and sends a reminder
async function runReminderJob() {
  const nowVan = toZonedTime(new Date(), SHOP_TZ);
  const tomorrowVan = addDays(nowVan, 1);
  const tomorrowStr = format(tomorrowVan, "yyyy-MM-dd");

  console.log(`📅 Reminder job running for ${tomorrowStr}`);

  const bookings = await Booking.find({
    date: tomorrowStr,
    status: "confirmed",
    reminderSent: { $ne: true },
  }).populate("services", "name");

  console.log(`📅 Found ${bookings.length} reminder(s) to send`);

  for (const b of bookings) {
    try {
      const servicesText = b.services.map((s) => s.name).join(", ");
      const prettyDate = format(parseISO(b.date), "EEEE, MMMM d");

      await sendReminderEmail({
        name: b.name,
        email: b.email,
        prettyDate,
        prettyTime: b.time,
        servicesText,
      });

      b.reminderSent = true;
      await b.save();

      console.log(`✅ Reminder sent to ${b.email}`);
    } catch (err) {
      console.error(`❌ Reminder failed for ${b.email}:`, err.message);
    }
  }
}

// ─── Schedule ──────────────────────────────────────────────────────
// "0 9 * * *" = 9:00 AM every day
// node-cron runs in server local time — we offset to Vancouver (UTC-7/8)
// Render servers run UTC, so 9 AM Vancouver = 16:00 or 17:00 UTC
// Use "0 17 * * *" as a safe default (covers both PST and PDT)
function startCronJobs() {
  cron.schedule("0 17 * * *", async () => {
    console.log("⏰ Running daily jobs...");
    await runBirthdayJob().catch((e) => console.error("Birthday job error:", e));
    await runReminderJob().catch((e) => console.error("Reminder job error:", e));
  });

  console.log("✅ Cron jobs scheduled (daily at 9 AM Vancouver)");
}

module.exports = { startCronJobs, runBirthdayJob, runReminderJob };
