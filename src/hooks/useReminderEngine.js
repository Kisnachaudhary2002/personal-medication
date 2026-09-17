import { useEffect, useRef, useState } from "react";

/**
 * Client-side medication reminder engine.
 *
 * While the tab is open, checks every 2s whether the current device time
 * has reached (or passed, within a small buffer) any medication's saved
 * reminder time that hasn't already fired today. On a match it:
 *   1. Requests/uses Notification permission to show a native browser popup
 *   2. Pushes an in-app alert into state (for the ReminderToast component),
 *      which works even if the user has denied notification permission.
 *
 * Only fires while this hook is mounted (i.e. the app is open) — it does
 * NOT work if the tab/browser is closed, by design (see README).
 */
const CHECK_INTERVAL_MS = 2000;
const BUFFER_MINUTES = 2; // catch reminders even if a tick was throttled/missed

export default function useReminderEngine(medications) {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const notifiedRef = useRef({}); // { "medId-time-date": true }

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!medications || medications.length === 0) return;

    const checkReminders = () => {
      const now = new Date();
      const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      medications.forEach((med) => {
        if (!med.isActive) return;

        med.reminderTimes.forEach((slot) => {
          const key = `${med._id}-${slot.time}-${today}`;
          if (notifiedRef.current[key] || slot.lastNotifiedDate === today) return;

          const [h, m] = slot.time.split(":").map(Number);
          const slotMinutes = h * 60 + m;
          const diff = nowMinutes - slotMinutes;

          // Fires once the clock reaches the reminder time, within a small
          // trailing buffer window so a throttled/missed tick doesn't skip it
          if (diff >= 0 && diff <= BUFFER_MINUTES) {
            notifiedRef.current[key] = true;

            const alert = {
              id: key,
              medicationId: med._id,
              name: med.name,
              dosage: med.dosage,
              time: slot.time,
            };

            setActiveAlerts((prev) => [...prev, alert]);

            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Medication Reminder", {
                body: `Time to take ${med.name} - ${med.dosage} (${slot.time})`,
                icon: "/pill-icon.png",
              });
            }
          }
        });
      });
    };

    checkReminders(); // run once immediately on mount/med change
    const interval = setInterval(checkReminders, CHECK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [medications]);

  const dismissAlert = (alertId) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  return { activeAlerts, dismissAlert };
}
