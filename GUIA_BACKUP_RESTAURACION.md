# 📦 Guía de Backup y Restauración - GestorCash

Esta guía te ayudará a hacer backups de Supabase y restaurarlos en tu PostgreSQL local, y viceversa.

## 📋 Índice

1. [Backup de Supabase](#1-backup-de-supabase)
2. [Restaurar a PostgreSQL Local](#2-restaurar-a-postgresql-local)
3. [Sincronización con Sequelize](#3-sincronización-con-sequelize)
4. [Aplicar Cambios a Supabase](#4-aplicar-cambios-a-supabase)
5. [Comandos Rápidos](#5-comandos-rápidos)

---

## 1. Backup de Supabase

### Opción A: Backup en formato binario (`.dump`) - **Recomendado**

El formato binario es más eficiente y preserva mejor la estructura:

```powershell
# En PowerShell (Windows)
$env:PGPASSWORD="oCQz9s4mqy4BVpB1"
pg_dump "postgresql://postgres.wlnbzzisnikxuvhymfqv:oCQz9s4mqy4BVpB1@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -Fc -f supabase_backup.dump
```

### Opción B: Backup en formato SQL (`.sql`) - Texto plano

```powershell
# En PowerShell (Windows)
$env:PGPASSWORD="oCQz9s4mqy4BVpB1"
pg_dump "postgresql://postgres.wlnbzzisnikxuvhymfqv:oCQz9s4mqy4BVpB1@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -f backup_supabase.sql
```

**Nota:** Si `pg_dump` no está disponible, puedes instalarlo desde [PostgreSQL Downloads](https://www.postgresql.org/download/windows/) o usar WSL.

---

## 2. Restaurar a PostgreSQL Local

### Paso 1: Copiar el backup al contenedor Docker

```powershell
# Copiar archivo .dump al contenedor
docker cp supabase_backup.dump gestor-postgres:/tmp/supabase_backup.dump

# O si es archivo .sql
docker cp backup_supabase.sql gestor-postgres:/tmp/backup_supabase.sql
```

### Paso 2: Restaurar el backup

#### Para archivo `.dump` (binario):

```powershell
# Restaurar usando pg_restore
docker exec gestor-postgres bash -c "pg_restore -U admin -d gestorcash -c /tmp/supabase_backup.dump"
```

**Parámetros importantes:**
- `-c` o `--clean`: Elimina objetos antes de crearlos (opcional, cuidado)
- `-a` o `--data-only`: Solo restaura datos, no estructura
- `-s` o `--schema-only`: Solo restaura estructura, no datos

#### Para archivo `.sql` (texto):

```powershell
# Restaurar usando psql
docker exec gestor-postgres bash -c "psql -U admin -d gestorcash -f /tmp/backup_supabase.sql"
```

### Paso 3: Verificar la restauración

```powershell
# Ver tablas creadas
docker exec gestor-postgres psql -U admin -d gestorcash -c "\dt public.*"

# Verificar datos
docker exec gestor-postgres psql -U admin -d gestorcash -c "SELECT COUNT(*) FROM store;"
```

---

## 3. Sincronización con Sequelize

Tu proyecto usa **Sequelize** (no TypeORM ni Prisma). La sincronización se controla con variables de entorno.

### Configurar variables de entorno

Crea o edita `app/server/.env`:

```env
# Conectar a base de datos local
ACTIVE_DB=local
LOCAL_DATABASE_URL=postgresql://admin:admin@localhost:5432/gestorcash
USE_SSL=false

# Habilitar sincronización (solo en desarrollo)
SHOULD_SYNC_DB=true
SHOULD_SYNC_DB_ALTER=false
SHOULD_SYNC_DB_FORCE=false
```

### Ejecutar sincronización

```powershell
# Desde la raíz del proyecto
cd app/server
npm run dev
```

El servidor automáticamente:
1. Se conectará a la base de datos
2. Verificará si existe la tabla `store`
3. Si `SHOULD_SYNC_DB=true`, sincronizará todos los modelos
4. Si `SEED_DEFAULT_DATA=true`, creará datos iniciales

### Opciones de sincronización

| Variable | Descripción | Cuándo usar |
|----------|-------------|-------------|
| `SHOULD_SYNC_DB=true` | Crea tablas si no existen | Desarrollo inicial |
| `SHOULD_SYNC_DB_ALTER=true` | Modifica tablas existentes | Cuando cambias modelos |
| `SHOULD_SYNC_DB_FORCE=true` | Elimina y recrea tablas | ⚠️ **CUIDADO**: Pierde datos |

**⚠️ IMPORTANTE:** En producción, todas estas opciones deben estar en `false`.

---

## 4. Aplicar Cambios a Supabase

### Paso 1: Hacer backup de Supabase (por seguridad)

```powershell
$env:PGPASSWORD="oCQz9s4mqy4BVpB1"
pg_dump "postgresql://postgres.wlnbzzisnikxuvhymfqv:oCQz9s4mqy4BVpB1@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -Fc -f supabase_backup_antes_cambios.dump
```

### Paso 2: Configurar conexión a Supabase

Edita `app/server/.env`:

```env
ACTIVE_DB=supabase
SUPABASE_DATABASE_URL=postgresql://postgres.wlnbzzisnikxuvhymfqv:oCQz9s4mqy4BVpB1@aws-1-us-east-2.pooler.supabase.com:5432/postgres
USE_SSL=true

# Habilitar sincronización (solo si necesitas crear/modificar tablas)
SHOULD_SYNC_DB=true
SHOULD_SYNC_DB_ALTER=true
SHOULD_SYNC_DB_FORCE=false
```

### Paso 3: Ejecutar sincronización

```powershell
# Opción A: Usar script del proyecto
npm run use:supabase

# Opción B: Manualmente
cd app/server
npm run dev
```

### Paso 4: Verificar cambios

Conecta a Supabase y verifica que las tablas se hayan creado/modificado correctamente.

---

## 5. Comandos Rápidos

### Backup de Supabase

```powershell
# Formato binario (recomendado)
$env:PGPASSWORD="oCQz9s4mqy4BVpB1"
pg_dump "postgresql://postgres.wlnbzzisnikxuvhymfqv:oCQz9s4mqy4BVpB1@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -Fc -f supabase_backup.dump

# Formato SQL
pg_dump "postgresql://postgres.wlnbzzisnikxuvhymfqv:oCQz9s4mqy4BVpB1@aws-1-us-east-2.pooler.supabase.com:5432/postgres" -f backup_supabase.sql
```

### Restaurar a Local (Docker)

```powershell
# Copiar al contenedor
docker cp supabase_backup.dump gestor-postgres:/tmp/

# Restaurar (formato .dump)
docker exec gestor-postgres bash -c "pg_restore -U admin -d gestorcash -c /tmp/supabase_backup.dump"

# Restaurar (formato .sql)
docker exec gestor-postgres bash -c "psql -U admin -d gestorcash -f /tmp/backup_supabase.sql"
```

### Verificar Base de Datos

```powershell
# Listar tablas
docker exec gestor-postgres psql -U admin -d gestorcash -c "\dt public.*"

# Contar registros
docker exec gestor-postgres psql -U admin -d gestorcash -c "SELECT 'store' as tabla, COUNT(*) FROM store UNION ALL SELECT 'usuario', COUNT(*) FROM usuario;"

# Ver estructura de una tabla
docker exec gestor-postgres psql -U admin -d gestorcash -c "\d store"
```

### Conectar a Base de Datos

```powershell
# Conectar al contenedor PostgreSQL
docker exec -it gestor-postgres psql -U admin -d gestorcash

# Desde el contenedor, puedes ejecutar comandos SQL directamente
```

---

## ⚠️ Recomendaciones y Riesgos

### ✅ Buenas Prácticas

1. **Siempre haz backup antes de aplicar cambios a Supabase**
2. **Prueba primero en local** antes de aplicar a producción
3. **Usa `SHOULD_SYNC_DB_ALTER=false` en producción** (o mejor, desactiva todas las sincronizaciones)
4. **Mantén credenciales fuera de Git** (usa `.env` y `.gitignore`)
5. **Usa formato `.dump` para backups** (más eficiente y confiable)

### ⚠️ Riesgos

1. **`SHOULD_SYNC_DB_FORCE=true` elimina todas las tablas** - Solo usar en desarrollo
2. **Restaurar directamente en Supabase puede sobrescribir datos** - Siempre haz backup primero
3. **Las extensiones de Supabase no existen en PostgreSQL local** - Los errores de roles son normales
4. **SSL es obligatorio para Supabase** - Asegúrate de `USE_SSL=true` cuando uses Supabase

---

## 🔧 Solución de Problemas

### Error: "role does not exist"

**Causa:** El backup de Supabase contiene roles específicos (`supabase_admin`, `anon`, etc.) que no existen en PostgreSQL local.

**Solución:** Estos errores son normales y no afectan las tablas principales de tu aplicación. Las tablas se crean correctamente.

### Error: "extension does not exist"

**Causa:** Extensiones de Supabase (`pg_graphql`, `supabase_vault`) no están disponibles en PostgreSQL local.

**Solución:** Ignora estos errores. Solo afectan funcionalidades específicas de Supabase, no tus tablas.

### Error: "connection refused" o "timeout"

**Causa:** El contenedor Docker no está corriendo o el puerto está bloqueado.

**Solución:**
```powershell
# Verificar contenedores
docker ps

# Iniciar contenedores
docker compose up -d

# Verificar logs
docker logs gestor-postgres
```

### Error: "SSL required"

**Causa:** Supabase requiere SSL pero no está configurado.

**Solución:** Asegúrate de tener `USE_SSL=true` en `.env` cuando uses Supabase.

---

## 📚 Recursos Adicionales

- [Documentación de Sequelize](https://sequelize.org/docs/v6/)
- [Documentación de pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Documentación de pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

**Última actualización:** Noviembre 2025



