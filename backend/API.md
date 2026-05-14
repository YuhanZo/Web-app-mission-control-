# James Blinds Mission Control — API Reference

Base URL: `http://localhost:3000`

All protected endpoints require an active session cookie.  
Send requests with `credentials: 'include'` (fetch) or `withCredentials: true` (axios).

---

## Auth

### POST /api/auth/login

Log in and start a session.

**Request body**
```json
{
  "email": "admin@jamesblinds.com",
  "password": "password123"
}
```

**Success — 200**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Error — 400**
```json
{ "error": "Email and password are required." }
```

**Error — 401**
```json
{ "error": "Invalid email or password." }
```

---

### POST /api/auth/logout

Destroy the current session.

**Success — 200**
```json
{ "message": "Logged out." }
```

---

### GET /api/auth/me

Return the currently logged-in user.

**Success — 200**
```json
{
  "user": {
    "id": 1,
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Not logged in — redirects to /login (302)**

---

## Dashboard

### GET /api/dashboard

Return project stats and recent projects.

**Success — 200**
```json
{
  "user": { "id": 1, "name": "Admin User", "role": "admin" },
  "stats": {
    "totalProjects": 5,
    "activeProjects": 3
  },
  "recentProjects": [
    {
      "id": 1,
      "project_name": "Smith Residence — Kitchen Blinds",
      "status": "active",
      "contract_value": "12500.00",
      "project_manager_name": "Admin User",
      "created_at": "2026-05-13T00:00:00.000Z"
    }
  ]
}
```

---

## Projects

### GET /api/projects

List all projects.

**Success — 200**
```json
{
  "projects": [
    {
      "id": 1,
      "project_name": "Smith Residence — Kitchen Blinds",
      "status": "active",
      "contract_value": "12500.00",
      "start_date": "2026-05-13T00:00:00.000Z",
      "project_manager_name": "Admin User",
      "customer_name": null
    }
  ]
}
```

---

### GET /api/projects/:id

Get a single project with its assigned team members.

**Success — 200**
```json
{
  "project": {
    "id": 1,
    "project_name": "Smith Residence — Kitchen Blinds",
    "status": "active",
    "contract_value": "12500.00",
    "start_date": "2026-05-13T00:00:00.000Z",
    "install_start_date": null,
    "install_end_date": null,
    "completion_date": null,
    "project_manager_name": "Admin User",
    "customer_name": null
  },
  "assignedUsers": [
    {
      "user_id": 1,
      "name": "Admin User",
      "email": "admin@jamesblinds.com",
      "role_name": "admin",
      "relationship_type": "project_manager"
    }
  ]
}
```

**Error — 404**
```json
{ "error": "Project not found." }
```

---

### POST /api/projects

Create a new project.

**Request body**
```json
{
  "project_name": "New Office Blinds",
  "status": "pending",
  "contract_value": 15000,
  "start_date": "2026-06-01",
  "project_manager_user_id": 1,
  "customer_user_id": null,
  "territory_id": null,
  "install_start_date": null,
  "install_end_date": null,
  "completion_date": null
}
```

Only `project_name` is required. All other fields are optional.

**Success — 201**
```json
{
  "project": {
    "id": 6,
    "project_name": "New Office Blinds",
    "status": "pending",
    "contract_value": "15000.00",
    "created_at": "2026-05-14T00:00:00.000Z"
  }
}
```

**Error — 400**
```json
{ "error": "project_name is required." }
```

---

### PUT /api/projects/:id

Update an existing project. Send only the fields you want to change.

**Request body**
```json
{
  "status": "active",
  "contract_value": 18000
}
```

**Updatable fields**
`project_name`, `customer_user_id`, `territory_id`, `project_manager_user_id`, `status`, `contract_value`, `start_date`, `install_start_date`, `install_end_date`, `completion_date`

**Success — 200**
```json
{
  "project": {
    "id": 6,
    "project_name": "New Office Blinds",
    "status": "active",
    "contract_value": "18000.00"
  }
}
```

**Error — 404**
```json
{ "error": "Project not found." }
```

---

### DELETE /api/projects/:id

Delete a project and all its team assignments.

**Success — 200**
```json
{ "message": "Project deleted." }
```

**Error — 404**
```json
{ "error": "Project not found." }
```

---

### POST /api/projects/:id/users

Assign a user to a project with a relationship type.

**Request body**
```json
{
  "user_id": 2,
  "relationship_type": "installer"
}
```

**Valid relationship types**
`project_manager`, `estimator`, `installer`, `customer`, `accounting`, `support_specialist`, `vendor`

**Success — 201**
```json
{
  "entry": {
    "id": 1,
    "project_id": 6,
    "user_id": 2,
    "relationship_type": "installer"
  }
}
```

**Error — 400**
```json
{ "error": "user_id and relationship_type are required." }
```

**Error — 404**
```json
{ "error": "User not found." }
```

---

### DELETE /api/projects/:id/users/:userId 

Remove a user from a project.

**Success — 200**
```json
{ "message": "User removed from project." }
```

**Error — 404**
```json
{ "error": "Assignment not found." }
```

---

## Users

### GET /api/users

List all team members.

**Success — 200**
```json
{
  "users": [
    { "id": 1, "name": "Admin User", "email": "admin@jamesblinds.com", "phone": null, "active": true, "role_name": "admin", "role_id": 1 }
  ]
}
```

---

### POST /api/users

Create a new team member.

**Request body**
```json
{ "name": "Jane Smith", "email": "jane@jamesblinds.com", "password": "secret123", "role_id": 2, "phone": "555-1234" }
```

Only `name`, `email`, and `password` are required.

**Success — 201**
```json
{ "user": { "id": 2, "name": "Jane Smith", "email": "jane@jamesblinds.com", "phone": "555-1234", "role_id": 2, "active": true } }
```

**Error — 400**
```json
{ "error": "Email already in use." }
```

---

### PUT /api/users/:id

Update a team member's name, email, phone, or role.

**Request body**
```json
{ "name": "Jane Doe", "email": "jane@jamesblinds.com", "phone": "555-9999", "role_id": 3 }
```

**Success — 200**
```json
{ "user": { "id": 2, "name": "Jane Doe", "email": "jane@jamesblinds.com", "phone": "555-9999", "role_id": 3 } }
```

---

### PATCH /api/users/:id/deactivate

Deactivate a team member (sets active = false, blocks login).

**Success — 200**
```json
{ "message": "Jane Doe has been deactivated." }
```

**Error — 404**
```json
{ "error": "User not found." }
```

---

### GET /api/users/roles

List all available roles.

**Success — 200**
```json
{ "roles": [{ "id": 1, "name": "admin" }, { "id": 2, "name": "installer" }] }
```

---

## Error Format

All errors return JSON in this shape:
```json
{ "error": "Description of what went wrong." }
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad request — missing or invalid input |
| 401  | Not authenticated |
| 404  | Resource not found |
| 500  | Server error |
