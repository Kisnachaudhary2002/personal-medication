import React, { useEffect, useState } from "react";
import MedicationCard from "../components/MedicationCard";
import {
  getMedications, addMedication, updateMedication, deleteMedication,
} from "../api/medication.api";

const emptyForm = { name: "", dosage: "", frequency: "once-daily", reminderTimes: [], notes: "" };

const Medications = ({ medications, setMedications }) => {
  const [form, setForm] = useState(emptyForm);
  const [timeInput, setTimeInput] = useState("08:00");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const refresh = () => getMedications().then((res) => setMedications(res.data.medications));

  useEffect(() => { refresh(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addTime = () => {
    if (!timeInput) return;
    if (form.reminderTimes.includes(timeInput)) return;
    setForm({ ...form, reminderTimes: [...form.reminderTimes, timeInput].sort() });
  };

  const removeTime = (t) => setForm({ ...form, reminderTimes: form.reminderTimes.filter((x) => x !== t) });

  const handleEdit = (med) => {
    setEditingId(med._id);
    setForm({
      name: med.name,
      dosage: med.dosage,
      frequency: med.frequency,
      reminderTimes: med.reminderTimes.map((r) => r.time),
      notes: med.notes || "",
    });
  };

  const resetForm = () => { setForm(emptyForm); setEditingId(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.reminderTimes.length === 0) {
      setError("Add at least one reminder time (e.g. 08:00 or 21:00).");
      return;
    }
    try {
      if (editingId) {
        await updateMedication(editingId, form);
      } else {
        await addMedication(form);
      }
      resetForm();
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medication?")) return;
    await deleteMedication(id);
    refresh();
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Medications</h1>
      <p className="page-subtitle">Add each medicine with the times you need reminders (e.g. 8:00 AM, 9:00 PM).</p>

      <form className="card form-grid" onSubmit={handleSubmit} style={{ marginBottom: 36, maxWidth: 560 }}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>Medicine name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Dosage</label>
          <input name="dosage" placeholder="e.g. 500mg" value={form.dosage} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Frequency</label>
          <select name="frequency" value={form.frequency} onChange={handleChange}>
            <option value="once-daily">Once daily</option>
            <option value="twice-daily">Twice daily</option>
            <option value="thrice-daily">Thrice daily</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="form-group">
          <label>Reminder times</label>
          <div className="time-input-row">
            <input type="time" value={timeInput} onChange={(e) => setTimeInput(e.target.value)} style={{ maxWidth: 140 }} />
            <button type="button" className="btn-secondary" onClick={addTime}>+ Add time</button>
          </div>
          <div className="time-input-row" style={{ marginTop: 8 }}>
            {form.reminderTimes.map((t) => (
              <span key={t} className="time-chip">
                {t}
                <button type="button" onClick={() => removeTime(t)}>×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label>Notes (optional)</label>
          <textarea name="notes" rows={2} value={form.notes} onChange={handleChange} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-primary" type="submit">{editingId ? "Update medication" : "Add medication"}</button>
          {editingId && <button type="button" className="btn-ghost" onClick={resetForm}>Cancel</button>}
        </div>
      </form>

      <div className="med-grid">
        {medications.map((med) => (
          <MedicationCard key={med._id} medication={med} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

export default Medications;
