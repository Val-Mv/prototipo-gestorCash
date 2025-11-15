import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { ReporteDiario } from '../models/ReporteDiario';
import { reporteDiarioCreateSchema } from '../schemas/reporte-diario';

const router = Router();

const parseFecha = (fecha?: string | Date) => {
  if (!fecha) return new Date();
  if (fecha instanceof Date) return fecha;
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error('Fecha inválida');
  }
  return parsed;
};

// Crear reporte diario
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = reporteDiarioCreateSchema.parse(req.body);
    const {
      fecha,
      totalVentas = 0,
      totalGastosDia = 0,
      saldoFinal = 0,
      totalClientes = 0,
      totalEfectivo = 0,
      totalTarjeta = 0,
      totalDiferencias = 0,
      idUsuarioGenerador,
    } = validatedData;

    const reporte = await ReporteDiario.create({
      fecha: parseFecha(fecha),
      totalVentas,
      totalGastosDia,
      saldoFinal,
      totalClientes,
      totalEfectivo,
      totalTarjeta,
      totalDiferencias,
      idUsuarioGenerador,
    });

    return res.status(201).json(reporte);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha inválida') {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Listar reportes diarios
router.get('/', async (req: Request, res: Response) => {
  try {
    const { skip = '0', limit = '100', fechaDesde, fechaHasta } = req.query;

    const where: any = {};

    if (fechaDesde && fechaHasta) {
      where.fecha = {
        [Op.between]: [new Date(String(fechaDesde)), new Date(String(fechaHasta))],
      };
    } else if (fechaDesde) {
      where.fecha = {
        [Op.gte]: new Date(String(fechaDesde)),
      };
    } else if (fechaHasta) {
      where.fecha = {
        [Op.lte]: new Date(String(fechaHasta)),
      };
    }

    const reportes = await ReporteDiario.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['fecha', 'DESC']],
    });

    return res.json(reportes);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener reporte por ID
router.get('/:idReporte', async (req: Request, res: Response) => {
  try {
    const reporte = await ReporteDiario.findByPk(req.params.idReporte);

    if (!reporte) {
      return res.status(404).json({ error: 'Reporte diario no encontrado' });
    }

    return res.json(reporte);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar reporte diario
router.put('/:idReporte', async (req: Request, res: Response) => {
  try {
    const validatedData = reporteDiarioCreateSchema.parse(req.body);
    const reporte = await ReporteDiario.findByPk(req.params.idReporte);

    if (!reporte) {
      return res.status(404).json({ error: 'Reporte diario no encontrado' });
    }

    const {
      fecha,
      totalVentas = reporte.totalVentas,
      totalGastosDia = reporte.totalGastosDia,
      saldoFinal = reporte.saldoFinal,
      totalClientes = reporte.totalClientes,
      totalEfectivo = reporte.totalEfectivo,
      totalTarjeta = reporte.totalTarjeta,
      totalDiferencias = reporte.totalDiferencias,
      idUsuarioGenerador = reporte.idUsuarioGenerador,
    } = validatedData;

    await reporte.update({
      fecha: parseFecha(fecha),
      totalVentas,
      totalGastosDia,
      saldoFinal,
      totalClientes,
      totalEfectivo,
      totalTarjeta,
      totalDiferencias,
      idUsuarioGenerador,
    });

    return res.json(reporte);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Datos inválidos', detalles: error.errors });
    } else if (error.message === 'Fecha inválida') {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.message });
    }
  }
});

// Eliminar reporte diario
router.delete('/:idReporte', async (req: Request, res: Response) => {
  try {
    const reporte = await ReporteDiario.findByPk(req.params.idReporte);

    if (!reporte) {
      return res.status(404).json({ error: 'Reporte diario no encontrado' });
    }

    await reporte.destroy();
    return res.json({ mensaje: 'Reporte diario eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;


