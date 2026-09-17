const Vaccination = require("../models/Vaccination");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/vaccinations
const getVaccinations = asyncHandler(async (req, res) => {
  const records = await Vaccination.find({ user: req.user._id }).sort({ dateGiven: -1 });
  res.status(200).json({ success: true, count: records.length, records });
});

// @route POST /api/vaccinations
const addVaccination = asyncHandler(async (req, res) => {
  const { vaccineName, doseNumber, dateGiven, nextDueDate, location, notes } = req.body;

  if (!vaccineName || !dateGiven) {
    res.statusCode = 400;
    throw new Error("Vaccine name and date given are required");
  }

  const record = await Vaccination.create({
    user: req.user._id,
    vaccineName,
    doseNumber,
    dateGiven,
    nextDueDate,
    location,
    notes,
  });

  res.status(201).json({ success: true, record });
});

// @route DELETE /api/vaccinations/:id
const deleteVaccination = asyncHandler(async (req, res) => {
  const record = await Vaccination.findById(req.params.id);
  if (!record) {
    res.statusCode = 404;
    throw new Error("Vaccination record not found");
  }
  if (record.user.toString() !== req.user._id.toString()) {
    res.statusCode = 403;
    throw new Error("Not authorized to delete this record");
  }
  await record.deleteOne();
  res.status(200).json({ success: true, message: "Vaccination record deleted" });
});

module.exports = { getVaccinations, addVaccination, deleteVaccination };
