import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Perfil activo: local o supabase
const profile = (process.env.ACTIVE_DB || 'local').toLowerCase();

// Selecciona URL según el entorno
const DATABASE_URL =
  profile === 'supabase'
    ? process.env.SUPABASE_DATABASE_URL
    : process.env.LOCAL_DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('❌ DATABASE_URL no está definida. Revisa tu archivo .env');
}

// Define si debe usar SSL
const useSSL =
  profile === 'supabase' ||
  process.env.USE_SSL === 'true' ||
  process.env.NODE_ENV === 'production';

// Conexión a PostgreSQL dinámica
const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: useSSL
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : { ssl: false },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Verifica conexión al iniciar
(async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conectado exitosamente a PostgreSQL (${profile})`);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
})();

export default sequelize;
