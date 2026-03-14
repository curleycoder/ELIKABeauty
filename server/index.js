const express = require("express");
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(compression());
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const { startCronJobs } = require("./services/cron");
    startCronJobs();
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const emailRouter = require("./routes/email");
const servicesRouter = require("./routes/services");
const googleRouter = require("./routes/google");
const bookingsRouter = require("./routes/bookings");

app.use("/api/email", emailRouter);
app.use("/api/services", servicesRouter);
app.use("/api/google", googleRouter);
app.use("/api/bookings", bookingsRouter);

app.get("/", (req, res) => {
  res.send("ELIKA Beauty server is running");
});

// Temporary env check — remove after confirming
app.get("/debug-env", (req, res) => {
  res.json({
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendKeyPrefix: process.env.RESEND_API_KEY?.slice(0, 8) || "MISSING",
    hasEmailFrom: !!process.env.EMAIL_FROM,
    emailFrom: process.env.EMAIL_FROM || "MISSING",
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
    adminEmail: process.env.ADMIN_EMAIL || "MISSING",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});