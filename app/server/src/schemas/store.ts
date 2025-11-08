import { z } from 'zod';

export const storeCreateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  active: z.boolean().default(true),
});

export type StoreCreate = z.infer<typeof storeCreateSchema>;

export const cashRegisterCreateSchema = z.object({
  id: z.string().min(1),
  store_id: z.string().min(1),
  number: z.number().int().positive(),
  active: z.boolean().default(true),
});

export type CashRegisterCreate = z.infer<typeof cashRegisterCreateSchema>;

