# ✅ Resumen: Solución al Error "column codigo does not exist"

## 🎯 Problema

El backend intenta crear un índice único sobre la columna `codigo` en la tabla `caja_fuerte`, pero esta columna no existe en la base de datos.

**Error:**
```
ERROR: column "codigo" does not exist
CREATE UNIQUE INDEX "idx_cajas_fuertes_codigo" ON "caja_fuerte" ("codigo")
```

## ✅ Solución Rápida (3 pasos)

### Paso 1: Aplicar la migración

**Windows:**
```powershell
.\scripts\apply-migration-codigo.ps1
```

**Linux/Mac:**
```bash
./scripts/apply-migration-codigo.sh
```

**O manualmente:**
```bash
docker exec -i gestor-postgres psql -U admin -d gestorcash < db/migrations/0002_add_codigo_caja_fuerte.sql
```

### Paso 2: Reiniciar el backend

```bash
npm run down
npm run use:local
```

### Paso 3: Verificar

```bash
docker logs gestor-backend
```

Deberías ver:
- `Database connection established`
- `✅ Modelos sincronizados con la base de datos`

## 🔍 ¿Qué hace la migración?

1. **Verifica** si la columna `codigo` existe
2. **Agrega** la columna `codigo` (VARCHAR(100), NOT NULL)
3. **Asigna** valores únicos a registros existentes: `'CAJA-' || idcajafuerte`
4. **Crea** el índice único `idx_cajas_fuertes_codigo`
5. **Documenta** la columna con comentarios

## 📋 Detalles Técnicos

### Modelo Sequelize

El modelo `CajaFuerte` define:
```typescript
codigo: {
  type: DataTypes.STRING(100),
  allowNull: false,
  unique: true,
}
```

### Migración SQL

La migración `0002_add_codigo_caja_fuerte.sql`:
- Es **idempotente** (se puede ejecutar múltiples veces sin errores)
- Maneja registros existentes (asigna códigos automáticamente)
- Crea el índice único que Sequelize espera

## 🚀 Aplicar en Supabase

Para aplicar en Supabase:

1. Abre el **SQL Editor** en Supabase Dashboard
2. Copia el contenido de `db/migrations/0002_add_codigo_caja_fuerte.sql`
3. Pega y ejecuta el script

O desde la línea de comandos:
```bash
psql "postgresql://postgres.wlnbzzisnikxuvhymfqv:amazon1234556@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -f db/migrations/0002_add_codigo_caja_fuerte.sql
```

## 🧪 Verificación

### Verificar que la columna existe

```bash
docker exec -it gestor-postgres psql -U admin -d gestorcash -c "\d caja_fuerte"
```

Deberías ver `codigo | character varying(100) | not null` en la lista.

### Verificar que el índice existe

```bash
docker exec -it gestor-postgres psql -U admin -d gestorcash -c "\d caja_fuerte"
```

Deberías ver `"idx_cajas_fuertes_codigo" UNIQUE, btree (codigo)` en la lista de índices.

### Probar el endpoint

```bash
GET http://localhost:8000/api/gastos
```

Deberías obtener una respuesta sin errores.

## 📚 Documentación Completa

Para más detalles, consulta:
- [SOLUCION_ERROR_CODIGO.md](./SOLUCION_ERROR_CODIGO.md) - Solución detallada
- [db/migrations/0002_add_codigo_caja_fuerte.sql](./db/migrations/0002_add_codigo_caja_fuerte.sql) - Migración SQL

---

**Estado:** ✅ Solución implementada y lista para aplicar


