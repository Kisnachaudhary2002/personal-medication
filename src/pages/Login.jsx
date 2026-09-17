import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("patient");
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(form.email)) {
      return "Email must be a valid @gmail.com address";
    }
    if (!form.password) return "Password is required";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password, role);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 480 }}>
      <h1 className="page-title">Welcome back</h1>
      <p className="page-subtitle">Log in to manage your medications and health records.</p>

      <form className="card form-grid" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Log in as</label>
          <div className="role-tabs">
            <button
              type="button"
              className={`role-tab ${role === "patient" ? "active" : ""}`}
              onClick={() => setRole("patient")}
            >
              Patient
            </button>
            <button
              type="button"
              className={`role-tab ${role === "doctor" ? "active" : ""}`}
              onClick={() => setRole("doctor")}
            >
              Doctor
            </button>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="you@gmail.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <PasswordInput name="password" value={form.password} onChange={handleChange} required />
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Logging in..." : `Log In as ${role === "doctor" ? "Doctor" : "Patient"}`}
        </button>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
          No account yet? <Link to="/register" style={{ color: "var(--teal)", fontWeight: 600 }}>Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
