import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (!role) return <Navigate to="/" replace />;
  if (role !== allowedRole) return <Navigate to="/" replace />;
  return <>{children}</>;
}
