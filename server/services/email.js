const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.BUSINESS_EMAIL,
    pass: process.env.BUSINESS_EMAIL_APP_PASSWORD,
  },
});

async function sendCancellationEmail({ to, name, date, time }) {
  await transporter.sendMail({
    from: `"Beauty Shohre Studio" <${process.env.BUSINESS_EMAIL}>`,
    to,
    subject: "Your Appointment Has Been Cancelled",
    text: `
Hi ${name},

Your appointment scheduled for ${date} at ${time} has been cancelled.

Please contact us if you would like to reschedule.

Beauty Shohre Studio
`,
  });
}

module.exports = { sendCancellationEmail };
