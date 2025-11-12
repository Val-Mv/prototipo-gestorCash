# Configuración de Conexión Frontend → Backend

## Resumen

El frontend está correctamente configurado para conectarse al backend.

## Configuración Actual

### Backend (Puerto 8000)
- **Archivo**: `app/server/src/index.ts`
- **Puerto**: `8000` (por defecto, configurable con `process.env.PORT`)
- **CORS**: Permite conexiones desde:
  - `http://localhost:3000`
  - `http://localhost:3001`
  - `http://127.0.0.1:3000`
  - `http://127.0.0.1:3001`

### Frontend (Puerto 3000)
- **Archivo**: `app/web/vite.config.ts`
- **Puerto**: `3000`
- **Proxy**: Configurado para redirigir `/api/*` a `http://localhost:8000`

### Configuración API (`api-config.ts`)
- **Archivo**: `app/web/src/lib/api-config.ts`
- **Comportamiento**:
  - Si `VITE_API_URL` está definido: usa URL absoluta
  - Si no está definido: usa rutas relativas (aprovecha el proxy de Vite)

## Cómo Funciona

1. **En Desarrollo (sin `.env`)**:
   - El frontend usa rutas relativas como `/api/gastos`
   - El proxy de Vite redirige automáticamente a `http://localhost:8000/api/gastos`
   - Esto evita problemas de CORS

2. **En Producción o con `.env`**:
   - Si defines `VITE_API_URL=http://tu-backend.com` en un archivo `.env`
   - El frontend usará URLs absolutas directamente

## Verificación

Para verificar que la conexión funciona:

1. **Inicia el backend**:
   ```bash
   cd app/server
   npm run dev
   ```
   Deberías ver: `🚀 Servidor corriendo en http://localhost:8000`

2. **Inicia el frontend**:
   ```bash
   cd app/web
   npm run dev
   ```
   Deberías ver el frontend en `http://localhost:3000`

3. **Prueba la conexión**:
   - Abre el navegador en `http://localhost:3000`
   - Abre las herramientas de desarrollador (F12)
   - Ve a la pestaña "Network"
   - Intenta usar la aplicación
   - Deberías ver peticiones a `/api/*` que se redirigen al backend

## Variables de Entorno (Opcional)

Si necesitas cambiar la URL del backend, crea un archivo `.env` en `app/web/`:

```env
VITE_API_URL=http://localhost:8000
```

O para producción:

```env
VITE_API_URL=https://api.tu-dominio.com
```

## Notas

- El proxy de Vite solo funciona en desarrollo (`npm run dev`)
- En producción, asegúrate de tener `VITE_API_URL` configurado
- El backend debe estar corriendo antes de que el frontend pueda hacer peticiones

