import { z } from 'zod';

export const userCreateSchema = z.object({
  uid: z.string().min(1),
  email: z.string().email(),
  display_name: z.string().optional().nullable(),
  role: z.enum(['DM', 'SM', 'ASM']),
  store_id: z.string().optional().nullable(),
  active: z.boolean().default(true),
});

export type UserCreate = z.infer<typeof userCreateSchema>;

