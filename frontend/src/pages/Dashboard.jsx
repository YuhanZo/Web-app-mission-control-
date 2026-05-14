import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.dashboard().then(setData);
  }, []);

  if (!data) return <div className="loading">Loading…</div>;

  const { stats, recentProjects } = data;

  return (
    <div>
      <Navbar />

      <main className="container">
        <h2>Dashboard</h2>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{stats.totalProjects}</div>
            <div className="stat-label">Total Projects</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.activeProjects}</div>
            <div className="stat-label">Active Projects</div>
          </div>
        </div>

        <div className="section-header">
          <h3>Recent Projects</h3>
          <Link to="/projects" className="btn btn-ghost">View all</Link>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Contract Value</th>
              <th>Project Manager</th>
            </tr>
          </thead>
          <tbody>
            {recentProjects.length === 0 ? (
              <tr><td colSpan="4" className="empty">No projects yet.</td></tr>
            ) : (
              recentProjects.map(p => (
                <tr key={p.id}>
                  <td><Link to={`/projects/${p.id}`}>{p.project_name}</Link></td>
                  <td><span className={`badge badge-status badge-${p.status}`}>{p.status}</span></td>
                  <td>{p.contract_value ? `$${Number(p.contract_value).toLocaleString()}` : '—'}</td>
                  <td>{p.project_manager_name || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
}
