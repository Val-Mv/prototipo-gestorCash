import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Forzar la inclusión del driver de pg en el bundle de Vercel
import 'pg';
import { syncDatabase } from './models';
import gastosRoutes from './routes/gastos';
import ventasDiariasRoutes from './routes/ventas-diarias';
import bitacorasRoutes from './routes/bitacoras';
import usuariosRoutes from './routes/usuarios';
import storesRoutes from './routes/stores';
import conteosRoutes from './routes/conteos';
import diferenciasCajaRoutes from './routes/diferencias-caja';
import tiposConteoRoutes from './routes/tipos-conteo';
import tiposDiferenciaRoutes from './routes/tipos-diferencia';
import reportesDiariosRoutes from './routes/reportes-diarios';

// Cargar variables de entorno
dotenv.config();

const app = express();

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
) => {
  if (!isDbSynced) {
    try {
      await syncDatabase();
      await seedRoles();
      await fixSequences();
      isDbSynced = true;
      // Si la sincronización es exitosa, pasamos al siguiente middleware.
      return next();
    } catch (error) {
      console.error('❌ Database connection failed on initial request:', error);
      return res.status(503).json({ error: 'Service Unavailable: Could not connect to the database.' });
    }
  }
  // Si la BD ya está sincronizada, simplemente continuamos.
  return next();
};
apiRouter.use(ensureDbConnection);

apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

apiRouter.use('/gastos', gastosRoutes);
apiRouter.use('/ventas-diarias', ventasDiariasRoutes);
apiRouter.use('/bitacoras', bitacorasRoutes);
apiRouter.use('/usuarios', usuariosRoutes);
apiRouter.use('/stores', storesRoutes);
apiRouter.use('/conteos', conteosRoutes);
apiRouter.use('/diferencias-caja', diferenciasCajaRoutes);
apiRouter.use('/tipos-conteo', tiposConteoRoutes);
apiRouter.use('/tipos-diferencia', tiposDiferenciaRoutes);
apiRouter.use('/reportes-diarios', reportesDiariosRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/roles', rolesRoutes);

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

// Manejo de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// Exportar la app de Express para que Vercel la pueda usar.
// Vercel se encarga de ejecutar el servidor.
export default app;
