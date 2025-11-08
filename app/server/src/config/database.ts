import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const profile = (process.env.ACTIVE_DB || 'local').toLowerCase();
const logging = process.env.NODE_ENV === 'development' ? console.log : false;

const resolveDatabaseUrl = () => {
  if (profile === 'supabase') {
    return process.env.SUPABASE_DATABASE_URL;
  }

  return process.env.LOCAL_DATABASE_URL || process.env.DATABASE_URL;
};

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  throw new Error('❌ DATABASE_URL no está definida. Revisa tu archivo .env');
}

const parsedUrl = new URL(databaseUrl);

if (profile === 'local' && parsedUrl.hostname === 'db') {
  parsedUrl.hostname = 'localhost';
  console.warn('⚠️  Reemplazando host "db" por "localhost" para entorno local.');
}

const useSSL =
  profile === 'supabase' ||
  process.env.USE_SSL === 'true' ||
  process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(parsedUrl.toString(), {
  dialect: 'postgres',
  logging,
  dialectOptions: useSSL
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
    : undefined,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conectado exitosamente a la base de datos (${parsedUrl.toString()})`);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
})();

export default sequelize;
export { sequelize };
