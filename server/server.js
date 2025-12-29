const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const bookingRoutes = require("./routes/bookings");
const galleryRoutes = require("./routes/gallery");
const googleRoutes = require("./routes/googleReview");
const emailRoutes = require("./routes/email");
const serviceRoutes = require("./routes/services");

const allowedOrigins = new Set([
  "https://beautyshohrestudio.ca",
  "https://www.beautyshohrestudio.ca",
  "http://localhost:3000",
]);

const app = express();

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true); // server-to-server / curl
      if (allowedOrigins.has(origin)) return cb(null, true);
      if (origin.endsWith(".vercel.app")) return cb(null, true);

      console.error("❌ Blocked by CORS:", origin);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

// ✅ Routes
app.use("/api/bookings", bookingRoutes);

// ✅ FIX: Admin page expects /api/admin/bookings
app.use("/api/admin/bookings", bookingRoutes);

app.use("/api/email", emailRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/services", serviceRoutes);

// ✅ Static
app.use("/gallery", express.static(path.join(__dirname, "public", "gallery")));

// ✅ Health check
app.get("/", (req, res) => res.send("✅ Beauty Shohre API is running"));

// ✅ DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Port (Render provides PORT)
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
