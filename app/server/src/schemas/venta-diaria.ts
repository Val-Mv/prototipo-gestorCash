import { z } from 'zod';

export const ventaDiariaCreateSchema = z.object({
  fecha: z.union([z.string(), z.date()]).optional(),
  numeroClientes: z.number().int().nonnegative(),
  totalEfectivo: z.number().nonnegative(),
  totalTarjeta: z.number().nonnegative(),
  ventaTotal: z.number().nonnegative(),
  idCaja: z.number().int().positive(),
  idUsuario: z.number().int().positive(),
  idReporte: z.number().int().positive().optional().nullable(),
});

export type VentaDiariaCreate = z.infer<typeof ventaDiariaCreateSchema>;


