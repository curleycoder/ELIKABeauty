const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.BUSINESS_EMAIL_APP_PASSWORD,
  },
});

async function sendCancellationEmail({ email, to, name, date, time }) {
  const recipient = String(email || to || "").trim();
  if (!recipient) throw new Error("No recipient email provided");

  return transporter.sendMail({
    from: `"Beauty Shohre Studio" <${process.env.BUSINESS_EMAIL}>`,
    to: recipient,
    subject: "Your Appointment Has Been Cancelled",
    text: `Hi ${name || "Client"},

Your appointment scheduled for ${date} at ${time} has been cancelled.

If you'd like to reschedule, reply to this email.

Beauty Shohre Studio`,
  });
}



module.exports = { sendCancellationEmail };
