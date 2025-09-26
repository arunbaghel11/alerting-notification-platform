# Alerting & Notification Platform (MVP)


This repository contains a minimal MERN scaffold implementing the PRD for an Alerting & Notification Platform.


## What's included

- **Backend** (Express + Mongoose): models, controllers, routes, a reminder service, and a simple Notification Strategy for In-App delivery.
- **Frontend** (React): minimal UI to view admin alerts and simulate triggering reminders; user dashboard to view/snooze/mark alerts.
- **Seed script** to create sample teams, users, and alerts.

## How to run locally

### Prerequisites
- Node.js (>=16), npm
- MongoDB running locally

### Backend

```bash
cd backend
cp .env.example .env   # edit if needed
npm install
npm run seed   # creates sample teams, users, alerts
npm run dev    # starts server on :5000
```

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_BASE=http://localhost:5000/api npm start
```

## Notes on design

- **Extensibility**: Notification strategies are pluggable (`backend/src/services/notificationService.js`). Add Email/SMS strategies without changing core logic.
- **Reminder logic**: `trigger-reminders` endpoint simulates a scheduler; in production you'd run a cron or scheduler that calls `reminderService.triggerReminders()` periodically.
- **Snooze semantics**: Snooze sets `snoozedUntil` to midnight (start of next day). Next day reminders resume automatically.
- **Data models** follow suggestions in PRD.

## APIs (quick)
- `POST /api/admin/alerts` - create alert
- `PUT /api/admin/alerts/:id` - update alert
- `GET /api/admin/alerts` - list alerts
- `POST /api/admin/trigger-reminders` - simulate reminders
- `GET /api/user/:userId/alerts` - fetch alerts for user
- `POST /api/user/:userId/alerts/:alertId/snooze` - snooze for today
- `POST /api/user/:userId/alerts/:alertId/read` - mark read

## Future improvements
- WebSocket / Push for real-time In-App delivery
- Email & SMS strategies
- Role-based access control
- Configurable reminder frequency per alert via admin UI

