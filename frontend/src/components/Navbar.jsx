import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useUser } from '../contexts/UserContext';

export default function Navbar() {
  const navigate = useNavigate();
  const user = useUser();

  async function handleLogout() {
    await api.logout();
    navigate('/login');
  }

  return (
    <nav className="navbar">
      <span className="brand">
        James Blinds <span className="brand-sub">Mission Control</span>
      </span>
      <div className="nav-right">
        <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
        <Link to="/projects"  className="btn btn-ghost">Projects</Link>
        <Link to="/users"     className="btn btn-ghost">Team</Link>
        {user && (
          <>
            <span className="nav-user">
              {user.name}
              <span className="badge badge-role">{user.role}</span>
            </span>
            <button onClick={handleLogout} className="btn btn-ghost">Log out</button>
          </>
        )}
      </div>
    </nav>
  );
}
