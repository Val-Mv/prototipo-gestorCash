import { z } from 'zod';

export const reporteDiarioCreateSchema = z.object({
  fecha: z.union([z.string(), z.date()]).optional(),
  totalVentas: z.number().nonnegative().optional(),
  totalGastosDia: z.number().nonnegative().optional(),
  saldoFinal: z.number().optional(),
  totalClientes: z.number().int().nonnegative().optional(),
  totalEfectivo: z.number().nonnegative().optional(),
  totalTarjeta: z.number().nonnegative().optional(),
  totalDiferencias: z.number().optional(),
  idUsuarioGenerador: z.number().int().positive(),
});

export type ReporteDiarioCreate = z.infer<typeof reporteDiarioCreateSchema>;


