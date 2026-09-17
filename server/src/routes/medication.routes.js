const express = require("express");
const {
  getMedications,
  addMedication,
  updateMedication,
  deleteMedication,
  logDose,
} = require("../controller/medication.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect); // every route below requires login

router.route("/").get(getMedications).post(addMedication);
router.route("/:id").put(updateMedication).delete(deleteMedication);
router.post("/:id/log-dose", logDose);

module.exports = router;
