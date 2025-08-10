# Notes App (React Native + Express + MongoDB + Offline Sync)

Full-stack notes application featuring an Expo/React Native client with an offline-first SQLite layer and background sync to a Node/Express + MongoDB API.

## ✨ Features

- Create, read, update, delete notes
- Offline-first local cache using Expo SQLite
- Background sync loop (push local pending changes / pull remote)
- Conflict-lean strategy: remote never overwrites locally dirty rows
- Soft delete locally; hard delete after remote confirmation
- Modular API (Express + Mongoose)
- EAS build configuration for Android
- Environment-based backend (config.env) + hosted API (Render)

## 🧱 Tech Stack

Frontend: Expo (React Native 0.79), React 19, React Navigation
Local Data: expo-sqlite (with schema migration helpers)
Sync: Custom sync engine (`src/services/sync.js`)
Backend: Node.js, Express 5, Mongoose 8, MongoDB Atlas
Tooling: EAS, nodemon, dotenv, CORS

## 📁 Repository Structure

```
App.js                # App entry (initializes DB + starts sync)
index.js              # Expo entry registration
src/
  navigation/         # Navigation stacks
  screens/            # UI screens
  components/         # Reusable UI components
  services/
    api.js            # REST API wrapper (network layer)
    sqlite-db.js      # SQLite schema + CRUD + sync helpers
    sync.js           # Background sync orchestrator
backend/
  server.js           # DB connect + server start
  app.js              # Express app + routes mounting
  routes/             # REST routes
  controllers/        # CRUD logic
  models/             # Mongoose schemas
  config.env          # Environment variables (NOT for production commit)
```

## 🔌 API Summary

Base: `/api/v1/notes`

| Method | Endpoint                 | Body (JSON)                  | Description          |
| ------ | ------------------------ | ---------------------------- | -------------------- |
| GET    | /api/v1/notes            | —                            | List all notes       |
| POST   | /api/v1/notes            | `{ title, description }`     | Create note          |
| PATCH  | /api/v1/notes/updateNote | `{ id, title, description }` | Update existing note |
| DELETE | /api/v1/notes/deleteNote | `{ id }`                     | Delete note          |

Responses are wrapped: `{ status, data | result }`.

## 🗄 Offline-First & Sync Flow

1. UI writes immediately to SQLite (optimistic). Rows flagged with `dirty` + `op` (create/update/delete).
2. Background interval (`startForegroundSync`) runs:
   - Push pending operations in causal order (create → update → delete)
   - Pull remote list and upsert locally (skips locally dirty rows)
   - Marks synced rows (clears `dirty`, `op` & persists `remoteId`)
3. Soft-deleted rows (`isDeleted=1`) are filtered from UI until remote delete confirmed → hard deleted.

Key columns in `notes` table:

- `remoteId`: Mongo `_id`
- `updatedAt`: last local timestamp
- `dirty`: 1 if pending push
- `op`: create | update | delete
- `isDeleted`: soft delete flag

## 🚀 Quick Start

### Prerequisites

- Node.js LTS + npm
- Expo CLI (`npm i -g expo` optional) / EAS CLI (`npm i -g eas-cli`)
- MongoDB Atlas URI (or local Mongo running)

### 1. Backend Setup

```powershell
cd backend
npm install
# Create config.env (do NOT commit secrets):
# DATABASE=mongodb+srv://<user>:<password>@cluster/db?retryWrites=true&w=majority
# DATABASE_PASSWORD=<password>
# PORT=3000
npm start
```

Server listens on `PORT` and connects to Mongo.

### 2. Mobile App Setup

```powershell
# From repo root
npm install
npm run start  # Expo dev server (QR scan / run on emulator)
```

Alternate:

```powershell
npm run android
npm run web
```

### 3. Point Client to Your Backend

`src/services/api.js` uses a hosted URL:

```js
const BASE_URL = "https://notes-app-api-u247.onrender.com/api/v1";
```

For local testing, change to (device must reach host):

```js
const BASE_URL = "http://<your-local-ip>:3000/api/v1";
```

(Use `ipconfig` / `ifconfig` to find LAN IP.)

## 🧪 Basic Test (Manual)

1. Start backend.
2. Launch app (airplane mode ON) → create a note (should appear instantly).
3. Turn network ON → after sync interval (default 10 min in `App.js`, forced immediate `syncNow()` is called from `startForegroundSync`), note appears in Mongo.

## 🔁 Forcing a Manual Sync

Add a temporary call somewhere (e.g., a dev button) invoking:

```js
import { syncNow } from "./src/services/sync";
await syncNow();
```

## 🧭 Branching Model (Current)

- `v1`: Stable baseline version (frozen for now)
- `v2`: Active development / next release
- `presentation-for-public-v2`: Variant with presentation-specific config
- Feature / bugfix branches named: `feature/<name>` or `bugfix/<issue>`

Typical flow:

```text
bugfix/* -> merge into v2 -> cherry-pick or merge into presentation branch if needed
```

Tag releases from `v2` (e.g., `v2.0.1`).

## 🛠 Scripts

Frontend (root `package.json`):

- `npm start` – Expo dev tools
- `npm run android` – Build/run Android (Gradle via Expo Run)
- `npm run web` – Web preview

Backend (`backend/package.json`):

- `npm start` – nodemon dev server

## 📦 Building (EAS)

Configure credentials first:

```powershell
eas login
# Update app.json / eas.json if needed
```

Build (development APK):

```powershell
eas build --profile development --platform android
```

Production:

```powershell
eas build --profile production --platform android
```

## 🔐 Environment & Secrets

Do not commit real passwords. The placeholder `config.env` is for local dev. Use deployment platform secret management (Render / EAS secrets).

Required (backend):

```
DATABASE=<Mongo URI with <db_password> placeholder>
DATABASE_PASSWORD=<resolved password>
PORT=3000
```

## 🧹 Troubleshooting

| Issue                           | Cause                         | Fix                                     |
| ------------------------------- | ----------------------------- | --------------------------------------- |
| Mobile cannot reach backend     | Using localhost               | Use LAN IP & same Wi-Fi                 |
| Notes not syncing               | App offline / interval long   | Call `syncNow()` manually               |
| Duplicate notes after reconnect | Rapid edits before first push | Tune sync interval or debounce UI edits |
| Expo build fails (SQLite flags) | Plugin config mismatch        | Verify `app.json` plugin block          |

## 📐 Future Improvements

- Conflict resolution strategy (timestamps / vector semantics)
- Pagination & large dataset sync delta
- Auth (user accounts + note ownership)
- Automated tests (Jest + supertest for API)
- Batch push for pending operations

## 📄 License

Unlicensed / Personal project (add a LICENSE file if distributing).

## 🤝 Contributing

1. Fork & branch: `git checkout -b feature/xyz`
2. Commit: `feat: add xyz`
3. PR into `v2`

## ✅ Summary

This project combines an offline-first client with a lightweight REST API. Modify `BASE_URL`, set up your `config.env`, run backend then the Expo app, and you have a syncing notes experience ready to extend.
