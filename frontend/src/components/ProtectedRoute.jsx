import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { UserContext } from '../contexts/UserContext';

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    api.me()
      .then(d => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  if (user === undefined) return <div className="loading">Loading…</div>;
  if (user === null) return <Navigate to="/login" replace />;

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
}
