# 🐍 Backend API - GestorCash

Backend API RESTful desarrollado con **FastAPI** para la plataforma de administración digital de caja menor GestorCash.

## 📋 Características

- ✅ API REST completa con FastAPI
- ✅ Base de datos SQLite (fácil de migrar a PostgreSQL/MySQL)
- ✅ Validación de datos con Pydantic
- ✅ Documentación automática (Swagger/ReDoc)
- ✅ CORS configurado para Next.js
- ✅ CRUD completo para todas las entidades del sistema
- ✅ Arquitectura basada en diagrama UML del sistema

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

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

## 🗄️ Esquema de Base de Datos

El sistema está basado en el siguiente diagrama UML de clases:

### Entidades Principales

#### 1. **Usuario**
- Roles: `DISTRICT_MANAGER`, `STORE_MANAGER`, `ASSISTANT_STORE_MANAGER`
- Atributos: idUsuario, nombreCompleto, email, passwordHash, telefono, fechaCreacion, activo, rol
- Métodos: iniciarSesion(), cerrarSesion(), cambiarPassword(), validarCredenciales(), obtenerPermisos()

#### 2. **CajaRegistradora**
- Atributos: idCaja, numeroCaja, montoInicialRequerido, ubicacion, fechaRegistro
- Métodos: activarCaja(), desactivarCaja(), validarMontoInicial(), obtenerSaldoActual(), verificarDisponibilidad()

#### 3. **CajaFuerte**
- Atributos: idCajaFuerte, codigo, saldoActual, limiteMaximo, ubicacion, fechaUltimaActualizacion
- Métodos: actualizarSaldo(), validarLimite(), obtenerSaldo(), registrarMovimiento()

#### 4. **Conteo**
- TipoConteo: `APERTURA`, `CIERRE`
- Atributos: idConteo, fechaHora, tipoConteo, montoContado, montoEsperado, diferencia, observaciones, idUsuario, idCaja
- Métodos: registrarConteo(), calcularDiferencia(), validarMonto(), generarAlertaSiDiferencia(), actualizarConteo(), eliminarConteo()

#### 5. **VentaDiaria**
- Atributos: idVenta, fecha, numeroClientes, totalEfectivo, totalTarjeta, totalGeneral, idCaja, idUsuario
- Métodos: registrarVenta(), calcularTotales(), validarTotales(), obtenerResumen(), actualizarVenta(), eliminarVenta(), consultarVentas()

#### 6. **Gasto**
- EstadoGasto: `PENDIENTE`, `APROBADO`, `RECHAZADO`
- Atributos: idGasto, fecha, monto, descripcion, numeroComprobante, rutaComprobante, estado, idCategoria, idUsuarioRegistro, idUsuarioAprobacion, fechaAprobacion, idCajaOrigen
- Métodos: registrarGasto(), aprobarGasto(), rechazarGasto(), adjuntarComprobante(), validarPresupuesto(), actualizarGasto(), eliminarGasto(), consultarGastos()

#### 7. **CategoriaGasto**
- Atributos: idCategoria, nombre, descripcion, presupuestoMensual, activa, idUsuarioCreacion
- Métodos: crearCategoria(), actualizarCategoria(), desactivarCategoria(), validarPresupuesto(), obtenerGastosMes(), consultarCategorias()

#### 8. **DiferenciaCaja**
- TipoDiferencia: `OVER`, `SHORT`, `EXACTO`
- Atributos: idDiferencia, fecha, montoEsperado, montoContado, diferencia, tipo, justificacion, resuelta, idConteo, idUsuario
- Métodos: registrarDiferencia(), clasificarDiferencia(), resolverDiferencia(), adjuntarJustificacion(), consultarDiferencias()

#### 9. **ReporteDiario**
- Atributos: idReporte, fecha, totalVentas, totalGastos, saldoFinal, numeroClientesTotal, totalEfectivo, totalTarjeta, resumenDiferencias, cantidadDiferencias, idUsuarioGenerador, fechaGeneracion
- Métodos: generarReporte(), consolidarConteos(), consolidarGastos(), consolidarVentas(), calcularResumen(), exportarPDF(), exportarExcel(), consultarReportes()

#### 10. **BitacoraAuditoria**
- Atributos: idBitacora, fechaHora, accion, moduloAfectado, registroId, descripcion, valoresAnteriores, valoresNuevos, direccionIP, idUsuario
- Métodos: registrarAccion(), consultarHistorial(), generarReporteAuditoria(), exportarLogs(), filtrarPorFecha(), filtrarPorUsuario(), filtrarPorModulo()

### Relaciones entre Entidades

- **Usuario** genera **ReporteDiario** (1:N)
- **Usuario** administra **BitacoraAuditoria** (1:N)
- **Usuario** registra **Conteo** (1:N)
- **Usuario** registra **VentaDiaria** (1:N)
- **Usuario** registra **Gasto** (1:N)
- **Usuario** clasifica **DiferenciaCaja** (1:N)
- **CajaRegistradora** tiene **Conteo** (1:N)
- **CajaRegistradora** registra **VentaDiaria** (1:N)
- **CajaRegistradora** es origen de **Gasto** (1:N)
- **ReporteDiario** consolida **Conteo** (N:M)
- **ReporteDiario** resume **VentaDiaria** (N:M)
- **ReporteDiario** incluye **Gasto** (N:M)
- **Conteo** clasifica **DiferenciaCaja** (1:N)
- **Gasto** pertenece a **CategoriaGasto** (N:1)
- **CajaFuerte** es origen de **Gasto** (1:N)

## 📚 Estructura del Proyecto

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Aplicación FastAPI principal
│   ├── database.py          # Configuración de base de datos
│   ├── models.py            # Modelos SQLAlchemy (mapeo del UML)
│   ├── schemas.py           # Esquemas Pydantic para validación
│   └── routers/             # Routers por entidad
│       ├── __init__.py
│       ├── opening.py       # CRUD Opening Counts (Conteo APERTURA)
│       ├── closing.py        # CRUD Closing Counts (Conteo CIERRE)
│       ├── expenses.py      # CRUD Expenses (Gasto)
│       ├── reports.py       # CRUD Reports (ReporteDiario)
│       ├── users.py         # CRUD Users (Usuario)
│       ├── stores.py        # CRUD Stores y Cash Registers
│       ├── categories.py    # CRUD CategoriaGasto
│       ├── sales.py         # CRUD VentaDiaria
│       ├── differences.py  # CRUD DiferenciaCaja
│       ├── safe.py          # CRUD CajaFuerte
│       └── audit.py         # CRUD BitacoraAuditoria
├── requirements.txt
├── run.py
├── README.md
└── .gitignore
```

## 🔌 Endpoints Disponibles

### Opening Counts (`/api/opening`)
Operaciones sobre conteos de apertura (TipoConteo: APERTURA)

- `POST /api/opening` - Crear conteo de apertura
- `GET /api/opening` - Listar conteos (filtros: `store_id`, `date`, `register_id`)
- `GET /api/opening/{id}` - Obtener por ID
- `PUT /api/opening/{id}` - Actualizar conteo
- `DELETE /api/opening/{id}` - Eliminar conteo
- `POST /api/opening/{id}/validate` - Validar monto inicial (debe ser $75)

### Closing Counts (`/api/closing`)
Operaciones sobre conteos de cierre (TipoConteo: CIERRE)

- `POST /api/closing` - Crear conteo de cierre
- `GET /api/closing` - Listar conteos (filtros: `store_id`, `date`, `register_id`)
- `GET /api/closing/{id}` - Obtener por ID
- `PUT /api/closing/{id}` - Actualizar conteo
- `DELETE /api/closing/{id}` - Eliminar conteo
- `POST /api/closing/{id}/calculate-difference` - Calcular diferencia automática
- `POST /api/closing/{id}/alert-if-over-threshold` - Generar alerta si diferencia > $5

### Expenses (`/api/expenses`)
Operaciones sobre gastos operativos

- `POST /api/expenses` - Crear gasto (estado: PENDIENTE por defecto)
- `GET /api/expenses` - Listar gastos (filtros: `store_id`, `category`, `date`, `status`)
- `GET /api/expenses/{id}` - Obtener por ID
- `PUT /api/expenses/{id}` - Actualizar gasto
- `DELETE /api/expenses/{id}` - Eliminar gasto
- `POST /api/expenses/{id}/approve` - Aprobar gasto (cambiar estado a APROBADO)
- `POST /api/expenses/{id}/reject` - Rechazar gasto (cambiar estado a RECHAZADO)
- `POST /api/expenses/{id}/attach-receipt` - Adjuntar comprobante
- `GET /api/expenses/stats/by-category` - Estadísticas por categoría
- `GET /api/expenses/validate-budget` - Validar presupuesto por categoría

### Reports (`/api/reports`)
Operaciones sobre reportes diarios

- `POST /api/reports` - Crear reporte diario
- `GET /api/reports` - Listar reportes (filtros: `store_id`, `date_from`, `date_to`)
- `GET /api/reports/{id}` - Obtener por ID
- `PUT /api/reports/{id}` - Actualizar reporte
- `DELETE /api/reports/{id}` - Eliminar reporte
- `POST /api/reports/{id}/generate` - Generar reporte consolidado
- `POST /api/reports/{id}/consolidate-counts` - Consolidar conteos
- `POST /api/reports/{id}/consolidate-expenses` - Consolidar gastos
- `POST /api/reports/{id}/consolidate-sales` - Consolidar ventas
- `GET /api/reports/{id}/export-pdf` - Exportar a PDF
- `GET /api/reports/{id}/export-excel` - Exportar a Excel

### Users (`/api/users`)
Operaciones sobre usuarios del sistema

- `POST /api/users` - Crear usuario
- `GET /api/users` - Listar usuarios (filtros: `role`, `store_id`, `active`)
- `GET /api/users/{id}` - Obtener por ID
- `PUT /api/users/{id}` - Actualizar usuario
- `DELETE /api/users/{id}` - Desactivar usuario
- `POST /api/users/{id}/change-password` - Cambiar contraseña
- `POST /api/users/login` - Iniciar sesión
- `POST /api/users/logout` - Cerrar sesión
- `GET /api/users/{id}/permissions` - Obtener permisos del usuario

### Stores (`/api/stores`)
Operaciones sobre tiendas

- `POST /api/stores` - Crear tienda
- `GET /api/stores` - Listar tiendas (filtro: `active_only`)
- `GET /api/stores/{id}` - Obtener por ID
- `PUT /api/stores/{id}` - Actualizar tienda
- `DELETE /api/stores/{id}` - Desactivar tienda

### Cash Registers (`/api/stores/registers`)
Operaciones sobre cajas registradoras

- `POST /api/stores/registers` - Crear registradora
- `GET /api/stores/registers` - Listar registradoras (filtros: `store_id`, `active_only`)
- `GET /api/stores/registers/{id}` - Obtener por ID
- `PUT /api/stores/registers/{id}` - Actualizar registradora
- `DELETE /api/stores/registers/{id}` - Desactivar registradora
- `POST /api/stores/registers/{id}/activate` - Activar caja
- `POST /api/stores/registers/{id}/deactivate` - Desactivar caja
- `GET /api/stores/registers/{id}/current-balance` - Obtener saldo actual

### Categories (`/api/categories`)
Operaciones sobre categorías de gastos

- `POST /api/categories` - Crear categoría
- `GET /api/categories` - Listar categorías (filtro: `active`)
- `GET /api/categories/{id}` - Obtener por ID
- `PUT /api/categories/{id}` - Actualizar categoría
- `DELETE /api/categories/{id}` - Desactivar categoría
- `GET /api/categories/{id}/expenses-month` - Obtener gastos del mes
- `GET /api/categories/{id}/validate-budget` - Validar presupuesto

### Sales (`/api/sales`)
Operaciones sobre ventas diarias

- `POST /api/sales` - Registrar venta diaria
- `GET /api/sales` - Listar ventas (filtros: `store_id`, `date`, `register_id`)
- `GET /api/sales/{id}` - Obtener por ID
- `PUT /api/sales/{id}` - Actualizar venta
- `DELETE /api/sales/{id}` - Eliminar venta
- `POST /api/sales/{id}/calculate-totals` - Calcular totales automáticamente
- `GET /api/sales/{id}/summary` - Obtener resumen

### Cash Differences (`/api/differences`)
Operaciones sobre diferencias de caja

- `POST /api/differences` - Registrar diferencia
- `GET /api/differences` - Listar diferencias (filtros: `store_id`, `date`, `type`, `resolved`)
- `GET /api/differences/{id}` - Obtener por ID
- `PUT /api/differences/{id}` - Actualizar diferencia
- `POST /api/differences/{id}/classify` - Clasificar diferencia (OVER/SHORT/EXACTO)
- `POST /api/differences/{id}/resolve` - Resolver diferencia
- `POST /api/differences/{id}/attach-justification` - Adjuntar justificación

### Safe (`/api/safe`)
Operaciones sobre caja fuerte

- `POST /api/safe` - Crear registro de caja fuerte
- `GET /api/safe` - Listar registros (filtro: `store_id`)
- `GET /api/safe/{id}` - Obtener por ID
- `PUT /api/safe/{id}` - Actualizar saldo
- `POST /api/safe/{id}/update-balance` - Actualizar saldo
- `GET /api/safe/{id}/balance` - Obtener saldo actual
- `POST /api/safe/{id}/validate-limit` - Validar límite máximo
- `POST /api/safe/{id}/register-movement` - Registrar movimiento

### Audit Log (`/api/audit`)
Operaciones sobre bitácora de auditoría

- `POST /api/audit` - Registrar acción en bitácora
- `GET /api/audit` - Consultar historial (filtros: `user_id`, `module`, `date_from`, `date_to`)
- `GET /api/audit/{id}` - Obtener registro por ID
- `GET /api/audit/report` - Generar reporte de auditoría
- `GET /api/audit/export-logs` - Exportar logs
- `GET /api/audit/filter-by-date` - Filtrar por fecha
- `GET /api/audit/filter-by-user` - Filtrar por usuario
- `GET /api/audit/filter-by-module` - Filtrar por módulo

## 💾 Base de Datos

### SQLite (Desarrollo)

La base de datos SQLite se crea automáticamente en `gestorcash.db` al iniciar el servidor por primera vez.

### Migrar a PostgreSQL/MySQL

Edita `app/database.py`:

```python
# PostgreSQL
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@localhost/gestorcash"

# MySQL
SQLALCHEMY_DATABASE_URL = "mysql+pymysql://user:password@localhost/gestorcash"
```

O usa variables de entorno:

```env
DATABASE_URL=postgresql://user:password@localhost/gestorcash
```

## 📝 Ejemplos de Uso

### Crear un conteo de apertura

```python
import requests

response = requests.post(
    "http://localhost:8000/api/opening",
    json={
        "register_id": "reg-1",
        "store_id": "berwyn-il",
        "amount": 75.00,
        "date": "2024-01-15",
        "user_id": "sm-456",
        "user_name": "Marcus Holloway"
    }
)

print(response.json())
```

### Registrar un gasto

```python
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
```

### Aprobar un gasto

```python
response = requests.post(
    "http://localhost:8000/api/expenses/{expense_id}/approve",
    json={
        "user_id": "dm-123"  # Usuario que aprueba
    }
)
```

### Generar un reporte diario

```python
response = requests.post(
    "http://localhost:8000/api/reports/{report_id}/generate",
    json={
        "store_id": "berwyn-il",
        "date": "2024-01-15"
    }
)
```

### Consultar bitácora de auditoría

```python
response = requests.get(
    "http://localhost:8000/api/audit",
    params={
        "user_id": "sm-456",
        "module": "expenses",
        "date_from": "2024-01-01",
        "date_to": "2024-01-31"
    }
)
```

## 🔒 Seguridad

### Autenticación (Pendiente)

Actualmente el backend no tiene autenticación implementada. Para producción, se recomienda:

1. Implementar JWT (JSON Web Tokens)
2. Hash de contraseñas con bcrypt
3. Validación de roles en cada endpoint
4. Rate limiting
5. HTTPS obligatorio

### Validación de Datos

- Todos los endpoints usan Pydantic para validación automática
- Validación de tipos, rangos y formatos
- Mensajes de error descriptivos

## 🛠️ Desarrollo

### Agregar nuevas rutas

1. Crea un nuevo router en `app/routers/`
2. Agrega el router en `app/main.py`:
   ```python
   from app.routers import nuevo_router
   app.include_router(nuevo_router.router, prefix="/api/nuevo", tags=["Nuevo"])
   ```

### Migraciones de base de datos

Para cambios en modelos, instala Alembic:

```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "Descripción del cambio"
alembic upgrade head
```

## 📖 Documentación Interactiva

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## ⚠️ Notas Importantes

- El backend usa SQLite por defecto para simplicidad
- Para producción, considera migrar a PostgreSQL o MySQL
- La autenticación está pendiente (actualmente sin protección)
- CORS está configurado para desarrollo local
- Todos los endpoints respetan el esquema UML del sistema

## 🔗 Integración con Next.js

Ver el archivo `INTEGRACION_NEXTJS.md` para instrucciones detalladas sobre cómo integrar este backend con la aplicación Next.js.

## 📞 Soporte

Para más información sobre el sistema, consulta:
- Documentación del proyecto: `/docs/blueprint.md`
- README principal: `/README.md`
