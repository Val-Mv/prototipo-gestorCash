/**
 * Servicio API para Expenses
 */
import { apiRequest } from '@/lib/api-config';
import type { Expense } from '@/lib/types';

export interface CreateExpensePayload {
  category: 'store_supplies' | 'maintenance' | 'paperwork' | 'transport';
  item: string;
  amount: number;
  description: string;
  attachment_url?: string;
  store_id?: string;
  register_id?: string;
  date?: string;
  user_id?: string;
}

export interface ExpenseFilters {
  store_id?: string;
  category?: string;
  date?: string;
  skip?: number;
  limit?: number;
}

/**
 * Crear un nuevo gasto
 */
export async function createExpense(payload: CreateExpensePayload): Promise<Expense> {
  return apiRequest<Expense>('/api/expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Obtener lista de gastos
 */
export async function getExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
  const params = new URLSearchParams();
  
  if (filters?.store_id) params.append('store_id', filters.store_id);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.date) params.append('date', filters.date);
  if (filters?.skip) params.append('skip', filters.skip.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  const queryString = params.toString();
  return apiRequest<Expense[]>(`/api/expenses${queryString ? `?${queryString}` : ''}`);
}

/**
 * Obtener un gasto por ID
 */
export async function getExpense(id: string): Promise<Expense> {
  return apiRequest<Expense>(`/api/expenses/${id}`);
}

/**
 * Actualizar un gasto
 */
export async function updateExpense(
  id: string,
  payload: Partial<CreateExpensePayload>
): Promise<Expense> {
  return apiRequest<Expense>(`/api/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

/**
 * Eliminar un gasto
 */
export async function deleteExpense(id: string): Promise<void> {
  return apiRequest<void>(`/api/expenses/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Obtener estadísticas de gastos por categoría
 */
export async function getExpensesStatsByCategory(params?: {
  store_id?: string;
  date_from?: string;
  date_to?: string;
}): Promise<Record<string, { count: number; total: number }>> {
  const queryParams = new URLSearchParams();
  
  if (params?.store_id) queryParams.append('store_id', params.store_id);
  if (params?.date_from) queryParams.append('date_from', params.date_from);
  if (params?.date_to) queryParams.append('date_to', params.date_to);

  const queryString = queryParams.toString();
  return apiRequest<Record<string, { count: number; total: number }>>(
    `/api/expenses/stats/by-category${queryString ? `?${queryString}` : ''}`
  );
}

