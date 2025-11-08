# GestorCash – Guía Docker

Este repositorio incluye una configuración con Docker Compose para levantar rápidamente todo el entorno de GestorCash y facilitar la conexión del equipo (backend y base de datos). A continuación encontrarás los pasos necesarios para prepararlo y ejecutarlo en tu máquina local o en un entorno compartido.

---

## 1. Requisitos previos

- Docker Desktop (o Docker Engine) instalado y corriendo.
- Docker Compose v2 (incluido en Docker Desktop ≥ 4.x).
- Opcional: cliente PostgreSQL (TablePlus, DBeaver, `psql`, etc.) para validar la conexión a la base de datos.

Confirma que Docker está operativo:

```powershell
docker --version
docker compose version
```

---

## 2. Contenedores disponibles

El archivo `docker-compose.yml` define dos servicios:

| Servicio  | Imagen/base             | Puerto local | Notas                                                                 |
|-----------|-------------------------|--------------|-----------------------------------------------------------------------|
| `db`      | `postgres:16`           | `5432`       | Base de datos PostgreSQL con credenciales simples para desarrollo.   |
| `backend` | Construido desde `app/server` | `8000`       | API Node.js/Express. Usa TypeScript y Sequelize sobre PostgreSQL.     |

La aplicación web (`app/web`) no está incluida en Compose por ahora, pero queda lista para conectarse vía `http://localhost:8000`.

---

## 3. Variables de entorno

Antes de levantar Docker Compose necesitas crear el archivo `app/server/.env`. Puedes basarte en el siguiente ejemplo orientado a uso local con PostgreSQL dentro del mismo Compose:

```
PORT=8000

# Selecciona el perfil de base de datos: local o supabase
ACTIVE_DB=local

# URL interna que usa el backend dentro de Docker
LOCAL_DATABASE_URL=postgres://admin:admin@db:5432/gestorcash

# Solo si se conecta a una base externa (opcional)
SUPABASE_DATABASE_URL=

# No usar SSL en entornos locales
USE_SSL=false

NODE_ENV=development
```

> **Nota:** El archivo está mapeado dentro del contenedor (`env_file`), por lo que cualquier actualización requiere reiniciar el servicio `backend` (`docker compose restart backend`).

---

## 4. Puesta en marcha

1. Desde la raíz del proyecto (`prototipo-gestorCash`):

   ```powershell
   docker compose up --build -d
   ```

   - `--build` asegura que se instalen dependencias y se compile el backend.
   - `-d` levanta los contenedores en segundo plano.

2. Comprueba el estado de los servicios:

   ```powershell
   docker compose ps
   docker compose logs -f backend
   ```

3. Verifica la API:

   - `http://localhost:8000/api/health` → Debe responder `{ "status": "healthy" }`.
   - `http://localhost:8000/` → Información básica de la API.

---

## 5. Conexión de tus herramientas

- **Frontend local**: configura `NEXT_PUBLIC_API_URL=http://localhost:8000` en tu `.env.local` de `app/web`.
- **Clientes PostgreSQL**:
  - Host: `localhost`
  - Puerto: `5432`
  - Usuario: `admin`
  - Contraseña: `admin`
  - Base de datos: `gestorcash`

Recuerda que los datos persisten en el volumen `postgres_data`. Para empezar desde cero, elimina el volumen:

```powershell
docker compose down -v
```

---

## 6. Ciclo de trabajo recomendado

1. Arranca servicios con `docker compose up -d`.
2. Edita el código del backend en tu máquina (el directorio `app/server` está montado como volumen).
3. Observa logs con `docker compose logs -f backend`.
4. Cuando cambies dependencias (`package.json`), ejecuta `docker compose build backend` seguido de `docker compose up -d`.

---

## 7. Solución de problemas

- **El backend no arranca y muestra `DATABASE_URL no está definida`**  
  Asegúrate de que `app/server/.env` contenga `LOCAL_DATABASE_URL` o `SUPABASE_DATABASE_URL` según el perfil activo.

- **Conflicto de puertos 5432 o 8000**  
  Modifica los puertos expuestos en `docker-compose.yml` y actualiza la URL en tu `.env`.

- **Cambios en TypeScript no se reflejan**  
  El backend corre con `npm run dev` (hot reload). Si persiste el problema, reinicia el servicio `backend`.

- **Necesito conectarme a una base externa (Supabase, RDS, etc.)**  
  Define `ACTIVE_DB=supabase`, coloca la URL externa en `SUPABASE_DATABASE_URL` y, si aplica, ajusta `USE_SSL=true`.

---

## 8. Apagar y limpiar

```powershell
# Detener servicios sin borrar datos
docker compose down

# Detener y borrar volumen de datos (⚠️ elimina la base)
docker compose down -v
```

Para liberar solo los contenedores pero conservar la imagen:

```powershell
docker compose stop
```

---

## 9. Próximos pasos

- Agregar el frontend (`app/web`) al Compose cuando el equipo lo necesite.
- Automatizar semillas de datos si se requiere un estado inicial para QA/demos.
- Integrar scripts de verificación (`docker compose exec backend npm run lint`) en pipelines CI/CD.

Con esto el equipo puede levantar el entorno localmente en minutos y trabajar sobre la API y la base de datos compartida. Cualquier actualización que debamos propagar (nuevos scripts, configuraciones adicionales, etc.) puede documentarse en este mismo archivo.

# GestorCash

Sistema de gestión de efectivo y detección de anomalías para tiendas minoristas.

## 📁 Estructura del Proyecto

```
prototipo-gestorCash/
├── app/
│   ├── server/          # Backend Python (FastAPI)
│   │   ├── app/
│   │   │   ├── routers/ # Routers de la API
│   │   │   ├── models.py
│   │   │   ├── schemas.py
│   │   │   ├── database.py
│   │   │   └── main.py
│   │   ├── requirements.txt
│   │   └── run.py
│   │
│   └── web/              # Frontend Next.js
│       ├── src/
│       │   ├── app/      # Páginas y rutas
│       │   ├── components/
│       │   ├── lib/
│       │   └── hooks/
│       ├── package.json
│       ├── next.config.ts
│       └── tsconfig.json
│
├── docs/                 # Documentación
└── README.md
```

## 🚀 Inicio Rápido

### Backend (Server)

```bash
cd app/server
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python run.py
```

El backend estará en: **http://localhost:8000**

### Frontend (Web)

```bash
cd app/web
npm install
npm run dev
```

El frontend estará en: **http://localhost:3000**

## 📚 Documentación

- **Backend**: Ver `app/server/README.md`
- **Frontend**: Ver documentación en `app/web/`
- **Blueprint**: Ver `docs/blueprint.md`
