# Personal Medication - A Health Tracker System

MERN stack web app for managing medication schedules, reminders, blood
pressure / blood sugar tracking, vaccination records, and a Doctor/Admin
dashboard for patient monitoring. Built for BCA 4th Semester project
(Nepathya College / Tribhuvan University).

## Folder structure

```
personalMedication/
  server/              # Express + MongoDB API
    src/
      config/          # DB connection
      middleware/      # auth guard, error handler
      models/          # Mongoose schemas
      controller/       # route handlers
      routes/          # Express routers
      utils/           # helpers (JWT, asyncHandler)
    server.js
  src/                 # React (Vite) frontend
    api/               # axios calls to the backend
    components/        # reusable UI
    context/           # AuthContext
    hooks/             # useReminderEngine (medication alerts)
    pages/             # route-level pages incl. landing page
  index.html
```

## Run locally

**Backend**
```
cd server
npm install
npm run dev      # http://localhost:5000
```

**Frontend**
```
npm install
npm run dev       # http://localhost:5173
```

Make sure MongoDB is running locally (or update `MONGO_URI` in
`server/.env` to your Atlas connection string).

## Reminder/Alert behaviour

Reminders are checked client-side every 30 seconds while the app is open
(`src/hooks/useReminderEngine.js`), comparing the browser's current time
against each medication's saved reminder times (e.g. 08:00, 21:00). A
match triggers a browser Notification (if permitted) plus an in-app
toast, with a "Mark as Taken" action. This only fires while the tab is
open — there is no background/server push in this version.
