const mongoose = require("mongoose");

// Vital sign readings only: blood pressure & blood sugar
const vitalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["blood_pressure", "blood_sugar"],
      required: true,
    },
    // Blood pressure
    systolic: { type: Number },
    diastolic: { type: Number },
    // Blood sugar
    sugarLevel: { type: Number }, // mg/dL
    sugarContext: { type: String, enum: ["fasting", "post-meal", "random"] },
    recordedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vital", vitalSchema);
