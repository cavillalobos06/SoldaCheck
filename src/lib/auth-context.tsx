import React, { createContext, useContext, useEffect, useState, useTransition } from 'react';
import { api, type User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Read persisted auth from localStorage
    const storedToken = localStorage.getItem('soldacheck_token');
    const storedUser = localStorage.getItem('soldacheck_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token with backend in background
        api.getProfile()
          .then((profile) => {
            setUser(profile);
            localStorage.setItem('soldacheck_user', JSON.stringify(profile));
          })
          .catch(() => {
            // If token invalid, logout
            logout();
          })
          .finally(() => {
            setIsLoading(false);
          });
        return;
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<User> => {
    const res = await api.login(email, pass);
    localStorage.setItem('soldacheck_token', res.accessToken);
    localStorage.setItem('soldacheck_user', JSON.stringify(res.user));
    startTransition(() => {
      setToken(res.accessToken);
      setUser(res.user);
    });
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('soldacheck_token');
    localStorage.removeItem('soldacheck_user');
    startTransition(() => {
      setToken(null);
      setUser(null);
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
