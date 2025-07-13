import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-toastify';
import api, { setupAxiosInterceptors } from '../api/axios';
import { AuthContextType } from '../features/auth/AuthContextType';
import { CircularProgress, Box } from '@mui/material';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; email: string; cpf: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);


  const setToken = (newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem('token', newToken);
    setupAxiosInterceptors(newToken, logout);
  
    api.get('/users/me')
      .then(res => {
        setUser(res.data);
      })
      .catch(() => {
        logout();
      });
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
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      setTokenState(storedToken);
      setupAxiosInterceptors(storedToken, logout);

      api.get('/users/me')
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setIsAuthLoading(false);
        });
    } else {
      setIsAuthLoading(false); 
    }
  }, []);

  useEffect(() => {
    setupAxiosInterceptors(token, logout);
  }, [token]);

  if (isAuthLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
        bgcolor="#121212"
      >
        <CircularProgress />
      </Box>
    );
  }

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
