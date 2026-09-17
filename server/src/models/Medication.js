const mongoose = require("mongoose");

// One medicine can have multiple reminder times a day, e.g. ["08:00", "21:00"]
const medicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true,
    },
    dosage: {
      type: String,
      required: [true, "Dosage is required"], // e.g. "500mg"
    },
    frequency: {
      type: String,
      enum: ["once-daily", "twice-daily", "thrice-daily", "custom"],
      default: "once-daily",
    },
    reminderTimes: [
      {
        time: { type: String, required: true }, // "HH:MM" 24-hour format
        lastNotifiedDate: { type: String, default: null }, // "YYYY-MM-DD" - prevents repeat alerts same day
      },
    ],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    doseLogs: [
      {
        date: { type: String }, // "YYYY-MM-DD"
        time: { type: String }, // which reminder slot
        status: { type: String, enum: ["taken", "missed"], default: "taken" },
        loggedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Medication", medicationSchema);
