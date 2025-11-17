import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'pg';
import { syncDatabase } from './models';
import { fixSequences } from './seeders/000_fix_sequences';
import { seedRoles } from './seeders/001_create_roles';
import gastosRoutes from './routes/gastos';
import ventasDiariasRoutes from './routes/ventas-diarias';
import bitacorasRoutes from './routes/bitacoras';
// import authRoutes from './routes/auth'; // Descomentar cuando se cree el archivo de rutas de autenticación
import usuariosRoutes from './routes/usuarios';
import authRoutes from './routes/auth';
import storesRoutes from './routes/stores';
import conteosRoutes from './routes/conteos';
import diferenciasCajaRoutes from './routes/diferencias-caja';
import tiposConteoRoutes from './routes/tipos-conteo';
import tiposDiferenciaRoutes from './routes/tipos-diferencia';
import reportesDiariosRoutes from './routes/reportes-diarios';
import rolesRoutes from './routes/roles';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Definir el puerto para el entorno local
const PORT = process.env.PORT || 8000;

// Lista de orígenes permitidos
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

// Middlewares
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Router principal para la API
const apiRouter = express.Router();

// Variable para rastrear el estado de la conexión
let isDbSynced = false;

// Middleware para asegurar la conexión a la base de datos
const ensureDbConnection = async (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> => {
  if (!isDbSynced) {
    try {
      await syncDatabase();
      // await seedRoles(); // Descomentar cuando se implemente
      // await fixSequences(); // Descomentar cuando se implemente
      isDbSynced = true;
      // Si la sincronización es exitosa, pasamos al siguiente middleware.
      next();
      return;
    } catch (error: any) {
      console.error('❌ Database connection failed on initial request:', error);
      // Asegurar que siempre devolvemos JSON, incluso en caso de error
      res.status(503).json({ 
        error: 'Service Unavailable: Could not connect to the database.',
        message: error?.message || 'Error de conexión a la base de datos',
        details: 'Verifica las credenciales en el archivo .env y que la base de datos esté corriendo'
      });
      return;
    }
  }
  // Si la BD ya está sincronizada, simplemente continuamos.
  next();
};
apiRouter.use(ensureDbConnection);

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

apiRouter.use('/gastos', gastosRoutes);
apiRouter.use('/ventas-diarias', ventasDiariasRoutes);
apiRouter.use('/bitacoras', bitacorasRoutes);
// apiRouter.use('/auth', authRoutes); // Descomentar cuando se implemente
apiRouter.use('/usuarios', usuariosRoutes);
apiRouter.use('/stores', storesRoutes);
apiRouter.use('/conteos', conteosRoutes);
apiRouter.use('/diferencias-caja', diferenciasCajaRoutes);
apiRouter.use('/tipos-conteo', tiposConteoRoutes);
apiRouter.use('/tipos-diferencia', tiposDiferenciaRoutes);
apiRouter.use('/reportes-diarios', reportesDiariosRoutes);
// apiRouter.use('/roles', rolesRoutes); // Descomentar cuando se implemente

// Ya no usamos el prefijo '/api' aquí, porque vercel.json se encarga de eso.
// Cualquier petición que llegue a esta función ya fue reescrita desde /api/...
// Por ejemplo, una petición a /api/gastos llegará aquí como /gastos.
app.use(apiRouter);

app.get('/', (_req, res) => {
  res.json({
    message: 'GestorCash API',
    version: '1.0.0',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

// Rutas de autenticación (sin prefijo /api)
app.use('/auth', authRoutes);

// Rutas de usuario (sin prefijo /api)
app.use('/usuario', usuariosRoutes);

// Rutas con prefijo /api (mantener compatibilidad)
app.use('/api/gastos', gastosRoutes);
app.use('/api/ventas-diarias', ventasDiariasRoutes);
app.use('/api/bitacoras', bitacorasRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/stores', storesRoutes);
app.use('/api/conteos', conteosRoutes);
app.use('/api/diferencias-caja', diferenciasCajaRoutes);
app.use('/api/tipos-conteo', tiposConteoRoutes);
app.use('/api/tipos-diferencia', tiposDiferenciaRoutes);
app.use('/api/reportes-diarios', reportesDiariosRoutes);
app.use('/api/roles', rolesRoutes);

// Middleware para manejar rutas no encontradas (debe ir antes del manejo de errores)
app.use((req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  // Si la ruta comienza con /api, devolver JSON
  if (req.path.startsWith('/api')) {
    res.status(404).json({
      error: 'Ruta no encontrada',
      message: `La ruta ${req.method} ${req.path} no existe`,
      path: req.path,
    });
    return;
  }
  // Para otras rutas, devolver un mensaje simple
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.path} no existe`,
  });
});

// Manejo de errores (asegurar que siempre devuelve JSON)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction): void => {
  console.error('Error:', err);
  // Asegurar que el Content-Type sea JSON
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'Error interno del servidor',
    });
  }
});

// Solo iniciar el servidor con app.listen en un entorno de desarrollo.
// En Vercel, el archivo se importa como un módulo y no debe escuchar en un puerto.
if (process.env.NODE_ENV !== 'production') {
  // Inicializar servidor para desarrollo local
  const startServer = async () => {
    try {
      // Sincronizar base de datos
      await syncDatabase();

      // Verificar y corregir secuencias de auto-increment
      await fixSequences();

      // Poblar datos iniciales (roles)
      console.log('🌱 Verificando datos iniciales...');
      await seedRoles();

      // Iniciar servidor
      app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
      });
    } catch (error) {
      console.error('❌ Error al iniciar el servidor:', error);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
