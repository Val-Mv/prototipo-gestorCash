import { z } from 'zod';

export const expenseCreateSchema = z.object({
  category: z.enum(['store_supplies', 'maintenance', 'paperwork', 'transport']),
  item: z.string().min(3),
  amount: z.number().positive(),
  description: z.string().min(10),
  attachment_url: z.string().optional().nullable(),
  store_id: z.string().optional().nullable(),
  register_id: z.string().optional().nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  user_id: z.string().optional().nullable(),
});

export type ExpenseCreate = z.infer<typeof expenseCreateSchema>;

