import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ReminderToast from "./components/ReminderToast";
import ProtectedRoute from "./components/ProtectedRoute";
import useReminderEngine from "./hooks/useReminderEngine";
import { useAuth } from "./context/AuthContext";
import { getMedications } from "./api/medication.api";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Medications from "./pages/Medications";
import Vitals from "./pages/Vitals";
import Notes from "./pages/Notes";
import Vaccinations from "./pages/Vaccinations";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDetail from "./pages/PatientDetail";

function App() {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);

  // Keep medications loaded at the App level so reminders keep checking
  // no matter which page the user is currently on.
  useEffect(() => {
    if (!user || user.role !== "patient") return;
    getMedications()
      .then((res) => setMedications(res.data.medications))
      .catch(() => {});
  }, [user]);

  const { activeAlerts, dismissAlert } = useReminderEngine(medications);

  return (
    <div className="app-shell">
      <Navbar />
      <ReminderToast alerts={activeAlerts} onDismiss={dismissAlert} />

      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard medications={medications} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medications"
            element={
              <ProtectedRoute>
                <Medications medications={medications} setMedications={setMedications} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vitals"
            element={
              <ProtectedRoute>
                <Vitals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vaccinations"
            element={
              <ProtectedRoute>
                <Vaccinations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["doctor", "admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/:id"
            element={
              <ProtectedRoute roles={["doctor", "admin"]}>
                <PatientDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
