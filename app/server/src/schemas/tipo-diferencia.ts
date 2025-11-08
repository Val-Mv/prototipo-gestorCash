import { z } from 'zod';

export const tipoDiferenciaCreateSchema = z.object({
  nombreTipo: z.string().min(1).max(20),
});

export type TipoDiferenciaCreate = z.infer<typeof tipoDiferenciaCreateSchema>;


