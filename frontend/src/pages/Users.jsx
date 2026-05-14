import { useEffect, useState } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';

const EMPTY_FORM = { name: '', email: '', password: '', role_id: '', phone: '' };

export default function Users() {
  const [users, setUsers]         = useState(null);
  const [roles, setRoles]         = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm]   = useState({});
  const [error, setError]         = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    Promise.all([api.users(), api.roles()])
      .then(([ud, rd]) => { setUsers(ud.users); setRoles(rd.roles); });
  }, []);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { user } = await api.createUser(form);
      setUsers(prev => [...prev, { ...user, role_name: roles.find(r => r.id === Number(form.role_id))?.name || null }]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(u) {
    setEditingId(u.id);
    setEditForm({ name: u.name, email: u.email, phone: u.phone || '', role_id: u.role_id || '' });
    setEditError('');
  }

  async function handleUpdate(e, id) {
    e.preventDefault();
    setEditError('');
    try {
      const { user } = await api.updateUser(id, editForm);
      setUsers(prev => prev.map(u => u.id === id
        ? { ...u, ...user, role_name: roles.find(r => r.id === Number(editForm.role_id))?.name || null }
        : u
      ));
      setEditingId(null);
    } catch (err) {
      setEditError(err.message);
    }
  }

  async function handleDeactivate(id, name) {
    if (!window.confirm(`Deactivate "${name}"? They will no longer be able to log in.`)) return;
    try {
      await api.deactivateUser(id);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: false } : u));
    } catch (err) {
      setError(err.message);
    }
  }

  if (!users) return <div className="loading">Loading…</div>;

  return (
    <div>
      <Navbar />

      <main className="container">
        <h2>Team Members</h2>

        <form className="create-form" onSubmit={handleCreate}>
          <h3>Add New Member</h3>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select name="role_id" value={form.role_id} onChange={handleChange}>
                <option value="">— No role —</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Adding…' : 'Add Member'}
          </button>
        </form>

        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="6" className="empty">No team members yet.</td></tr>
            ) : (
              users.map(u => editingId === u.id ? (
                <tr key={u.id}>
                  <td colSpan="6">
                    <form onSubmit={e => handleUpdate(e, u.id)} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', padding: '4px 0' }}>
                      {editError && <div className="alert alert-error" style={{ width: '100%' }}>{editError}</div>}
                      <input value={editForm.name}  onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}  required placeholder="Name"  style={{ flex: 1, minWidth: '120px', padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: '13px' }} />
                      <input value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} required placeholder="Email" type="email" style={{ flex: 1, minWidth: '160px', padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: '13px' }} />
                      <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}         placeholder="Phone" style={{ flex: 1, minWidth: '100px', padding: '6px 10px', border: '1px solid var(--color-border)', borderRadius: 'var(--radius)', fontSize: '13px' }} />
                      <select value={editForm.role_id} onChange={e => setEditForm(f => ({ ...f, role_id: e.target.value }))} style={{ flex: 1, minWidth: '120px' }}>
                        <option value="">— No role —</option>
                        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                      </select>
                      <button type="submit" className="btn btn-primary" style={{ fontSize: '12px', padding: '5px 12px' }}>Save</button>
                      <button type="button" className="btn btn-ghost" style={{ fontSize: '12px', padding: '5px 12px' }} onClick={() => setEditingId(null)}>Cancel</button>
                    </form>
                  </td>
                </tr>
              ) : (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone || '—'}</td>
                  <td><span className="badge badge-role">{u.role_name || '—'}</span></td>
                  <td><span className={`badge badge-status badge-${u.active ? 'active' : 'pending'}`}>{u.active ? 'active' : 'inactive'}</span></td>
                  <td style={{ display: 'flex', gap: '6px' }}>
                    <button className="btn btn-ghost" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => startEdit(u)}>Edit</button>
                    {u.active && (
                      <button className="btn btn-danger-ghost" onClick={() => handleDeactivate(u.id, u.name)}>Deactivate</button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
