import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login         from './pages/Login';
import Dashboard     from './pages/Dashboard';
import Projects      from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Users         from './pages/Users';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"          element={<Login />} />
        <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects"       element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id"   element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/users"          element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="*"               element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
