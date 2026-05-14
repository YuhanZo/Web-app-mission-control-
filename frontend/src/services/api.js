const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include', // send session cookie with every request
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const api = {
  // Auth
  login:     (email, password) => request('/api/auth/login',  { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout:    ()                => request('/api/auth/logout', { method: 'POST' }),
  me:        ()                => request('/api/auth/me'),

  // Dashboard
  dashboard: () => request('/api/dashboard'),

  // Users
  users:          ()         => request('/api/users'),
  createUser:     (data)     => request('/api/users',                    { method: 'POST',  body: JSON.stringify(data) }),
  updateUser:     (id, data) => request(`/api/users/${id}`,              { method: 'PUT',   body: JSON.stringify(data) }),
  deactivateUser: (id)       => request(`/api/users/${id}/deactivate`,   { method: 'PATCH' }),
  roles:          ()         => request('/api/users/roles'),

  // Projects
  projects:       ()           => request('/api/projects'),
  project:        (id)         => request(`/api/projects/${id}`),
  createProject:  (data)       => request('/api/projects',        { method: 'POST',   body: JSON.stringify(data) }),
  updateProject:  (id, data)   => request(`/api/projects/${id}`,  { method: 'PUT',    body: JSON.stringify(data) }),
  deleteProject:  (id)         => request(`/api/projects/${id}`,                  { method: 'DELETE' }),
  assignUser:     (id, data)   => request(`/api/projects/${id}/users`,             { method: 'POST',   body: JSON.stringify(data) }),
  removeUser:     (id, userId) => request(`/api/projects/${id}/users/${userId}`,   { method: 'DELETE' }),
};
