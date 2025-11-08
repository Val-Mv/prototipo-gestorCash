/**
 * Servicio API para Cajas Registradoras
 */
import { apiRequest } from '@/lib/api-config';

export interface CashRegister {
  idCaja: number;
  numeroCaja: string;
  montoInicialRequerido: number;
  ubicacion?: string | null;
  estadoActiva: boolean;
  fechaRegistro?: string;
}

export interface CreateCashRegisterPayload {
  numeroCaja: string;
  montoInicialRequerido: number;
  ubicacion?: string | null;
  estadoActiva?: boolean;
}

export interface UpdateCashRegisterPayload {
  numeroCaja?: string;
  montoInicialRequerido?: number;
  ubicacion?: string | null;
  estadoActiva?: boolean;
}

/**
 * Obtener todas las cajas registradoras
 */
export async function getActiveCashRegisters(activeOnly: boolean = true): Promise<CashRegister[]> {
  const params = new URLSearchParams();
  if (activeOnly) {
    params.append('active_only', 'true');
  }
  // Si activeOnly es false, no enviar el parámetro para obtener todas (activas e inactivas)
  const queryString = params.toString();
  return apiRequest<CashRegister[]>(`/api/stores/registers${queryString ? `?${queryString}` : ''}`);
}

/**
 * Obtener una caja registradora por ID
 */
export async function getCashRegister(id: number): Promise<CashRegister> {
  return apiRequest<CashRegister>(`/api/stores/registers/${id}`);
}

/**
 * Crear una nueva caja registradora
 */
export async function createCashRegister(payload: CreateCashRegisterPayload): Promise<CashRegister> {
  return apiRequest<CashRegister>('/api/stores/registers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Actualizar una caja registradora
 */
export async function updateCashRegister(
  id: number,
  payload: UpdateCashRegisterPayload
): Promise<CashRegister> {
  return apiRequest<CashRegister>(`/api/stores/registers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Eliminar (desactivar) una caja registradora
 */
export async function deleteCashRegister(id: number): Promise<void> {
  return apiRequest<void>(`/api/stores/registers/${id}`, {
    method: 'DELETE',
  });
}

