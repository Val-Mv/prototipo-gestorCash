import type { AppUser } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '@/lib/api-config';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
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

  const login = useCallback(async (email: string, contrasena: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, contrasena }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Credenciales incorrectas');
      }

      const { user: loggedInUser, token } = await response.json();

      if (loggedInUser && token) {
        setUser(loggedInUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedInUser));
        localStorage.setItem('auth-token', token); // Guardar el token
        navigate('/dashboard');
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
      localStorage.removeItem('auth-token'); // Limpiar el token
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
