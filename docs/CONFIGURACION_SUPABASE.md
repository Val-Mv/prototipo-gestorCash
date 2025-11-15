# ✅ Configuración de Supabase - Completada

## 🔧 Cambios Realizados

### 1. Actualización de `database.ts`
- ✅ Soporte para construir URL desde variables individuales (`DB_HOST`, `DB_PORT`, etc.)
- ✅ Soporte para URL completa (`SUPABASE_DATABASE_URL`)
- ✅ Configuración SSL automática para Supabase
- ✅ Detección automática del perfil (local/supabase)

### 2. Actualización de `docker-compose.yml`
- ✅ Perfiles de Docker Compose (`local` y `supabase`)
- ✅ Servicio `db` solo para perfil `local`
- ✅ Backend funciona en ambos perfiles
- ✅ Variables de entorno dinámicas

### 3. Actualización de `package.json`
- ✅ Scripts `use:local` y `use:supabase` actualizados
- ✅ Uso correcto de perfiles de Docker Compose

### 4. Scripts de Configuración
- ✅ `scripts/configure-supabase.ps1` - Configura `.env` para Supabase
- ✅ `scripts/configure-local.ps1` - Configura `.env` para local

### 5. Documentación
- ✅ `GUIA_ARRANQUE.md` - Guía completa paso a paso
- ✅ `ENV_TEMPLATE.txt` - Actualizado con credenciales de Supabase

## 📝 Configuración del Archivo `.env`

### Para Supabase

El archivo `app/server/.env` debe tener:

```env
ACTIVE_DB=supabase
SUPABASE_DATABASE_URL=postgresql://postgres.wlnbzzisnikxuvhymfqv:amazon1234556@aws-1-us-east-2.pooler.supabase.com:5432/postgres
USE_SSL=true
DB_SSL=true
```

O usando variables individuales:

```env
ACTIVE_DB=supabase
DB_HOST=aws-1-us-east-2.pooler.supabase.com
DB_PORT=5432
DB_USERNAME=postgres.wlnbzzisnikxuvhymfqv
DB_PASSWORD=amazon1234556
DB_NAME=postgres
DB_SSL=true
USE_SSL=true
```

### Para Local

```env
ACTIVE_DB=local
LOCAL_DATABASE_URL=postgresql://admin:admin@localhost:5432/gestorcash
USE_SSL=false
DB_SSL=false
```

## 🚀 Comandos de Arranque

### Local
```bash
npm run use:local
```

### Supabase
```bash
npm run use:supabase
```

### Detener
```bash
npm run down
```

## ✅ Verificación

### Ver logs del backend
```bash
docker logs gestor-backend
```

### Probar endpoint
```bash
GET http://localhost:8000/api/usuarios
```

Deberías ver:
- `Database connection established`
- `✅ Conectado exitosamente a la base de datos`
- Respuesta `[]` (vacío) si las tablas están creadas

## 🔄 Cambiar entre Local y Supabase

### Opción 1: Scripts de PowerShell (Recomendado)

**Para Supabase:**
```powershell
.\scripts\configure-supabase.ps1
npm run use:supabase
```

**Para Local:**
```powershell
.\scripts\configure-local.ps1
npm run use:local
```

### Opción 2: Manual

1. Editar `app/server/.env`
2. Cambiar `ACTIVE_DB=local` a `ACTIVE_DB=supabase` (o viceversa)
3. Actualizar las variables de conexión
4. Ejecutar el comando correspondiente

## 📚 Documentación Completa

Para más detalles, consulta:
- `GUIA_ARRANQUE.md` - Guía completa paso a paso
- `app/server/README.md` - Documentación del backend
- `app/server/ENV_TEMPLATE.txt` - Template de variables de entorno

## 🐛 Solución de Problemas

### Error: "Database connection established" no aparece
- Verifica que las credenciales en `.env` sean correctas
- Verifica que `ACTIVE_DB=supabase` esté configurado
- Revisa los logs: `docker logs gestor-backend`

### Error: "relation 'usuario' does not exist"
- Habilita temporalmente `SHOULD_SYNC_DB=true` en `.env`
- Reinicia el backend: `docker restart gestor-backend`

### Error: "SSL connection required"
- Asegúrate de tener `USE_SSL=true` y `DB_SSL=true` en `.env`

## 📝 Próximos Pasos

1. ✅ Configurar `.env` con credenciales de Supabase
2. ✅ Ejecutar `npm run use:supabase`
3. ✅ Verificar logs: `docker logs gestor-backend`
4. ✅ Probar endpoint: `GET http://localhost:8000/api/usuarios`
5. ⚠️ Crear tablas si es necesario (habilitar `SHOULD_SYNC_DB=true` temporalmente)
6. ✅ Deshabilitar sincronización automática en producción

---

**Estado:** ✅ Configuración completada y lista para usar






