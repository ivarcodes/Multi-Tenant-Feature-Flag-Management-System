import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api/api';
import { SignupForm } from '../../components/admin/SignupForm';

export function AdminSignup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (email: string, password: string, orgId: string) => {
    await api.signup({ email, password, orgId, role: 'admin' });
    await login(email, password);
    navigate('/admin/dashboard');
  };

  return <SignupForm onSubmit={handleSubmit} extra={<p className="text-center mt-4 text-sm text-gray-500">Already have an account? <Link to="/admin/login" className="text-blue-600">Login</Link></p>} />;
}
