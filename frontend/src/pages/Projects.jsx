import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

const STATUS_OPTIONS = ['pending', 'active', 'completed', 'cancelled'];

const EMPTY_FORM = {
  project_name: '',
  status: 'pending',
  contract_value: '',
  start_date: '',
};

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [error, setError]       = useState('');
  const [saving, setSaving]     = useState(false);

  useEffect(() => {
    api.projects()
      .then(d => setProjects(d.projects))
      .catch(() => navigate('/login'));
  }, [navigate]);

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { project } = await api.createProject(form);
      setProjects(prev => [project, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <nav className="navbar">
        <span className="brand">
          James Blinds <span className="brand-sub">Mission Control</span>
        </span>
        <div className="nav-right">
          <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
          <Link to="/users"    className="btn btn-ghost">Team</Link>
        </div>
      </nav>

      <main className="container">
        <div className="section-header">
          <h2>Projects</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(s => !s)}>
            {showForm ? 'Cancel' : '+ New Project'}
          </button>
        </div>

        {showForm && (
          <form className="create-form" onSubmit={handleCreate}>
            <h3>New Project</h3>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-row">
              <div className="form-group">
                <label>Project Name *</label>
                <input name="project_name" value={form.project_name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Contract Value ($)</label>
                <input name="contract_value" type="number" value={form.contract_value} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input name="start_date" type="date" value={form.start_date} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Creating…' : 'Create Project'}
            </button>
          </form>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Contract Value</th>
              <th>Start Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr><td colSpan="5" className="empty">No projects yet.</td></tr>
            ) : (
              projects.map(p => (
                <tr key={p.id}>
                  <td>{p.project_name}</td>
                  <td><span className={`badge badge-status badge-${p.status}`}>{p.status}</span></td>
                  <td>{p.contract_value ? `$${Number(p.contract_value).toLocaleString()}` : '—'}</td>
                  <td>{p.start_date ? p.start_date.slice(0, 10) : '—'}</td>
                  <td><Link to={`/projects/${p.id}`} className="btn btn-ghost">View</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
