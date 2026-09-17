const express = require("express");
const { getVitals, addVital, deleteVital } = require("../controller/vital.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getVitals).post(addVital);
router.delete("/:id", deleteVital);

module.exports = router;
