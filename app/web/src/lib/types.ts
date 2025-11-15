export type UserRole = 'DM' | 'SM' | 'ASM';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  storeId?: string;
  idUsuario?: number;
}

export interface Store {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface CashRegister {
  id: string;
  storeId: string;
  number: number;
  active: boolean;
}

export interface Shift {
  id: string;
  storeId: string;
  date: string; 
  status: 'open' | 'closed';
  customers: number;
  salesCash: number;
  salesCard: number;
}

export interface Count {
  id: string;
  registerId?: string; // undefined for safe
  type: 'opening' | 'closing';
  amount: number;
  timestamp: number; // Fecha y hora del registro
  userId: string; // ID del usuario que realizó el registro
  userName: string; // Nombre del usuario responsable
}

export interface Gasto {
  idGasto: number;
  fecha: string;
  monto: number;
  descripcion: string;
  numeroComprobante: string | null; // Puede ser null según DDL
  rutaComprobante: string | null; // Puede ser null según DDL
  idCaja?: number | null;
  idUsuarioRegistro: number;
  idUsuarioAprobacion?: number | null;
  idCajaOrigen?: number | null;
  idCategoria: number;
  idEstadoGasto: number;
}

export interface DailyReport {
  id: string;
  storeId: string;
  date: string; // YYYY-MM-DD
  customers: number;
  salesCash: number;
  salesCard: number;
  totalExpenses: number;
  totalDifference: number;
  generatedAt: number; // timestamp
  anomalies: Anomaly[];
}

export interface Anomaly {
  type: string;
  message: string;
  expenseId?: string;
}
