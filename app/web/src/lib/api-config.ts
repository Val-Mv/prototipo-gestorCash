/**
 * Configuración de la API Backend
 * 
 * En desarrollo local, apunta a http://localhost:8000
 * En producción o cuando VITE_API_URL está definido, usa esa URL
 * 
 * Los endpoints siempre deben incluir /api (ej: /api/usuarios, /api/gastos)
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Función helper para hacer requests al backend
 */
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Construir la URL completa
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  // LOGS PARA DEBUG (TEMPORAL - BORRAR LUEGO)
  console.log("API BASE URL:", API_BASE_URL);
  console.log("FULL REQUEST URL:", url);
  console.log("Endpoint recibido:", endpoint);
  console.log("Options:", options);

  // Validar que API_BASE_URL no sea undefined
  if (!API_BASE_URL || API_BASE_URL === 'undefined') {
    const error = new Error('API_BASE_URL no está configurado. Verifica VITE_API_URL en .env');
    console.error('ERROR CRÍTICO:', error.message);
    throw error;
  }

  // Obtener token del localStorage si existe
  const token = localStorage.getItem('cashflow-token');

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    console.log("Response recibida:", response);
    console.log("Response status:", response?.status);
    console.log("Response ok:", response?.ok);

    if (!response || !response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');
      
      // Verificar si la respuesta es JSON antes de intentar parsearla
      if (contentType && contentType.includes('application/json')) {
        try {
          errorData = await response.json();
        } catch (e) {
          console.error("Error al parsear respuesta JSON:", e);
          errorData = {
            message: `HTTP error! status: ${response?.status || 'unknown'}`,
            error: `HTTP error! status: ${response?.status || 'unknown'}`
          };
        }
      } else {
        // Si la respuesta no es JSON (probablemente HTML de error), leer como texto
        try {
          const text = await response.text();
          console.error("Respuesta no-JSON recibida:", text.substring(0, 200));
          errorData = {
            message: `El servidor devolvió una respuesta no-JSON (${response?.status || 'unknown'}). Verifica que la ruta exista y el servidor esté funcionando correctamente.`,
            error: `HTTP error! status: ${response?.status || 'unknown'} - Respuesta no-JSON`
          };
        } catch (e) {
          console.error("Error al leer respuesta:", e);
          errorData = {
            message: `HTTP error! status: ${response?.status || 'unknown'}`,
            error: `HTTP error! status: ${response?.status || 'unknown'}`
          };
        }
      }

      // Crear un error más descriptivo
      const error = new Error(
        errorData.message ||
        errorData.error ||
        `HTTP error! status: ${response?.status || 'unknown'}`
      );
      (error as any).error = errorData.error;
      (error as any).details = errorData.details || errorData.detalles;
      (error as any).status = response?.status;
      throw error;
    }

    // Verificar que la respuesta exitosa sea JSON antes de parsearla
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Clonar la respuesta para poder leer el texto sin consumir el body
      const clonedResponse = response.clone();
      const text = await clonedResponse.text();
      console.error("Respuesta exitosa pero no-JSON:", text.substring(0, 200));
      throw new Error(`El servidor devolvió una respuesta no-JSON. Esperado: application/json, recibido: ${contentType || 'unknown'}`);
    }

    const jsonData = await response.json();
    console.log("Response JSON data:", jsonData);
    return jsonData;
  } catch (error: any) {
    console.error("Error en apiRequest:", error);
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);

    // Si es un error de red, proporcionar mensaje más claro
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Error de conexión: No se pudo conectar al servidor en ${url}. Verifica que el backend esté corriendo.`);
    }

    throw error;
  }
}
