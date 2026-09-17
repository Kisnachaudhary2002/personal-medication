import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

// Mock schedule purely for the hero's illustrative dose-timeline widget
const demoDoses = [
  { time: "08:00", percent: 15, status: "taken" },
  { time: "13:00", percent: 48, status: "taken" },
  { time: "20:00", percent: 82, status: "next" },
];

const LandingPage = () => {
  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="hero">
        <div>
          <span className="hero-eyebrow">Personal Medication</span>
          <h1>
            Never miss a dose. <em>Never lose a record.</em>
          </h1>
          <p className="lede">
            Track medications, get reminded exactly when to take them, and
            log blood pressure, blood sugar, and vaccinations in one secure
            place — with your doctor able to check in whenever needed.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary">Get Started Free</Link>
            <Link to="/login" className="btn-secondary">I already have an account</Link>
          </div>
          <div className="hero-trust">
            <span><strong>0</strong> paper records lost</span>
            <span><strong>24/7</strong> access to your history</span>
            <span><strong>1</strong> place for you & your doctor</span>
          </div>
        </div>

        <div className="dose-timeline-widget">
          <div className="dtw-header">
            <h4>Today's schedule</h4>
            <span>Metformin · 500mg</span>
          </div>
          <div className="dtw-track">
            <div className="dtw-now-line" style={{ left: "60%" }} />
            {demoDoses.map((d) => (
              <div key={d.time} className={`dtw-dose ${d.status}`} style={{ left: `${d.percent}%` }}>
                <span className="pill">{d.status === "taken" ? "✓" : "!"}</span>
                <span className="dtw-time">{d.time}</span>
              </div>
            ))}
          </div>
          <div className="dtw-alert">
            <span className="dot" />
            Next reminder fires automatically at 20:00 — even if you forget.
          </div>
        </div>
      </section>

      {/* ===== Features ===== */}
      <section className="section">
        <div className="section-head">
          <span className="section-eyebrow">What it does</span>
          <h2>Everything your medication routine needs, in one place</h2>
          <p>Built around the two things people actually forget: taking the dose, and keeping the record.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon">⏰</div>
            <h3>Timely reminders</h3>
            <p>Set one or more times per medicine — the app alerts you the moment it's due, right in your browser.</p>
          </div>
          <div className="feature-card">
            <div className="icon">📈</div>
            <h3>Health tracking</h3>
            <p>Log blood pressure and blood sugar readings over time and spot trends before they become problems.</p>
          </div>
          <div className="feature-card">
            <div className="icon">💉</div>
            <h3>Vaccination records</h3>
            <p>Keep dose dates, locations, and next-due reminders together instead of scattered across paper cards.</p>
          </div>
        </div>
      </section>

      {/* ===== How it works — genuine 3-step sequence ===== */}
      <section className="section">
        <div className="section-head">
          <span className="section-eyebrow">How it works</span>
          <h2>From prescription to peace of mind</h2>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h4>Add your medicine</h4>
            <p>Enter the name, dosage, and the times you need to take it — once, twice, or as many times a day as prescribed.</p>
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h4>Get reminded on time</h4>
            <p>When 8:00am or 9:00pm hits, an alert pops up so you can mark the dose taken in one tap.</p>
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h4>Track and share progress</h4>
            <p>Your history builds automatically — readings, doses, vaccinations — ready for your next doctor visit.</p>
          </div>
        </div>
      </section>

      {/* ===== Doctor/Admin callout ===== */}
      <div className="doctor-panel">
        <div>
          <h2>Built for doctors too</h2>
          <p>A dedicated dashboard lets healthcare providers monitor patients without waiting for the next appointment.</p>
          <ul>
            <li>Search and open any patient's full record instantly</li>
            <li>Review medication adherence and dose history</li>
            <li>See blood pressure, blood sugar, and vaccination trends at a glance</li>
          </ul>
        </div>
        <div className="stat-row" style={{ margin: 0 }}>
          <div className="stat-pill" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
            <div className="stat-value" style={{ color: "#fff" }}>92%</div>
            <div className="stat-label" style={{ color: "#C9DED9" }}>Avg. adherence rate*</div>
          </div>
          <div className="stat-pill" style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.15)" }}>
            <div className="stat-value" style={{ color: "#fff" }}>3</div>
            <div className="stat-label" style={{ color: "#C9DED9" }}>Record types tracked</div>
          </div>
        </div>
      </div>

      {/* ===== Final CTA ===== */}
      <section className="cta-band">
        <h2>Start tracking your health today</h2>
        <p>It takes less than two minutes to add your first medication.</p>
        <Link to="/register" className="btn-primary">Create your free account</Link>
      </section>
    </div>
  );
};

export default LandingPage;
