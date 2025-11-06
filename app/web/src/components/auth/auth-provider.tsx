'use client';

import type { AppUser } from '@/lib/types';
import { mockUsers } from '@/lib/data';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
  const router = useRouter();

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
    // Mock authentication
    const foundUser = mockUsers[email];
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(foundUser));
      router.push('/dashboard');
    } else {
      throw new Error('User not found or password incorrect');
    }
    setLoading(false);
  }, [router]);

  const logout = useCallback(async () => {
    setLoading(true);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    router.push('/login');
    setLoading(false);
  }, [router]);

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
