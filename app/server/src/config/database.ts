import { Sequelize } from 'sequelize';
import path from 'path';

// Configuración de base de datos
const DATABASE_URL = process.env.DATABASE_URL || 'sqlite://./gestorcash.db';

let sequelize: Sequelize;

if (DATABASE_URL.startsWith('sqlite')) {
  // Para SQLite - usar path relativo desde la raíz del proyecto server
  const dbPath = path.resolve(__dirname, '../../gestorcash.db');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
} else if (DATABASE_URL.startsWith('postgres')) {
  // Para PostgreSQL
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  // Para MySQL u otras bases de datos
  sequelize = new Sequelize(DATABASE_URL, {
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
}

export default sequelize;

