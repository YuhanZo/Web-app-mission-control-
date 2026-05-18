# James Blinds Mission Control

Internal operations dashboard for James Blinds. The app has:

- Backend API: Node.js, Express, PostgreSQL, session auth
- Frontend app: React and Vite
- Current frontend: login screen plus a project manager dashboard with project and financial visibility by area/territory

## Project Structure

```text
mission-control/
+-- backend/        Express REST API and PostgreSQL data access
+-- frontend/       React/Vite dashboard app
+-- README.md
+-- .gitignore
```

## Prerequisites

Install these first:

- Node.js 20 or newer
- npm, included with Node.js
- PostgreSQL 14 or newer
- Git

Check Node/npm:

```bash
node -v
npm -v
```

Check PostgreSQL:

```bash
psql --version
```

On Windows, if `psql` is not found, add your PostgreSQL `bin` folder to PATH. It usually looks like:

```text
C:\Program Files\PostgreSQL\<version>\bin
```

Then reopen the terminal.

## Database Setup

Create the database:

```bash
psql -U postgres -c "CREATE DATABASE james_blinds_mvp;"
```

Create the tables:

```bash
psql -U postgres -d james_blinds_mvp -f backend/database/schema.sql
```

The schema creates:

- `roles`
- `users`
- `territories`
- `companies`
- `contacts`
- `projects`
- `project_users`
- `change_orders`
- `monthly_billings`
- `bids`
- `bid_invitations`
- `interactions`
- `monthly_metrics`
- `weekly_metrics`
- `multifamily_feedback`
- `quickbooks_sync`

If your local database was created before the richer financial schema, run `schema.sql` again. It includes compatibility `ALTER TABLE` statements for the older MVP tables:

```bash
psql -U postgres -d james_blinds_mvp -f backend/database/schema.sql
```

## Backend Environment

Create `backend/.env` from the example:

```bash
copy backend\.env.example backend\.env
```

On Mac/Linux/Git Bash:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` and set your database values:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=james_blinds_mvp
DB_USER=postgres
DB_PASSWORD=your_postgres_password
SESSION_SECRET=change-this-local-secret
CLIENT_URL=http://localhost:5173
PORT=3000
```

If PostgreSQL was installed on port `5433`, use `DB_PORT=5433`.

## Backend Setup

Install backend dependencies:

```bash
cd backend
npm install
```

Seed roles, the admin user, and sample projects:

```bash
npm run seed
```

Default login:

```text
Email: admin@jamesblinds.com
Password: password123
```

Project manager login:

```text
Email: maya.pm@jamesblinds.com
Password: password123
```

The seed adds sample data for territories, internal users, companies, contacts, projects, change orders, billing progress, bids, interactions, monthly metrics, weekly metrics, multifamily feedback, and QuickBooks sync rows.

Start the backend API:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

## Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the frontend:

```text
http://localhost:5173
```

The frontend dev server proxies `/api` requests to the backend at `http://localhost:3000`.

## Running The App Every Day

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```

Log in with:

```text
admin@jamesblinds.com
password123
```

## Frontend Notes

The current frontend includes:

- Login screen
- Role-aware app shell
- Project manager dashboard
- Area selector
- Financial cards
- Area financial breakdown
- Project table
- Status/value breakdown

If the backend or database is not running, the frontend can show demo project manager dashboard data so the screen can still be reviewed while setup is being fixed.

## API Endpoints

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | No | Login and create a session |
| `POST` | `/api/auth/logout` | No | Destroy the current session |
| `GET` | `/api/auth/me` | Yes | Return the current session user |
| `GET` | `/api/dashboard` | Yes | Return dashboard stats, recent projects, and project manager financial rollups |

## Useful Commands

Backend:

```bash
cd backend
npm run dev
npm run seed
npm start
```

Frontend:

```bash
cd frontend
npm run dev
npm run build
npm run preview
```

## Troubleshooting

If `npm` is blocked in PowerShell with an execution policy error, use:

```bash
npm.cmd run dev
```

If login fails:

- Make sure PostgreSQL is running.
- Make sure `backend/.env` has the correct `DB_PASSWORD`.
- Make sure the database exists.
- Run `npm run seed` inside `backend`.
- Make sure backend is running at `http://localhost:3000`.

If the frontend opens but API calls fail:

- Make sure the backend is running.
- Make sure `CLIENT_URL=http://localhost:5173` in `backend/.env`.
- Restart the backend after changing `.env`.

If `psql` is not recognized:

- Add PostgreSQL `bin` to PATH.
- Reopen the terminal.

## Current Backend Data Model

The dashboard currently uses these project fields:

- `job_number`
- `project_name`
- `company_id`
- `status`
- `original_contract`
- `approved_change_orders`
- `total_contract`
- `estimated_material_cost`
- `estimated_labor_cost`
- `total_estimate`
- `territory_id`
- `project_manager_user_id`
- `start_date`
- `install_start_date`
- `install_end_date`
- `completion_date`

Project manager dashboard financials are grouped by:

- current manager
- territory/area
- status
- total contract value

## Development Notes

- Do not commit `backend/.env`.
- Do not commit `node_modules/`, `dist/`, logs, or local cache folders.
- The backend uses session cookies, so frontend API calls should use `credentials: 'include'`.
