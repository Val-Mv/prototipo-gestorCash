import type { AppUser } from '@/lib/types';
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '@/lib/api-config';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  login: (email: string, contrasena: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'cashflow-user';
const TOKEN_STORAGE_KEY = 'cashflow-token';

// Mapear nombreRol del backend a UserRole del frontend
function mapRolToUserRole(nombreRol: string): 'DM' | 'SM' | 'ASM' {
  const rolLower = nombreRol.toLowerCase();
  if (rolLower.includes('distrito') || rolLower.includes('dm')) return 'DM';
  if (rolLower.includes('gerente') || rolLower.includes('sm')) return 'SM';
  return 'ASM';
}

interface LoginResponse {
  token: string;
  usuario: {
    // El backend devuelve campos en minúsculas (idusuario, nombrecompleto, etc.)
    idusuario: number | string;
    nombrecompleto: string;
    email: string;
    telefono?: string | null;
    estadoactivo: number;
    idrol: number | string;
    nombrerol: string | null;
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Usar setTimeout para evitar bloqueo del render inicial
    const timer = setTimeout(() => {
      try {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to parse user from localStorage', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async (email: string, contrasena: string) => {
    setLoading(true);
    try {
      console.log("LOGIN → Iniciando login con:", { email });

      const response = await apiRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, contrasena }),
      });

      console.log("LOGIN → Response recibida:", response);
      console.log("LOGIN → Response.usuario:", response?.usuario);
      console.log("LOGIN → Response.token:", response?.token);

      // Validar que la respuesta tenga la estructura esperada
      if (!response) {
        throw new Error('La respuesta del servidor está vacía');
      }

      if (!response.usuario) {
        console.error("LOGIN → Response.usuario es undefined:", response);
        throw new Error('La respuesta del servidor no contiene datos de usuario');
      }

      if (!response.token) {
        console.error("LOGIN → Response.token es undefined:", response);
        throw new Error('La respuesta del servidor no contiene token');
      }

      // Validar que idusuario exista antes de usarlo
      if (response.usuario.idusuario === undefined || response.usuario.idusuario === null) {
        console.error("LOGIN → Response.usuario.idusuario es undefined/null:", response.usuario);
        throw new Error('La respuesta del servidor no contiene idusuario válido');
      }

      // Mapear respuesta del backend a AppUser
      // El backend devuelve campos en minúsculas, mapearlos a camelCase para AppUser
      const appUser: AppUser = {
        uid: String(response.usuario.idusuario),
        email: response.usuario.email,
        displayName: response.usuario.nombrecompleto,
        role: mapRolToUserRole(response.usuario.nombrerol || ''),
        idUsuario: Number(response.usuario.idusuario),
      };

      console.log("LOGIN → AppUser creado:", appUser);

      setUser(appUser);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
      localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('LOGIN → Error completo:', error);
      console.error('LOGIN → Error name:', error?.name);
      console.error('LOGIN → Error message:', error?.message);
      console.error('LOGIN → Error stack:', error?.stack);
      throw new Error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const value = { user, loading, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
