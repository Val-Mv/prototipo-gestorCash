# 🚀 Backend API - GestorCash (Node.js/Express)

Backend API RESTful desarrollado con **Node.js**, **Express** y **TypeScript** para la plataforma de administración digital de caja menor GestorCash.

## 📋 Características

- ✅ API REST completa con Express
- ✅ TypeScript para type safety
- ✅ Base de datos SQLite (fácil de migrar a PostgreSQL/MySQL)
- ✅ Validación de datos con Zod
- ✅ ORM con Sequelize
- ✅ CORS configurado para Next.js
- ✅ CRUD completo para todas las entidades del sistema

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Navegar a la carpeta del servidor
cd app/server

# Instalar dependencias
npm install
```

### 2. Ejecutar el servidor

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm run build
npm start
```

El servidor estará disponible en: **http://localhost:8000**

### 3. Verificar que funciona

- **Health Check**: http://localhost:8000/api/health
- **API Root**: http://localhost:8000/

## 🗄️ Estructura del Proyecto

```
app/server/
├── src/
│   ├── config/
│   │   └── database.ts       # Configuración de base de datos
│   ├── models/               # Modelos de Sequelize
│   │   ├── OpeningCount.ts
│   │   ├── ClosingCount.ts
│   │   ├── Expense.ts
│   │   ├── DailyReport.ts
│   │   ├── User.ts
│   │   ├── Store.ts
│   │   ├── CashRegister.ts
│   │   └── index.ts
│   ├── routes/               # Rutas de la API
│   │   ├── opening.ts
│   │   ├── closing.ts
│   │   ├── expenses.ts
│   │   ├── reports.ts
│   │   ├── users.ts
│   │   └── stores.ts
│   ├── schemas/              # Schemas de validación (Zod)
│   │   ├── opening.ts
│   │   ├── closing.ts
│   │   ├── expense.ts
│   │   ├── report.ts
│   │   ├── user.ts
│   │   └── store.ts
│   └── index.ts              # Punto de entrada
├── package.json
├── tsconfig.json
└── README.md
```

## 📡 Endpoints de la API

### Opening (`/api/opening`)
- `POST /api/opening` - Crear conteo de apertura
- `GET /api/opening` - Listar conteos (filtros: `store_id`, `date`)
- `GET /api/opening/:id` - Obtener por ID
- `PUT /api/opening/:id` - Actualizar
- `DELETE /api/opening/:id` - Eliminar

### Closing (`/api/closing`)
- `POST /api/closing` - Crear conteo de cierre
- `GET /api/closing` - Listar conteos (filtros: `store_id`, `date`)
- `GET /api/closing/:id` - Obtener por ID
- `PUT /api/closing/:id` - Actualizar
- `DELETE /api/closing/:id` - Eliminar

### Expenses (`/api/expenses`)
- `POST /api/expenses` - Crear gasto
- `GET /api/expenses` - Listar gastos (filtros: `store_id`, `category`, `date`)
- `GET /api/expenses/:id` - Obtener por ID
- `PUT /api/expenses/:id` - Actualizar
- `DELETE /api/expenses/:id` - Eliminar
- `GET /api/expenses/stats/by-category` - Estadísticas por categoría

### Reports (`/api/reports`)
- `POST /api/reports` - Crear reporte diario
- `GET /api/reports` - Listar reportes (filtros: `store_id`, `date_from`, `date_to`)
- `GET /api/reports/:id` - Obtener por ID
- `PUT /api/reports/:id` - Actualizar
- `DELETE /api/reports/:id` - Eliminar

### Users (`/api/users`)
- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios (filtros: `role`, `store_id`)
- `GET /api/users/:id` - Obtener por ID
- `PUT /api/users/:id` - Actualizar
- `DELETE /api/users/:id` - Desactivar usuario

### Stores (`/api/stores`)
- `POST /api/stores` - Crear tienda
- `GET /api/stores` - Listar tiendas
- `GET /api/stores/:id` - Obtener por ID
- `PUT /api/stores/:id` - Actualizar
- `DELETE /api/stores/:id` - Desactivar tienda
- `POST /api/stores/registers` - Crear registradora
- `GET /api/stores/registers` - Listar registradoras
- `GET /api/stores/registers/:id` - Obtener registradora por ID
- `PUT /api/stores/registers/:id` - Actualizar registradora
- `DELETE /api/stores/registers/:id` - Desactivar registradora

## 💾 Base de Datos

### SQLite (Desarrollo)

La base de datos SQLite se crea automáticamente en `gestorcash.db` al iniciar el servidor por primera vez.

### Migrar a PostgreSQL/MySQL

1. Instalar el driver correspondiente:
   ```bash
   # Para PostgreSQL
   npm install pg pg-hstore
   
   # Para MySQL
   npm install mysql2
   ```

2. Configurar variable de entorno:
   ```env
   DATABASE_URL=postgresql://user:password@localhost/gestorcash
   # o
   DATABASE_URL=mysql://user:password@localhost/gestorcash
   ```

3. La configuración en `src/config/database.ts` detecta automáticamente el tipo de base de datos.

## 🔧 Variables de Entorno

Crea un archivo `.env` en `app/server/`:

```env
# Puerto del servidor
PORT=8000

# Base de datos (opcional, por defecto usa SQLite)
DATABASE_URL=sqlite://./gestorcash.db

# Entorno
NODE_ENV=development
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con hot reload
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Inicia el servidor en modo producción
- `npm run lint` - Ejecuta el linter
- `npm run typecheck` - Verifica tipos sin compilar

## 🔄 Migración desde Python/FastAPI

Este backend es una migración completa desde Python/FastAPI a Node.js/Express, manteniendo:

- ✅ Misma estructura de endpoints
- ✅ Misma estructura de datos
- ✅ Misma validación de datos
- ✅ Compatibilidad total con el frontend Next.js

## 📚 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Superset de JavaScript con tipos
- **Sequelize** - ORM para Node.js
- **Zod** - Validación de schemas
- **SQLite3** - Base de datos (por defecto)

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error de conexión a la base de datos
Verifica que el archivo `gestorcash.db` tenga permisos de escritura, o configura `DATABASE_URL` correctamente.

### Puerto ya en uso
Cambia el puerto en la variable de entorno `PORT` o en `src/index.ts`.

## 📄 Licencia

ISC
