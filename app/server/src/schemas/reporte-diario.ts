import { z } from 'zod';

export const reporteDiarioCreateSchema = z.object({
  fecha: z.union([z.string(), z.date()]).optional(),
  totalVentas: z.number().nonnegative().optional(),
  totalGastos: z.number().nonnegative().optional(),
  saldoFinal: z.number().optional(),
  numeroClientesTotal: z.number().int().nonnegative().optional(),
  totalEfectivo: z.number().nonnegative().optional(),
  totalTarjeta: z.number().nonnegative().optional(),
  resumenDiferencias: z.string().max(1000).optional().nullable(),
  cantidadDiferencias: z.number().int().nonnegative().optional(),
  idUsuarioGenerador: z.number().int().positive(),
});

export type ReporteDiarioCreate = z.infer<typeof reporteDiarioCreateSchema>;


