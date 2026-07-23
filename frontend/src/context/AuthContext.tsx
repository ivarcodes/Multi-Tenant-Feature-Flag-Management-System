import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import * as api from '../api/api';

interface AuthState {
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  role: null,
  loading: true,
  login: async () => null,
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getMe();
        setRole(res.data.role);
      } catch {
        setRole(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    const res = await api.login({ email, password });
    setRole(res.data.role);
    return res.data.role;
  };

  const logout = async () => {
    try { await api.logout(); } catch { }
    setRole(null);
  };

  return <AuthContext.Provider value={{ role, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
