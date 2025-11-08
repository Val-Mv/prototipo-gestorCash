import { z } from 'zod';

export const usuarioCreateSchema = z.object({
  nombreCompleto: z.string().min(1),
  email: z.string().email(),
  contrasenaHash: z.string().min(6),
  telefono: z.string().min(6).optional().nullable(),
  idRol: z.number().int().positive(),
  estadoActivo: z.boolean().optional().default(true),
});

export type UsuarioCreate = z.infer<typeof usuarioCreateSchema>;


