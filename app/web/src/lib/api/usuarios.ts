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
  estadoActivo: number; // numeric(1/0) según DDL
  idRol: number;
  nombreRol?: string | null; // Viene del JOIN con rol
}

export interface CreateUsuarioPayload {
  nombreCompleto: string;
  email: string;
  contrasena: string; // Cambiado de contrasenaHash a contrasena
  telefono?: string | null;
  estadoActivo?: number; // numeric(1/0) según DDL
  idRol: number;
}

export interface UpdateUsuarioPayload {
  nombreCompleto?: string;
  email?: string;
  contrasena?: string; // Cambiado de contrasenaHash a contrasena
  telefono?: string | null;
  estadoActivo?: number; // numeric(1/0) según DDL
  idRol?: number;
}

export interface CambioEstadoPayload {
  estadoActivo: number; // numeric(1/0)
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
    contrasena: payload.contrasena, // El backend espera 'contrasena', no 'contrasenaHash'
    idRol: payload.idRol,
    estadoActivo: payload.estadoActivo ?? 1, // Enviar como numeric(1/0)
    ...(payload.telefono ? { telefono: payload.telefono } : {}),
  };

  return apiRequest<Usuario>('/usuario', {
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
  // El backend retorna usuarios con nombreRol del JOIN
  return apiRequest<Usuario[]>(`/usuario${queryString ? `?${queryString}` : ''}`);
}

/**
 * Obtener un usuario por ID
 */
export async function getUsuario(id: number): Promise<Usuario> {
  return apiRequest<Usuario>(`/usuario/${id}`);
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
  if (payload.contrasena !== undefined && payload.contrasena.length > 0) {
    backendPayload.contrasena = payload.contrasena; // El backend espera 'contrasena'
  }
  if (payload.idRol !== undefined) {
    backendPayload.idRol = payload.idRol;
  }
  if (payload.estadoActivo !== undefined) {
    backendPayload.estadoActivo = payload.estadoActivo; // Enviar como numeric(1/0)
  }
  if (payload.telefono !== undefined && payload.telefono !== null && payload.telefono !== '') {
    backendPayload.telefono = payload.telefono;
  }

  return apiRequest<Usuario>(`/usuario/${id}`, {
    method: 'PUT',
    body: JSON.stringify(backendPayload),
  });
}

/**
 * Cambiar estado de un usuario (activar/desactivar)
 */
export async function cambiarEstadoUsuario(
  id: number,
  estadoActivo: number
): Promise<{ idUsuario: number; estadoActivo: boolean; mensaje: string }> {
  return apiRequest(`/usuario/${id}/estado`, {
    method: 'PATCH',
    body: JSON.stringify({ estadoActivo }),
  });
}

/**
 * Desactivar un usuario (usando cambio de estado)
 */
export async function deleteUsuario(id: number): Promise<void> {
  // Usar el endpoint de cambio de estado en lugar de DELETE
  await cambiarEstadoUsuario(id, 0);
}

