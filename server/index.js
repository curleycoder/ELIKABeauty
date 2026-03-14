const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const emailRouter = require("./routes/email");
const servicesRouter = require("./routes/services");

app.use("/api/email", emailRouter);
app.use("/api/services", servicesRouter);

app.get("/", (req, res) => {
  res.send("ELIKA Beauty server is running");
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});