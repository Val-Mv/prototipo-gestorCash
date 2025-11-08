/**
 * Configuración de la API Backend
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Función helper para hacer requests al backend
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: `HTTP error! status: ${response.status}` };
    }
    
    // Crear un error más descriptivo
    const error = new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
    (error as any).error = errorData.error;
    (error as any).details = errorData.details || errorData.detalles;
    (error as any).status = response.status;
    throw error;
  }

  return response.json();
}
