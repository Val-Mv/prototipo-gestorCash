import { z } from 'zod';

export const closingCountCreateSchema = z.object({
  register_id: z.string().optional().nullable(),
  store_id: z.string().min(1),
  amount: z.number().positive(),
  safe_amount: z.number().nonnegative(),
  sales_cash: z.number().nonnegative(),
  sales_card: z.number().nonnegative(),
  customer_count: z.number().int().nonnegative(),
  total_difference: z.number(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe estar en formato YYYY-MM-DD'),
  user_id: z.string().min(1),
  user_name: z.string().min(1),
});

export type ClosingCountCreate = z.infer<typeof closingCountCreateSchema>;

