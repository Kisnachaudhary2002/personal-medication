import React, { useEffect, useState } from "react";
import { getVaccinations, addVaccination, deleteVaccination } from "../api/vaccination.api";

const emptyForm = { vaccineName: "", doseNumber: 1, dateGiven: "", nextDueDate: "", location: "", notes: "" };

const Vaccinations = () => {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const refresh = () => getVaccinations().then((res) => setRecords(res.data.records));
  useEffect(() => { refresh(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addVaccination(form);
      setForm(emptyForm);
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => { await deleteVaccination(id); refresh(); };

  return (
    <div className="page-container">
      <h1 className="page-title">Vaccination Records</h1>
      <p className="page-subtitle">Keep track of every dose and when the next one is due.</p>

      <form className="card form-grid" onSubmit={handleSubmit} style={{ marginBottom: 36, maxWidth: 560 }}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>Vaccine name</label>
          <input name="vaccineName" value={form.vaccineName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Dose number</label>
          <input type="number" min="1" name="doseNumber" value={form.doseNumber} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Date given</label>
          <input type="date" name="dateGiven" value={form.dateGiven} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Next due date (optional)</label>
          <input type="date" name="nextDueDate" value={form.nextDueDate} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input name="location" value={form.location} onChange={handleChange} />
        </div>
        <button className="btn-primary" type="submit">Save vaccination</button>
      </form>

      <table className="data-table">
        <thead>
          <tr><th>Vaccine</th><th>Dose</th><th>Given</th><th>Next due</th><th></th></tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td>{r.vaccineName}</td>
              <td>{r.doseNumber}</td>
              <td>{new Date(r.dateGiven).toLocaleDateString()}</td>
              <td>{r.nextDueDate ? new Date(r.nextDueDate).toLocaleDateString() : "—"}</td>
              <td><button className="btn-danger" onClick={() => handleDelete(r._id)}>Delete</button></td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={5} style={{ color: "var(--muted)", textAlign: "center" }}>No vaccination records yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vaccinations;
