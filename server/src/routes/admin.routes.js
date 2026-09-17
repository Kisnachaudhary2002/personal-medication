const express = require("express");
const { getPatients, getPatientDetail } = require("../controller/admin.controller");
const { protect, authorizeRoles } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect, authorizeRoles("doctor", "admin"));

router.get("/patients", getPatients);
router.get("/patients/:id", getPatientDetail);

module.exports = router;
