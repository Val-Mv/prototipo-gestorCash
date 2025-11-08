import { z } from 'zod';

export const dailyReportCreateSchema = z.object({
  store_id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Fecha debe estar en formato YYYY-MM-DD'),
  customers: z.number().int().nonnegative(),
  sales_cash: z.number().nonnegative(),
  sales_card: z.number().nonnegative(),
  total_expenses: z.number().nonnegative(),
  total_difference: z.number(),
  anomalies: z.string().optional().nullable(),
});

export type DailyReportCreate = z.infer<typeof dailyReportCreateSchema>;

