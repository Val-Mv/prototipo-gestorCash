# 🚀 Guía de Arranque - GestorCash

Esta guía te ayudará a arrancar el proyecto en **local** (con Docker PostgreSQL) y en **producción** (con Supabase).

## 📋 Prerequisitos

- Node.js 18+ instalado
- Docker y Docker Compose instalados
- Git instalado
- Cuenta de Supabase (para producción)

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio (si aún no lo has hecho)

```bash
git clone <tu-repositorio>
cd prototipo-gestorCash
```

### 2. Instalar Dependencias

```bash
# Instalar dependencias del proyecto raíz
npm install

# Instalar dependencias del backend
npm run install:server

# Instalar dependencias del frontend
npm run install:web
```

### 3. Configurar Variables de Entorno

#### Para Desarrollo Local

El archivo `.env` en `app/server/` debe tener esta configuración para desarrollo local:

```env
# Puerto del servidor
PORT=8000
NODE_ENV=development

# Perfil de base de datos
ACTIVE_DB=local

# Base de datos local (PostgreSQL en Docker)
LOCAL_DATABASE_URL=postgresql://admin:admin@localhost:5432/gestorcash

# SSL deshabilitado para local
USE_SSL=false
DB_SSL=false

# Sincronización de base de datos (solo desarrollo)
SHOULD_SYNC_DB=true
SHOULD_SYNC_DB_ALTER=false
SHOULD_SYNC_DB_FORCE=false

# Datos iniciales
SEED_DEFAULT_DATA=true
DEFAULT_STORE_ID=berwyn-il
DEFAULT_STORE_NAME=Dollar Tree Berwyn
DEFAULT_STORE_CODE=DT-BYW
```

#### Para Producción (Supabase)

El archivo `.env` en `app/server/` debe tener esta configuración para Supabase:

```env
# Puerto del servidor
PORT=8000
NODE_ENV=production

# Perfil de base de datos
ACTIVE_DB=supabase

# Opción 1: URL completa de Supabase (recomendado)
SUPABASE_DATABASE_URL=postgresql://postgres.wlnbzzisnikxuvhymfqv:amazon1234556@aws-1-us-east-2.pooler.supabase.com:5432/postgres

# Opción 2: Variables individuales (alternativa)
# Si no defines SUPABASE_DATABASE_URL, usa estas:
DB_HOST=aws-1-us-east-2.pooler.supabase.com
DB_PORT=5432
DB_USERNAME=postgres.wlnbzzisnikxuvhymfqv
DB_PASSWORD=amazon1234556
DB_NAME=postgres
DB_SSL=true

# SSL habilitado para Supabase
USE_SSL=true

# Sincronización de base de datos (deshabilitar en producción)
SHOULD_SYNC_DB=false
SHOULD_SYNC_DB_ALTER=false
SHOULD_SYNC_DB_FORCE=false

# Datos iniciales
SEED_DEFAULT_DATA=false
```

> **Nota:** Si el archivo `.env` no existe, puedes copiar `ENV_TEMPLATE.txt`:
> ```bash
> cd app/server
> cp ENV_TEMPLATE.txt .env
> # Luego edita el archivo .env con las credenciales correctas
> ```

---

## 🏠 Arranque en Local (Desarrollo)

### Opción 1: Usando Docker Compose (Recomendado)

Esta opción levanta tanto la base de datos PostgreSQL como el backend en contenedores Docker.

#### 1. Verificar que el archivo `.env` esté configurado para local

Asegúrate de que `ACTIVE_DB=local` en `app/server/.env`

#### 2. Arrancar los servicios

```bash
# Desde la raíz del proyecto
npm run use:local
```

Este comando:
- Levanta el contenedor de PostgreSQL (puerto 5432)
- Levanta el backend en Docker (puerto 8000)
- Usa el perfil `local` de Docker Compose

#### 3. Verificar que todo esté funcionando

**Ver logs del backend:**
```bash
docker logs gestor-backend
```

Deberías ver:
```
✅ Conectado exitosamente a la base de datos (postgresql://...) usando el dialecto "postgres"
```

**Probar el endpoint:**
```bash
# Desde el navegador o Postman
GET http://localhost:8000/api/usuarios
```

Deberías obtener `[]` (vacío) si las tablas están creadas pero no hay datos.

#### 4. Detener los servicios

```bash
# Detener los contenedores
npm run down

# Detener y eliminar volúmenes (elimina la base de datos)
npm run down:volumes
```

### Opción 2: Sin Docker (Solo Backend en Node)

Si prefieres ejecutar el backend directamente sin Docker:

#### 1. Levantar PostgreSQL en Docker (solo la BD)

```bash
# Levantar solo la base de datos
docker compose --profile local up db -d
```

#### 2. Arrancar el backend

```bash
# Desde la raíz del proyecto
npm run dev:server
```

O directamente:
```bash
cd app/server
npm run dev
```

El backend estará disponible en `http://localhost:8000`

#### 3. Detener PostgreSQL

```bash
docker compose --profile local down
```

---

## ☁️ Arranque en Producción (Supabase)

### 1. Configurar el archivo `.env` para Supabase

Asegúrate de que `ACTIVE_DB=supabase` y que tengas las credenciales correctas de Supabase en `app/server/.env`:

```env
ACTIVE_DB=supabase
SUPABASE_DATABASE_URL=postgresql://postgres.wlnbzzisnikxuvhymfqv:amazon1234556@aws-1-us-east-2.pooler.supabase.com:5432/postgres
USE_SSL=true
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

### 2. Arrancar el backend con Docker (conectado a Supabase)

```bash
# Desde la raíz del proyecto
npm run use:supabase
```

Este comando:
- Levanta **solo** el backend en Docker (no levanta PostgreSQL local)
- Conecta el backend a Supabase
- Usa el perfil `supabase` de Docker Compose

### 3. Verificar la conexión

**Ver logs del backend:**
```bash
docker logs gestor-backend
```

Deberías ver:
```
✅ Conectado exitosamente a la base de datos (postgresql://...) usando el dialecto "postgres"
Database connection established
```

**Probar el endpoint:**
```bash
GET http://localhost:8000/api/usuarios
```

### 4. Crear las tablas en Supabase (si aún no existen)

Si obtienes un error tipo `relation "usuario" does not exist`, necesitas crear las tablas:

#### Opción A: Sincronización automática (solo desarrollo)

En `app/server/.env`, temporalmente habilita:
```env
SHOULD_SYNC_DB=true
```

Luego reinicia el backend:
```bash
docker restart gestor-backend
```

#### Opción B: Migraciones manuales (recomendado para producción)

Si usas migraciones (TypeORM, Prisma, etc.), ejecuta:

```bash
# Si usas TypeORM
npm run typeorm:migration:run

# Si usas Prisma
npx prisma migrate deploy
```

### 5. Detener el backend

```bash
npm run down
```

---

## 🔄 Cambiar entre Local y Supabase

### De Local a Supabase

1. **Actualizar `.env`:**
   ```env
   ACTIVE_DB=supabase
   SUPABASE_DATABASE_URL=postgresql://...
   USE_SSL=true
   ```

2. **Detener servicios locales:**
   ```bash
   npm run down
   ```

3. **Arrancar con Supabase:**
   ```bash
   npm run use:supabase
   ```

### De Supabase a Local

1. **Actualizar `.env`:**
   ```env
   ACTIVE_DB=local
   LOCAL_DATABASE_URL=postgresql://admin:admin@localhost:5432/gestorcash
   USE_SSL=false
   ```

2. **Detener servicios:**
   ```bash
   npm run down
   ```

3. **Arrancar en local:**
   ```bash
   npm run use:local
   ```

---

## 📊 Sincronización de Bases de Datos

### Backup de Supabase

Para crear un backup de Supabase:

```bash
.\scripts\backup-supabase.ps1
```

### Restaurar a Local

Para restaurar el backup de Supabase en tu base de datos local:

```bash
.\scripts\restore-to-local.ps1
```

---

## 🐛 Solución de Problemas

### Error: "Database connection established" no aparece

**Problema:** El backend no se conecta a la base de datos.

**Solución:**
1. Verifica que las credenciales en `.env` sean correctas
2. Verifica que el puerto 8000 no esté en uso
3. Revisa los logs: `docker logs gestor-backend`
4. Para Supabase, verifica que la IP esté en la whitelist de Supabase

### Error: "relation 'usuario' does not exist"

**Problema:** Las tablas no existen en la base de datos.

**Solución:**
1. Habilita la sincronización temporalmente:
   ```env
   SHOULD_SYNC_DB=true
   ```
2. Reinicia el backend: `docker restart gestor-backend`
3. Verifica que las tablas se crearon: `docker logs gestor-backend`

### Error: "SSL connection required"

**Problema:** Supabase requiere SSL pero no está habilitado.

**Solución:**
En `.env`, asegúrate de tener:
```env
USE_SSL=true
DB_SSL=true
ACTIVE_DB=supabase
```

### Error: Puerto 5432 ya en uso

**Problema:** Ya hay un PostgreSQL corriendo en el puerto 5432.

**Solución:**
1. Detén el PostgreSQL existente
2. O cambia el puerto en `docker-compose.yml`:
   ```yaml
   ports:
     - "5433:5432"  # Usa 5433 en lugar de 5432
   ```
3. Actualiza `LOCAL_DATABASE_URL` en `.env`:
   ```env
   LOCAL_DATABASE_URL=postgresql://admin:admin@localhost:5433/gestorcash
   ```

### Error: "Host 'db' no resolvió"

**Problema:** El backend no puede resolver el hostname 'db' de Docker.

**Solución:**
1. Verifica que estés usando Docker Compose (no ejecutando el backend directamente)
2. O habilita el rewrite de host en `.env`:
   ```env
   REWRITE_DB_HOST_LOCALHOST=true
   DB_HOST_OVERRIDE=127.0.0.1
   ```

---

## 📝 Resumen de Comandos

### Comandos de Docker

```bash
# Arrancar en local
npm run use:local

# Arrancar con Supabase
npm run use:supabase

# Detener servicios
npm run down

# Detener y eliminar volúmenes
npm run down:volumes

# Ver logs del backend
docker logs gestor-backend

# Ver logs de PostgreSQL
docker logs gestor-postgres

# Reiniciar el backend
docker restart gestor-backend
```

### Comandos de Desarrollo

```bash
# Instalar dependencias
npm run install:all

# Desarrollo del backend (sin Docker)
npm run dev:server

# Desarrollo del frontend
npm run dev:web

# Desarrollo de ambos
npm run dev:all

# Build del backend
npm run build:server

# Build del frontend
npm run build
```

---

## ✅ Checklist de Arranque

### Para Local:
- [ ] Docker y Docker Compose instalados
- [ ] Dependencias instaladas (`npm run install:all`)
- [ ] Archivo `.env` configurado con `ACTIVE_DB=local`
- [ ] Puerto 5432 disponible
- [ ] Puerto 8000 disponible
- [ ] Ejecutar `npm run use:local`
- [ ] Verificar logs: `docker logs gestor-backend`
- [ ] Probar endpoint: `GET http://localhost:8000/api/usuarios`

### Para Supabase:
- [ ] Cuenta de Supabase creada
- [ ] Credenciales de Supabase obtenidas
- [ ] Archivo `.env` configurado con `ACTIVE_DB=supabase`
- [ ] `SUPABASE_DATABASE_URL` o variables individuales configuradas
- [ ] `USE_SSL=true` configurado
- [ ] IP agregada a la whitelist de Supabase (si es necesario)
- [ ] Ejecutar `npm run use:supabase`
- [ ] Verificar logs: `docker logs gestor-backend`
- [ ] Verificar mensaje "Database connection established"
- [ ] Probar endpoint: `GET http://localhost:8000/api/usuarios`
- [ ] Crear tablas si es necesario (habilitar `SHOULD_SYNC_DB=true` temporalmente)

---

## 🎯 Próximos Pasos

1. **Frontend:** Configura el frontend para que apunte al backend
2. **Autenticación:** Implementa la autenticación si es necesario
3. **Migraciones:** Configura migraciones para producción
4. **Monitoreo:** Configura monitoreo y logs
5. **CI/CD:** Configura pipeline de despliegue

---

## 📚 Recursos Adicionales

- [Documentación de Docker Compose](https://docs.docker.com/compose/)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Sequelize](https://sequelize.org/docs/v6/)

---

**¿Necesitas ayuda?** Revisa la sección de [Solución de Problemas](#-solución-de-problemas) o consulta los logs con `docker logs gestor-backend`.

