import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from '../../components/common/LoginForm';

export function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <LoginForm
      title="Admin Login"
      gradient="from-blue-600 to-cyan-600"
      onSubmit={(e, p) => login(e, p).then(() => navigate('/admin/dashboard'))}
      extra={
        <p className="text-center mt-6 text-sm text-gray-500">
          No account?{' '}
          <Link to="/admin/signup" className="text-blue-600 hover:text-blue-800 font-medium transition">Sign up</Link>
        </p>
      }
    />
  );
}
