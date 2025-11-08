/**
 * Servicio API para Roles
 */
import { apiRequest } from '@/lib/api-config';

export interface Rol {
  idRol: number;
  nombreRol: string;
  descripcion?: string | null;
}

/**
 * Obtener todos los roles
 */
export async function getRoles(): Promise<Rol[]> {
  return apiRequest<Rol[]>('/api/roles');
}

/**
 * Obtener un rol por ID
 */
export async function getRol(id: number): Promise<Rol> {
  return apiRequest<Rol>(`/api/roles/${id}`);
}

