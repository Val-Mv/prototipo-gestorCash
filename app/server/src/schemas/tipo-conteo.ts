import { z } from 'zod';

export const tipoConteoCreateSchema = z.object({
  nombreTipo: z.string().min(1).max(20),
});

export type TipoConteoCreate = z.infer<typeof tipoConteoCreateSchema>;


