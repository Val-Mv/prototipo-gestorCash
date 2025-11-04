export type UserRole = 'DM' | 'SM' | 'ASM';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  storeId?: string;
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
}

export interface Expense {
  id: string;
  category: 'store_supplies' | 'maintenance' | 'paperwork' | 'transport';
  item: string;
  amount: number;
  description: string;
  attachmentUrl?: string;
  createdAt: number;
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
