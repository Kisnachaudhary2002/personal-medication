import React, { useEffect, useState } from "react";
import { getVitals, addVital, deleteVital } from "../api/vital.api";

const Vitals = () => {
  const [records, setRecords] = useState([]);
  const [type, setType] = useState("blood_pressure");
  const [form, setForm] = useState({ systolic: "", diastolic: "", sugarLevel: "", sugarContext: "fasting" });
  const [error, setError] = useState("");

  const refresh = () => getVitals().then((res) => setRecords(res.data.vitals));
  useEffect(() => { refresh(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addVital({ type, ...form });
      setForm({ systolic: "", diastolic: "", sugarLevel: "", sugarContext: "fasting" });
      refresh();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async (id) => { await deleteVital(id); refresh(); };

  return (
    <div className="page-container">
      <h1 className="page-title">Vitals</h1>
      <p className="page-subtitle">Log blood pressure and blood sugar readings.</p>

      <form className="card form-grid" onSubmit={handleSubmit} style={{ marginBottom: 36, maxWidth: 560 }}>
        {error && <div className="form-error">{error}</div>}
        <div className="form-group">
          <label>Reading type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="blood_pressure">Blood Pressure</option>
            <option value="blood_sugar">Blood Sugar</option>
          </select>
        </div>

        {type === "blood_pressure" ? (
          <>
            <div className="form-group">
              <label>Systolic (mmHg)</label>
              <input type="number" min="1" max ="500" name="systolic" value={form.systolic} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Diastolic (mmHg)</label>
              <input type="number" min="1" max ="500" name="diastolic" value={form.diastolic} onChange={handleChange} required />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Sugar level (mg/dL)</label>
              <input type="number" min="1" max ="999" name="sugarLevel" value={form.sugarLevel} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Context</label>
              <select name="sugarContext" value={form.sugarContext} onChange={handleChange}>
                <option value="fasting">Fasting</option>
                <option value="post-meal">Post-meal</option>
                <option value="random">Random</option>
              </select>
            </div>
          </>
        )}

        <button className="btn-primary" type="submit">Save reading</button>
      </form>

      <table className="data-table">
        <thead><tr><th>Type</th><th>Value</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id}>
              <td style={{ textTransform: "capitalize" }}>{r.type.replace("_", " ")}</td>
              <td>
                {r.type === "blood_pressure" && `${r.systolic}/${r.diastolic} mmHg`}
                {r.type === "blood_sugar" && `${r.sugarLevel} mg/dL (${r.sugarContext})`}
              </td>
              <td>{new Date(r.recordedAt).toLocaleDateString()}</td>
              <td><button className="btn-danger" onClick={() => handleDelete(r._id)}>Delete</button></td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr><td colSpan={4} style={{ color: "var(--muted)", textAlign: "center" }}>No readings yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Vitals;
