const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const path = require("path"); 

const app = express();
app.use(cors());
app.use(express.json());

const bookingRoutes = require("./routes/bookings");
const serviceRoutes = require("./routes/services")
const galleryRoutes = require("./routes/gallery")

app.use("/api/bookings", bookingRoutes)
app.use("/api/services", serviceRoutes)
app.use("/api/gallery", galleryRoutes)

app.use('/gallery', express.static(path.join(__dirname, 'public' , 'gallery')))

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.get("/", (req, res)=>{
    res.send("Hello from server");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`))