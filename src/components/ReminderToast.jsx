import React from "react";
import { logDose } from "../api/medication.api";

// Renders active reminder popups pushed by useReminderEngine.
// Sits once near the top of the app (in App.jsx) so alerts show on any page.
const ReminderToast = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  const markTaken = async (alert) => {
    try {
      await logDose(alert.medicationId, { time: alert.time, status: "taken" });
    } catch (err) {
      console.error("Failed to log dose", err);
    } finally {
      onDismiss(alert.id);
    }
  };

  return (
    <div className="reminder-toast-stack">
      {alerts.map((alert) => (
        <div key={alert.id} className="reminder-toast">
          <div className="reminder-toast-icon">💊</div>
          <div className="reminder-toast-body">
            <strong>Time to take {alert.name}</strong>
            <p>
              {alert.dosage} · scheduled {alert.time}
            </p>
          </div>
          <div className="reminder-toast-actions">
            <button className="btn-primary-sm" onClick={() => markTaken(alert)}>
              Mark as Taken
            </button>
            <button className="btn-ghost" onClick={() => onDismiss(alert.id)}>
              Dismiss
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReminderToast;
