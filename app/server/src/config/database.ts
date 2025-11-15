import path from 'path';
import { Sequelize } from 'sequelize';
import type { Dialect, Options } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const profile = (process.env.ACTIVE_DB || 'local').toLowerCase();
const logging = process.env.NODE_ENV === 'development' ? console.log : false;

const resolveDatabaseUrl = () => {
  if (profile === 'supabase') {
    // Primero intenta usar SUPABASE_DATABASE_URL si está definida
    if (process.env.SUPABASE_DATABASE_URL) {
      return process.env.SUPABASE_DATABASE_URL;
    }
    
    // Si no, construye la URL desde variables individuales
    const dbHost = process.env.DB_HOST;
    const dbPort = process.env.DB_PORT || '5432';
    const dbUsername = process.env.DB_USERNAME;
    const dbPassword = process.env.DB_PASSWORD;
    const dbName = process.env.DB_NAME || 'postgres';
    
    if (dbHost && dbUsername && dbPassword) {
      // Codificar la contraseña para evitar problemas con caracteres especiales
      const encodedPassword = encodeURIComponent(dbPassword);
      return `postgresql://${dbUsername}:${encodedPassword}@${dbHost}:${dbPort}/${dbName}`;
    }
    
    throw new Error('❌ Para usar Supabase, debes definir SUPABASE_DATABASE_URL o las variables DB_HOST, DB_USERNAME, DB_PASSWORD (y opcionalmente DB_PORT, DB_NAME). Revisa tu archivo .env');
  }

  // Para local, intenta construir desde variables o usar URL completa
  // Detectar si estamos en Docker (variables establecidas en docker-compose.yml)
  const isInDocker = process.env.RUNNING_IN_DOCKER === 'true' || 
                     process.env.DOCKER_CONTAINER === 'true';
  
  // Prioridad: LOCAL_DATABASE_URL > DATABASE_URL > variables individuales > fallback
  if (process.env.LOCAL_DATABASE_URL) {
    let urlString = process.env.LOCAL_DATABASE_URL;
    
    // Si estamos en Docker y la URL contiene 'localhost' o '127.0.0.1', reemplazar por 'db'
    if (isInDocker && (urlString.includes('localhost') || urlString.includes('127.0.0.1'))) {
      try {
        const url = new URL(urlString);
        url.hostname = 'db';
        urlString = url.toString();
        console.log(`🔄 Ajustando host a 'db' para Docker: ${urlString}`);
      } catch (e) {
        // Si falla el parse, continuar con la URL original
        console.warn('⚠️  No se pudo ajustar la URL de base de datos para Docker');
      }
    }
    return urlString;
  }
  
  if (process.env.DATABASE_URL) {
    let urlString = process.env.DATABASE_URL;
    
    // Si estamos en Docker y la URL contiene 'localhost' o '127.0.0.1', reemplazar por 'db'
    if (isInDocker && (urlString.includes('localhost') || urlString.includes('127.0.0.1'))) {
      try {
        const url = new URL(urlString);
        url.hostname = 'db';
        urlString = url.toString();
        console.log(`🔄 Ajustando host a 'db' para Docker: ${urlString}`);
      } catch (e) {
        // Si falla el parse, continuar con la URL original
        console.warn('⚠️  No se pudo ajustar la URL de base de datos para Docker');
      }
    }
    return urlString;
  }
  
  // Construir desde variables individuales para local
  // Si estamos en Docker y no se especificó DB_HOST, usar 'db'
  // Si no estamos en Docker y no se especificó DB_HOST, usar 'localhost'
  const defaultHost = isInDocker ? 'db' : 'localhost';
  const dbHost = process.env.DB_HOST || defaultHost;
  const dbPort = process.env.DB_PORT || '5432';
  const dbUsername = process.env.DB_USERNAME || 'admin';
  const dbPassword = process.env.DB_PASSWORD || 'admin';
  const dbName = process.env.DB_NAME || 'gestorcash';
  
  if (dbHost && dbUsername && dbPassword) {
    const encodedPassword = encodeURIComponent(dbPassword);
    const constructedUrl = `postgresql://${dbUsername}:${encodedPassword}@${dbHost}:${dbPort}/${dbName}`;
    if (isInDocker && dbHost === 'db') {
      console.log(`🐳 Usando host 'db' para conexión Docker`);
    }
    return constructedUrl;
  }

  // Fallback a SQLite
  return 'sqlite://./gestorcash.db';
};

const databaseUrl = resolveDatabaseUrl();

if (!databaseUrl) {
  throw new Error('❌ DATABASE_URL no está definida. Revisa tu archivo .env');
}

const inferDialect = (url: string): Dialect => {
  const normalized = url.toLowerCase();

  if (normalized.startsWith('postgresql://') || normalized.startsWith('postgres://')) {
    return 'postgres';
  }

  if (normalized.startsWith('sqlite://') || normalized.startsWith('sqlite:')) {
    return 'sqlite';
  }

  if (normalized.startsWith('mysql://')) {
    return 'mysql';
  }

  if (normalized.startsWith('mariadb://')) {
    return 'mariadb';
  }

  if (normalized.startsWith('mssql://')) {
    return 'mssql';
  }

  if (process.env.DB_DIALECT) {
    return process.env.DB_DIALECT as Dialect;
  }

  return 'postgres';
};

const dialect = inferDialect(databaseUrl);

let connectionUri = databaseUrl;

if (dialect === 'postgres') {
  const parsedUrl = new URL(databaseUrl);
  const isInDocker = process.env.RUNNING_IN_DOCKER === 'true' || 
                     process.env.DOCKER_CONTAINER === 'true';

  // Si estamos en Docker pero la URL tiene localhost/127.0.0.1, cambiar a 'db'
  if (isInDocker && (parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1')) {
    const oldHost = parsedUrl.hostname;
    parsedUrl.hostname = 'db';
    console.log(`🔄 Ajustando hostname de '${oldHost}' a 'db' para Docker`);
    connectionUri = parsedUrl.toString();
  }
  // Si NO estamos en Docker pero la URL tiene 'db', cambiar a localhost
  else if (!isInDocker && parsedUrl.hostname === 'db') {
    parsedUrl.hostname = process.env.DB_HOST_OVERRIDE || 'localhost';
    console.warn(`⚠️  Hostname 'db' detectado pero no estamos en Docker. Cambiando a '${parsedUrl.hostname}'`);
    connectionUri = parsedUrl.toString();
  }
  else {
    connectionUri = databaseUrl;
  }
}

const useSSL =
  dialect === 'postgres' &&
  (
    profile === 'supabase' ||
    process.env.USE_SSL === 'true' ||
    process.env.DB_SSL === 'true' ||
    process.env.NODE_ENV === 'production'
  );

const sequelizeOptions: Options = {
  dialect,
  logging,
};

if (dialect === 'postgres' || dialect === 'mysql' || dialect === 'mariadb' || dialect === 'mssql') {
  sequelizeOptions.pool = {
    max: Number(process.env.DB_POOL_MAX ?? 10),
    min: Number(process.env.DB_POOL_MIN ?? 0),
    acquire: Number(process.env.DB_POOL_ACQUIRE ?? 30000),
    idle: Number(process.env.DB_POOL_IDLE ?? 10000),
  };
}

if (dialect === 'postgres' && useSSL) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  };
}

if (dialect === 'sqlite') {
  const storagePath = databaseUrl
    .replace(/^sqlite:(\/\/)?/i, '')
    .replace(/^file:(\/\/)?/i, '');

  if (storagePath && storagePath !== ':memory:') {
    sequelizeOptions.storage = path.isAbsolute(storagePath)
      ? storagePath
      : path.resolve(process.cwd(), storagePath);
  } else if (!storagePath) {
    sequelizeOptions.storage = path.resolve(process.cwd(), 'gestorcash.db');
  }
}

const sequelize = new Sequelize(connectionUri, sequelizeOptions);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(`✅ Conectado exitosamente a la base de datos (${connectionUri}) usando el dialecto "${dialect}"`);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
})();

export default sequelize;
export { sequelize };
