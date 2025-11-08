import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { syncDatabase } from './models';
import openingRoutes from './routes/opening';
import closingRoutes from './routes/closing';
import expensesRoutes from './routes/expenses';
import reportsRoutes from './routes/reports';
import usersRoutes from './routes/users';
import storesRoutes from './routes/stores';

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
app.get('/', (req, res) => {
  res.json({
    message: 'GestorCash API',
    version: '1.0.0',
    docs: '/api/health',
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/api/opening', openingRoutes);
app.use('/api/closing', closingRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/stores', storesRoutes);

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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

