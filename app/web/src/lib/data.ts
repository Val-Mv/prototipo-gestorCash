import type { DailyReport, Gasto, Store, AppUser, CashRegister } from './types';

export const mockUsers: Record<string, AppUser> = {
  'dm@company.com': {
    uid: 'dm-123', //contraseña
    email: 'dm@company.com',
    displayName: 'Eleanor Vance',
    role: 'DM',
    idUsuario: 1,
  },
  'sm.berwyn@company.com': {
    uid: 'sm-456',
    email: 'sm.berwyn@company.com',
    displayName: 'Marcus Holloway',
    role: 'SM',
    storeId: 'berwyn-il',
    idUsuario: 2,
  },
  'asm.berwyn@company.com': {
    uid: 'asm-789',
    email: 'asm.berwyn@company.com',
    displayName: 'Anya Sharma',
    role: 'ASM',
    storeId: 'berwyn-il',
    idUsuario: 3,
  },
};

export const mockStores: Store[] = [
  { id: 'berwyn-il', name: 'Dollar Tree Berwyn', code: 'DT-BYW', active: true },
  { id: 'chicago-1', name: 'Dollar Tree Chicago West', code: 'DT-CHW', active: true },
];

export const mockRegisters: CashRegister[] = [
  { id: 'reg-1', storeId: 'berwyn-il', number: 1, active: true },
  { id: 'reg-2', storeId: 'berwyn-il', number: 2, active: true },
  { id: 'reg-3', storeId: 'berwyn-il', number: 3, active: false },
  { id: 'reg-4', storeId: 'berwyn-il', number: 4, active: true },
];

export const mockGastos: Gasto[] = [
  {
    idGasto: 1,
    fecha: new Date(Date.now() - 86400000 * 1).toISOString(),
    monto: 12.5,
    descripcion: 'Reabastecimiento semanal de suministros de limpieza',
    numeroComprobante: 'COMP-001',
    rutaComprobante: 'https://picsum.photos/seed/receipt1/400/600',
    idCaja: null,
    idUsuarioRegistro: 2,
    idUsuarioAprobacion: null,
    idCajaOrigen: null,
    idCategoria: 1,
    idEstadoGasto: 1,
  },
  {
    idGasto: 2,
    fecha: new Date(Date.now() - 86400000 * 2).toISOString(),
    monto: 25.0,
    descripcion: 'Reemplazo de bombilla parpadeante en pasillo 3',
    numeroComprobante: 'COMP-002',
    rutaComprobante: null,
    idCaja: null,
    idUsuarioRegistro: 2,
    idUsuarioAprobacion: null,
    idCajaOrigen: null,
    idCategoria: 2,
    idEstadoGasto: 1,
  },
  {
    idGasto: 3,
    fecha: new Date(Date.now() - 86400000 * 3).toISOString(),
    monto: 45.75,
    descripcion: 'Caja de papel A4 para oficina',
    numeroComprobante: 'COMP-003',
    rutaComprobante: 'https://picsum.photos/seed/receipt2/400/600',
    idCaja: null,
    idUsuarioRegistro: 3,
    idUsuarioAprobacion: null,
    idCajaOrigen: null,
    idCategoria: 3,
    idEstadoGasto: 1,
  },
  {
    idGasto: 4,
    fecha: new Date(Date.now() - 86400000 * 4).toISOString(),
    monto: 22.3,
    descripcion: 'Pedido al por mayor de papel de recibos',
    numeroComprobante: 'COMP-004',
    rutaComprobante: null,
    idCaja: null,
    idUsuarioRegistro: 2,
    idUsuarioAprobacion: null,
    idCajaOrigen: null,
    idCategoria: 1,
    idEstadoGasto: 1,
  },
];

export const mockDailyReports: DailyReport[] = Array.from({ length: 7 }).map((_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (i + 1));
  const dateString = date.toISOString().split('T')[0];

  return {
    id: `rep-${dateString}`,
    storeId: 'berwyn-il',
    date: dateString,
    customers: 150 + Math.floor(Math.random() * 50),
    salesCash: 2500 + Math.floor(Math.random() * 500),
    salesCard: 4000 + Math.floor(Math.random() * 1000),
    totalExpenses: 50 + Math.floor(Math.random() * 100),
    totalDifference: (Math.random() * 10 - 5),
    generatedAt: date.getTime(),
    anomalies: Math.random() > 0.7 ? [{ type: 'Discrepancia de Efectivo', message: `Se detectó sobrante/faltante de efectivo de $${(Math.random() * 4 + 5).toFixed(2)}.` }] : [],
  };
});
