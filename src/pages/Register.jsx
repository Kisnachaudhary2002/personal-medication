import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PasswordInput from "../components/PasswordInput";

const emptyForm = {
  name: "", email: "", password: "", role: "patient", age: "", gender: "male", phone: "",
};

const GMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
const PHONE_REGEX = /^\d{10}$/;

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Only digits, capped at 10 characters, so the field can't even accept a bad value
  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
    setForm({ ...form, phone: digitsOnly });
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!GMAIL_REGEX.test(form.email)) return "Email must be a valid @gmail.com address";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (!form.age || Number(form.age) <= 0) return "Age is required";
    if (!form.gender) return "Gender is required";
    if (!PHONE_REGEX.test(form.phone)) return "Phone number must be exactly 10 digits";
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
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 480 }}>
      <h1 className="page-title">Create your account</h1>
      <p className="page-subtitle">Set up your personal health tracker in under a minute.</p>

      <form className="card form-grid" onSubmit={handleSubmit}>
        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label>Full name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>

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
          <PasswordInput name="password" value={form.password} onChange={handleChange} minLength={6} required />
        </div>

        <div className="form-group">
          <label>I am registering as</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </div>

        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" min="1" max="120" value={form.age} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange} required>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Phone number</label>
          <input
            type="tel"
            name="phone"
            placeholder="10-digit number"
            value={form.phone}
            onChange={handlePhoneChange}
            required
          />
        </div>

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)" }}>
          Already have an account? <Link to="/login" style={{ color: "var(--teal)", fontWeight: 600 }}>Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
