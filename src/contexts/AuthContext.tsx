import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';
import api, { setupAxiosInterceptors } from '../api/axios';
import { AuthContextType } from '../features/auth/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<{ name: string; email: string; cpf: string } | null>(null);

  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setTokenState(null);
    localStorage.removeItem('token');
    toast.error('Sessão expirada. Faça login novamente.');
    setUser(null);
    setTimeout(() => {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }, 100);
  };

  useEffect(() => {
    setupAxiosInterceptors(token, logout);
  }, [token]);

  useEffect(() => {
    if (token) {
      api.get('/users/me')
        .then(res => setUser(res.data))
        .catch(() => {
          logout();
        });
    } else {
      setUser(null);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
