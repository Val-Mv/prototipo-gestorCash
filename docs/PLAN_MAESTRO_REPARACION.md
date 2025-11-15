# Plan Maestro de Reparación - Modelos Sequelize vs Esquema de Base de Datos

**Fecha de Creación:** $(date)  
**Objetivo:** Alinear todos los modelos Sequelize con el esquema de base de datos definido en el DDL  
**Idioma:** 100% Español (sin términos en inglés)

---

## Resumen Ejecutivo

Este plan detalla la reparación sistemática de 15 modelos Sequelize para que coincidan exactamente con el esquema de base de datos PostgreSQL. La reparación se realizará en 6 fases secuenciales, cada una enfocada en un tipo específico de corrección para minimizar riesgos y facilitar la validación.

### Modelos a Reparar

1. Usuario
2. Rol
3. CajaRegistradora
4. CategoriaGasto
5. Gasto
6. EstadoGasto
7. CajaFuerte
8. VentaDiaria
9. BitacoraAuditoria
10. Conteo
11. DiferenciaCaja
12. TipoConteo
13. TipoDiferencia
14. ReporteDiario
15. Store (sin cambios necesarios)

---

## Estrategia de Aplicación

### Principios de Seguridad

1. **Una fase a la vez:** Completar y validar cada fase antes de continuar
2. **Backup antes de cada fase:** Crear punto de restauración
3. **Validación incremental:** Probar después de cada fase
4. **Reversibilidad:** Cada cambio debe poder revertirse fácilmente
5. **Documentación:** Registrar cada cambio realizado

### Orden de Ejecución

Las fases deben ejecutarse **estrictamente en el orden indicado**, sin saltar fases ni combinarlas.

---

## FASE 1 — Corrección de Nombres de Tablas

### Objetivo

Actualizar únicamente la propiedad `tableName` en cada modelo para que apunte a las tablas plurales correctas del esquema de base de datos.

### Alcance

Esta fase **SOLO** modifica la propiedad `tableName` en la configuración de cada modelo. No toca campos, tipos de datos, ni mapeos.

### Modelos Afectados

| Modelo | Tabla Actual (Incorrecta) | Tabla Correcta (DDL) | Archivo |
|--------|---------------------------|----------------------|---------|
| Usuario | `usuario` | `usuarios` | `app/server/src/models/Usuario.ts` |
| Rol | `rol` | `roles` | `app/server/src/models/Rol.ts` |
| CajaRegistradora | `caja_registradora` | `cajas_registradoras` | `app/server/src/models/CajaRegistradora.ts` |
| CategoriaGasto | `categoria_gasto` | `categorias_gasto` | `app/server/src/models/CategoriaGasto.ts` |
| Gasto | `gasto` | `gastos` | `app/server/src/models/Gasto.ts` |
| EstadoGasto | `estado_gasto` | `estados_gasto` | `app/server/src/models/EstadoGasto.ts` |
| CajaFuerte | `caja_fuerte` | `cajas_fuertes` | `app/server/src/models/CajaFuerte.ts` |
| VentaDiaria | `venta_diaria` | `ventas_diarias` | `app/server/src/models/VentaDiaria.ts` |
| BitacoraAuditoria | `bitacora_auditoria` | `bitacoras_auditoria` | `app/server/src/models/BitacoraAuditoria.ts` |
| Conteo | `conteo` | `conteos` | `app/server/src/models/Conteo.ts` |
| DiferenciaCaja | `diferencia_caja` | `diferencias_caja` | `app/server/src/models/DiferenciaCaja.ts` |
| TipoConteo | `tipo_conteo` | `tipos_conteo` | `app/server/src/models/TipoConteo.ts` |
| TipoDiferencia | `tipo_diferencia` | `tipos_diferencia` | `app/server/src/models/TipoDiferencia.ts` |
| ReporteDiario | `reporte_diario` | `reportes_diarios` | `app/server/src/models/ReporteDiario.ts` |

**Total:** 14 modelos (Store no requiere cambios)

### Acciones por Modelo

#### 1. Usuario
- **Archivo:** `app/server/src/models/Usuario.ts`
- **Línea aproximada:** 78
- **Cambio:** `tableName: 'usuario'` → `tableName: 'usuarios'`

#### 2. Rol
- **Archivo:** `app/server/src/models/Rol.ts`
- **Línea aproximada:** 40
- **Cambio:** `tableName: 'rol'` → `tableName: 'roles'`

#### 3. CajaRegistradora
- **Archivo:** `app/server/src/models/CajaRegistradora.ts`
- **Línea aproximada:** 67
- **Cambio:** `tableName: 'caja_registradora'` → `tableName: 'cajas_registradoras'`

#### 4. CategoriaGasto
- **Archivo:** `app/server/src/models/CategoriaGasto.ts`
- **Línea aproximada:** 60
- **Cambio:** `tableName: 'categoria_gasto'` → `tableName: 'categorias_gasto'`

#### 5. Gasto
- **Archivo:** `app/server/src/models/Gasto.ts`
- **Línea aproximada:** 107
- **Cambio:** `tableName: 'gasto'` → `tableName: 'gastos'`

#### 6. EstadoGasto
- **Archivo:** `app/server/src/models/EstadoGasto.ts`
- **Línea aproximada:** 36
- **Cambio:** `tableName: 'estado_gasto'` → `tableName: 'estados_gasto'`

#### 7. CajaFuerte
- **Archivo:** `app/server/src/models/CajaFuerte.ts`
- **Línea aproximada:** 67
- **Cambio:** `tableName: 'caja_fuerte'` → `tableName: 'cajas_fuertes'`

#### 8. VentaDiaria
- **Archivo:** `app/server/src/models/VentaDiaria.ts`
- **Línea aproximada:** 85
- **Cambio:** `tableName: 'venta_diaria'` → `tableName: 'ventas_diarias'`

#### 9. BitacoraAuditoria
- **Archivo:** `app/server/src/models/BitacoraAuditoria.ts`
- **Línea aproximada:** 95
- **Cambio:** `tableName: 'bitacora_auditoria'` → `tableName: 'bitacoras_auditoria'`

#### 10. Conteo
- **Archivo:** `app/server/src/models/Conteo.ts`
- **Línea aproximada:** 86
- **Cambio:** `tableName: 'conteo'` → `tableName: 'conteos'`

#### 11. DiferenciaCaja
- **Archivo:** `app/server/src/models/DiferenciaCaja.ts`
- **Línea aproximada:** 91
- **Cambio:** `tableName: 'diferencia_caja'` → `tableName: 'diferencias_caja'`

#### 12. TipoConteo
- **Archivo:** `app/server/src/models/TipoConteo.ts`
- **Línea aproximada:** 35
- **Cambio:** `tableName: 'tipo_conteo'` → `tableName: 'tipos_conteo'`

#### 13. TipoDiferencia
- **Archivo:** `app/server/src/models/TipoDiferencia.ts`
- **Línea aproximada:** 35
- **Cambio:** `tableName: 'tipo_diferencia'` → `tableName: 'tipos_diferencia'`

#### 14. ReporteDiario
- **Archivo:** `app/server/src/models/ReporteDiario.ts`
- **Línea aproximada:** 111
- **Cambio:** `tableName: 'reporte_diario'` → `tableName: 'reportes_diarios'`

### Archivos Impactados

- `app/server/src/models/Usuario.ts`
- `app/server/src/models/Rol.ts`
- `app/server/src/models/CajaRegistradora.ts`
- `app/server/src/models/CategoriaGasto.ts`
- `app/server/src/models/Gasto.ts`
- `app/server/src/models/EstadoGasto.ts`
- `app/server/src/models/CajaFuerte.ts`
- `app/server/src/models/VentaDiaria.ts`
- `app/server/src/models/BitacoraAuditoria.ts`
- `app/server/src/models/Conteo.ts`
- `app/server/src/models/DiferenciaCaja.ts`
- `app/server/src/models/TipoConteo.ts`
- `app/server/src/models/TipoDiferencia.ts`
- `app/server/src/models/ReporteDiario.ts`

### Validación Post-Fase 1

1. Compilar el proyecto TypeScript sin errores
2. Verificar que los modelos se importen correctamente
3. No ejecutar consultas a base de datos todavía (los mapeos aún no están corregidos)

### Riesgos

- **Bajo:** Esta fase solo cambia nombres de tablas. Si la base de datos tiene las tablas correctas, no habrá problemas.
- **Mitigación:** Verificar que las tablas plurales existan en la base de datos antes de aplicar cambios.

---

## FASE 2 — Corrección de Tipos de Datos

### Objetivo

Corregir los tipos de datos en los modelos para que coincidan exactamente con los tipos definidos en el DDL.

### Alcance

Esta fase modifica únicamente los tipos de datos en las definiciones de campos. No modifica nombres de campos ni mapeos.

### Tipos de Correcciones Necesarias

#### 2.1. Campos Booleanos (INTEGER → BOOLEAN)

**Modelos Afectados:**

1. **Usuario.estadoActivo**
   - **Archivo:** `app/server/src/models/Usuario.ts`
   - **Líneas aproximadas:** 11, 25, 64-68
   - **Cambios:**
     - Interface: `estadoActivo: number` → `estadoActivo: boolean`
     - Clase: `public estadoActivo!: number` → `public estadoActivo!: boolean`
     - Definición: `type: DataTypes.INTEGER` → `type: DataTypes.BOOLEAN`
     - Default: `defaultValue: 1` → `defaultValue: true`

2. **CajaRegistradora.estadoActiva**
   - **Archivo:** `app/server/src/models/CajaRegistradora.ts`
   - **Líneas aproximadas:** 9, 24, 52-57
   - **Cambios:**
     - Interface: `estadoActiva: number` → `estadoActiva: boolean`
     - Clase: `public estadoActiva!: number` → `public estadoActiva!: boolean`
     - Definición: `type: DataTypes.INTEGER` → `type: DataTypes.BOOLEAN`
     - Default: `defaultValue: 1` → `defaultValue: true`

3. **DiferenciaCaja.resuelta**
   - **Archivo:** `app/server/src/models/DiferenciaCaja.ts`
   - **Líneas aproximadas:** 11, 30, 72-77
   - **Cambios:**
     - Interface: `resuelta: number` → `resuelta: boolean`
     - Clase: `public resuelta!: number` → `public resuelta!: boolean`
     - Definición: `type: DataTypes.INTEGER` → `type: DataTypes.BOOLEAN`
     - Default: `defaultValue: 0` → `defaultValue: false`

#### 2.2. Campos de Timestamp (DATE → TIMESTAMPTZ)

**Nota:** Los campos de fecha que en el DDL son `timestamptz` deben mantenerse como `DataTypes.DATE` en Sequelize, ya que Sequelize maneja automáticamente las zonas horarias. Sin embargo, debemos verificar que los campos estén correctamente configurados.

**Modelos Afectados (Verificación):**

1. **Usuario.fechaCreacion**
   - **Archivo:** `app/server/src/models/Usuario.ts`
   - **Estado:** Ya usa `DataTypes.DATE` (correcto para timestamptz en Sequelize)
   - **Acción:** Verificar que el mapeo sea correcto (se corregirá en Fase 3)

2. **CajaRegistradora.fechaRegistro**
   - **Archivo:** `app/server/src/models/CajaRegistradora.ts`
   - **Estado:** Ya usa `DataTypes.DATE` (correcto)
   - **Acción:** Verificar mapeo en Fase 3

3. **CajaFuerte.fechaUltimaActualizacion**
   - **Archivo:** `app/server/src/models/CajaFuerte.ts`
   - **Estado:** Ya usa `DataTypes.DATE` (correcto)
   - **Acción:** Verificar mapeo en Fase 3

4. **Gasto.fecha**
   - **Archivo:** `app/server/src/models/Gasto.ts`
   - **Estado:** Ya usa `DataTypes.DATE` (correcto)
   - **Acción:** Verificar mapeo en Fase 3

5. **BitacoraAuditoria.fechaHora**
   - **Archivo:** `app/server/src/models/BitacoraAuditoria.ts`
   - **Estado:** Ya usa `DataTypes.DATE` (correcto)
   - **Acción:** Verificar mapeo en Fase 3

6. **Conteo.fechaHora**
   - **Archivo:** `app/server/src/models/Conteo.ts`
   - **Estado:** Ya usa `DataTypes.DATE` (correcto)
   - **Acción:** Verificar mapeo en Fase 3

7. **DiferenciaCaja.fecha**
   - **Archivo:** `app/server/src/models/DiferenciaCaja.ts`
   - **Estado:** Ya usa `DataTypes.DATE` (correcto)
   - **Acción:** Verificar mapeo en Fase 3

#### 2.3. Campos DECIMAL (Verificación de Precisión)

**Modelos Afectados (Verificación de precisión):**

Todos los campos DECIMAL deben verificar que la precisión coincida con el DDL:

- `DECIMAL(14, 2)` para montos de cajas, gastos, ventas
- `DECIMAL(18, 2)` para montos de cajas fuertes y reportes

**Acción:** Verificar que todos los campos DECIMAL tengan la precisión correcta según el DDL.

### Archivos Impactados

- `app/server/src/models/Usuario.ts`
- `app/server/src/models/CajaRegistradora.ts`
- `app/server/src/models/DiferenciaCaja.ts`

### Validación Post-Fase 2

1. Compilar TypeScript sin errores
2. Verificar que las interfaces TypeScript sean consistentes
3. Verificar que los valores por defecto sean correctos

### Riesgos

- **Medio:** Cambiar tipos puede afectar código que dependa de valores numéricos (0/1) para booleanos.
- **Mitigación:** Buscar en el código todas las referencias a estos campos y actualizarlas si es necesario.

---

## FASE 3 — Corrección de Mapeos de Campos (camelCase Español)

### Objetivo

Actualizar todos los mapeos de campos (`field`) para que usen exactamente los nombres de columnas en camelCase español definidos en el DDL.

### Alcance

Esta fase modifica únicamente la propiedad `field` en cada definición de campo. No modifica nombres de propiedades en interfaces ni clases.

### Modelos Afectados y Correcciones Detalladas

#### 1. Usuario

**Archivo:** `app/server/src/models/Usuario.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idUsuario | `'idusuario'` | `'idUsuario'` | 35 |
| nombreCompleto | `'nombrecompleto'` | `'nombreCompleto'` | 40 |
| contrasenaHash | `'contrasenahash'` | `'contrasenaHash'` | 51 |
| fechaCreacion | `'fechacreacion'` | `'fechaCreacion'` | 62 |
| estadoActivo | `'estadoactivo'` | `'estadoActivo'` | 68 |
| idRol | `'idrol'` | `'idRol'` | 73 |

**Total de cambios:** 6 campos

#### 2. Rol

**Archivo:** `app/server/src/models/Rol.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idRol | `'idrol'` | `'idRol'` | 24 |
| nombreRol | `'nombrerol'` | `'nombreRol'` | 30 |

**Total de cambios:** 2 campos

#### 3. CajaRegistradora

**Archivo:** `app/server/src/models/CajaRegistradora.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idCaja | `'idcaja'` | `'idCaja'` | 34 |
| numeroCaja | `'numerocaja'` | `'numeroCaja'` | 40 |
| montoInicialRequerido | `'montoinicialrequerido'` | `'montoInicialRequerido'` | 45 |
| estadoActiva | `'estadoactiva'` | `'estadoActiva'` | 56 |
| fechaRegistro | `'fecharegistro'` | `'fechaRegistro'` | 62 |

**Total de cambios:** 5 campos

#### 4. CategoriaGasto

**Archivo:** `app/server/src/models/CategoriaGasto.ts`

| Propiedad | Mapeo Actual | Mapeo Correcto (DDL) | Línea Aprox. | Nota |
|-----------|-------------|----------------------|--------------|------|
| idCategoria | (sin mapeo) | `'idCategoria'` | 34 | Agregar mapeo |
| presupuestoMensual | (sin mapeo) | `'presupuestoMensual'` | 47 | Agregar mapeo |
| idUsuarioCreacion | (sin mapeo) | `'idUsuarioCreacion'` | 56 | Agregar mapeo |

**Total de cambios:** 3 campos (agregar mapeos faltantes)

#### 5. Gasto

**Archivo:** `app/server/src/models/Gasto.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idGasto | `'idgasto'` | `'idGasto'` | 46 |
| numeroComprobante | `'numerocomprobante'` | `'numeroComprobante'` | 67 |
| rutaComprobante | `'rutacomprobante'` | `'rutaComprobante'` | 72 |
| idCaja | `'idcaja'` | `'idCaja'` | 77 |
| idUsuarioRegistro | `'idusuarioregistro'` | `'idUsuarioRegistro'` | 82 |
| idUsuarioAprobacion | `'idusuarioaprobacion'` | `'idUsuarioAprobacion'` | 87 |
| idCajaOrigen | `'idcajaorigen'` | `'idCajaOrigen'` | 92 |
| idCategoria | `'idcategoria'` | `'idCategoria'` | 97 |
| idEstadoGasto | `'idestadogasto'` | `'idEstadoGasto'` | 102 |

**Total de cambios:** 9 campos

#### 6. EstadoGasto

**Archivo:** `app/server/src/models/EstadoGasto.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idEstadoGasto | `'idestadogasto'` | `'idEstadoGasto'` | 25 |
| nombreEstado | `'nombreestado'` | `'nombreEstado'` | 31 |

**Total de cambios:** 2 campos

#### 7. CajaFuerte

**Archivo:** `app/server/src/models/CajaFuerte.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idCajaFuerte | `'idcajafuerte'` | `'idCajaFuerte'` | 34 |
| saldoActual | `'saldoactual'` | `'saldoActual'` | 46 |
| limiteMaximo | `'limitemaximo'` | `'limiteMaximo'` | 51 |
| fechaUltimaActualizacion | `'fechaultimaactualizacion'` | `'fechaUltimaActualizacion'` | 62 |

**Total de cambios:** 4 campos

#### 8. VentaDiaria

**Archivo:** `app/server/src/models/VentaDiaria.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. | Nota |
|-----------|---------------------------|----------------------|--------------|------|
| idVenta | `'idventa'` | `'idVenta'` | 38 | |
| numeroClientes | `'totalclientes'` | `'numeroClientes'` | 50 | ⚠️ Mapeo incorrecto |
| totalEfectivo | `'totalefectivo'` | `'totalEfectivo'` | 56 | |
| totalTarjeta | `'totaltarjeta'` | `'totalTarjeta'` | 62 | |
| idCaja | `'idcaja'` | `'idCaja'` | 75 | |
| idUsuario | `'idusuariogeneral'` | `'idUsuario'` | 80 | ⚠️ Mapeo incorrecto |

**Total de cambios:** 6 campos (2 con mapeos incorrectos críticos)

#### 9. BitacoraAuditoria

**Archivo:** `app/server/src/models/BitacoraAuditoria.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. | Nota |
|-----------|---------------------------|----------------------|--------------|------|
| idBitacora | `'idbitacora'` | `'idBitacora'` | 44 | |
| fechaHora | `'fechahora'` | `'fechaHora'` | 50 | |
| tablaModificada | `'moduloAfectado'` | `'tablaModificada'` | 60 | ⚠️ Mapeo incorrecto |
| registroAfectado | `'registroId'` | `'registroAfectado'` | 65 | ⚠️ Mapeo incorrecto |
| valoresAnteriores | `'valoresanteriores'` | `'valoresAnteriores'` | 75 | |
| valoresNuevos | `'valoresnuevos'` | `'valoresNuevos'` | 80 | |
| direccionIP | `'direccionip'` | `'direccionIP'` | 85 | |
| idUsuario | `'idusuario'` | `'idUsuario'` | 90 | |

**Total de cambios:** 8 campos (2 con mapeos incorrectos críticos)

#### 10. Conteo

**Archivo:** `app/server/src/models/Conteo.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idConteo | `'idconteo'` | `'idConteo'` | 37 | |
| fechaHora | `'fechahora'` | `'fechaHora'` | 43 | |
| montoContado | `'montocontado'` | `'montoContado'` | 48 | |
| montoEsperado | `'montoesperado'` | `'montoEsperado'` | 53 | |
| idCaja | `'idcaja'` | `'idCaja'` | 71 | |
| idUsuario | `'idusuario'` | `'idUsuario'` | 76 | |
| idTipoConteo | `'idtipoconteo'` | `'idTipoConteo'` | 81 | |

**Total de cambios:** 7 campos

#### 11. DiferenciaCaja

**Archivo:** `app/server/src/models/DiferenciaCaja.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idDiferencia | `'iddiferencia'` | `'idDiferencia'` | 42 | |
| montoEsperado | `'montoesperado'` | `'montoEsperado'` | 53 | |
| montoReal | `'montoreal'` | `'montoReal'` | 58 | |
| idConteo | `'idconteo'` | `'idConteo'` | 81 | |
| idTipoDiferencia | `'idtipodiferencia'` | `'idTipoDiferencia'` | 86 | |

**Total de cambios:** 5 campos

#### 12. TipoConteo

**Archivo:** `app/server/src/models/TipoConteo.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idTipoConteo | `'idtipoconteo'` | `'idTipoConteo'` | 24 | |
| nombreTipo | `'nombretipo'` | `'nombreTipo'` | 30 | |

**Total de cambios:** 2 campos

#### 13. TipoDiferencia

**Archivo:** `app/server/src/models/TipoDiferencia.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. |
|-----------|---------------------------|----------------------|--------------|
| idTipoDiferencia | `'idtipodiferencia'` | `'idTipoDiferencia'` | 25 | |
| nombreTipo | `'nombretipo'` | `'nombreTipo'` | 31 | |

**Total de cambios:** 2 campos

#### 14. ReporteDiario

**Archivo:** `app/server/src/models/ReporteDiario.ts`

| Propiedad | Mapeo Actual (Incorrecto) | Mapeo Correcto (DDL) | Línea Aprox. | Nota |
|-----------|---------------------------|----------------------|--------------|------|
| idReporte | `'idreporte'` | `'idReporte'` | 53 | |
| totalVentas | `'totalventas'` | `'totalVentas'` | 65 | |
| saldoFinal | `'saldofinal'` | `'saldoFinal'` | 71 | |
| totalClientes | `'totalclientestotal'` | `'numeroClientesTotal'` | 77 | ⚠️ Mapeo y nombre incorrectos |
| totalEfectivo | `'totalefectivototal'` | `'totalEfectivo'` | 83 | ⚠️ Mapeo incorrecto |
| totalTarjeta | `'totaltarjeta'` | `'totalTarjeta'` | 89 | |
| totalGastosDia | `'totalgastosdia'` | `'totalGastos'` | 95 | ⚠️ Mapeo y nombre incorrectos |
| idUsuarioGenerador | `'idusuariogenerador'` | `'idUsuarioGenerador'` | 106 | |

**Total de cambios:** 8 campos (3 con mapeos/nombres incorrectos críticos)

### Archivos Impactados

Todos los 14 modelos listados anteriormente.

### Validación Post-Fase 3

1. Compilar TypeScript sin errores
2. Verificar que todos los mapeos coincidan exactamente con nombres de columnas del DDL
3. Verificar índices (deben usar los nombres de campos correctos)

### Riesgos

- **Alto:** Mapeos incorrectos pueden causar errores en consultas a base de datos.
- **Mitigación:** Probar consultas básicas (SELECT) después de esta fase antes de continuar.

---

## FASE 4 — Agregar Campos Faltantes

### Objetivo

Agregar todos los campos que existen en el DDL pero no están definidos en los modelos.

### Alcance

Esta fase agrega nuevas propiedades a interfaces, clases y definiciones de campos. No modifica campos existentes.

### Campos Faltantes por Modelo

#### 1. VentaDiaria

**Archivo:** `app/server/src/models/VentaDiaria.ts`

**Campo a Agregar:** `idReporte`

- **Tipo en DDL:** `int4` (nullable)
- **Tipo en Modelo:** `number | null`
- **Ubicación en Interface:** Después de `idUsuario`
- **Ubicación en Clase:** Después de `public idUsuario!: number;`
- **Ubicación en Definición:** Después del campo `idUsuario`
- **Configuración:**
  ```typescript
  idReporte: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idReporte',
  }
  ```
- **En CreationAttributes:** Agregar `'idReporte'` a Optional

#### 2. Conteo

**Archivo:** `app/server/src/models/Conteo.ts`

**Campo a Agregar:** `idReporte`

- **Tipo en DDL:** `int4` (nullable)
- **Tipo en Modelo:** `number | null`
- **Ubicación en Interface:** Después de `idTipoConteo`
- **Ubicación en Clase:** Después de `public idTipoConteo!: number;`
- **Ubicación en Definición:** Después del campo `idTipoConteo`
- **Configuración:**
  ```typescript
  idReporte: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'idReporte',
  }
  ```
- **En CreationAttributes:** Agregar `'idReporte'` a Optional

#### 3. DiferenciaCaja

**Archivo:** `app/server/src/models/DiferenciaCaja.ts`

**Campo a Agregar:** `idUsuario`

- **Tipo en DDL:** `int4` (NOT NULL)
- **Tipo en Modelo:** `number`
- **Ubicación en Interface:** Después de `idTipoDiferencia` (actualmente comentado)
- **Ubicación en Clase:** Después de `public idTipoDiferencia!: number;` (actualmente comentado)
- **Ubicación en Definición:** Después del campo `idTipoDiferencia`
- **Configuración:**
  ```typescript
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'idUsuario',
  }
  ```
- **En CreationAttributes:** No agregar a Optional (es requerido)
- **Índice:** Agregar índice `idx_diferencias_usuario` en la sección de índices

#### 4. ReporteDiario

**Archivo:** `app/server/src/models/ReporteDiario.ts`

**Campos a Agregar:** `resumenDiferencias` y `cantidadDiferencias`

**Campo 1: resumenDiferencias**
- **Tipo en DDL:** `varchar(1000)` (nullable)
- **Tipo en Modelo:** `string | null`
- **Ubicación en Interface:** Después de `totalTarjeta`
- **Ubicación en Clase:** Después de `public totalTarjeta!: number;`
- **Ubicación en Definición:** Después del campo `totalTarjeta`
- **Configuración:**
  ```typescript
  resumenDiferencias: {
    type: DataTypes.STRING(1000),
    allowNull: true,
    field: 'resumenDiferencias',
  }
  ```
- **En CreationAttributes:** Agregar `'resumenDiferencias'` a Optional

**Campo 2: cantidadDiferencias**
- **Tipo en DDL:** `int4` (NOT NULL, default 0)
- **Tipo en Modelo:** `number`
- **Ubicación en Interface:** Después de `resumenDiferencias`
- **Ubicación en Clase:** Después de `public resumenDiferencias?: string | null;`
- **Ubicación en Definición:** Después del campo `resumenDiferencias`
- **Configuración:**
  ```typescript
  cantidadDiferencias: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'cantidadDiferencias',
  }
  ```
- **En CreationAttributes:** Agregar `'cantidadDiferencias'` a Optional

### Archivos Impactados

- `app/server/src/models/VentaDiaria.ts`
- `app/server/src/models/Conteo.ts`
- `app/server/src/models/DiferenciaCaja.ts`
- `app/server/src/models/ReporteDiario.ts`

### Validación Post-Fase 4

1. Compilar TypeScript sin errores
2. Verificar que todas las interfaces incluyan los nuevos campos
3. Verificar que las clases incluyan los nuevos campos
4. Verificar que las definiciones de campos estén completas

### Riesgos

- **Medio:** Agregar campos puede requerir actualizar código que crea instancias de estos modelos.
- **Mitigación:** Los campos opcionales no deberían romper código existente. Los campos requeridos pueden necesitar valores por defecto.

---

## FASE 5 — Eliminar Campos Sobrantes

### Objetivo

Eliminar o convertir campos que están en los modelos pero no existen en el DDL, o que están marcados como VIRTUAL pero deberían ser columnas reales.

### Alcance

Esta fase elimina propiedades de interfaces, clases y definiciones, o convierte campos VIRTUAL a campos reales.

### Campos a Corregir/Eliminar por Modelo

#### 1. VentaDiaria

**Archivo:** `app/server/src/models/VentaDiaria.ts`

**Campo a Convertir:** `ventaTotal`

- **Estado Actual:** VIRTUAL (calculado)
- **Estado en DDL:** Columna real `numeric(14, 2)`
- **Acción:** Convertir de VIRTUAL a campo real
- **Cambios:**
  - Eliminar el getter VIRTUAL
  - Agregar definición real:
    ```typescript
    ventaTotal: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      defaultValue: 0,
      field: 'ventaTotal',
    }
    ```

#### 2. Conteo

**Archivo:** `app/server/src/models/Conteo.ts`

**Campo a Convertir:** `diferencia`

- **Estado Actual:** VIRTUAL (calculado)
- **Estado en DDL:** Columna real `numeric(14, 2)`
- **Acción:** Convertir de VIRTUAL a campo real
- **Cambios:**
  - Eliminar el getter VIRTUAL
  - Agregar definición real:
    ```typescript
    diferencia: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      field: 'diferencia',
    }
    ```

#### 3. DiferenciaCaja

**Archivo:** `app/server/src/models/DiferenciaCaja.ts`

**Campo 1 a Convertir:** `diferencia`

- **Estado Actual:** VIRTUAL (calculado)
- **Estado en DDL:** Columna real `numeric(14, 2)`
- **Acción:** Convertir de VIRTUAL a campo real
- **Cambios:**
  - Eliminar el getter VIRTUAL
  - Agregar definición real:
    ```typescript
    diferencia: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
      field: 'diferencia',
    }
    ```

**Campo 2 a Convertir:** `justificacion`

- **Estado Actual:** VIRTUAL (comentado como no existente)
- **Estado en DDL:** Columna real `varchar(500)` (nullable)
- **Acción:** Convertir de VIRTUAL a campo real
- **Cambios:**
  - Eliminar la definición VIRTUAL
  - Agregar definición real:
    ```typescript
    justificacion: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'justificacion',
    }
    ```

#### 4. ReporteDiario

**Archivo:** `app/server/src/models/ReporteDiario.ts`

**Campo a Eliminar:** `totalDiferencias`

- **Estado Actual:** Campo en modelo
- **Estado en DDL:** No existe
- **Acción:** Eliminar completamente
- **Cambios:**
  - Eliminar de Interface
  - Eliminar de Clase
  - Eliminar de Definición
  - Eliminar de CreationAttributes (si está en Optional)

**Campos a Renombrar/Corregir:**

**Campo 1:** `totalClientes` → `numeroClientesTotal`

- **Estado Actual:** `totalClientes` mapea a `totalclientestotal`
- **Estado en DDL:** Columna `numeroClientesTotal`
- **Acción:** Renombrar propiedad y corregir mapeo
- **Cambios:**
  - Interface: `totalClientes: number` → `numeroClientesTotal: number`
  - Clase: `public totalClientes!: number` → `public numeroClientesTotal!: number`
  - Definición: Cambiar nombre de propiedad y mapeo a `'numeroClientesTotal'`
  - CreationAttributes: `'totalClientes'` → `'numeroClientesTotal'`

**Campo 2:** `totalGastosDia` → `totalGastos`

- **Estado Actual:** `totalGastosDia` mapea a `totalgastosdia`
- **Estado en DDL:** Columna `totalGastos`
- **Acción:** Renombrar propiedad y corregir mapeo
- **Cambios:**
  - Interface: `totalGastosDia: number` → `totalGastos: number`
  - Clase: `public totalGastosDia!: number` → `public totalGastos!: number`
  - Definición: Cambiar nombre de propiedad y mapeo a `'totalGastos'`
  - CreationAttributes: `'totalGastosDia'` → `'totalGastos'`

**Campo 3:** `totalEfectivo` (corregir mapeo)

- **Estado Actual:** Mapea a `totalefectivototal`
- **Estado en DDL:** Columna `totalEfectivo`
- **Acción:** Solo corregir mapeo (el nombre de propiedad está bien)
- **Cambios:**
  - Definición: `field: 'totalefectivototal'` → `field: 'totalEfectivo'`

### Archivos Impactados

- `app/server/src/models/VentaDiaria.ts`
- `app/server/src/models/Conteo.ts`
- `app/server/src/models/DiferenciaCaja.ts`
- `app/server/src/models/ReporteDiario.ts`

### Validación Post-Fase 5

1. Compilar TypeScript sin errores
2. Verificar que no queden campos VIRTUAL que deberían ser reales
3. Verificar que no queden campos que no existen en DDL
4. Buscar referencias a campos eliminados/renombrados en el código y actualizarlas

### Riesgos

- **Alto:** Eliminar o renombrar campos puede romper código que los usa.
- **Mitigación:** 
  - Buscar todas las referencias a campos eliminados/renombrados antes de aplicar cambios
  - Actualizar código que use estos campos
  - Campos renombrados: buscar y reemplazar en todo el proyecto

---

## FASE 6 — Pruebas Locales para Validar Integridad del Backend

### Objetivo

Validar que todos los cambios aplicados funcionen correctamente y que el backend pueda interactuar correctamente con la base de datos.

### Alcance

Esta fase incluye pruebas de compilación, conexión, consultas básicas y validación de relaciones.

### Checklist de Validación

#### 6.1. Compilación y Sintaxis

- [ ] Compilar proyecto TypeScript sin errores
- [ ] Verificar que no haya warnings críticos
- [ ] Verificar que todos los imports sean correctos
- [ ] Verificar que todas las interfaces estén completas

#### 6.2. Conexión a Base de Datos

- [ ] Verificar conexión a base de datos PostgreSQL
- [ ] Verificar que todas las tablas existan con nombres correctos
- [ ] Verificar que todas las columnas existan con nombres correctos

#### 6.3. Consultas Básicas (CRUD)

Para cada modelo, probar:

- [ ] **CREATE:** Crear un registro nuevo
- [ ] **READ:** Leer un registro existente
- [ ] **UPDATE:** Actualizar un registro existente
- [ ] **DELETE:** Eliminar un registro (si aplica)

**Modelos a Probar:**
1. Usuario
2. Rol
3. CajaRegistradora
4. CategoriaGasto
5. Gasto
6. EstadoGasto
7. CajaFuerte
8. VentaDiaria
9. BitacoraAuditoria
10. Conteo
11. DiferenciaCaja
12. TipoConteo
13. TipoDiferencia
14. ReporteDiario

#### 6.4. Validación de Relaciones (Foreign Keys)

Verificar que las relaciones entre modelos funcionen correctamente:

- [ ] Usuario → Rol (idRol)
- [ ] CategoriaGasto → Usuario (idUsuarioCreacion)
- [ ] Gasto → CajaRegistradora (idCaja)
- [ ] Gasto → CajaFuerte (idCajaOrigen)
- [ ] Gasto → Usuario (idUsuarioRegistro, idUsuarioAprobacion)
- [ ] Gasto → CategoriaGasto (idCategoria)
- [ ] Gasto → EstadoGasto (idEstadoGasto)
- [ ] VentaDiaria → CajaRegistradora (idCaja)
- [ ] VentaDiaria → Usuario (idUsuario)
- [ ] VentaDiaria → ReporteDiario (idReporte) - NUEVO
- [ ] BitacoraAuditoria → Usuario (idUsuario)
- [ ] Conteo → CajaRegistradora (idCaja)
- [ ] Conteo → Usuario (idUsuario)
- [ ] Conteo → TipoConteo (idTipoConteo)
- [ ] Conteo → ReporteDiario (idReporte) - NUEVO
- [ ] DiferenciaCaja → Conteo (idConteo)
- [ ] DiferenciaCaja → TipoDiferencia (idTipoDiferencia)
- [ ] DiferenciaCaja → Usuario (idUsuario) - NUEVO
- [ ] ReporteDiario → Usuario (idUsuarioGenerador)

#### 6.5. Validación de Tipos de Datos

- [ ] Verificar que campos booleanos acepten true/false correctamente
- [ ] Verificar que campos DECIMAL acepten valores decimales correctamente
- [ ] Verificar que campos timestamptz manejen fechas correctamente
- [ ] Verificar que campos nullable acepten null correctamente

#### 6.6. Validación de Índices

- [ ] Verificar que los índices se creen correctamente
- [ ] Verificar que los índices usen los nombres de campos correctos
- [ ] Verificar que los índices únicos funcionen correctamente

#### 6.7. Validación de Valores por Defecto

- [ ] Verificar que campos con defaultValue se inicialicen correctamente
- [ ] Verificar que campos booleanos con defaultValue funcionen
- [ ] Verificar que campos numéricos con defaultValue funcionen

#### 6.8. Pruebas de Integración

- [ ] Probar flujos completos de negocio que usen múltiples modelos
- [ ] Probar operaciones que involucren relaciones
- [ ] Probar operaciones que involucren transacciones

### Archivos de Prueba Sugeridos

Crear archivos de prueba (opcional, para validación manual):

- `app/server/src/tests/validacion-modelos.ts` (temporal, para validación)

### Criterios de Éxito

La Fase 6 se considera exitosa cuando:

1. ✅ Todas las compilaciones son exitosas
2. ✅ Todas las conexiones a BD funcionan
3. ✅ Todas las operaciones CRUD básicas funcionan
4. ✅ Todas las relaciones funcionan correctamente
5. ✅ No hay errores en tiempo de ejecución relacionados con modelos
6. ✅ Los tipos de datos funcionan correctamente

### Riesgos

- **Medio:** Pueden aparecer errores inesperados al interactuar con la base de datos.
- **Mitigación:** 
  - Probar cada modelo individualmente
  - Revisar logs de errores detalladamente
  - Tener backup de base de datos antes de probar

---

## Resumen de Archivos Impactados por Fase

### FASE 1 (Nombres de Tablas)
- 14 archivos de modelos

### FASE 2 (Tipos de Datos)
- 3 archivos de modelos (Usuario, CajaRegistradora, DiferenciaCaja)

### FASE 3 (Mapeos de Campos)
- 14 archivos de modelos

### FASE 4 (Campos Faltantes)
- 4 archivos de modelos (VentaDiaria, Conteo, DiferenciaCaja, ReporteDiario)

### FASE 5 (Campos Sobrantes)
- 4 archivos de modelos (VentaDiaria, Conteo, DiferenciaCaja, ReporteDiario)

### FASE 6 (Pruebas)
- Archivos de prueba (opcionales)
- Posiblemente archivos que usan los modelos (rutas, servicios, etc.)

---

## Orden de Ejecución Estricto

1. **FASE 1** → Validar → Commit (si es necesario)
2. **FASE 2** → Validar → Commit (si es necesario)
3. **FASE 3** → Validar → Commit (si es necesario)
4. **FASE 4** → Validar → Commit (si es necesario)
5. **FASE 5** → Validar → Commit (si es necesario)
6. **FASE 6** → Validar completamente → Commit final

**IMPORTANTE:** No saltar fases. Cada fase debe completarse y validarse antes de continuar.

---

## Notas Finales

- Este plan asume que la base de datos ya tiene las tablas correctas (plurales, camelCase español).
- Si la base de datos aún tiene las tablas antiguas, será necesario migrar los datos o recrear las tablas.
- Después de completar todas las fases, actualizar la documentación del proyecto.
- Considerar actualizar las rutas y servicios que usan estos modelos si hay cambios en nombres de propiedades.

---

**Fin del Plan Maestro de Reparación**

