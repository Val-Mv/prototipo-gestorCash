/**
 * Servicio API para Usuarios
 */
import { apiRequest } from '@/lib/api-config';

export interface Usuario {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  telefono?: string | null;
  fechaCreacion?: string;
  estadoActivo: boolean;
  idRol: number;
}

export interface CreateUsuarioPayload {
  nombreCompleto: string;
  email: string;
  contrasenaHash: string;
  telefono?: string | null;
  estadoActivo?: boolean;
  idRol: number;
}

export interface UpdateUsuarioPayload {
  nombreCompleto?: string;
  email?: string;
  contrasenaHash?: string;
  telefono?: string | null;
  estadoActivo?: boolean;
  idRol?: number;
}

export interface UsuarioFilters {
  idRol?: number;
  soloActivos?: boolean;
  skip?: number;
  limit?: number;
}

/**
 * Crear un nuevo usuario
 */
export async function createUsuario(payload: CreateUsuarioPayload): Promise<Usuario> {
  const backendPayload = {
    nombreCompleto: payload.nombreCompleto,
    email: payload.email,
    contrasenaHash: payload.contrasenaHash,
    idRol: payload.idRol,
    estadoActivo: payload.estadoActivo ?? true,
    ...(payload.telefono ? { telefono: payload.telefono } : {}),
  };
  
  return apiRequest<Usuario>('/api/usuarios', {
    method: 'POST',
    body: JSON.stringify(backendPayload),
  });
}

/**
 * Obtener todos los usuarios
 */
export async function getUsuarios(filters?: UsuarioFilters): Promise<Usuario[]> {
  const params = new URLSearchParams();
  
  if (filters?.idRol) params.append('idRol', filters.idRol.toString());
  if (filters?.soloActivos !== undefined) params.append('soloActivos', filters.soloActivos.toString());
  if (filters?.skip) params.append('skip', filters.skip.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  return apiRequest<Usuario[]>(`/api/usuarios${queryString ? `?${queryString}` : ''}`);
}

/**
 * Obtener un usuario por ID
 */
export async function getUsuario(id: number): Promise<Usuario> {
  return apiRequest<Usuario>(`/api/usuarios/${id}`);
}

/**
 * Obtener usuario por email
 */
export async function getUsuarioByEmail(email: string): Promise<Usuario | null> {
  try {
    const usuarios = await getUsuarios();
    return usuarios.find(u => u.email === email) || null;
  } catch (error) {
    console.error('Error al obtener usuario por email:', error);
    return null;
  }
}

/**
 * Actualizar un usuario
 */
export async function updateUsuario(
  id: number,
  payload: UpdateUsuarioPayload
): Promise<Usuario> {
  const backendPayload: any = {};
  
  if (payload.nombreCompleto !== undefined) {
    backendPayload.nombreCompleto = payload.nombreCompleto;
  }
  if (payload.email !== undefined) {
    backendPayload.email = payload.email;
  }
  if (payload.contrasenaHash !== undefined) {
    backendPayload.contrasenaHash = payload.contrasenaHash;
  }
  if (payload.idRol !== undefined) {
    backendPayload.idRol = payload.idRol;
  }
  if (payload.estadoActivo !== undefined) {
    backendPayload.estadoActivo = payload.estadoActivo;
  }
  if (payload.telefono !== undefined && payload.telefono !== null && payload.telefono !== '') {
    backendPayload.telefono = payload.telefono;
  }
  
  return apiRequest<Usuario>(`/api/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(backendPayload),
  });
}

/**
 * Desactivar un usuario
 */
export async function deleteUsuario(id: number): Promise<void> {
  return apiRequest<void>(`/api/usuarios/${id}`, {
    method: 'DELETE',
  });
}

