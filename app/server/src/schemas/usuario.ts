import { z } from 'zod';

export const usuarioCreateSchema = z.object({
  nombreCompleto: z.string().min(1).max(150),
  email: z.string().email().max(150),
  contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  telefono: z.string().max(30).optional().nullable(),
  idRol: z.number().int().positive(),
  estadoActivo: z.union([z.boolean(), z.number()]).optional().default(true),
  // ❌ No permitir que contrasenahash sea enviado desde el frontend
  contrasenahash: z.never().optional(),
});

export const usuarioUpdateSchema = usuarioCreateSchema.partial().extend({
  contrasena: z.string().min(6).optional(),
  // ❌ No permitir que contrasenahash sea enviado desde el frontend
  contrasenahash: z.never().optional(),
});

export const usuarioEstadoSchema = z.object({
  estadoActivo: z.union([z.boolean(), z.number()]),
});

export type UsuarioCreate = z.infer<typeof usuarioCreateSchema>;
export type UsuarioUpdate = z.infer<typeof usuarioUpdateSchema>;
export type UsuarioEstado = z.infer<typeof usuarioEstadoSchema>;


