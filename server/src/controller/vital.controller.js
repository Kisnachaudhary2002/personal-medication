const Vital = require("../models/Vital");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/vitals?type=blood_pressure
const getVitals = asyncHandler(async (req, res) => {
  const filter = { user: req.user._id };
  if (req.query.type) filter.type = req.query.type;

  const vitals = await Vital.find(filter).sort({ recordedAt: -1 });
  res.status(200).json({ success: true, count: vitals.length, vitals });
});

// @route POST /api/vitals
const addVital = asyncHandler(async (req, res) => {
  const { type, systolic, diastolic, sugarLevel, sugarContext, recordedAt } = req.body;

  if (!type) {
    res.statusCode = 400;
    throw new Error("Vital type is required (blood_pressure or blood_sugar)");
  }
  if (type === "blood_pressure" && (!systolic || !diastolic)) {
    res.statusCode = 400;
    throw new Error("Systolic and diastolic values are required for blood pressure");
  }
  if (type === "blood_sugar" && !sugarLevel) {
    res.statusCode = 400;
    throw new Error("Sugar level is required for blood sugar readings");
  }

  const vital = await Vital.create({
    user: req.user._id,
    type,
    systolic,
    diastolic,
    sugarLevel,
    sugarContext,
    recordedAt: recordedAt || Date.now(),
  });

  res.status(201).json({ success: true, vital });
});

// @route DELETE /api/vitals/:id
const deleteVital = asyncHandler(async (req, res) => {
  const vital = await Vital.findById(req.params.id);
  if (!vital) {
    res.statusCode = 404;
    throw new Error("Vital record not found");
  }
  if (vital.user.toString() !== req.user._id.toString()) {
    res.statusCode = 403;
    throw new Error("Not authorized to delete this record");
  }
  await vital.deleteOne();
  res.status(200).json({ success: true, message: "Vital record deleted" });
});

module.exports = { getVitals, addVital, deleteVital };
