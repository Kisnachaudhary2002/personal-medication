import React from "react";

// Small fixed-position label in the corner of a dashboard showing the
// logged-in user's role, e.g. "Patient" or "Doctor".
const RoleBadge = ({ role }) => {
  const label = role === "doctor" ? "Doctor" : role === "admin" ? "Admin" : "Patient";
  return <div className="role-badge">{label}</div>;
};

export default RoleBadge;
