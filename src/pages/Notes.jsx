import React, { useEffect, useState } from "react";
import { getNotes, addNote, deleteNote } from "../api/note.api";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  const refresh = () => getNotes().then((res) => setNotes(res.data.notes));
  useEffect(() => { refresh(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addNote(form);
      setForm({ title: "", content: "" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => { await deleteNote(id); refresh(); };

  return (
    <div className="page-container">
      <h1 className="page-title">Personal Notes</h1>
      <p className="page-subtitle">Keep freeform medical notes — symptoms, doctor instructions, anything worth remembering.</p>

      <form className="card form-grid" onSubmit={handleSubmit} style={{ marginBottom: 36, maxWidth: 560 }}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>Title (optional)</label>
          <input name="title" value={form.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Note</label>
          <textarea name="content" rows={4} value={form.content} onChange={handleChange} required />
        </div>
        <button className="btn-primary" type="submit">Save note</button>
      </form>

      <div className="med-grid">
        {notes.map((n) => (
          <div key={n._id} className="med-card">
            {n.title && <h3 style={{ marginTop: 0 }}>{n.title}</h3>}
            <p style={{ color: "var(--ink)", fontSize: "0.92rem" }}>{n.content}</p>
            <p style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{new Date(n.createdAt).toLocaleDateString()}</p>
            <div className="med-card-actions">
              <button className="btn-danger" onClick={() => handleDelete(n._id)}>Delete</button>
            </div>
          </div>
        ))}
        {notes.length === 0 && <p style={{ color: "var(--muted)" }}>No notes yet.</p>}
      </div>
    </div>
  );
};

export default Notes;
