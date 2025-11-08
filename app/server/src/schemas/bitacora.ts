import { z } from 'zod';

export const bitacoraCreateSchema = z.object({
  fechaHora: z.union([z.string(), z.date()]).optional(),
  accion: z.string().min(1).max(200),
  tablaModificada: z.string().min(1).max(200),
  registroAfectado: z.string().min(1).max(200),
  descripcion: z.string().max(1000).optional().nullable(),
  valoresAnteriores: z.string().optional().nullable(),
  valoresNuevos: z.string().optional().nullable(),
  direccionIP: z.string().max(100).optional().nullable(),
  idUsuario: z.number().int().positive(),
});

export const bitacoraUpdateSchema = bitacoraCreateSchema.partial();

export type BitacoraCreate = z.infer<typeof bitacoraCreateSchema>;
export type BitacoraUpdate = z.infer<typeof bitacoraUpdateSchema>;


