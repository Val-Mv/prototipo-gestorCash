import { z } from 'zod';

export const usuarioCreateSchema = z.object({
  nombreCompleto: z.string().min(1).max(150),
  email: z.string().email().max(150),
  contrasenaHash: z.string().min(6).max(255),
  telefono: z.string().min(6).max(30).optional().nullable(),
  idRol: z.number().int().positive(),
  estadoActivo: z.number().int().min(0).max(1).optional().default(1),  // 0 = false, 1 = true
});

export const usuarioUpdateSchema = usuarioCreateSchema.partial();

export type UsuarioCreate = z.infer<typeof usuarioCreateSchema>;
export type UsuarioUpdate = z.infer<typeof usuarioUpdateSchema>;


