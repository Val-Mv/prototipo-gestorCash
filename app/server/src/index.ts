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
import rolesRoutes from './routes/roles';

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

// Manejo de errores
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

// Inicializar servidor
async function startServer() {
  try {
    // Sincronizar base de datos
    await syncDatabase();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

