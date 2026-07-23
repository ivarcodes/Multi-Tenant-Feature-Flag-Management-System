import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from '../../components/common/LoginForm';

export function UserLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <LoginForm
      title="User Login"
      gradient="from-green-600 to-emerald-600"
      onSubmit={(e, p) => login(e, p).then(() => navigate('/user/check'))}
      extra={
        <p className="text-center mt-6 text-sm text-gray-500">
          No account?{' '}
          <Link to="/user/signup" className="text-green-600 hover:text-green-800 font-medium transition">Sign up</Link>
        </p>
      }
    />
  );
}
