const express = require("express");
const {
  getVaccinations,
  addVaccination,
  deleteVaccination,
} = require("../controller/vaccination.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getVaccinations).post(addVaccination);
router.delete("/:id", deleteVaccination);

module.exports = router;
