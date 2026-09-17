const User = require("../models/User");
const Medication = require("../models/Medication");
const Vital = require("../models/Vital");
const Note = require("../models/Note");
const Vaccination = require("../models/Vaccination");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/admin/patients
// Doctor/Admin: list & search patients
const getPatients = asyncHandler(async (req, res) => {
  const search = req.query.search || "";
  const filter = {
    role: "patient",
    ...(search && { name: { $regex: search, $options: "i" } }),
  };
  const patients = await User.find(filter).select("-password").sort({ name: 1 });
  res.status(200).json({ success: true, count: patients.length, patients });
});

// @route GET /api/admin/patients/:id
// Doctor/Admin: full record of one patient — medications, health data, vaccinations
const getPatientDetail = asyncHandler(async (req, res) => {
  const patient = await User.findById(req.params.id).select("-password");
  if (!patient || patient.role !== "patient") {
    res.statusCode = 404;
    throw new Error("Patient not found");
  }

  const [medications, vitals, notes, vaccinations] = await Promise.all([
    Medication.find({ user: patient._id }).sort({ createdAt: -1 }),
    Vital.find({ user: patient._id }).sort({ recordedAt: -1 }),
    Note.find({ user: patient._id }).sort({ createdAt: -1 }),
    Vaccination.find({ user: patient._id }).sort({ dateGiven: -1 }),
  ]);

  // Simple adherence stat: taken vs missed dose logs across all medications
  const allLogs = medications.flatMap((m) => m.doseLogs);
  const taken = allLogs.filter((l) => l.status === "taken").length;
  const missed = allLogs.filter((l) => l.status === "missed").length;
  const adherenceRate = allLogs.length ? Math.round((taken / allLogs.length) * 100) : null;

  res.status(200).json({
    success: true,
    patient,
    medications,
    vitals,
    notes,
    vaccinations,
    stats: { taken, missed, adherenceRate },
  });
});

module.exports = { getPatients, getPatientDetail };
