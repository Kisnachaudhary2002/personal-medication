const mongoose = require("mongoose");

const vaccinationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vaccineName: { type: String, required: true },
    doseNumber: { type: Number, default: 1 },
    dateGiven: { type: Date, required: true },
    nextDueDate: { type: Date },
    location: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vaccination", vaccinationSchema);
