import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        Personal<span>Medication</span>
      </Link>

      <nav className="navbar-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/medications">Medications</Link>
            <Link to="/vitals">Vitals</Link>
            <Link to="/notes">Notes</Link>
            <Link to="/vaccinations">Vaccinations</Link>
            {(user.role === "doctor" || user.role === "admin") && (
              <Link to="/admin">Patients</Link>
            )}
            <span className="navbar-user">Hi, {user.name.split(" ")[0]}</span>
            <button className="btn-ghost" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary-sm">
              Get Started
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
