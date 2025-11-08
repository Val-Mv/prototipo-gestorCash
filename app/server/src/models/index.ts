import sequelize from '../config/database';
import { OpeningCount } from './OpeningCount';
import { ClosingCount } from './ClosingCount';
import { Expense } from './Expense';
import { DailyReport } from './DailyReport';
import { User } from './User';
import { Store } from './Store';
import { CashRegister } from './CashRegister';

// Exportar modelos
export { OpeningCount, ClosingCount, Expense, DailyReport, User, Store, CashRegister };

// Sincronizar modelos con la base de datos
export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (crear tablas si no existen)
    await sequelize.sync({ alter: false });
    console.log('✅ Modelos sincronizados con la base de datos.');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    throw error;
  }
};

export { sequelize };
export default {
  OpeningCount,
  ClosingCount,
  Expense,
  DailyReport,
  User,
  Store,
  CashRegister,
};
