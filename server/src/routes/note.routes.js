const express = require("express");
const { getNotes, addNote, updateNote, deleteNote } = require("../controller/note.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getNotes).post(addNote);
router.route("/:id").put(updateNote).delete(deleteNote);

module.exports = router;
