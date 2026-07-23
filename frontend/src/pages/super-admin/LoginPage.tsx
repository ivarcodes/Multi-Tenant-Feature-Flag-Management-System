import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from '../../components/common/LoginForm';

export function SuperAdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return (
    <LoginForm
      title="Super Admin Login"
      gradient="from-purple-600 to-indigo-600"
      initialEmail="super@admin.com"
      submitLabel="Login"
      onSubmit={(e, p) => login(e, p).then(() => navigate('/super-admin/organizations'))}
    />
  );
}
