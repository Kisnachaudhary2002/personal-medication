const mongoose = require("mongoose");

// Personal medical notes - separate from structured vital readings
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String },
    content: { type: String, required: [true, "Note content is required"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
