import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginForm } from '../../components/common/LoginForm';

export function UserLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return <LoginForm title="User Login" onSubmit={(e, p) => login(e, p).then(() => navigate('/user/check'))} />;
}
