import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export const RequireAuth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return user ? <Outlet /> : <Navigate to="/signin" replace />;
};
