import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

const STATUS_OPTIONS    = ['pending', 'active', 'completed', 'cancelled'];
const RELATIONSHIP_TYPES = ['project_manager', 'estimator', 'installer', 'customer', 'accounting', 'support_specialist', 'vendor'];

export default function ProjectDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [project, setProject]           = useState(null);
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [allUsers, setAllUsers]         = useState([]);
  const [editing, setEditing]           = useState(false);
  const [form, setForm]                 = useState({});
  const [assignForm, setAssignForm]     = useState({ user_id: '', relationship_type: 'installer' });
  const [error, setError]               = useState('');
  const [assignError, setAssignError]   = useState('');
  const [saving, setSaving]             = useState(false);

  useEffect(() => {
    Promise.all([api.project(id), api.users()])
      .then(([d, ud]) => {
        setProject(d.project);
        setForm(d.project);
        setAssignedUsers(d.assignedUsers);
        setAllUsers(ud.users);
      })
      .catch(() => navigate('/projects'));
  }, [id, navigate]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { project: updated } = await api.updateProject(id, form);
      setProject(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAssign(e) {
    e.preventDefault();
    setAssignError('');
    try {
      await api.assignUser(id, assignForm);
      const refreshed = await api.project(id);
      setAssignedUsers(refreshed.assignedUsers);
      setAssignForm({ user_id: '', relationship_type: 'installer' });
    } catch (err) {
      setAssignError(err.message);
    }
  }

  async function handleRemove(userId) {
    try {
      await api.removeUser(id, userId);
      setAssignedUsers(prev => prev.filter(u => u.user_id !== userId));
    } catch (err) {
      setAssignError(err.message);
    }
  }

  if (!project) return <div className="loading">Loading…</div>;

  return (
    <div>
      <nav className="navbar">
        <span className="brand">
          James Blinds <span className="brand-sub">Mission Control</span>
        </span>
        <div className="nav-right">
          <Link to="/projects" className="btn btn-ghost">← Projects</Link>
        </div>
      </nav>

      <main className="container">

        {/* Project Info */}
        <div className="section-header">
          <h2>{project.project_name}</h2>
          <button className="btn btn-ghost" onClick={() => setEditing(e => !e)}>
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form className="create-form" onSubmit={handleUpdate}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-row">
              <div className="form-group">
                <label>Project Name *</label>
                <input name="project_name" value={form.project_name || ''} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status || ''} onChange={handleChange}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Contract Value ($)</label>
                <input name="contract_value" type="number" value={form.contract_value || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input name="start_date" type="date" value={form.start_date ? form.start_date.slice(0,10) : ''} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="detail-grid">
            <div className="detail-item"><span className="detail-label">Status</span><span className={`badge badge-status badge-${project.status}`}>{project.status}</span></div>
            <div className="detail-item"><span className="detail-label">Contract Value</span><span>{project.contract_value ? `$${Number(project.contract_value).toLocaleString()}` : '—'}</span></div>
            <div className="detail-item"><span className="detail-label">Project Manager</span><span>{project.project_manager_name || '—'}</span></div>
            <div className="detail-item"><span className="detail-label">Customer</span><span>{project.customer_name || '—'}</span></div>
            <div className="detail-item"><span className="detail-label">Start Date</span><span>{project.start_date ? project.start_date.slice(0,10) : '—'}</span></div>
            <div className="detail-item"><span className="detail-label">Completion</span><span>{project.completion_date ? project.completion_date.slice(0,10) : '—'}</span></div>
          </div>
        )}

        {/* Assigned Users */}
        <div className="section-header" style={{ marginTop: '32px' }}>
          <h3>Assigned Team</h3>
        </div>

        {assignError && <div className="alert alert-error">{assignError}</div>}

        <table className="table" style={{ marginBottom: '16px' }}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Relationship</th><th></th></tr>
          </thead>
          <tbody>
            {assignedUsers.length === 0 ? (
              <tr><td colSpan="5" className="empty">No team members assigned yet.</td></tr>
            ) : (
              assignedUsers.map(u => (
                <tr key={u.user_id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className="badge">{u.role_name || '—'}</span></td>
                  <td><span className="badge badge-role">{u.relationship_type}</span></td>
                  <td>
                    <button className="btn btn-danger-ghost" onClick={() => handleRemove(u.user_id)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Assign User Form */}
        <form className="assign-form" onSubmit={handleAssign}>
          <h4>Assign a team member</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Team Member</label>
              <select
                value={assignForm.user_id}
                onChange={e => setAssignForm(f => ({ ...f, user_id: e.target.value }))}
                required
              >
                <option value="">— Select member —</option>
                {allUsers.map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Relationship</label>
              <select
                value={assignForm.relationship_type}
                onChange={e => setAssignForm(f => ({ ...f, relationship_type: e.target.value }))}
              >
                {RELATIONSHIP_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ alignSelf: 'flex-end' }}>
              <button type="submit" className="btn btn-primary">Assign</button>
            </div>
          </div>
        </form>

      </main>
    </div>
  );
}
