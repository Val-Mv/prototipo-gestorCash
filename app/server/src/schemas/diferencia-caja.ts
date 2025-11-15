import { z } from 'zod';

export const diferenciaCajaCreateSchema = z.object({
  fecha: z.union([z.string(), z.date()]).optional(),
  montoEsperado: z.number(),
  montoReal: z.number(),
  resuelta: z.boolean().optional(),
  idConteo: z.number().int().positive(),
  idTipoDiferencia: z.number().int().positive(),
});

export type DiferenciaCajaCreate = z.infer<typeof diferenciaCajaCreateSchema>;


