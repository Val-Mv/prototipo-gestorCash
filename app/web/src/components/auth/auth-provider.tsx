import type { AppUser } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'cashflow-user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Usar setTimeout para evitar bloqueo del render inicial
    const timer = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (email: string) => {
    setLoading(true);
    try {
      // Mock authentication
      const foundUser = mockUsers[email];
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
        navigate('/dashboard');
      } else {
        throw new Error('User not found or password incorrect');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
