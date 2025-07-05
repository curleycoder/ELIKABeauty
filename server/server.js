const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const path = require("path"); 

const allowedOrigins = [
  "https://beautyshohrestudio.ca",
  "https://www.beautyshohrestudio.ca",
];

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "OPTIONS"],
  credentials: true,
}));

app.use(express.json());

const bookingRoutes = require("./routes/bookings");
const galleryRoutes = require("./routes/gallery")
const googleRoutes = require("./routes/googleReview")
const emailRoutes = require("./routes/email");



app.use("/api/bookings", bookingRoutes)
app.use("/api/email", emailRoutes);
app.use("/api/gallery", galleryRoutes)
app.use("/api/google", googleRoutes)

app.use('/gallery', express.static(path.join(__dirname, 'public', 'gallery')))

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get("/", (req, res)=>{
    res.send("Hello from server");
});
app.get("/api/google/reviews", (req, res) => {
  console.log("✅ Hardcoded test route hit");
  res.json({ reviews: [{ author_name: "Jane Test", text: "Testing route!", rating: 5 }] });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`)) ;