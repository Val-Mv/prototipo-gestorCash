import { z } from 'zod';

export const storeCreateSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  code: z.string().min(1),
  active: z.boolean().default(true),
});

export type StoreCreate = z.infer<typeof storeCreateSchema>;

export const storeUpdateSchema = storeCreateSchema.omit({ id: true }).partial();

export type StoreUpdate = z.infer<typeof storeUpdateSchema>;

export const cajaRegistradoraCreateSchema = z.object({
  numeroCaja: z.string().min(1).max(50),
  montoInicialRequerido: z.number().nonnegative(),
  ubicacion: z.string().min(1).max(150).optional().nullable(),
  estadoActiva: z.boolean().optional().default(true),
});

export type CajaRegistradoraCreate = z.infer<typeof cajaRegistradoraCreateSchema>;

export const cajaRegistradoraUpdateSchema = cajaRegistradoraCreateSchema.partial();

export type CajaRegistradoraUpdate = z.infer<typeof cajaRegistradoraUpdateSchema>;

