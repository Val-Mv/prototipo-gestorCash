/**
 * Servicio API para Gastos
 */
import { apiRequest } from '@/lib/api-config';
import type { Gasto } from '@/lib/types';

export interface CrearGastoPayload {
  fecha?: string;
  monto: number;
  descripcion: string;
  numeroComprobante: string;
  rutaComprobante: string;
  idCaja?: number | null;
  idUsuarioRegistro: number;
  idUsuarioAprobacion?: number | null;
  idCajaOrigen?: number | null;
  idCategoria: number;
  idEstadoGasto: number;
}

export interface FiltroGastos {
  idCaja?: number;
  idCategoria?: number;
  idEstadoGasto?: number;
  fechaDesde?: string;
  fechaHasta?: string;
  skip?: number;
  limit?: number;
}

/**
 * Crear un nuevo gasto
 */
export async function crearGasto(payload: CrearGastoPayload): Promise<Gasto> {
  return apiRequest<Gasto>('/api/gastos', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Obtener lista de gastos
 */
export async function obtenerGastos(filtros?: FiltroGastos): Promise<Gasto[]> {
  const params = new URLSearchParams();

  if (typeof filtros?.idCaja === 'number') params.append('idCaja', filtros.idCaja.toString());
  if (typeof filtros?.idCategoria === 'number') params.append('idCategoria', filtros.idCategoria.toString());
  if (typeof filtros?.idEstadoGasto === 'number') params.append('idEstadoGasto', filtros.idEstadoGasto.toString());
  if (filtros?.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros?.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
  if (typeof filtros?.skip === 'number') params.append('skip', filtros.skip.toString());
  if (typeof filtros?.limit === 'number') params.append('limit', filtros.limit.toString());

  const queryString = params.toString();
  return apiRequest<Gasto[]>(`/api/gastos${queryString ? `?${queryString}` : ''}`);
}

/**
 * Obtener un gasto por ID
 */
export async function obtenerGasto(id: number): Promise<Gasto> {
  return apiRequest<Gasto>(`/api/gastos/${id}`);
}

/**
 * Actualizar un gasto
 */
export async function actualizarGasto(
  id: number,
  payload: Partial<CrearGastoPayload>
): Promise<Gasto> {
  return apiRequest<Gasto>(`/api/gastos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Eliminar un gasto
 */
export async function eliminarGasto(id: number): Promise<void> {
  return apiRequest<void>(`/api/gastos/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Obtener estadísticas de gastos por categoría
 */
export async function obtenerEstadisticasGastosPorCategoria(params?: {
  idEstadoGasto?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}): Promise<Record<number, { cantidad: number; total: number }>> {
  const queryParams = new URLSearchParams();

  if (typeof params?.idEstadoGasto === 'number') {
    queryParams.append('idEstadoGasto', params.idEstadoGasto.toString());
  }
  if (params?.fechaDesde) queryParams.append('fechaDesde', params.fechaDesde);
  if (params?.fechaHasta) queryParams.append('fechaHasta', params.fechaHasta);

  const queryString = queryParams.toString();
  return apiRequest<Record<number, { cantidad: number; total: number }>>(
    `/api/gastos/estadisticas/por-categoria${queryString ? `?${queryString}` : ''}`
  );
}

