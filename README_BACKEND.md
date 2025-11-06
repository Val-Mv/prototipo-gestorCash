# 🐍 Backend Python para GestorCash

Backend API RESTful desarrollado con **FastAPI** para gestionar todas las operaciones CRUD del sistema GestorCash.

## 📋 Características

- ✅ API REST completa con FastAPI
- ✅ Base de datos SQLite (fácil de migrar a PostgreSQL/MySQL)
- ✅ Validación de datos con Pydantic
- ✅ Documentación automática (Swagger/ReDoc)
- ✅ CORS configurado para Next.js
- ✅ CRUD completo para todas las entidades

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Navegar a la carpeta backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt
```

### 2. Ejecutar el servidor

```bash
# Opción 1: Usando uvicorn directamente
uvicorn app.main:app --reload --port 8000

# Opción 2: Usando el script run.py
python run.py
```

El servidor estará disponible en: **http://localhost:8000**

### 3. Verificar que funciona

Visita: **http://localhost:8000/docs** para ver la documentación interactiva de Swagger.

## 📚 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI principal
│   ├── database.py          # Configuración de base de datos
│   ├── models.py            # Modelos SQLAlchemy
│   ├── schemas.py           # Esquemas Pydantic para validación
│   └── routers/             # Routers por entidad
│       ├── __init__.py
│       ├── opening.py       # CRUD Opening Counts
│       ├── closing.py        # CRUD Closing Counts
│       ├── expenses.py      # CRUD Expenses
│       ├── reports.py       # CRUD Reports
│       ├── users.py         # CRUD Users
│       └── stores.py        # CRUD Stores y Cash Registers
├── requirements.txt
├── run.py
├── README.md
└── INTEGRACION_NEXTJS.md
```

## 🔌 Endpoints Disponibles

### Opening Counts (`/api/opening`)
- `POST /api/opening` - Crear conteo de apertura
- `GET /api/opening` - Listar (filtros: `store_id`, `date`)
- `GET /api/opening/{id}` - Obtener por ID
- `PUT /api/opening/{id}` - Actualizar
- `DELETE /api/opening/{id}` - Eliminar

### Closing Counts (`/api/closing`)
- `POST /api/closing` - Crear conteo de cierre
- `GET /api/closing` - Listar (filtros: `store_id`, `date`)
- `GET /api/closing/{id}` - Obtener por ID
- `PUT /api/closing/{id}` - Actualizar
- `DELETE /api/closing/{id}` - Eliminar

### Expenses (`/api/expenses`)
- `POST /api/expenses` - Crear gasto
- `GET /api/expenses` - Listar (filtros: `store_id`, `category`, `date`)
- `GET /api/expenses/{id}` - Obtener por ID
- `PUT /api/expenses/{id}` - Actualizar
- `DELETE /api/expenses/{id}` - Eliminar
- `GET /api/expenses/stats/by-category` - Estadísticas por categoría

### Reports (`/api/reports`)
- `POST /api/reports` - Crear reporte
- `GET /api/reports` - Listar (filtros: `store_id`, `date_from`, `date_to`)
- `GET /api/reports/{id}` - Obtener por ID
- `PUT /api/reports/{id}` - Actualizar
- `DELETE /api/reports/{id}` - Eliminar

### Users (`/api/users`)
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar (filtros: `role`, `store_id`)
- `GET /api/users/{id}` - Obtener por ID
- `PUT /api/users/{id}` - Actualizar
- `DELETE /api/users/{id}` - Desactivar

### Stores (`/api/stores`)
- `POST /api/stores` - Crear tienda
- `GET /api/stores` - Listar
- `GET /api/stores/{id}` - Obtener por ID
- `PUT /api/stores/{id}` - Actualizar
- `DELETE /api/stores/{id}` - Desactivar

### Cash Registers (`/api/stores/registers`)
- `POST /api/stores/registers` - Crear registradora
- `GET /api/stores/registers` - Listar (filtro: `store_id`)
- `GET /api/stores/registers/{id}` - Obtener por ID
- `PUT /api/stores/registers/{id}` - Actualizar
- `DELETE /api/stores/registers/{id}` - Desactivar

## 💾 Base de Datos

La base de datos SQLite se crea automáticamente en `gestorcash.db` al iniciar el servidor por primera vez.

### Cambiar a PostgreSQL/MySQL

Edita `app/database.py`:

```python
# PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/gestorcash"

# MySQL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user:password@localhost/gestorcash"
```

## 📝 Ejemplo de Uso

### Crear un gasto

```python
import requests

response = requests.post(
    "http://localhost:8000/api/expenses",
    json={
        "category": "store_supplies",
        "item": "Spray Limpiador",
        "amount": 12.50,
        "description": "Reabastecimiento semanal de suministros",
        "store_id": "berwyn-il",
        "date": "2024-01-15",
        "user_id": "sm-456"
    }
)

print(response.json())
```

### Obtener gastos filtrados

```python
import requests

response = requests.get(
    "http://localhost:8000/api/expenses",
    params={
        "store_id": "berwyn-il",
        "category": "store_supplies",
        "date": "2024-01-15"
    }
)

print(response.json())
```

## 🔗 Integración con Next.js

Ver el archivo `INTEGRACION_NEXTJS.md` para instrucciones detalladas sobre cómo integrar este backend con la aplicación Next.js.

## 🛠️ Desarrollo

### Agregar nuevas rutas

1. Crea un nuevo router en `app/routers/`
2. Agrega el router en `app/main.py`:
   ```python
   from app.routers import nuevo_router
   app.include_router(nuevo_router.router, prefix="/api/nuevo", tags=["Nuevo"])
   ```

### Migraciones de base de datos

Para cambios en modelos, puedes usar Alembic (no incluido por defecto):

```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Descripción"
alembic upgrade head
```

## 📖 Documentación

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## ⚠️ Notas

- El backend usa SQLite por defecto para simplicidad
- Para producción, considera migrar a PostgreSQL o MySQL
- La autenticación está pendiente (actualmente sin protección)
- CORS está configurado para desarrollo local


