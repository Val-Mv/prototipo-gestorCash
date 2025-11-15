import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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
const PORT = process.env.PORT || 8000;

// Middlewares
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ],
  credentials: true,
}));
app.use(express.json());

// Rutas
app.get('/', (_req, res) => {
  res.json({
    message: 'GestorCash API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/gastos', gastosRoutes);
app.use('/ventas-diarias', ventasDiariasRoutes);
app.use('/bitacoras', bitacorasRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/stores', storesRoutes);
app.use('/conteos', conteosRoutes);
app.use('/diferencias-caja', diferenciasCajaRoutes);
app.use('/tipos-conteo', tiposConteoRoutes);
app.use('/tipos-diferencia', tiposDiferenciaRoutes);
app.use('/reportes-diarios', reportesDiariosRoutes);

// Manejo de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// Sincronizar la base de datos al iniciar.
// En un entorno serverless, esto puede ejecutarse en cada "cold start".
syncDatabase().catch(err => console.error('❌ Error al sincronizar la base de datos:', err));

// Exportar la app de Express para que Vercel la pueda usar.
// Vercel se encarga de ejecutar el servidor.
export default app;
