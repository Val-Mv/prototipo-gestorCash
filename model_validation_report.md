# Reporte de Validación: Modelos Sequelize vs Esquema de Base de Datos

**Generado:** $(date)  
**Motor de Base de Datos:** PostgreSQL  
**DDL de Referencia:** DB_SCRIPT_GRUPO_DE_SISTEMAS_5.sql

## Resumen Ejecutivo

Este reporte compara todos los modelos Sequelize en `/app/server/src/models/` contra el esquema de base de datos definido en el DDL. El DDL muestra **dos conjuntos de tablas**: legado (singular, minúsculas) y nuevo (plural, camelCase en español). Los modelos están actualmente mapeados a las **tablas legado**, pero las **tablas nuevas** parecen ser el esquema activo.

### Hallazgos Críticos

- **15 modelos analizados**
- **13 modelos tienen discrepancias en nombres de tablas** (usan nombres singulares legado en lugar de nombres plurales nuevos)
- **Múltiples discrepancias en mapeo de campos** (modelos usan snake_case minúsculas, DDL usa camelCase en español)
- **Inconsistencias en tipos de datos** (boolean vs numeric(1), timestamptz vs timestamp, etc.)
- **Campos faltantes** en algunos modelos
- **Campos extra** en algunos modelos (campos virtuales que no existen en BD)

---

## Análisis Detallado por Modelo

### 1. Modelo Store ✅ **MAYORMENTE CORRECTO**

**Tabla del Modelo:** `store`  
**Tabla en DDL:** `store` ✅

| Campo | Tipo en Modelo | Tipo en DDL | Estado |
|-------|----------------|-------------|--------|
| id | STRING | varchar(255) | ✅ Coincide |
| name | STRING | varchar(255) | ✅ Coincide |
| code | STRING | varchar(255) | ✅ Coincide |
| active | BOOLEAN | bool | ✅ Coincide |

**Problemas:** Ninguno

---

### 2. Modelo Usuario ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `usuario`  
**Tabla en DDL:** `usuarios` ❌ (debería ser `usuarios`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idUsuario | idUsuario | INTEGER | "idUsuario" | serial4 | ⚠️ Mapeo: `idusuario` |
| nombreCompleto | nombreCompleto | STRING(150) | "nombreCompleto" | varchar(150) | ⚠️ Mapeo: `nombrecompleto` |
| email | email | STRING(150) | email | varchar(150) | ✅ Coincide |
| contrasenaHash | contrasenaHash | STRING(255) | "contrasenaHash" | varchar(255) | ⚠️ Mapeo: `contrasenahash` |
| telefono | telefono | STRING(30) | telefono | varchar(30) | ✅ Coincide |
| fechaCreacion | fechaCreacion | DATE | "fechaCreacion" | timestamptz | ⚠️ Tipo: DATE vs timestamptz |
| estadoActivo | estadoActivo | INTEGER | "estadoActivo" | bool | ❌ Discrepancia de tipo: INTEGER vs bool |
| idRol | idRol | INTEGER | "idRol" | int4 | ⚠️ Mapeo: `idrol` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `usuarios`, no `usuario`
2. ❌ **estadoActivo:** Modelo usa INTEGER, DDL usa bool (debería ser BOOLEAN)
3. ⚠️ **fechaCreacion:** Modelo usa DATE, DDL usa timestamptz (debería ser DATE con timezone)
4. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 3. Modelo Rol ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `rol`  
**Tabla en DDL:** `roles` ❌ (debería ser `roles`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idRol | idRol | INTEGER | "idRol" | serial4 | ⚠️ Mapeo: `idrol` |
| nombreRol | nombreRol | STRING(50) | "nombreRol" | varchar(50) | ⚠️ Mapeo: `nombrerol` |
| descripcion | descripcion | STRING(200) | descripcion | varchar(200) | ✅ Coincide |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `roles`, no `rol`
2. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 4. Modelo CajaRegistradora ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `caja_registradora`  
**Tabla en DDL:** `cajas_registradoras` ❌ (debería ser `cajas_registradoras`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idCaja | idCaja | INTEGER | "idCaja" | serial4 | ⚠️ Mapeo: `idcaja` |
| numeroCaja | numeroCaja | STRING(50) | "numeroCaja" | varchar(50) | ⚠️ Mapeo: `numerocaja` |
| montoInicialRequerido | montoInicialRequerido | DECIMAL(14,2) | "montoInicialRequerido" | numeric(14,2) | ⚠️ Mapeo: `montoinicialrequerido` |
| ubicacion | ubicacion | STRING(150) | ubicacion | varchar(150) | ✅ Coincide |
| estadoActiva | estadoActiva | INTEGER | "estadoActiva" | bool | ❌ Discrepancia de tipo: INTEGER vs bool |
| fechaRegistro | fechaRegistro | DATE | "fechaRegistro" | timestamptz | ⚠️ Tipo: DATE vs timestamptz |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `cajas_registradoras`, no `caja_registradora`
2. ❌ **estadoActiva:** Modelo usa INTEGER, DDL usa bool (debería ser BOOLEAN)
3. ⚠️ **fechaRegistro:** Modelo usa DATE, DDL usa timestamptz
4. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 5. Modelo CategoriaGasto ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `categoria_gasto`  
**Tabla en DDL:** `categorias_gasto` ❌ (debería ser `categorias_gasto`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idCategoria | idCategoria | INTEGER | "idCategoria" | serial4 | ⚠️ Problema de mapeo |
| nombre | nombre | STRING(150) | nombre | varchar(150) | ✅ Coincide |
| descripcion | descripcion | STRING(400) | descripcion | varchar(400) | ✅ Coincide |
| presupuestoMensual | presupuestoMensual | DECIMAL(14,2) | "presupuestoMensual" | numeric(14,2) | ⚠️ Problema de mapeo |
| activa | activa | BOOLEAN | activa | bool | ✅ Coincide |
| idUsuarioCreacion | idUsuarioCreacion | INTEGER | "idUsuarioCreacion" | int4 | ⚠️ Problema de mapeo |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `categorias_gasto`, no `categoria_gasto`
2. ⚠️ **Mapeos de campos:** Algunos campos necesitan mapeo correcto en camelCase

---

### 6. Modelo Gasto ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `gasto`  
**Tabla en DDL:** `gastos` ❌ (debería ser `gastos`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idGasto | idGasto | INTEGER | "idGasto" | serial4 | ⚠️ Mapeo: `idgasto` |
| fecha | fecha | DATE | fecha | timestamptz | ⚠️ Tipo: DATE vs timestamptz |
| monto | monto | DECIMAL(14,2) | monto | numeric(14,2) | ✅ Coincide |
| descripcion | descripcion | STRING(500) | descripcion | varchar(500) | ✅ Coincide |
| numeroComprobante | numeroComprobante | STRING(200) | "numeroComprobante" | varchar(200) | ⚠️ Mapeo: `numerocomprobante` |
| rutaComprobante | rutaComprobante | STRING(400) | "rutaComprobante" | varchar(400) | ⚠️ Mapeo: `rutacomprobante` |
| idCaja | idCaja | INTEGER | "idCaja" | int4 | ⚠️ Mapeo: `idcaja` |
| idUsuarioRegistro | idUsuarioRegistro | INTEGER | "idUsuarioRegistro" | int4 | ⚠️ Mapeo: `idusuarioregistro` |
| idUsuarioAprobacion | idUsuarioAprobacion | INTEGER | "idUsuarioAprobacion" | int4 | ⚠️ Mapeo: `idusuarioaprobacion` |
| idCajaOrigen | idCajaOrigen | INTEGER | "idCajaOrigen" | int4 | ⚠️ Mapeo: `idcajaorigen` |
| idCategoria | idCategoria | INTEGER | "idCategoria" | int4 | ⚠️ Mapeo: `idcategoria` |
| idEstadoGasto | idEstadoGasto | INTEGER | "idEstadoGasto" | int4 | ⚠️ Mapeo: `idestadogasto` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `gastos`, no `gasto`
2. ⚠️ **fecha:** Modelo usa DATE, DDL usa timestamptz
3. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 7. Modelo EstadoGasto ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `estado_gasto`  
**Tabla en DDL:** `estados_gasto` ❌ (debería ser `estados_gasto`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idEstadoGasto | idEstadoGasto | INTEGER | "idEstadoGasto" | serial4 | ⚠️ Mapeo: `idestadogasto` |
| nombreEstado | nombreEstado | STRING(20) | "nombreEstado" | varchar(20) | ⚠️ Mapeo: `nombreestado` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `estados_gasto`, no `estado_gasto`
2. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 8. Modelo CajaFuerte ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `caja_fuerte`  
**Tabla en DDL:** `cajas_fuertes` ❌ (debería ser `cajas_fuertes`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idCajaFuerte | idCajaFuerte | INTEGER | "idCajaFuerte" | serial4 | ⚠️ Mapeo: `idcajafuerte` |
| codigo | codigo | STRING(100) | codigo | varchar(100) | ✅ Coincide |
| saldoActual | saldoActual | DECIMAL(18,2) | "saldoActual" | numeric(18,2) | ⚠️ Mapeo: `saldoactual` |
| limiteMaximo | limiteMaximo | DECIMAL(18,2) | "limiteMaximo" | numeric(18,2) | ⚠️ Mapeo: `limitemaximo` |
| ubicacion | ubicacion | STRING(150) | ubicacion | varchar(150) | ✅ Coincide |
| fechaUltimaActualizacion | fechaUltimaActualizacion | DATE | "fechaUltimaActualizacion" | timestamptz | ⚠️ Tipo: DATE vs timestamptz |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `cajas_fuertes`, no `caja_fuerte`
2. ⚠️ **fechaUltimaActualizacion:** Modelo usa DATE, DDL usa timestamptz
3. ⚠️ **Mapeos de campos:** Algunos campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 9. Modelo VentaDiaria ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `venta_diaria`  
**Tabla en DDL:** `ventas_diarias` ❌ (debería ser `ventas_diarias`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idVenta | idVenta | INTEGER | "idVenta" | serial4 | ⚠️ Mapeo: `idventa` |
| fecha | fecha | DATEONLY | fecha | date | ✅ Coincide |
| numeroClientes | numeroClientes | INTEGER | "numeroClientes" | int4 | ⚠️ Mapeo: `totalclientes` (¡INCORRECTO!) |
| totalEfectivo | totalEfectivo | DECIMAL(14,2) | "totalEfectivo" | numeric(14,2) | ⚠️ Mapeo: `totalefectivo` |
| totalTarjeta | totalTarjeta | DECIMAL(14,2) | "totalTarjeta" | numeric(14,2) | ⚠️ Mapeo: `totaltarjeta` |
| ventaTotal | ventaTotal | VIRTUAL | "ventaTotal" | numeric(14,2) | ❌ Modelo usa VIRTUAL, DDL tiene columna real |
| idCaja | idCaja | INTEGER | "idCaja" | int4 | ⚠️ Mapeo: `idcaja` |
| idUsuario | idUsuario | INTEGER | "idUsuario" | int4 | ⚠️ Mapeo: `idusuariogeneral` (¡INCORRECTO!) |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `ventas_diarias`, no `venta_diaria`
2. ❌ **numeroClientes:** Modelo mapea a `totalclientes`, pero columna en DDL es `numeroClientes`
3. ❌ **ventaTotal:** Modelo usa VIRTUAL, pero DDL tiene columna real `ventaTotal` (numeric(14,2))
4. ❌ **idUsuario:** Modelo mapea a `idusuariogeneral`, pero columna en DDL es `idUsuario`
5. ⚠️ **Campo faltante:** `idReporte` existe en DDL pero no en modelo

---

### 10. Modelo BitacoraAuditoria ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `bitacora_auditoria`  
**Tabla en DDL:** `bitacoras_auditoria` ❌ (debería ser `bitacoras_auditoria`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idBitacora | idBitacora | INTEGER | "idBitacora" | serial4 | ⚠️ Mapeo: `idbitacora` |
| fechaHora | fechaHora | DATE | "fechaHora" | timestamptz | ⚠️ Tipo: DATE vs timestamptz |
| accion | accion | STRING(200) | accion | varchar(200) | ✅ Coincide |
| tablaModificada | tablaModificada | STRING(200) | "tablaModificada" | varchar(200) | ⚠️ Mapeo: `moduloAfectado` (¡INCORRECTO!) |
| registroAfectado | registroAfectado | STRING(200) | "registroAfectado" | varchar(200) | ⚠️ Mapeo: `registroId` (¡INCORRECTO!) |
| descripcion | descripcion | STRING(1000) | descripcion | varchar(1000) | ✅ Coincide |
| valoresAnteriores | valoresAnteriores | TEXT | "valoresAnteriores" | text | ⚠️ Mapeo: `valoresanteriores` |
| valoresNuevos | valoresNuevos | TEXT | "valoresNuevos" | text | ⚠️ Mapeo: `valoresnuevos` |
| direccionIP | direccionIP | STRING(100) | "direccionIP" | varchar(100) | ⚠️ Mapeo: `direccionip` |
| idUsuario | idUsuario | INTEGER | "idUsuario" | int4 | ⚠️ Mapeo: `idusuario` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `bitacoras_auditoria`, no `bitacora_auditoria`
2. ❌ **tablaModificada:** Modelo mapea a `moduloAfectado`, pero columna en DDL es `tablaModificada`
3. ❌ **registroAfectado:** Modelo mapea a `registroId`, pero columna en DDL es `registroAfectado`
4. ⚠️ **fechaHora:** Modelo usa DATE, DDL usa timestamptz
5. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 11. Modelo Conteo ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `conteo`  
**Tabla en DDL:** `conteos` ❌ (debería ser `conteos`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idConteo | idConteo | INTEGER | "idConteo" | serial4 | ⚠️ Mapeo: `idconteo` |
| fechaHora | fechaHora | DATE | "fechaHora" | timestamptz | ⚠️ Tipo: DATE vs timestamptz |
| montoContado | montoContado | DECIMAL(14,2) | "montoContado" | numeric(14,2) | ⚠️ Mapeo: `montocontado` |
| montoEsperado | montoEsperado | DECIMAL(14,2) | "montoEsperado" | numeric(14,2) | ⚠️ Mapeo: `montoesperado` |
| diferencia | diferencia | VIRTUAL | diferencia | numeric(14,2) | ❌ Modelo usa VIRTUAL, DDL tiene columna real |
| observaciones | observaciones | STRING(500) | observaciones | varchar(500) | ✅ Coincide |
| idCaja | idCaja | INTEGER | "idCaja" | int4 | ⚠️ Mapeo: `idcaja` |
| idUsuario | idUsuario | INTEGER | "idUsuario" | int4 | ⚠️ Mapeo: `idusuario` |
| idTipoConteo | idTipoConteo | INTEGER | "idTipoConteo" | int4 | ⚠️ Mapeo: `idtipoconteo` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `conteos`, no `conteo`
2. ❌ **diferencia:** Modelo usa VIRTUAL, pero DDL tiene columna real `diferencia` (numeric(14,2))
3. ⚠️ **fechaHora:** Modelo usa DATE, DDL usa timestamptz
4. ⚠️ **Campo faltante:** `idReporte` existe en DDL pero no en modelo
5. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 12. Modelo DiferenciaCaja ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `diferencia_caja`  
**Tabla en DDL:** `diferencias_caja` ❌ (debería ser `diferencias_caja`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idDiferencia | idDiferencia | INTEGER | "idDiferencia" | serial4 | ⚠️ Mapeo: `iddiferencia` |
| fecha | fecha | DATE | fecha | timestamptz | ⚠️ Tipo: DATE vs timestamptz |
| montoEsperado | montoEsperado | DECIMAL(14,2) | "montoEsperado" | numeric(14,2) | ⚠️ Mapeo: `montoesperado` |
| montoReal | montoReal | DECIMAL(14,2) | "montoReal" | numeric(14,2) | ⚠️ Mapeo: `montoreal` |
| diferencia | diferencia | VIRTUAL | diferencia | numeric(14,2) | ❌ Modelo usa VIRTUAL, DDL tiene columna real |
| justificacion | justificacion | VIRTUAL | justificacion | varchar(500) | ❌ Modelo usa VIRTUAL, DDL tiene columna real |
| resuelta | resuelta | INTEGER | resuelta | bool | ❌ Discrepancia de tipo: INTEGER vs bool |
| idConteo | idConteo | INTEGER | "idConteo" | int4 | ⚠️ Mapeo: `idconteo` |
| idTipoDiferencia | idTipoDiferencia | INTEGER | "idTipoDiferencia" | int4 | ⚠️ Mapeo: `idtipodiferencia` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `diferencias_caja`, no `diferencia_caja`
2. ❌ **diferencia:** Modelo usa VIRTUAL, pero DDL tiene columna real `diferencia` (numeric(14,2))
3. ❌ **justificacion:** Modelo usa VIRTUAL, pero DDL tiene columna real `justificacion` (varchar(500))
4. ❌ **resuelta:** Modelo usa INTEGER, DDL usa bool (debería ser BOOLEAN)
5. ❌ **Campo faltante:** `idUsuario` existe en DDL pero no en modelo (está comentado en modelo)
6. ⚠️ **fecha:** Modelo usa DATE, DDL usa timestamptz
7. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 13. Modelo TipoConteo ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `tipo_conteo`  
**Tabla en DDL:** `tipos_conteo` ❌ (debería ser `tipos_conteo`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idTipoConteo | idTipoConteo | INTEGER | "idTipoConteo" | serial4 | ⚠️ Mapeo: `idtipoconteo` |
| nombreTipo | nombreTipo | STRING(20) | "nombreTipo" | varchar(20) | ⚠️ Mapeo: `nombretipo` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `tipos_conteo`, no `tipo_conteo`
2. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 14. Modelo TipoDiferencia ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `tipo_diferencia`  
**Tabla en DDL:** `tipos_diferencia` ❌ (debería ser `tipos_diferencia`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idTipoDiferencia | idTipoDiferencia | INTEGER | "idTipoDiferencia" | serial4 | ⚠️ Mapeo: `idtipodiferencia` |
| nombreTipo | nombreTipo | STRING(20) | "nombreTipo" | varchar(20) | ⚠️ Mapeo: `nombretipo` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `tipos_diferencia`, no `tipo_diferencia`
2. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

### 15. Modelo ReporteDiario ❌ **DISCREPANCIA EN NOMBRE DE TABLA**

**Tabla del Modelo:** `reporte_diario`  
**Tabla en DDL:** `reportes_diarios` ❌ (debería ser `reportes_diarios`)

| Campo | Campo en Modelo | Tipo en Modelo | Columna en DDL | Tipo en DDL | Estado |
|-------|----------------|----------------|----------------|------------|--------|
| idReporte | idReporte | INTEGER | "idReporte" | serial4 | ⚠️ Mapeo: `idreporte` |
| fecha | fecha | DATEONLY | fecha | date | ✅ Coincide |
| totalVentas | totalVentas | DECIMAL(18,2) | "totalVentas" | numeric(18,2) | ⚠️ Mapeo: `totalventas` |
| saldoFinal | saldoFinal | DECIMAL(18,2) | "saldoFinal" | numeric(18,2) | ⚠️ Mapeo: `saldofinal` |
| totalClientes | totalClientes | INTEGER | "numeroClientesTotal" | int4 | ❌ Mapeo: `totalclientestotal` (¡INCORRECTO!) |
| totalEfectivo | totalEfectivo | DECIMAL(18,2) | "totalEfectivo" | numeric(18,2) | ⚠️ Mapeo: `totalefectivototal` (¡INCORRECTO!) |
| totalTarjeta | totalTarjeta | DECIMAL(18,2) | "totalTarjeta" | numeric(18,2) | ⚠️ Mapeo: `totaltarjeta` |
| totalGastosDia | totalGastosDia | DECIMAL(18,2) | "totalGastos" | numeric(18,2) | ❌ Mapeo: `totalgastosdia` (¡INCORRECTO!) |
| totalDiferencias | totalDiferencias | DECIMAL(18,2) | N/A | N/A | ❌ Campo no existe en DDL |
| idUsuarioGenerador | idUsuarioGenerador | INTEGER | "idUsuarioGenerador" | int4 | ⚠️ Mapeo: `idusuariogenerador` |

**Problemas:**
1. ❌ **Nombre de tabla:** Debería ser `reportes_diarios`, no `reporte_diario`
2. ❌ **totalClientes:** Modelo mapea a `totalclientestotal`, pero columna en DDL es `numeroClientesTotal`
3. ❌ **totalEfectivo:** Modelo mapea a `totalefectivototal`, pero columna en DDL es `totalEfectivo`
4. ❌ **totalGastosDia:** Modelo mapea a `totalgastosdia`, pero columna en DDL es `totalGastos`
5. ❌ **totalDiferencias:** Campo no existe en DDL (debería eliminarse o usar `resumenDiferencias`/`cantidadDiferencias`)
6. ⚠️ **Campos faltantes:** `resumenDiferencias` (varchar(1000)) y `cantidadDiferencias` (int4) existen en DDL pero no en modelo
7. ⚠️ **Mapeos de campos:** Todos los campos usan snake_case minúsculas, pero DDL usa camelCase en español

---

## Resumen de Problemas por Categoría

### Problemas Críticos (Deben Corregirse)

1. **Discrepancias en Nombres de Tablas (13 modelos):**
   - `usuario` → `usuarios`
   - `rol` → `roles`
   - `caja_registradora` → `cajas_registradoras`
   - `categoria_gasto` → `categorias_gasto`
   - `gasto` → `gastos`
   - `estado_gasto` → `estados_gasto`
   - `caja_fuerte` → `cajas_fuertes`
   - `venta_diaria` → `ventas_diarias`
   - `bitacora_auditoria` → `bitacoras_auditoria`
   - `conteo` → `conteos`
   - `diferencia_caja` → `diferencias_caja`
   - `tipo_conteo` → `tipos_conteo`
   - `tipo_diferencia` → `tipos_diferencia`
   - `reporte_diario` → `reportes_diarios`

2. **Discrepancias en Tipos de Datos:**
   - `Usuario.estadoActivo`: INTEGER → BOOLEAN
   - `CajaRegistradora.estadoActiva`: INTEGER → BOOLEAN
   - `DiferenciaCaja.resuelta`: INTEGER → BOOLEAN

3. **Errores en Mapeo de Campos:**
   - `VentaDiaria.numeroClientes`: mapea a `totalclientes` → debería mapear a `numeroClientes`
   - `VentaDiaria.idUsuario`: mapea a `idusuariogeneral` → debería mapear a `idUsuario`
   - `BitacoraAuditoria.tablaModificada`: mapea a `moduloAfectado` → debería mapear a `tablaModificada`
   - `BitacoraAuditoria.registroAfectado`: mapea a `registroId` → debería mapear a `registroAfectado`
   - `ReporteDiario.totalClientes`: mapea a `totalclientestotal` → debería mapear a `numeroClientesTotal`
   - `ReporteDiario.totalEfectivo`: mapea a `totalefectivototal` → debería mapear a `totalEfectivo`
   - `ReporteDiario.totalGastosDia`: mapea a `totalgastosdia` → debería mapear a `totalGastos`

4. **Campos Virtuales que Deberían Ser Reales:**
   - `VentaDiaria.ventaTotal`: VIRTUAL → debería ser DECIMAL(14,2)
   - `Conteo.diferencia`: VIRTUAL → debería ser DECIMAL(14,2)
   - `DiferenciaCaja.diferencia`: VIRTUAL → debería ser DECIMAL(14,2)
   - `DiferenciaCaja.justificacion`: VIRTUAL → debería ser STRING(500)

5. **Campos Faltantes:**
   - `VentaDiaria.idReporte`: falta en modelo
   - `Conteo.idReporte`: falta en modelo
   - `DiferenciaCaja.idUsuario`: falta en modelo (existe en DDL)
   - `ReporteDiario.resumenDiferencias`: falta en modelo
   - `ReporteDiario.cantidadDiferencias`: falta en modelo

6. **Campos Extra (Deben Eliminarse):**
   - `ReporteDiario.totalDiferencias`: no existe en DDL

### Problemas de Advertencia (Deberían Corregirse)

1. **Discrepancias en Tipos de Timestamp:**
   - Múltiples modelos usan `DATE` pero DDL usa `timestamptz`
   - Deberían usar `DataTypes.DATE` con soporte de timezone o `DataTypes.DATEONLY` donde corresponda

2. **Mapeos de Nombres de Campos:**
   - Todos los modelos usan mapeos en snake_case minúsculas, pero DDL usa camelCase en español
   - Deberían actualizarse los mapeos para coincidir exactamente con los nombres de columnas del DDL

---

## Recomendaciones

1. **Acciones Inmediatas:**
   - Actualizar todos los nombres de tablas para coincidir con las tablas plurales en camelCase del DDL
   - Corregir todos los mapeos de campos para usar los nombres exactos de columnas del DDL
   - Convertir campos INTEGER boolean a BOOLEAN
   - Convertir campos VIRTUAL a columnas reales de base de datos donde existan en DDL
   - Agregar campos faltantes a los modelos
   - Eliminar campos no existentes de los modelos

2. **Pruebas:**
   - Después de aplicar correcciones, probar todas las operaciones CRUD
   - Verificar que las relaciones de claves foráneas sigan funcionando
   - Verificar que los índices se creen correctamente

3. **Documentación:**
   - Actualizar documentación de modelos para reflejar nombres correctos de tablas y columnas
   - Documentar cualquier diferencia intencional entre modelo y esquema

---

## Notas

- El DDL contiene definiciones tanto de tablas legado (singular) como nuevas (plural). Los modelos deben apuntar a las **tablas nuevas plurales**.
- Algunos modelos tienen comentarios que indican conocimiento de discrepancias (ej: `DiferenciaCaja.idUsuario` está comentado).
- El modelo `Store` usa correctamente la tabla `store` (singular), que coincide con el DDL.

---

**Fin del Reporte**
