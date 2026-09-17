const Medication = require("../models/Medication");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/medications
const getMedications = asyncHandler(async (req, res) => {
  const medications = await Medication.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: medications.length, medications });
});

// @route POST /api/medications
const addMedication = asyncHandler(async (req, res) => {
  const { name, dosage, frequency, reminderTimes, startDate, endDate, notes } = req.body;

  if (!name || !dosage || !reminderTimes || reminderTimes.length === 0) {
    res.statusCode = 400;
    throw new Error("Name, dosage and at least one reminder time are required");
  }

  const medication = await Medication.create({
    user: req.user._id,
    name,
    dosage,
    frequency,
    reminderTimes: reminderTimes.map((time) => ({ time, lastNotifiedDate: null })),
    startDate,
    endDate,
    notes,
  });

  res.status(201).json({ success: true, medication });
});

// @route PUT /api/medications/:id
const updateMedication = asyncHandler(async (req, res) => {
  let medication = await Medication.findById(req.params.id);

  if (!medication) {
    res.statusCode = 404;
    throw new Error("Medication not found");
  }
  if (medication.user.toString() !== req.user._id.toString()) {
    res.statusCode = 403;
    throw new Error("Not authorized to update this medication");
  }

  const { name, dosage, frequency, reminderTimes, startDate, endDate, notes, isActive } = req.body;

  if (name !== undefined) medication.name = name;
  if (dosage !== undefined) medication.dosage = dosage;
  if (frequency !== undefined) medication.frequency = frequency;
  if (reminderTimes !== undefined) {
    medication.reminderTimes = reminderTimes.map((time) => ({ time, lastNotifiedDate: null }));
  }
  if (startDate !== undefined) medication.startDate = startDate;
  if (endDate !== undefined) medication.endDate = endDate;
  if (notes !== undefined) medication.notes = notes;
  if (isActive !== undefined) medication.isActive = isActive;

  await medication.save();
  res.status(200).json({ success: true, medication });
});

// @route DELETE /api/medications/:id
const deleteMedication = asyncHandler(async (req, res) => {
  const medication = await Medication.findById(req.params.id);

  if (!medication) {
    res.statusCode = 404;
    throw new Error("Medication not found");
  }
  if (medication.user.toString() !== req.user._id.toString()) {
    res.statusCode = 403;
    throw new Error("Not authorized to delete this medication");
  }

  await medication.deleteOne();
  res.status(200).json({ success: true, message: "Medication deleted" });
});

// @route POST /api/medications/:id/log-dose
// Marks a specific reminder slot as taken/missed for today (used by the reminder alert's
// "Mark as Taken" button and for the health-trend / adherence stats)
const logDose = asyncHandler(async (req, res) => {
  const { time, status, date } = req.body; // time: "08:00", status: "taken"|"missed"

  const medication = await Medication.findById(req.params.id);
  if (!medication) {
    res.statusCode = 404;
    throw new Error("Medication not found");
  }
  if (medication.user.toString() !== req.user._id.toString()) {
    res.statusCode = 403;
    throw new Error("Not authorized");
  }

  const today = date || new Date().toISOString().slice(0, 10);

  medication.doseLogs.push({ date: today, time, status: status || "taken" });

  // Mark this slot as already notified today so the reminder engine won't re-alert
  const slot = medication.reminderTimes.find((r) => r.time === time);
  if (slot) slot.lastNotifiedDate = today;

  await medication.save();
  res.status(200).json({ success: true, medication });
});

module.exports = { getMedications, addMedication, updateMedication, deleteMedication, logDose };
