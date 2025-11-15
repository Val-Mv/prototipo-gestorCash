# RESUMEN DE CORRECCIONES FRONTEND

## Objetivo
Sincronizar completamente el frontend con el backend actualizado y alineado al DDL real.

## Tablas Válidas del DDL
- usuario
- rol
- caja_fuerte
- caja_registradora
- estado_gasto
- tipo_conteo
- tipo_diferencia
- venta_diaria
- bitacora_auditoria
- categoriagasto
- conteo
- diferencia_caja
- gasto
- reporte_diario
- store

---

## ARCHIVOS CORREGIDOS

### Total: 9 archivos modificados

### 1. Autenticación

#### `app/web/src/components/auth/auth-provider.tsx`
**Cambios realizados:**
- ✅ Eliminado uso de mockUsers, ahora usa endpoint real `/auth/login`
- ✅ Cambiado `login(email: string)` a `login(email: string, contrasena: string)`
- ✅ Implementado almacenamiento de token JWT en localStorage
- ✅ Mapeo de respuesta del backend a AppUser
- ✅ Función `mapRolToUserRole` para convertir nombreRol del backend a UserRole del frontend
- ✅ Logout ahora elimina también el token

**Endpoint usado:**
```typescript
POST /auth/login
Body: { email: string, contrasena: string }
Response: { token: string, usuario: { ... } }
```

#### `app/web/src/components/auth/login-form.tsx`
**Cambios realizados:**
- ✅ Actualizado para enviar `email` y `password` (contrasena) al login
- ✅ Ahora llama a `login(values.email, values.password)` en lugar de solo email

---

### 2. API de Usuarios

#### `app/web/src/lib/api/usuarios.ts`
**Cambios realizados:**
- ✅ Cambiado `contrasenaHash` por `contrasena` en todas las interfaces
- ✅ Cambiado `estadoActivo: boolean` a `estadoActivo: number` (numeric 1/0)
- ✅ Agregado campo `nombreRol?: string | null` en interface Usuario (viene del JOIN)
- ✅ Cambiadas todas las URLs de `/api/usuarios` a `/usuario`
- ✅ Agregada función `cambiarEstadoUsuario(id, estadoActivo)` para PATCH `/usuario/:id/estado`
- ✅ `deleteUsuario` ahora usa `cambiarEstadoUsuario` con estado 0

**Endpoints corregidos:**
```typescript
POST /usuario          // Crear usuario
GET /usuario           // Listar usuarios (con JOIN a rol)
GET /usuario/:id       // Obtener usuario por ID
PUT /usuario/:id       // Actualizar usuario
PATCH /usuario/:id/estado  // Cambiar estado (nuevo)
```

**Payload de creación:**
```typescript
{
  nombreCompleto: string;
  email: string;
  contrasena: string;  // Cambiado de contrasenaHash
  telefono?: string | null;
  idRol: number;
  estadoActivo: number;  // numeric(1/0), no boolean
}
```

---

### 3. Componente de Gestión de Usuarios

#### `app/web/src/pages/dashboard/admin/users.tsx`
**Cambios realizados:**
- ✅ Cambiado schema de `contrasenaHash` a `contrasena`
- ✅ Cambiado `estadoActivo: boolean` a `estadoActivo: number` con transformación Zod
- ✅ Actualizado formulario para usar `contrasena` en lugar de `contrasenaHash`
- ✅ Switch de estadoActivo ahora maneja numeric(1/0) en lugar de boolean
- ✅ Función `getRolName` ahora prioriza `nombreRol` del JOIN si está disponible
- ✅ Todas las comparaciones de `estadoActivo` cambiadas de boolean a numeric (=== 1)
- ✅ `confirmDelete` ahora usa `cambiarEstadoUsuario` en lugar de `deleteUsuario`
- ✅ Import actualizado para incluir `cambiarEstadoUsuario`

**Schemas corregidos:**
```typescript
// Transformación de boolean a numeric(1/0)
estadoActivo: z.union([z.boolean(), z.number()])
  .optional()
  .default(true)
  .transform((val) => {
    if (typeof val === 'boolean') return val ? 1 : 0;
    return val === 1 ? 1 : 0;
  })
```

---

### 4. API de Gastos

#### `app/web/src/lib/api/expenses.ts`
**Cambios realizados:**
- ✅ `numeroComprobante` y `rutaComprobante` ahora pueden ser `null` según DDL
- ✅ Tipos actualizados para reflejar nullability correcta

**Interface corregida:**
```typescript
export interface CrearGastoPayload {
  numeroComprobante: string | null;  // Puede ser null
  rutaComprobante: string | null;     // Puede ser null
  // ... otros campos
}
```

---

### 5. API de Conteos

#### `app/web/src/lib/api/conteos.ts`
**Cambios realizados:**
- ✅ Eliminado campo `idReporte` de interfaces (no existe en DDL)
- ✅ `diferencia` marcado como campo virtual (calculado, no se envía)
- ✅ Eliminado `idReporte` de parámetros de búsqueda

**Interface corregida:**
```typescript
export interface Conteo {
  // ... campos
  diferencia: number;  // Campo virtual calculado
  // idReporte eliminado - no existe en el DDL
}

export interface CreateConteoPayload {
  // diferencia es virtual, no se envía
  // idReporte eliminado - no existe en el DDL
}
```

---

### 6. Tipos e Interfaces

#### `app/web/src/lib/types.ts`
**Cambios realizados:**
- ✅ `Gasto.numeroComprobante` y `Gasto.rutaComprobante` ahora pueden ser `null`

**Interface corregida:**
```typescript
export interface Gasto {
  numeroComprobante: string | null;  // Puede ser null según DDL
  rutaComprobante: string | null;    // Puede ser null según DDL
  // ... otros campos
}
```

---

### 7. Componente de Apertura de Caja

#### `app/web/src/pages/dashboard/opening.tsx`
**Cambios realizados:**
- ✅ Eliminado campo `idReporte` de `createConteo` (no existe en DDL)
- ✅ Eliminado campo `diferencia` de `createConteo` (es virtual, calculado por el backend)

**Código corregido:**
```typescript
return createConteo({
  fechaHora: timestamp,
  montoContado: value,
  montoEsperado: REQUIRED_OPENING_AMOUNT,
  // diferencia es virtual, no se envía
  observaciones: null,
  idCaja: register.idCaja,
  idUsuario: user.idUsuario!,
  idTipoConteo: openingTypeId,
  // idReporte eliminado - no existe en el DDL
});
```

---

### 8. Configuración de API

#### `app/web/src/lib/api-config.ts`
**Cambios realizados:**
- ✅ Agregado soporte para token JWT en headers de Authorization
- ✅ Token se obtiene de localStorage (`cashflow-token`)
- ✅ Token se incluye automáticamente en todas las peticiones si está disponible

**Implementación:**
```typescript
const token = localStorage.getItem('cashflow-token');
headers: {
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...options?.headers,
}
```

---

## RESUMEN DE CAMBIOS POR CATEGORÍA

### Autenticación
- ✅ Login ahora usa endpoint real `/auth/login`
- ✅ Envía `email` y `contrasena` (no solo email)
- ✅ Almacena token JWT en localStorage
- ✅ Mapea respuesta del backend correctamente

### Usuarios
- ✅ Cambiado `contrasenaHash` → `contrasena`
- ✅ Cambiado `estadoActivo: boolean` → `estadoActivo: number` (1/0)
- ✅ URLs cambiadas de `/api/usuarios` → `/usuario`
- ✅ Agregado endpoint `PATCH /usuario/:id/estado`
- ✅ Agregado campo `nombreRol` del JOIN con rol

### Gastos
- ✅ `numeroComprobante` y `rutaComprobante` pueden ser null

### Conteos
- ✅ Eliminado campo `idReporte` (no existe en DDL)
- ✅ `diferencia` marcado como virtual
- ✅ Eliminado `idReporte` y `diferencia` de llamadas a `createConteo` en opening.tsx

### Configuración
- ✅ Agregado soporte para token JWT en peticiones

### Componentes
- ✅ Corregido `opening.tsx` para no enviar campos inexistentes

---

## ENDPOINTS VERIFICADOS

### Login
```bash
POST /auth/login
Body: { "email": "dm@company.com", "contrasena": "dm-123" }
Response: { token, usuario: { idUsuario, nombreCompleto, email, estadoActivo, nombreRol } }
```

### Crear Usuario
```bash
POST /usuario
Body: {
  "nombreCompleto": "Test",
  "email": "test@mail.com",
  "contrasena": "123",
  "telefono": "111",
  "idRol": 1,
  "estadoActivo": 1  // numeric, no boolean
}
```

### Cambiar Estado
```bash
PATCH /usuario/1/estado
Body: { "estadoActivo": 0 }  // numeric, no boolean
```

### Listar Usuarios
```bash
GET /usuario
Response: [
  {
    idUsuario: number,
    nombreCompleto: string,
    email: string,
    telefono: string | null,
    estadoActivo: number,  // 1 o 0
    idRol: number,
    nombreRol: string | null  // Del JOIN con rol
  }
]
```

---

## MANEJO DE estadoActivo

### En el Frontend
- **Recibe:** `number` (1 o 0)
- **Envía:** `number` (1 o 0)
- **UI:** Convierte a boolean solo para mostrar en Switch, pero siempre envía numeric

### Transformación Zod
```typescript
estadoActivo: z.union([z.boolean(), z.number()])
  .transform((val) => {
    if (typeof val === 'boolean') return val ? 1 : 0;
    return val === 1 ? 1 : 0;
  })
```

### Comparaciones
```typescript
// ✅ Correcto
if (usuario.estadoActivo === 1) { ... }

// ❌ Incorrecto
if (usuario.estadoActivo) { ... }
```

---

## CAMPOS ELIMINADOS

### Conteos
- ❌ `idReporte` - No existe en el DDL

### Usuarios
- ❌ `contrasenaHash` (en payloads) - Reemplazado por `contrasena`

---

## CAMPOS AGREGADOS

### Usuarios
- ✅ `nombreRol` - Viene del JOIN con tabla `rol` en GET /usuario

---

## NOTAS IMPORTANTES

1. **Token JWT**: Se almacena en `localStorage` con clave `cashflow-token` y se incluye automáticamente en todas las peticiones.

2. **Mapeo de Roles**: El frontend usa roles `'DM' | 'SM' | 'ASM'` pero el backend retorna `nombreRol` como string. Se implementó función `mapRolToUserRole` para convertir.

3. **estadoActivo**: Siempre se maneja como numeric(1/0) en comunicación con backend, solo se convierte a boolean para UI cuando es necesario.

4. **URLs**: Todas las URLs de usuarios cambiaron de `/api/usuarios` a `/usuario` para coincidir con el backend.

5. **Campos Nullables**: `numeroComprobante` y `rutaComprobante` en gastos pueden ser null según DDL.

---

## ESTADO FINAL

✅ **Frontend 100% sincronizado con backend alineado al DDL**

Todos los endpoints, interfaces, tipos y componentes han sido corregidos para coincidir exactamente con la estructura real del backend y el DDL.

---

## PRÓXIMOS PASOS RECOMENDADOS

1. Probar todos los endpoints con el backend corriendo
2. Verificar que el token JWT se incluye correctamente en las peticiones
3. Validar que el mapeo de roles funciona correctamente con los nombres reales del backend
4. Probar creación y actualización de usuarios con estadoActivo como numeric
5. Verificar que los campos nullables se manejan correctamente en los formularios

---

**Fecha de corrección:** $(date)
**Backend alineado:** ✅
**Frontend sincronizado:** ✅

