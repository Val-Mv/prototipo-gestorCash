/**
 * Servicio API para Tiendas
 */
import { apiRequest } from '@/lib/api-config';

export interface Store {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface CreateStorePayload {
  id: string;
  name: string;
  code: string;
  active?: boolean;
}

/**
 * Obtener todas las tiendas
 */
export async function getStores(activeOnly: boolean = true): Promise<Store[]> {
  const params = new URLSearchParams();
  if (activeOnly) {
    params.append('active_only', 'true');
  }
  // Si activeOnly es false, no enviar el parámetro para obtener todas las tiendas
  const queryString = params.toString();
  return apiRequest<Store[]>(`/api/stores${queryString ? `?${queryString}` : ''}`);
}

/**
 * Obtener una tienda por ID
 */
export async function getStore(id: string): Promise<Store> {
  return apiRequest<Store>(`/api/stores/${id}`);
}

/**
 * Crear una nueva tienda
 */
export async function createStore(payload: CreateStorePayload): Promise<Store> {
  return apiRequest<Store>('/api/stores', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Actualizar una tienda
 */
export async function updateStore(
  id: string,
  payload: Partial<CreateStorePayload>
): Promise<Store> {
  return apiRequest<Store>(`/api/stores/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Eliminar (desactivar) una tienda
 */
export async function deleteStore(id: string): Promise<void> {
  return apiRequest<void>(`/api/stores/${id}`, {
    method: 'DELETE',
  });
}

