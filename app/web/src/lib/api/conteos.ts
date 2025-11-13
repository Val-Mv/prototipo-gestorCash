/**
 * Servicio API para Conteos de Caja
 */
import { apiRequest } from '@/lib/api-config';

export interface Conteo {
  idConteo: number;
  fechaHora: string;
  montoContado: number;
  montoEsperado: number;
  diferencia: number;
  observaciones?: string | null;
  idCaja: number;
  idUsuario: number;
  idTipoConteo: number;
  idReporte?: number | null;
}

export interface CreateConteoPayload {
  fechaHora?: string;
  montoContado: number;
  montoEsperado: number;
  diferencia: number;
  observaciones?: string | null;
  idCaja: number;
  idUsuario: number;
  idTipoConteo: number;
  idReporte?: number | null;
}

/**
 * Crear un conteo
 */
export async function createConteo(payload: CreateConteoPayload): Promise<Conteo> {
  return apiRequest<Conteo>('/api/conteos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Obtener conteos (opcional)
 */
export interface GetConteosParams {
  skip?: number;
  limit?: number;
  idCaja?: number;
  idUsuario?: number;
  idTipoConteo?: number;
  idReporte?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}

export async function getConteos(params: GetConteosParams = {}): Promise<Conteo[]> {
  const searchParams = new URLSearchParams();

  if (typeof params.skip === 'number') searchParams.append('skip', String(params.skip));
  if (typeof params.limit === 'number') searchParams.append('limit', String(params.limit));
  if (typeof params.idCaja === 'number') searchParams.append('idCaja', String(params.idCaja));
  if (typeof params.idUsuario === 'number') searchParams.append('idUsuario', String(params.idUsuario));
  if (typeof params.idTipoConteo === 'number') searchParams.append('idTipoConteo', String(params.idTipoConteo));
  if (typeof params.idReporte === 'number') searchParams.append('idReporte', String(params.idReporte));
  if (params.fechaDesde) searchParams.append('fechaDesde', params.fechaDesde);
  if (params.fechaHasta) searchParams.append('fechaHasta', params.fechaHasta);

  const queryString = searchParams.toString();
  return apiRequest<Conteo[]>(`/api/conteos${queryString ? `?${queryString}` : ''}`);
}




