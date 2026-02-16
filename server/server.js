const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

// Routes
const bookingRoutes = require("./routes/bookings");
const galleryRoutes = require("./routes/gallery");
const googleRoutes = require("./routes/googleReview");
const serviceRoutes = require("./routes/services");

function assertRouter(name, r) {
  if (typeof r !== "function") {
    throw new Error(
      `❌ ${name} is not a router/function. Check its export. Expected "module.exports = router". Got: ${typeof r}`
    );
  }
}

assertRouter("bookingRoutes", bookingRoutes);
assertRouter("galleryRoutes", galleryRoutes);
assertRouter("googleRoutes", googleRoutes);
assertRouter("serviceRoutes", serviceRoutes);

const allowedOrigins = new Set([
  "https://elikabeauty.ca",
  "https://www.elikabeauty.ca",
  "http://localhost:3000",
]);

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, cb) {
      if (!origin) return cb(null, true);
      if (allowedOrigins.has(origin)) return cb(null, true);
      if (origin.endsWith(".vercel.app")) return cb(null, true);

      console.error("❌ Blocked by CORS:", origin);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => res.send("✅ ELIKA Beauty API is running"));

// Public routes
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/google", googleRoutes);

// Admin route
app.use("/api/admin/bookings", bookingRoutes);

// Static gallery
app.use("/gallery", express.static(path.join(__dirname, "public", "gallery")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
