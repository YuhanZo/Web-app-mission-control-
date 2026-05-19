# James Blinds Mission Control — Technical Documentation

**Version:** Integration Branch (Prototype)  
**Last Updated:** May 2026  
**Authors:** Yuhan Zo, Jenny (UI/feature branches)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [System Architecture](#3-system-architecture)
4. [Feature Modules](#4-feature-modules)
5. [API Reference](#5-api-reference)
6. [Database Schema](#6-database-schema)
7. [Role & Access Control](#7-role--access-control)
8. [Local Development Setup](#8-local-development-setup)
9. [Known Issues & Roadmap](#9-known-issues--roadmap)

---

## 1. Project Overview

**Mission Control** is an internal operations dashboard for James Blinds field teams. It centralizes project scheduling, material tracking, installer coordination, bid management, and financial reporting into a single role-aware web application.

**Target users:** Project Managers, Chief Estimators, Estimators, Installers, Accounting  
**Territories:** Charlotte Metro, Lake Norman, South Carolina, Triad (expandable)  
**Current stage:** Functional prototype — core modules complete, ready for internal demo

---

## 2. Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Frontend | React 19 + Vite | Single-page app, single file `main.jsx` |
| Backend | Node.js + Express | REST API |
| Database | PostgreSQL | Hosted locally via pgAdmin |
| Auth | express-session | Cookie-based sessions, 8-hour TTL |
| Styling | Plain CSS (`styles.css`) | CSS variables for theming |
| Build | Vite (dev server port 5173) | Proxies `/api` → backend |
| Package manager | npm | |

**Key dependencies:**
- `bcrypt` — password hashing
- `pg` — PostgreSQL client
- `cors` — cross-origin configuration for dev
- `dotenv` — environment variable loading

---

## 3. System Architecture

```
Browser (port 5173)
    │
    ├─ Vite Dev Server
    │     └─ /api/* → proxy → localhost:3000
    │
    └─ React SPA (main.jsx)
          └─ fetch('/api/...', { credentials: 'include' })

Backend (port 3000)
    │
    ├─ express-session  (auth state)
    ├─ requireAuth middleware  (guards all /api routes)
    │
    ├─ /api/auth          authRoutes.js
    ├─ /api/users         userRoutes.js
    ├─ /api/dashboard     dashboardRoutes.js
    ├─ /api/installers    installerRoutes.js
    ├─ /api/materials     materialRoutes.js
    └─ /api/subprojects   subprojectRoutes.js
          │
          └─ PostgreSQL (james_blinds_mvp database)
```

### Authentication Flow

1. User submits email + password to `POST /api/auth/login`
2. Backend verifies password hash with bcrypt
3. On success: `req.session.user` is set with `{ id, name, email, role, territoryId }`
4. All subsequent API calls include the session cookie (`credentials: 'include'`)
5. `requireAuth` middleware checks `req.session.user` — returns 401 if absent

### Territory Filtering

- Each user has an optional `territory_id`
- Dashboard API accepts `?territory=<id>` query param
- Non-field roles (admin, project_manager, executive, etc.) can switch territories via the dropdown
- Installer and estimator roles are locked to their assigned territory

---

## 4. Feature Modules

### 4.1 Dashboard

**Route:** `/` (default view after login)  
**API:** `GET /api/dashboard?territory=<id>`  
**Tables:** `projects`, `monthly_billings`, `bids`, `companies`, `users`

Displays KPI cards and summary panels per territory:
- Active projects count, contract value, billing status
- Bid pipeline (sent, won, pending)
- Customer and installer summaries

Role-specific views:
- **Project Manager** — full operations dashboard
- **Chief Estimator** — financial metrics + bid analysis
- **Estimator** — bid pipeline view only

---

### 4.2 Scheduling

**Route:** Scheduling tab in sidebar  
**Sub-views:** Month Calendar, Monthly Gantt, Daily, Installer Calendar

#### Month Calendar
Displays projects as event dots on a monthly grid. Events sourced from `projects.install_start_date`.

#### Monthly Gantt
Horizontal bar chart showing 6-month project timeline. Each project row displays install date range. Subprojects shown as child rows with color coding by type.

#### Daily (2-Week Gantt)
Two-week timeline with day columns (Mon–Sun × 2 weeks). Projects with `install_start_date` / `install_end_date` rendered as colored bars. Navigate by week. Today column highlighted.

**Data source:** `projects` table fields `install_start_date`, `install_end_date`

#### Installer Calendar
Weekly grid showing each installer as a row, colored blocks indicating their assigned project dates.

**Data source:** `GET /api/installers` — joins `users` (role=installer) → `project_users` → `projects`

---

### 4.3 Projects

**Tables:** `projects`, `subprojects`, `companies`, `territories`, `change_orders`

Lists all active and pending projects with detail panel. Shows:
- Job number, project name, territory, status
- Contract value, install dates
- Subproject breakdown (phases, types)
- Change orders

---

### 4.4 Materials

**Route:** Materials tab  
**API:** `GET/POST/PATCH/DELETE /api/materials`  
**Table:** `materials`

Grouped table with 5 workflow stages:

| Stage ID | Label |
|---|---|
| `schedule_calls` | Schedule Calls |
| `measures` | Measures |
| `orders` | Orders |
| `deliveries` | Deliveries |
| `in_stock` | In Stock |

Each row has: Project, City, Who, When (scheduled_date), Install (install_date), Vendor, Notes/ETA/Tracking.  
Inline editing with stage reassignment via dropdown (supports cross-stage jumps).

---

### 4.5 Team

**Route:** Team tab (Project Manager dashboard)  
**API:** `GET/POST/PUT/PATCH /api/users`, `GET/POST/DELETE /api/users/:id/projects`  
**Tables:** `users`, `roles`, `territories`, `project_users`

Features:
- Add new team members with name, email, password, role, territory, phone
- Edit existing members inline
- Deactivate members (soft delete via `active = false`)
- Assign / unassign installer-role users to active projects

---

### 4.6 Installers

**Tables:** `users` (role=installer), `project_users`, `projects`

Roster view of all installer-role users with profile info, efficiency rating (demo data), and current project assignment.

---

### 4.7 Reports

Provides 8 CSV export buttons:
- Project Status Summary
- Weekly Field Report
- Install Schedule Export
- Billing Cycle Summary
- Bid Pipeline Export
- Customer Activity Report
- Installer Hours Log
- Full Data Export

Exports are generated client-side from loaded dashboard data using the Blob API.

---

## 5. API Reference

All endpoints require authentication (`requireAuth` middleware). Unauthenticated requests return `401 Unauthorized`.

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Login with email + password. Sets session cookie. |
| POST | `/api/auth/logout` | Clears session. |
| GET | `/api/auth/me` | Returns current session user. |

### Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Returns projects, billings, bids, customers, installers. Accepts `?territory=<id>`. |

### Users

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | List all users with role and territory names. |
| POST | `/api/users` | Create user. Required: `name`, `email`, `password`. |
| PUT | `/api/users/:id` | Update user fields including `territory_id`. |
| PATCH | `/api/users/:id/deactivate` | Soft-deactivate user. |
| GET | `/api/users/roles` | List all roles. |
| GET | `/api/users/projects-list` | List active/pending projects for assignment dropdown. |
| GET | `/api/users/:id/projects` | Get projects assigned to a user. |
| POST | `/api/users/:id/projects` | Assign user to a project. Body: `{ project_id, relationship_type }`. |
| DELETE | `/api/users/:id/projects/:projectId` | Remove user from a project. |

### Installers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/installers` | Returns active installer-role users with their current project assignment. One row per installer (DISTINCT ON). |

### Materials

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/materials` | List all material items, ordered by stage + sort_order. Accepts `?stage=<id>`. |
| POST | `/api/materials` | Create material item. Fields: `project_name`, `city`, `assigned_to`, `scheduled_date`, `install_date`, `vendor`, `notes`, `eta`, `tracking_number`, `stage`. |
| PATCH | `/api/materials/:id` | Update any fields including `stage` for reassignment. |
| DELETE | `/api/materials/:id` | Delete a material item. |

### Subprojects

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/projects/:id/subprojects` | Get subprojects for a project. |
| POST | `/api/projects/:id/subprojects` | Add subproject. |
| PATCH | `/api/subprojects/:id` | Update subproject. |

---

## 6. Database Schema

**Database name:** `james_blinds_mvp`

### Core Tables

#### `territories`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| code | varchar | Unique, e.g. `CLT` |
| name | varchar | e.g. `Charlotte Metro` |

Seed values: Charlotte Metro (1), Lake Norman (2), South Carolina (3), Triad (4)

---

#### `roles`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| name | varchar | Unique |

Values: `admin`, `executive`, `project_manager`, `estimator`, `installer`, `accounting`, `support_specialist`

---

#### `users`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| name | varchar | |
| email | varchar | Unique |
| phone | varchar | |
| role_id | int FK → roles | |
| territory_id | int FK → territories | |
| active | boolean | Default true. False = deactivated. |
| password_hash | varchar | bcrypt hash |
| created_at / updated_at | timestamp | |

---

#### `projects`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| job_number | int | e.g. 24001 |
| project_name | varchar | |
| company_id | int FK → companies | |
| territory_id | int FK → territories | |
| project_manager_user_id | int FK → users | |
| status | varchar | `active`, `pending`, `complete`, `cancelled` |
| original_contract | numeric(14,2) | |
| approved_change_orders | numeric(14,2) | |
| total_contract | numeric(14,2) | |
| install_start_date | date | Used by all scheduling views |
| install_end_date | date | Used by all scheduling views |
| is_on_hold | boolean | |

---

#### `project_users`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| project_id | int FK → projects | CASCADE delete |
| user_id | int FK → users | CASCADE delete |
| relationship_type | varchar | e.g. `installer`, `lead_installer` |
| UNIQUE | (project_id, user_id) | Prevents duplicate assignments |

---

#### `materials`
| Column | Type | Notes |
|---|---|---|
| id | serial PK | |
| project_id | int FK → projects | Optional link |
| project_name | varchar | Free-text fallback |
| stage | varchar | `schedule_calls`, `measures`, `orders`, `deliveries`, `in_stock` |
| city | varchar | |
| assigned_to | varchar | Who is responsible |
| scheduled_date | date | "When" column |
| install_date | date | "Install" column |
| vendor | varchar | |
| notes | text | |
| eta | date | |
| tracking_number | varchar | |
| billed | boolean | |
| sort_order | int | Manual ordering within stage |

---

#### `monthly_billings`
Financial billing records per project per month. Used in Dashboard billing summaries and Reports CSV export. Key fields: `billing_month`, `bill_this_month`, `total_billed_to_date`, `percent_complete`, `invoice_sent`.

---

#### `bids`
Bid pipeline records. Fields: `company_id`, `territory_id`, `project_name`, `bid_date`, `bid_amount`, `bid_status`, `won`.

---

#### Other Tables
- `subprojects` — phases/areas within a project (linked to Gantt child rows)
- `change_orders` — contract change orders per project
- `companies` / `contacts` — customer company and contact records
- `interactions` — CRM-style interaction log per company
- `monthly_metrics` / `weekly_metrics` — aggregated KPI snapshots
- `multifamily_feedback` — multifamily project performance data
- `quickbooks_sync` — QuickBooks integration sync status

---

## 7. Role & Access Control

### Role Definitions

| Role | Description |
|---|---|
| `admin` | Full system access |
| `executive` | Full read access, financial dashboards |
| `project_manager` | Full ops: projects, scheduling, materials, team |
| `chief_estimator` | Financial metrics, bid pipeline, estimator oversight |
| `estimator` | Bid pipeline, project list (read) |
| `installer` | Scheduling views only, locked to own territory |
| `accounting` | Billing and financial data |

### Territory Switching

- Roles that **can** switch territories: `admin`, `executive`, `project_manager`, `chief_estimator`, `accounting`
- Roles that **cannot** switch: `installer`, `estimator` (locked to `user.territoryId`)

### Frontend Guard Logic

```js
const canSwitchTerritory = !['installer', 'estimator'].includes(user.role);
```

All API routes are guarded by `requireAuth`. No frontend-only role enforcement — API validates session on every request.

---

## 8. Local Development Setup

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- pgAdmin (optional, for DB management)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/YuhanZo/mission-control.git
cd mission-control

# 2. Install backend dependencies
cd backend
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env:
#   DATABASE_URL=postgresql://postgres:<password>@localhost:5432/james_blinds_mvp
#   SESSION_SECRET=your-secret-here
#   CLIENT_URL=http://localhost:5173

# 4. Set up the database
psql -U postgres -c "CREATE DATABASE james_blinds_mvp;"
psql -U postgres -d james_blinds_mvp -f database/schema.sql
psql -U postgres -d james_blinds_mvp -f database/seed.sql

# 5. Start the backend
npm run dev   # nodemon on port 3000

# 6. Install and start the frontend (new terminal)
cd ../frontend
npm install
npm run dev   # Vite on port 5173
```

### Demo Login
| Field | Value |
|---|---|
| Email | `maya.pm@jamesblinds.com` |
| Password | `demo1234` |
| Role | Project Manager — Charlotte Metro |

---

## 9. Known Issues & Roadmap

### Known Issues

| Issue | Impact | Notes |
|---|---|---|
| Session stored in memory | Sessions lost on backend restart | Replace with `connect-pg-simple` for persistent sessions |
| `main.jsx` is a single large file (~3500 lines) | Hard to navigate, no code splitting | Should be split into component files per module |
| No input sanitization on backend | Low risk internally, would need fixing before public deployment | Add express-validator |
| Materials `project_id` FK unused in UI | Project dropdown links not wired to DB projects | Team page assigns via `project_users`, materials uses free-text |
| `SESSION_SECRET` defaults to `'dev-secret-change-me'` | Security risk if deployed | Must be set in production `.env` |

### Roadmap (Next Steps)

**Short term**
- [ ] Merge Jenny's remaining branches (`small-punch`, `billable`, `weekly-view`)
- [ ] Wire project detail edit form (install dates, status updates from UI)
- [ ] Persistent sessions (PostgreSQL session store)

**Medium term**
- [ ] Split `main.jsx` into component modules
- [ ] Mobile-responsive layout
- [ ] Real-time notifications (new project, material delivery)
- [ ] QuickBooks sync activation (`quickbooks_sync` table ready)

**Long term**
- [ ] Customer portal (read-only project status for clients)
- [ ] JWT-based auth for API-first architecture
- [ ] Multi-region deployment

---

*This document reflects the state of the `integration` branch as of May 2026.*
