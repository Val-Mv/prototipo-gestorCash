import { z } from 'zod';

export const conteoCreateSchema = z.object({
  fechaHora: z.union([z.string(), z.date()]).optional(),
  montoContado: z.number().nonnegative(),
  montoEsperado: z.number().nonnegative(),
  diferencia: z.number(),
  observaciones: z.string().max(500).optional().nullable(),
  idCaja: z.number().int().positive(),
  idUsuario: z.number().int().positive(),
  idTipoConteo: z.number().int().positive(),
  idReporte: z.number().int().positive().optional().nullable(),
});

export type ConteoCreate = z.infer<typeof conteoCreateSchema>;


