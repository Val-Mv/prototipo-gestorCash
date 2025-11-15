# ✅ Solución al Error: column "codigo" does not exist

## 🐛 Problema Identificado

El backend intenta crear un índice único sobre la columna `codigo` en la tabla `caja_fuerte`, pero esta columna no existe en la base de datos.

**Error:**
```
ERROR: column "codigo" does not exist
CREATE UNIQUE INDEX "idx_cajas_fuertes_codigo" ON "caja_fuerte" ("codigo")
```

## 🔍 Causa del Problema

El modelo Sequelize `CajaFuerte` define:
- Campo `codigo`: `STRING(100)`, `NOT NULL`, `UNIQUE`
- Índice único: `idx_cajas_fuertes_codigo`

Pero la tabla `caja_fuerte` en PostgreSQL no tiene esta columna (probablemente restaurada desde un backup antiguo).

## ✅ Soluciones

### 🟢 Opción 1: Aplicar Migración SQL (Recomendado)

**Esta es la solución más segura y documentada.**

#### Paso 1: Aplicar la migración

**En Windows (PowerShell):**
```powershell
.\scripts\apply-migration-codigo.ps1
```

**En Linux/Mac:**
```bash
chmod +x scripts/apply-migration-codigo.sh
./scripts/apply-migration-codigo.sh
```

**O manualmente:**
```bash
# Si los contenedores están corriendo
docker exec -i gestor-postgres psql -U admin -d gestorcash < db/migrations/0002_add_codigo_caja_fuerte.sql
```

#### Paso 2: Reiniciar el backend

```bash
npm run down
npm run use:local
```

#### Paso 3: Verificar

```bash
docker logs gestor-backend
```

Deberías ver:
- `Database connection established`
- `✅ Modelos sincronizados con la base de datos`

### 🟡 Opción 2: Usar Sequelize Sync con ALTER (Temporal)

**Solo para desarrollo, no recomendado para producción.**

#### Paso 1: Habilitar ALTER en `.env`

Edita `app/server/.env`:
```env
SHOULD_SYNC_DB_ALTER=true
```

#### Paso 2: Reiniciar el backend

```bash
npm run down
npm run use:local
```

Sequelize agregará automáticamente la columna faltante.

#### Paso 3: Deshabilitar ALTER

Después de que funcione, deshabilita ALTER:
```env
SHOULD_SYNC_DB_ALTER=false
```

### 🔵 Opción 3: SQL Manual (Si las opciones anteriores fallan)

#### Paso 1: Conectarse a PostgreSQL

```bash
docker exec -it gestor-postgres psql -U admin -d gestorcash
```

#### Paso 2: Ejecutar SQL

```sql
-- Verificar si la columna existe
\d caja_fuerte

-- Agregar la columna (si no existe)
ALTER TABLE public.caja_fuerte
ADD COLUMN IF NOT EXISTS codigo VARCHAR(100) NOT NULL DEFAULT 'CAJA-' || idcajafuerte::text;

-- Crear el índice único
CREATE UNIQUE INDEX IF NOT EXISTS idx_cajas_fuertes_codigo
ON public.caja_fuerte(codigo);

-- Verificar que se creó correctamente
\d caja_fuerte

-- Salir
\q
```

#### Paso 3: Reiniciar el backend

```bash
npm run down
npm run use:local
```

## 📋 Detalles de la Migración

La migración `0002_add_codigo_caja_fuerte.sql` hace lo siguiente:

1. **Verifica si la columna existe** (para evitar errores)
2. **Agrega la columna `codigo`**:
   - Tipo: `VARCHAR(100)`
   - Restricción: `NOT NULL`
   - Valor por defecto: `'CAJA-' || idcajafuerte::text` (para registros existentes)
3. **Crea el índice único** `idx_cajas_fuertes_codigo`
4. **Agrega documentación** con comentarios

## 🧪 Verificación

### Verificar que la columna existe

```bash
docker exec -it gestor-postgres psql -U admin -d gestorcash -c "\d caja_fuerte"
```

Deberías ver la columna `codigo` en la lista.

### Verificar que el índice existe

```bash
docker exec -it gestor-postgres psql -U admin -d gestorcash -c "\d caja_fuerte"
```

Deberías ver el índice `idx_cajas_fuertes_codigo` en la lista de índices.

### Probar el endpoint

```bash
GET http://localhost:8000/api/gastos
```

Deberías obtener una respuesta sin errores.

## 🚀 Aplicar en Supabase

Para aplicar la misma migración en Supabase:

### Opción 1: Desde el Dashboard de Supabase

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `db/migrations/0002_add_codigo_caja_fuerte.sql`
4. Ejecuta el script

### Opción 2: Desde la línea de comandos

```bash
# Conectar a Supabase (necesitas las credenciales)
psql "postgresql://postgres.wlnbzzisnikxuvhymfqv:amazon1234556@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -f db/migrations/0002_add_codigo_caja_fuerte.sql
```

## 🧠 Prevención Futura

Para evitar este problema en el futuro:

1. **Usa migraciones**: Siempre crea migraciones SQL para cambios de esquema
2. **Documenta cambios**: Actualiza la documentación cuando cambies modelos
3. **Sincroniza backups**: Al restaurar backups, verifica que el esquema coincida con los modelos
4. **Usa `alter: true` con cuidado**: Solo en desarrollo, nunca en producción

## 📚 Referencias

- [GUIA_ARRANQUE.md](./GUIA_ARRANQUE.md) - Guía de arranque
- [SOLUCION_ERROR_DOCKER.md](./SOLUCION_ERROR_DOCKER.md) - Solución al error de conexión Docker
- [db/migrations/0002_add_codigo_caja_fuerte.sql](./db/migrations/0002_add_codigo_caja_fuerte.sql) - Migración SQL

---

**Estado:** ✅ Solución implementada - La migración está lista para aplicar






