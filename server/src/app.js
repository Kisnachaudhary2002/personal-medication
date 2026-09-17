const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorMiddleware = require("./middleware/error.middleware");

const authRoutes = require("./routes/auth.routes");
const medicationRoutes = require("./routes/medication.routes");
const vitalRoutes = require("./routes/vital.routes");
const noteRoutes = require("./routes/note.routes");
const vaccinationRoutes = require("./routes/vaccination.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Personal Medication API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/medications", medicationRoutes);
app.use("/api/vitals", vitalRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/vaccinations", vaccinationRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorMiddleware);

module.exports = app;
