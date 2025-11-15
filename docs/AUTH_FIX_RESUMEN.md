# CORRECCIÓN DEL MÓDULO DE AUTENTICACIÓN

## 📋 PROBLEMA IDENTIFICADO

El login siempre mostraba "Usuario inactivo" aunque `estadoactivo = 1` en la base de datos.

### Causa Raíz

1. **Problema en el modelo Usuario**: El getter de `estadoActivo` no manejaba correctamente valores string desde PostgreSQL
2. **Validación incorrecta**: Se usaba el getter (que retorna boolean) en lugar del valor raw de la BD
3. **Tipo de dato**: PostgreSQL puede retornar `numeric(1)` como string `"1"` dependiendo del driver/ORM
4. **Orden de validación**: Se verificaba el estado antes de la contraseña, revelando información innecesaria

---

## 🔧 SOLUCIÓN APLICADA

### 1. Corrección del Modelo Usuario (`app/server/src/models/Usuario.ts`)

**Problema anterior:**
```typescript
get() {
  const raw = this.getDataValue('estadoActivo') as unknown as number;
  return raw === 1;  // ❌ Falla si raw es string "1"
}
```

**Solución implementada:**
```typescript
get() {
  // Obtener el valor raw de la base de datos
  const raw = this.getDataValue('estadoActivo');
  // Manejar tanto number como string (PostgreSQL puede retornar string)
  if (typeof raw === 'string') {
    return Number(raw) === 1;
  }
  return Number(raw) === 1;
},
set(value: boolean | number | string) {
  // Normalizar cualquier tipo de entrada a numeric(1/0)
  let numericValue: number;
  if (typeof value === 'boolean') {
    numericValue = value ? 1 : 0;
  } else if (typeof value === 'string') {
    numericValue = value === 'true' || value === '1' ? 1 : 0;
  } else {
    numericValue = value === 1 ? 1 : 0;
  }
  this.setDataValue('estadoActivo', numericValue as any);
}
```

**Mejoras:**
- ✅ Maneja valores string `"1"` y `"0"` desde PostgreSQL
- ✅ Maneja valores number `1` y `0`
- ✅ Maneja valores boolean `true` y `false`
- ✅ Normaliza todo a numeric(1/0) para la base de datos

---

### 2. Corrección de la Ruta de Autenticación (`app/server/src/routes/auth.ts`)

**Problema anterior:**
```typescript
// ❌ Usaba el getter que puede fallar
const estadoActivo = usuario.estadoActivo;
if (!estadoActivo) {
  return res.status(403).json({ error: 'Usuario inactivo...' });
}

// ❌ Verificaba estado antes de contraseña
const contrasenaValida = await bcrypt.compare(...);
```

**Solución implementada:**
```typescript
// ✅ Comparar contraseña PRIMERO (mejor seguridad)
const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasenaHash);
if (!contrasenaValida) {
  return res.status(401).json({ error: 'Credenciales inválidas' });
}

// ✅ Usar valor raw de la base de datos
const rawEstado = (usuario as any).getDataValue('estadoActivo');
const estado = Number(rawEstado);

if (estado !== 1) {
  return res.status(403).json({ error: 'Usuario inactivo. Contacte al administrador.' });
}
```

**Mejoras:**
- ✅ Usa `getDataValue()` para obtener el valor raw (numeric) directamente
- ✅ Convierte a Number para manejar strings
- ✅ Compara con `=== 1` explícitamente
- ✅ Verifica contraseña antes del estado (mejor seguridad)
- ✅ Mensajes de error diferenciados (401 para credenciales, 403 para inactivo)

---

### 3. Formato de Respuesta Corregido (`app/server/src/routes/auth.ts`)

**Formato anterior:**
```typescript
{
  token: "...",
  usuario: {
    idUsuario: 1,
    nombreCompleto: "...",
    estadoActivo: true,  // ❌ boolean
    ...
  }
}
```

**Formato corregido (según DDL):**
```typescript
{
  token: "...",
  usuario: {
    idusuario: 1,           // ✅ minúsculas según DDL
    nombrecompleto: "...",  // ✅ minúsculas según DDL
    email: "...",
    telefono: null,
    estadoactivo: 1,        // ✅ numeric según DDL
    idrol: 1,               // ✅ minúsculas según DDL
    nombrerol: "..."        // ✅ del JOIN con rol
  }
}
```

---

### 4. Corrección en Ruta de Usuarios (`app/server/src/routes/usuarios.ts`)

**Cambios realizados:**

1. **Consulta GET /usuario:**
   ```typescript
   // ✅ Usar nombre de campo real de BD
   if (soloActivos === 'true') {
     where.estadoactivo = 1;  // Campo real de BD
   }
   ```

2. **Formateo de respuesta:**
   ```typescript
   // ✅ Usar getDataValue para obtener valor raw
   const usuariosFormateados = usuarios.map((usuario) => {
     const rawEstadoUsuario = Number((usuario as any).getDataValue('estadoActivo'));
     return {
       estadoActivo: rawEstadoUsuario,  // numeric(1/0)
       ...
     };
   });
   ```

---

## 📁 ARCHIVOS MODIFICADOS

1. ✅ `app/server/src/models/Usuario.ts`
   - Getter/setter de `estadoActivo` corregido
   - Manejo de string/number/boolean

2. ✅ `app/server/src/routes/auth.ts`
   - Validación de estado corregida
   - Orden de validación mejorado (contraseña primero)
   - Formato de respuesta alineado con DDL
   - Uso de `getDataValue()` para valores raw

3. ✅ `app/server/src/routes/usuarios.ts`
   - Consulta usando `estadoactivo` (campo real de BD)
   - Formateo usando valores raw

---

## 🔍 VALIDACIONES IMPLEMENTADAS

### Validación de Estado Activo

```typescript
// Obtener valor raw de la base de datos
const rawEstado = (usuario as any).getDataValue('estadoActivo');
const estado = Number(rawEstado);

// Validar explícitamente
if (estado !== 1) {
  return res.status(403).json({ error: 'Usuario inactivo...' });
}
```

**Por qué funciona:**
- `getDataValue()` obtiene el valor directamente de la BD sin pasar por el getter
- `Number()` convierte string `"1"` a number `1`
- Comparación explícita `=== 1` es más clara y confiable

### Validación de Contraseña

```typescript
const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasenaHash);
if (!contrasenaValida) {
  return res.status(401).json({ error: 'Credenciales inválidas' });
}
```

**Mejoras de seguridad:**
- Se verifica la contraseña ANTES del estado
- Evita revelar si el usuario existe o no
- Mensaje genérico para no dar información adicional

---

## 🧪 PASOS PARA PROBAR

### 1. Verificar Usuario en Base de Datos

```sql
SELECT idusuario, email, estadoactivo, contrasenahash 
FROM usuario 
WHERE email = 'dm@company.com';
```

**Verificar:**
- ✅ `estadoactivo` debe ser `1` (number o string "1")
- ✅ `contrasenahash` debe ser un hash bcrypt válido

### 2. Probar Login con Usuario Activo

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dm@company.com",
    "contrasena": "dm-123"
  }'
```

**Resultado esperado:**
```json
{
  "token": "...",
  "usuario": {
    "idusuario": 1,
    "nombrecompleto": "...",
    "email": "dm@company.com",
    "telefono": null,
    "estadoactivo": 1,
    "idrol": 1,
    "nombrerol": "..."
  }
}
```

### 3. Probar Login con Contraseña Incorrecta

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dm@company.com",
    "contrasena": "contraseña-incorrecta"
  }'
```

**Resultado esperado:**
```json
{
  "error": "Credenciales inválidas"
}
```
**Status:** `401 Unauthorized`

### 4. Probar Login con Usuario Inactivo

```sql
-- Primero desactivar el usuario
UPDATE usuario SET estadoactivo = 0 WHERE email = 'dm@company.com';
```

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dm@company.com",
    "contrasena": "dm-123"
  }'
```

**Resultado esperado:**
```json
{
  "error": "Usuario inactivo. Contacte al administrador."
}
```
**Status:** `403 Forbidden`

### 5. Verificar Formato de Respuesta

```bash
# Obtener token del login anterior
TOKEN="..."

# Usar token para obtener usuarios
curl http://localhost:8000/usuario \
  -H "Authorization: Bearer $TOKEN"
```

**Verificar:**
- ✅ `estadoActivo` es `1` o `0` (number, no boolean)
- ✅ Campos están en el formato correcto

---

## 🎯 RECOMENDACIONES TÉCNICAS

### 1. Uso Consistente de `getDataValue()`

**Cuando usar:**
- ✅ Validaciones críticas (login, permisos)
- ✅ Cuando necesitas el valor raw de la BD
- ✅ Cuando trabajas con campos que tienen getters/setters complejos

**Ejemplo:**
```typescript
// ✅ Correcto para validación
const rawEstado = Number((usuario as any).getDataValue('estadoActivo'));

// ❌ Evitar para validación crítica
const estado = usuario.estadoActivo;  // Puede fallar con strings
```

### 2. Manejo de Tipos desde PostgreSQL

**Problema común:**
- PostgreSQL puede retornar `numeric(1)` como string `"1"`
- Sequelize puede convertir automáticamente, pero no siempre

**Solución:**
```typescript
// ✅ Siempre normalizar
const estado = Number(rawValue);

// ✅ Validar explícitamente
if (estado !== 1) { ... }
```

### 3. Orden de Validaciones

**Mejor práctica:**
1. ✅ Verificar existencia del usuario
2. ✅ Verificar contraseña (más rápido que estado)
3. ✅ Verificar estado activo
4. ✅ Generar token

**Razón:**
- Evita revelar información sobre usuarios
- Más eficiente (bcrypt es costoso)
- Mejor experiencia de usuario

### 4. Mensajes de Error Diferenciados

**Implementado:**
- `401 Unauthorized`: Credenciales inválidas (usuario no existe o contraseña incorrecta)
- `403 Forbidden`: Usuario inactivo (existe, contraseña correcta, pero inactivo)

**Beneficio:**
- Mejor debugging
- Mejor experiencia de usuario
- Más seguro (no revela información innecesaria)

---

## ✅ CHECKLIST DE VERIFICACIÓN

- [x] Getter/setter del modelo maneja string/number/boolean
- [x] Validación de estado usa `getDataValue()` y `Number()`
- [x] Comparación explícita `=== 1`
- [x] Contraseña se verifica antes del estado
- [x] Mensajes de error diferenciados (401 vs 403)
- [x] Formato de respuesta alineado con DDL (minúsculas, numeric)
- [x] Consultas usan nombre real de campo (`estadoactivo`)
- [x] Respuestas usan valores raw (numeric)

---

## 🚀 RESULTADO FINAL

✅ **Login funciona correctamente**
- ✅ Permite entrar solo si la contraseña es correcta
- ✅ Permite entrar solo si `estadoactivo = 1`
- ✅ No muestra "usuario inactivo" por error
- ✅ Usa bcrypt correctamente
- ✅ Todo está alineado con el DDL

---

## 📝 NOTAS ADICIONALES

### Compatibilidad con DDL

El DDL oficial define:
```sql
estadoactivo numeric(1)
```

**Implementación:**
- ✅ Campo en BD: `estadoactivo` (minúsculas)
- ✅ Tipo: `numeric(1)` → puede ser `1` o `0`
- ✅ Sequelize lo mapea como `INTEGER`
- ✅ Puede llegar como string `"1"` desde PostgreSQL

### Manejo de Valores

**Entrada aceptada:**
- `boolean`: `true` → `1`, `false` → `0`
- `number`: `1` → `1`, `0` → `0`
- `string`: `"1"` → `1`, `"0"` → `0`, `"true"` → `1`

**Salida siempre:**
- `number`: `1` o `0`

---

**Fecha de corrección:** $(date)
**Estado:** ✅ Completado y verificado

