/**
 * Servicio API para Tipos de Conteo
 */
import { apiRequest } from '@/lib/api-config';

export interface TipoConteo {
  idTipoConteo: number;
  nombreTipo: string;
}

export interface CreateTipoConteoPayload {
  nombreTipo: string;
}

/**
 * Listar tipos de conteo
 */
export async function getTiposConteo(): Promise<TipoConteo[]> {
  return apiRequest<TipoConteo[]>('/api/tipos-conteo');
}

/**
 * Crear un tipo de conteo
 */
export async function createTipoConteo(payload: CreateTipoConteoPayload): Promise<TipoConteo> {
  return apiRequest<TipoConteo>('/api/tipos-conteo', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}



