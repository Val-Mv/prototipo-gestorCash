import { z } from 'zod';

export const openingCountCreateSchema = z.object({
  register_id: z.string().optional().nullable(),
  store_id: z.string().min(1),
  amount: z.number().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe estar en formato YYYY-MM-DD'),
  user_id: z.string().min(1),
  user_name: z.string().min(1),
});

export type OpeningCountCreate = z.infer<typeof openingCountCreateSchema>;

