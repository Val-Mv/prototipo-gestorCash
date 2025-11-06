import type { DailyReport, Expense, Store, AppUser, CashRegister } from './types';

export const mockUsers: Record<string, AppUser> = {
  'dm@company.com': {
    uid: 'dm-123', //contraseña
    email: 'dm@company.com',
    displayName: 'Eleanor Vance',
    role: 'DM',
  },
  'sm.berwyn@company.com': {
    uid: 'sm-456',
    email: 'sm.berwyn@company.com',
    displayName: 'Marcus Holloway',
    role: 'SM',
    storeId: 'berwyn-il',
  },
  'asm.berwyn@company.com': {
    uid: 'asm-789',
    email: 'asm.berwyn@company.com',
    displayName: 'Anya Sharma',
    role: 'ASM',
    storeId: 'berwyn-il',
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

export const mockExpenses: Expense[] = [
  { id: 'exp-1', category: 'store_supplies', item: 'Spray Limpiador', amount: 12.50, description: 'Reabastecimiento semanal de suministros de limpieza', createdAt: new Date().getTime() - 86400000 * 1, attachmentUrl: 'https://picsum.photos/seed/receipt1/400/600', storeId: 'berwyn-il', date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0] },
  { id: 'exp-2', category: 'maintenance', item: 'Cambio de Bombilla', amount: 25.00, description: 'Reemplazo de bombilla parpadeante en pasillo 3', createdAt: new Date().getTime() - 86400000 * 2, storeId: 'berwyn-il', date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] },
  { id: 'exp-3', category: 'paperwork', item: 'Papel para Impresora', amount: 45.75, description: 'Caja de papel A4 para oficina', createdAt: new Date().getTime() - 86400000 * 3, attachmentUrl: 'https://picsum.photos/seed/receipt2/400/600', storeId: 'berwyn-il', date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0] },
  { id: 'exp-4', category: 'store_supplies', item: 'Rollos de Cinta de Registro', amount: 22.30, description: 'Pedido al por mayor de papel de recibos', createdAt: new Date().getTime() - 86400000 * 4, storeId: 'berwyn-il', date: new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0] },
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
