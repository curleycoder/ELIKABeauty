const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const emailRouter = require("./routes/email");
app.use("/api/email", emailRouter);

app.get("/", (req, res) => {
  res.send("ELIKA Beauty server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});