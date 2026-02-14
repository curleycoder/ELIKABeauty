const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Routes
const bookingRoutes = require("./routes/bookings");
const galleryRoutes = require("./routes/gallery");
const googleRoutes = require("./routes/googleReview");
const emailRoutes = require("./routes/email");
const serviceRoutes = require("./routes/services");

function assertRouter(name, r) {
  // Express Router is a function with methods like .use/.get/.post
  if (typeof r !== "function") {
    throw new Error(
      `❌ ${name} is not a router/function. Check its export. Expected "module.exports = router". Got: ${typeof r}`
    );
  }
}

assertRouter("bookingRoutes", bookingRoutes);
assertRouter("galleryRoutes", galleryRoutes);
assertRouter("googleRoutes", googleRoutes);
assertRouter("emailRoutes", emailRoutes);
assertRouter("serviceRoutes", serviceRoutes);

const allowedOrigins = new Set([
  "https://elikabeauty.ca",
  "https://www.elikabeauty.ca",
  "http://localhost:3000",
]);

const app = express();

// Trust proxy (Render / reverse proxies)
app.set("trust proxy", 1);

// CORS
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

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/", (req, res) => res.send("✅ ELIKA Beauty API is running"));

// Public routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/google", googleRoutes);
app.use("/api/email", emailRoutes);

// Admin route (same router, different base path)
// IMPORTANT: your frontend admin page must call /api/admin/bookings
app.use("/api/admin/bookings", bookingRoutes);

// Static gallery
app.use("/gallery", express.static(path.join(__dirname, "public", "gallery")));

// DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Port (Render provides PORT)
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
