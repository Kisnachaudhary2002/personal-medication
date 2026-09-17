import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getVitals } from "../api/vital.api";
import { getVaccinations } from "../api/vaccination.api";
import RoleBadge from "../components/RoleBadge";

const Dashboard = ({ medications }) => {
  const { user } = useAuth();
  const [recentBP, setRecentBP] = useState(null);
  const [recentSugar, setRecentSugar] = useState(null);
  const [nextVaccine, setNextVaccine] = useState(null);

  useEffect(() => {
    getVitals("blood_pressure").then((res) => setRecentBP(res.data.vitals[0])).catch(() => {});
    getVitals("blood_sugar").then((res) => setRecentSugar(res.data.vitals[0])).catch(() => {});
    getVaccinations().then((res) => {
      const upcoming = res.data.records.find((v) => v.nextDueDate && new Date(v.nextDueDate) > new Date());
      setNextVaccine(upcoming);
    }).catch(() => {});
  }, []);

  const activeMeds = medications.filter((m) => m.isActive);
  const todaysReminders = activeMeds.flatMap((m) => m.reminderTimes.map((r) => ({ med: m.name, time: r.time })))
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="page-container">
      <RoleBadge role={user?.role} />
      <h1 className="page-title">Welcome, {user?.name?.split(" ")[0]}</h1>
      <p className="page-subtitle">Here's a snapshot of your health today.</p>

      <div className="stat-row">
        <div className="stat-pill">
          <div className="stat-value">{activeMeds.length}</div>
          <div className="stat-label">Active medications</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{recentBP ? `${recentBP.systolic}/${recentBP.diastolic}` : "—"}</div>
          <div className="stat-label">Last blood pressure</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{recentSugar ? `${recentSugar.sugarLevel}` : "—"}</div>
          <div className="stat-label">Last blood sugar (mg/dL)</div>
        </div>
        <div className="stat-pill">
          <div className="stat-value">{nextVaccine ? new Date(nextVaccine.nextDueDate).toLocaleDateString() : "—"}</div>
          <div className="stat-label">Next vaccination due</div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 10 }}>
        <h3 style={{ marginTop: 0 }}>Today's reminder schedule</h3>
        {todaysReminders.length === 0 ? (
          <p style={{ color: "var(--muted)" }}>
            No medications added yet. <Link to="/medications" style={{ color: "var(--teal)", fontWeight: 600 }}>Add your first one</Link>.
          </p>
        ) : (
          <div className="med-times">
            {todaysReminders.map((r, i) => (
              <span key={i} className="time-chip">{r.time} · {r.med}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
