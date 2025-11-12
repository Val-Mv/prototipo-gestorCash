# ✅ Solución al Error de Conexión Docker

## 🐛 Problema Identificado

El backend en Docker intentaba conectarse a `127.0.0.1:5432`, pero dentro del contenedor Docker, `127.0.0.1` no apunta al contenedor de PostgreSQL, sino al propio contenedor del backend.

**Error:**
```
ConnectionRefusedError [SequelizeConnectionRefusedError]: connect ECONNREFUSED 127.0.0.1:5432
```

## ✅ Solución Implementada

### 1. Detección Automática de Docker

El código ahora detecta automáticamente si está ejecutándose en Docker usando las variables de entorno:
- `RUNNING_IN_DOCKER=true`
- `DOCKER_CONTAINER=true`

Estas variables se establecen en `docker-compose.yml`.

### 2. Ajuste Automático del Hostname

Cuando está en Docker:
- Si la URL tiene `localhost` o `127.0.0.1`, se cambia automáticamente a `db` (nombre del servicio Docker)
- Si no se especifica `DB_HOST`, se usa `db` por defecto

Cuando NO está en Docker:
- Si la URL tiene `db`, se cambia automáticamente a `localhost`
- Si no se especifica `DB_HOST`, se usa `localhost` por defecto

### 3. Configuración del Script

El script `configure-local.ps1` ahora configura:
- `DB_HOST=db` (nombre del servicio Docker)
- `LOCAL_DATABASE_URL=postgresql://admin:admin@db:5432/gestorcash`

### 4. Variables de Entorno en Docker Compose

Se agregaron las variables de entorno necesarias en `docker-compose.yml`:
```yaml
environment:
  - RUNNING_IN_DOCKER=true
  - DOCKER_CONTAINER=true
```

## 📝 Cambios Realizados

### Archivos Modificados

1. **`app/server/src/config/database.ts`**
   - Detección automática de Docker
   - Ajuste automático del hostname según el entorno
   - Logs informativos cuando se ajusta el hostname

2. **`scripts/configure-local.ps1`**
   - Configura `DB_HOST=db` para Docker
   - Configura `LOCAL_DATABASE_URL` con hostname `db`
   - Mensajes informativos sobre la configuración

3. **`docker-compose.yml`**
   - Agregadas variables `RUNNING_IN_DOCKER` y `DOCKER_CONTAINER`
   - Removido `depends_on` para evitar problemas con perfiles

4. **`app/server/ENV_TEMPLATE.txt`**
   - Actualizado con `DB_HOST=db` como valor por defecto
   - Documentación sobre cuándo usar `db` vs `localhost`

## 🚀 Cómo Usar

### Opción 1: Usar el Script (Recomendado)

```powershell
# Configurar para Docker
.\scripts\configure-local.ps1

# Arrancar servicios
npm run use:local
```

### Opción 2: Configuración Manual

Edita `app/server/.env`:
```env
ACTIVE_DB=local
DB_HOST=db
DB_PORT=5432
DB_USERNAME=admin
DB_PASSWORD=admin
DB_NAME=gestorcash
LOCAL_DATABASE_URL=postgresql://admin:admin@db:5432/gestorcash
```

### Opción 3: Ejecutar Fuera de Docker

Si ejecutas el backend fuera de Docker (directamente con Node), usa:
```env
ACTIVE_DB=local
DB_HOST=localhost
LOCAL_DATABASE_URL=postgresql://admin:admin@localhost:5432/gestorcash
```

El código detectará automáticamente que NO está en Docker y ajustará el hostname.

## ✅ Verificación

### 1. Ver logs del backend
```bash
docker logs gestor-backend
```

Deberías ver:
- `🔄 Ajustando hostname de 'localhost' a 'db' para Docker` (si se ajustó)
- `Database connection established`
- `✅ Conectado exitosamente a la base de datos`

### 2. Probar el endpoint
```bash
GET http://localhost:8000/api/usuarios
```

Deberías obtener `[]` (vacío) si las tablas están creadas.

## 🔍 Cómo Funciona

### Flujo de Detección

1. **El código detecta si está en Docker:**
   ```typescript
   const isInDocker = process.env.RUNNING_IN_DOCKER === 'true' || 
                      process.env.DOCKER_CONTAINER === 'true';
   ```

2. **Resuelve la URL de la base de datos:**
   - Si `LOCAL_DATABASE_URL` tiene `localhost`, lo cambia a `db` (en Docker)
   - Si `DB_HOST` no está definido, usa `db` (en Docker) o `localhost` (fuera de Docker)

3. **Ajusta el hostname si es necesario:**
   - Si está en Docker y la URL tiene `localhost`, cambia a `db`
   - Si NO está en Docker y la URL tiene `db`, cambia a `localhost`

### Ejemplo de Logs

**Cuando se ajusta el hostname:**
```
🔄 Ajustando hostname de 'localhost' a 'db' para Docker
✅ Conectado exitosamente a la base de datos (postgresql://admin:***@db:5432/gestorcash) usando el dialecto "postgres"
Database connection established
```

## 🐛 Solución de Problemas

### Error: "connect ECONNREFUSED 127.0.0.1:5432"

**Causa:** El backend está intentando conectarse a `localhost` dentro de Docker.

**Solución:**
1. Verifica que `RUNNING_IN_DOCKER=true` esté en `docker-compose.yml`
2. Verifica que `DB_HOST=db` en `app/server/.env`
3. Ejecuta `.\scripts\configure-local.ps1` para actualizar la configuración
4. Reinicia los contenedores: `npm run down && npm run use:local`

### Error: "connect ECONNREFUSED db:5432"

**Causa:** El backend está intentando conectarse a `db` pero no está en Docker.

**Solución:**
1. Si ejecutas fuera de Docker, cambia `DB_HOST=localhost` en `.env`
2. O ejecuta dentro de Docker: `npm run use:local`

### El hostname no se ajusta automáticamente

**Causa:** Las variables de entorno de Docker no están configuradas.

**Solución:**
1. Verifica que `docker-compose.yml` tenga:
   ```yaml
   environment:
     - RUNNING_IN_DOCKER=true
     - DOCKER_CONTAINER=true
   ```
2. Reinicia los contenedores: `npm run down && npm run use:local`

## 📚 Referencias

- [GUIA_ARRANQUE.md](./GUIA_ARRANQUE.md) - Guía completa de arranque
- [CONFIGURACION_SUPABASE.md](./CONFIGURACION_SUPABASE.md) - Configuración de Supabase
- [app/server/ENV_TEMPLATE.txt](./app/server/ENV_TEMPLATE.txt) - Template de variables de entorno

---

**Estado:** ✅ Problema resuelto - El backend ahora se conecta correctamente a PostgreSQL en Docker usando el hostname `db`.

