import { Router, Request, Response } from 'express';
import { Op } from 'sequelize';
import { Gasto } from '../models/Gasto';
import { gastoCreateSchema } from '../schemas/gasto';

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

// Crear un nuevo gasto
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = gastoCreateSchema.parse(req.body);
    const { fecha, ...rest } = validatedData;

    const gasto = await Gasto.create({
      ...rest,
      fecha: parseFecha(fecha),
    });

    return res.status(201).json(gasto);
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

// Obtener todos los gastos
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      skip = '0',
      limit = '100',
      idCaja,
      idCategoria,
      idEstadoGasto,
      fechaDesde,
      fechaHasta,
    } = req.query;

    const where: any = {};
    if (idCaja) where.idCaja = Number(idCaja);
    if (idCategoria) where.idCategoria = Number(idCategoria);
    if (idEstadoGasto) where.idEstadoGasto = Number(idEstadoGasto);

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

    const gastos = await Gasto.findAll({
      where,
      limit: Number(limit),
      offset: Number(skip),
      order: [['fecha', 'DESC']],
    });

    return res.json(gastos);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener estadísticas de gastos por categoría
router.get('/estadisticas/por-categoria', async (req: Request, res: Response) => {
  try {
    const { fechaDesde, fechaHasta, idEstadoGasto } = req.query;

    const where: any = {};
    if (idEstadoGasto) where.idEstadoGasto = Number(idEstadoGasto);

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

    const gastos = await Gasto.findAll({ where });

    const estadisticas: Record<
      number,
      {
        cantidad: number;
        total: number;
      }
    > = {};

    gastos.forEach((gasto) => {
      const categoriaId = gasto.idCategoria;
      if (!estadisticas[categoriaId]) {
        estadisticas[categoriaId] = { cantidad: 0, total: 0 };
      }
      estadisticas[categoriaId].cantidad += 1;
      estadisticas[categoriaId].total += Number(gasto.monto);
    });

    return res.json(estadisticas);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Obtener un gasto por ID
router.get('/:gasto_id', async (req: Request, res: Response) => {
  try {
    const gasto = await Gasto.findByPk(req.params.gasto_id);

    if (!gasto) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    return res.json(gasto);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Actualizar un gasto
router.put('/:gasto_id', async (req: Request, res: Response) => {
  try {
    const validatedData = gastoCreateSchema.parse(req.body);
    const gasto = await Gasto.findByPk(req.params.gasto_id);

    if (!gasto) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    const { fecha, ...rest } = validatedData;
    await gasto.update({
      ...rest,
      fecha: parseFecha(fecha),
    });

    return res.json(gasto);
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

// Eliminar un gasto
router.delete('/:gasto_id', async (req: Request, res: Response) => {
  try {
    const gasto = await Gasto.findByPk(req.params.gasto_id);

    if (!gasto) {
      return res.status(404).json({ error: 'Gasto no encontrado' });
    }

    await gasto.destroy();
    return res.json({ mensaje: 'Gasto eliminado correctamente' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

export default router;


