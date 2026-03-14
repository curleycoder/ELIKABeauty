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
const adminRouter = require("./routes/admin");
const clientsRouter = require("./routes/clients");

app.use("/api/email", emailRouter);
app.use("/api/services", servicesRouter);
app.use("/api/google", googleRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/clients", clientsRouter);

app.get("/", (req, res) => {
  res.send("ELIKA Beauty server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});