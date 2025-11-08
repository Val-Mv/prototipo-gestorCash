import { z } from 'zod';

export const diferenciaCajaCreateSchema = z.object({
  fecha: z.union([z.string(), z.date()]).optional(),
  montoEsperado: z.number(),
  montoReal: z.number(),
  diferencia: z.number(),
  justificacion: z.string().max(500).optional().nullable(),
  resuelta: z.boolean().optional(),
  idConteo: z.number().int().positive(),
  idTipoDiferencia: z.number().int().positive(),
  idUsuario: z.number().int().positive(),
});

export type DiferenciaCajaCreate = z.infer<typeof diferenciaCajaCreateSchema>;


