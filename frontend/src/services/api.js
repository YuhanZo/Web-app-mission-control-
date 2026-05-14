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
  login:     (email, password) => request('/api/auth/login',  { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout:    ()                => request('/api/auth/logout', { method: 'POST' }),
  me:        ()                => request('/api/auth/me'),
  dashboard: ()                => request('/api/dashboard'),
};
