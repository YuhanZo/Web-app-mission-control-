# James Blinds — Mission Control

Internal operations system for James Blinds.

---

## Project Structure

```
mission-control/
├── backend/       Node.js + Express REST API + PostgreSQL
├── frontend/      React + Vite app
├── .gitignore
└── README.md
```

---

## Prerequisites — Install These First

### 1. Node.js (v18 or higher)
Download: https://nodejs.org — choose the **LTS** version.
```bash
node -v   # should print v18 or higher
npm -v
```

### 2. PostgreSQL (v14 or higher)
Download: https://www.postgresql.org/download/windows
Click **Download the installer** → pick the latest version → run it.

During installation:
- Set a password for the `postgres` user — **remember this password**
- Keep the default port **5432** (use 5433 only if 5432 is already taken)
- When Stack Builder pops up at the end, just close it

After installing, add PostgreSQL to your system PATH:
Add `C:\Program Files\PostgreSQL\<version>\bin` to Environment Variables → Path, then **reopen your terminal**.

### 3. Git
Download: https://git-scm.com

---

## First-Time Setup

### Step 1 — Clone the repo
```bash
git clone https://github.com/YuhanZo/mission-control.git
cd mission-control
```

### Step 2 — Create the database
```bash
psql -U postgres -c "CREATE DATABASE james_blinds_mvp;"
```
Enter your postgres password when prompted.

### Step 3 — Create the tables
```bash
psql -U postgres -d james_blinds_mvp -f backend/database/schema.sql
```
You should see 4 lines of `CREATE TABLE`.

### Step 4 — Configure backend environment
```bash
cp backend/.env.example backend/.env
```
Open `backend/.env` and update:
```
DB_PASSWORD=your_postgres_password   # the password you set during installation
DB_PORT=5432                         # change to 5433 if that's what you chose
```

### Step 5 — Install backend dependencies
```bash
cd backend
npm install
```

### Step 6 — Seed the database
```bash
npm run seed
```
Expected output:
```
Roles seeded.
Admin user seeded  (admin@jamesblinds.com / password123)
Sample projects seeded.
Seed complete.
```

### Step 7 — Install frontend dependencies
Open a new terminal tab:
```bash
cd frontend
npm install
```

---

## Running the App (Every Time)

You need **two terminal tabs** running simultaneously.

**Terminal 1 — Backend API:**
```bash
cd backend
npm run dev
```
API running at: http://localhost:3000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
App running at: http://localhost:5173

Open **http://localhost:5173** in your browser.

**Default login credentials:**
- Email: `admin@jamesblinds.com`
- Password: `password123`

---

## Codebase Overview

```
backend/
├── app.js                  # Express entry point
├── config/db.js            # PostgreSQL connection pool
├── database/
│   ├── schema.sql          # CREATE TABLE statements (run once)
│   └── seed.js             # Seed script (run once)
├── models/                 # SQL queries — one file per table
├── controllers/            # Business logic, returns JSON
├── routes/                 # Route definitions (all under /api)
├── middleware/
│   └── authMiddleware.js   # Session-based auth guard
├── .env                    # Your local config — never commit this
└── .env.example            # Template — safe to commit

frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx       # Login form
│   │   └── Dashboard.jsx   # Stats + recent projects
│   ├── services/
│   │   └── api.js          # All fetch calls to backend
│   ├── App.jsx             # Router setup
│   └── index.css           # Global styles
└── .env                    # VITE_API_URL (defaults to localhost:3000)
```

---

## API Endpoints

| Method | Path               | Auth?    | Description                 |
|--------|--------------------|----------|-----------------------------|
| POST   | `/api/auth/login`  | No       | Login, starts session       |
| POST   | `/api/auth/logout` | No       | Destroy session             |
| GET    | `/api/auth/me`     | Required | Return current session user |
| GET    | `/api/dashboard`   | Required | Stats + recent projects     |

---

## Planned Modules

- `/api/projects` — project CRUD + user assignment
- `/api/users` — user management
- Materials, scheduling, punch list modules
- QBO billing integration
- JWT auth (replaces session)
- AI assistant
