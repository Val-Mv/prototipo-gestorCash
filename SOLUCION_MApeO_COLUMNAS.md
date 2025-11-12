# 🔧 Solución: Mapeo de Columnas entre Sequelize y PostgreSQL

## 🐛 Problema Identificado

Los modelos Sequelize usan nombres de columnas en **camelCase** (ej: `idEstadoGasto`, `nombreEstado`), pero la base de datos PostgreSQL tiene columnas en **minúsculas** (ej: `idestadogasto`, `nombreestado`).

Cuando Sequelize intenta crear índices, usa los nombres de los campos del modelo (camelCase) en lugar de los nombres de las columnas en la base de datos (minúsculas), causando errores:

```
ERROR: column "nombreEstado" does not exist
ERROR: column "idEstadoGasto" does not exist
ERROR: column "idCaja" does not exist
```

## ✅ Solución

### 1. Usar `field` para mapear columnas

En cada modelo, usar la opción `field` para mapear el nombre del campo del modelo (camelCase) al nombre de la columna en la base de datos (minúsculas):

```typescript
EstadoGasto.init(
  {
    idEstadoGasto: {
      type: DataTypes.INTEGER,
      field: 'idestadogasto',  // ← Mapeo a minúsculas
    },
    nombreEstado: {
      type: DataTypes.STRING(20),
      field: 'nombreestado',  // ← Mapeo a minúsculas
    },
  },
  {
    indexes: [
      {
        name: 'idx_estados_gasto_nombre',
        fields: ['nombreestado'],  // ← Usar nombre de columna en minúsculas
      },
    ],
  }
);
```

### 2. Usar nombres de columnas en índices

En los índices, usar los nombres de las columnas en la base de datos (minúsculas), no los nombres de los campos del modelo:

```typescript
// ❌ Incorrecto
indexes: [
  {
    fields: ['idEstadoGasto'],  // Usa camelCase del modelo
  },
]

// ✅ Correcto
indexes: [
  {
    fields: ['idestadogasto'],  // Usa minúsculas de la base de datos
  },
]
```

## 📋 Modelos Corregidos

### ✅ EstadoGasto
- ✅ Agregado `field: 'idestadogasto'`
- ✅ Agregado `field: 'nombreestado'`
- ✅ Índice corregido: `fields: ['nombreestado']`

### ✅ CajaFuerte
- ✅ Agregado `field: 'idcajafuerte'`
- ✅ Agregado `field: 'codigo'`
- ✅ Agregado `field: 'saldoactual'`
- ✅ Agregado `field: 'limitemaximo'`
- ✅ Agregado `field: 'ubicacion'`
- ✅ Agregado `field: 'fechaultimaactualizacion'`

### ✅ Gasto
- ✅ Índice corregido: `fields: ['idestadogasto']`

## 🔄 Modelos Pendientes de Revisión

Estos modelos pueden necesitar correcciones similares:

### ⚠️ VentaDiaria
- Revisar índices: `fields: ['idCaja']`, `fields: ['idUsuario']`
- Verificar si las columnas son `idcaja`, `idusuario` en minúsculas

### ⚠️ DiferenciaCaja
- Revisar índices: `fields: ['idConteo']`, `fields: ['idTipoDiferencia']`, `fields: ['idUsuario']`

### ⚠️ Conteo
- Revisar índices: `fields: ['idCaja']`, `fields: ['idUsuario']`, `fields: ['idTipoConteo']`

### ⚠️ BitacoraAuditoria
- Revisar índices: `fields: ['idUsuario']`

### ⚠️ TipoConteo
- Revisar índices: `fields: ['nombreTipo']`

### ⚠️ TipoDiferencia
- Revisar índices: `fields: ['nombreTipo']`

### ⚠️ CategoriaGasto
- Revisar índice: `fields: ['idUsuarioCreacion']`
- Nota: Esta tabla parece tener columnas en camelCase, verificar

## 🧪 Verificación

### Verificar estructura de tabla

```bash
docker exec gestor-postgres psql -U admin -d gestorcash -c "\d nombre_tabla"
```

### Verificar mapeos en modelo

```typescript
// Buscar modelos sin mapeos 'field'
grep -r "type: DataTypes" app/server/src/models | grep -v "field:"
```

## 📚 Referencias

- [Sequelize Documentation - Model Definition](https://sequelize.org/docs/v6/core-concepts/model-basics/)
- [Sequelize Documentation - Indexes](https://sequelize.org/docs/v6/core-concepts/model-instances/#indexes)

---

**Estado:** 🔄 En progreso - Modelos principales corregidos, revisando modelos restantes


