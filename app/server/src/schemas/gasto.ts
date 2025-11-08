import { z } from 'zod';

export const gastoCreateSchema = z.object({
  fecha: z.union([z.string(), z.date()]).optional(),
  monto: z.number().positive(),
  descripcion: z.string().min(1),
  numeroComprobante: z.string().min(1),
  rutaComprobante: z.string().min(1),
  idCaja: z.number().int().positive().nullable().optional(),
  idUsuarioRegistro: z.number().int().positive(),
  idUsuarioAprobacion: z.number().int().positive().nullable().optional(),
  idCajaOrigen: z.number().int().positive().nullable().optional(),
  idCategoria: z.number().int().positive(),
  idEstadoGasto: z.number().int().positive(),
});

export type GastoCreate = z.infer<typeof gastoCreateSchema>;


