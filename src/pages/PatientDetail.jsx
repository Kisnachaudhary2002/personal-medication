import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientDetail } from "../api/admin.api";

const PatientDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => { getPatientDetail(id).then((res) => setData(res.data)); }, [id]);

  if (!data) return <div className="page-loading">Loading patient record...</div>;

  const { patient, medications, vitals, notes, vaccinations, stats } = data;

  return (
    <div className="page-container">
      <h1 className="page-title">{patient.name}</h1>
      <p className="page-subtitle">{patient.email} · {patient.age || "—"} yrs · {patient.gender || "—"}</p>

      <div className="stat-row">
        <div className="stat-pill">
          <div className="stat-value">{stats.adherenceRate !== null ? `${stats.adherenceRate}%` : "—"}</div>
          <div className="stat-label">Medication adherence</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{stats.taken}</div>
          <div className="stat-label">Doses taken (logged)</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{stats.missed}</div>
          <div className="stat-label">Doses missed (logged)</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>Medications</h3>
        {medications.length === 0 ? <p style={{ color: "var(--muted)" }}>None recorded.</p> : (
          <div className="med-grid">
            {medications.map((m) => (
              <div key={m._id} className="med-card">
                <h3 style={{ marginTop: 0 }}>{m.name}</h3>
                <p className="med-dosage">{m.dosage} · {m.frequency.replace("-", " ")}</p>
                <div className="med-times">
                  {m.reminderTimes.map((t) => <span key={t.time} className="time-chip">{t.time}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>Vitals</h3>
        <table className="data-table">
          <thead><tr><th>Type</th><th>Value</th><th>Date</th></tr></thead>
          <tbody>
            {vitals.map((r) => (
              <tr key={r._id}>
                <td style={{ textTransform: "capitalize" }}>{r.type.replace("_", " ")}</td>
                <td>
                  {r.type === "blood_pressure" && `${r.systolic}/${r.diastolic} mmHg`}
                  {r.type === "blood_sugar" && `${r.sugarLevel} mg/dL (${r.sugarContext})`}
                </td>
                <td>{new Date(r.recordedAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {vitals.length === 0 && (
              <tr><td colSpan={3} style={{ color: "var(--muted)", textAlign: "center" }}>None recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ marginTop: 0 }}>Personal notes</h3>
        {notes.length === 0 ? <p style={{ color: "var(--muted)" }}>None recorded.</p> : (
          <div className="med-grid">
            {notes.map((n) => (
              <div key={n._id} className="med-card">
                {n.title && <h3 style={{ marginTop: 0 }}>{n.title}</h3>}
                <p style={{ fontSize: "0.9rem" }}>{n.content}</p>
                <p style={{ color: "var(--muted)", fontSize: "0.78rem" }}>{new Date(n.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Vaccinations</h3>
        <table className="data-table">
          <thead><tr><th>Vaccine</th><th>Dose</th><th>Given</th><th>Next due</th></tr></thead>
          <tbody>
            {vaccinations.map((v) => (
              <tr key={v._id}>
                <td>{v.vaccineName}</td>
                <td>{v.doseNumber}</td>
                <td>{new Date(v.dateGiven).toLocaleDateString()}</td>
                <td>{v.nextDueDate ? new Date(v.nextDueDate).toLocaleDateString() : "—"}</td>
              </tr>
            ))}
            {vaccinations.length === 0 && (
              <tr><td colSpan={4} style={{ color: "var(--muted)", textAlign: "center" }}>None recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientDetail;
