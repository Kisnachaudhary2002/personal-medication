const Note = require("../models/Note");
const asyncHandler = require("../utils/asyncHandler");

// @route GET /api/notes
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: notes.length, notes });
});

// @route POST /api/notes
const addNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!content) {
    res.statusCode = 400;
    throw new Error("Note content is required");
  }

  const note = await Note.create({ user: req.user._id, title, content });
  res.status(201).json({ success: true, note });
});

// @route PUT /api/notes/:id
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }
  if (note.user.toString() !== req.user._id.toString()) {
    res.statusCode = 403;
    throw new Error("Not authorized to update this note");
  }

  const { title, content } = req.body;
  if (title !== undefined) note.title = title;
  if (content !== undefined) note.content = content;

  await note.save();
  res.status(200).json({ success: true, note });
});

// @route DELETE /api/notes/:id
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    res.statusCode = 404;
    throw new Error("Note not found");
  }
  if (note.user.toString() !== req.user._id.toString()) {
    res.statusCode = 403;
    throw new Error("Not authorized to delete this note");
  }
  await note.deleteOne();
  res.status(200).json({ success: true, message: "Note deleted" });
});

module.exports = { getNotes, addNote, updateNote, deleteNote };
