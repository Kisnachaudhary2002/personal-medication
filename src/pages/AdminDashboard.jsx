import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPatients } from "../api/admin.api";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/RoleBadge";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");

  const refresh = (q) => getPatients(q).then((res) => setPatients(res.data.patients));
  useEffect(() => { refresh(""); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    refresh(search);
  };

  return (
    <div className="page-container">
      <RoleBadge role={user?.role} />
      <h1 className="page-title">Patients</h1>
      <p className="page-subtitle">Search and open a patient's record for monitoring.</p>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 10, marginBottom: 24, maxWidth: 420 }}>
        <input
          className="form-group"
          style={{ flex: 1, padding: "11px 14px", border: "1px solid var(--line)", borderRadius: "var(--radius-sm)" }}
          placeholder="Search patient by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-primary-sm" type="submit">Search</button>
      </form>

      <table className="data-table">
        <thead>
          <tr><th>Name</th><th>Email</th><th>Age</th><th>Gender</th><th></th></tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>
              <td>{p.age || "—"}</td>
              <td style={{ textTransform: "capitalize" }}>{p.gender || "—"}</td>
              <td><Link to={`/admin/patients/${p._id}`} className="btn-primary-sm">View record</Link></td>
            </tr>
          ))}
          {patients.length === 0 && (
            <tr><td colSpan={5} style={{ color: "var(--muted)", textAlign: "center" }}>No patients found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
